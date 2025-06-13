// libs/passport.ts
import passport from 'passport';
import {
  ClientAuthMethod,
  Issuer,
  Strategy,
  TokenSet,
  // UserinfoResponse,
} from 'openid-client';
import config from 'config';
import { inject, injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { COMMON } from '../utils/common';
import logger from './logger';
import TokenService from './tokenService';
import ProfileRepository from '../profile/repositories/profileRepository';
import TYPES from '../dependencyManager/types';
import CommonRepository from '../common/repositories/commonRepository';

const DISCOVERY_ENDPOINT = config.get<string>('auth.discoveryEndpoint');
const OIDC_CONFIG = {
  client_id: config.get<string>('auth.clientId'),
  client_secret: config.get<string>('auth.clientSecret'),
  redirect_uris: config.get<string>('auth.redirectUris').split(','),
  post_logout_redirect_uris: config
    .get<string>('auth.postLogoutRedirectUris')
    .split(','),
  token_endpoint_auth_method: config.get<ClientAuthMethod>(
    'auth.tokenEndpointAuthMethod',
  ),
};

@injectable()
class AuthHandler {
  private client;

  private readonly profileRepository: ProfileRepository;

  private readonly prisma: PrismaClient;

  private readonly commonRepository: CommonRepository;

  constructor(
    @inject(TYPES.ProfileRepository) profileRepository: ProfileRepository,
    @inject(TYPES.PrismaClient) prisma: PrismaClient,
    @inject(TYPES.CommonRepository) commonRepository: CommonRepository,
  ) {
    this.profileRepository = profileRepository;
    this.prisma = prisma;
    this.commonRepository = commonRepository;
  }

  public async init() {
    const iqviaIssuer = await Issuer.discover(DISCOVERY_ENDPOINT);
    this.client = new iqviaIssuer.Client(OIDC_CONFIG);

    passport.use(
      'oidc',
      new Strategy(
        { client: this.client },
        (
          tokenSet: TokenSet,
          done: (error: unknown, user?: unknown) => void,
        ) => {
          const user = tokenSet.claims();
          user.refreshToken = tokenSet.refresh_token;
          user.accessToken = tokenSet.access_token;
          user.idToken = tokenSet.id_token;
          return done(null, user);
        },
      ),
    );

    passport.serializeUser((user: Express.User, done) => {
      done(null, user);
    });

    passport.deserializeUser((obj: Express.User, done) => {
      done(null, obj);
    });
  }

  public registerMiddleware() {
    return passport.initialize();
  }

  public registerSessionMiddleware() {
    return passport.session();
  }

  private isInternal(user) {
    const { domain } = user;

    const configDomains = config.get<string>('auth.internalSsoDomains');
    const domains = configDomains.split(',').map((d) => d.trim());

    const domainPatterns = domains.map((d) => {
      if (d.startsWith('*.')) {
        return `([a-z0-9-]+\\.)?${d.slice(2).replace(/\./g, '\\.')}`;
      }
      return d.replace(/\./g, '\\.');
    });

    const domainsRegex = new RegExp(`^(${domainPatterns.join('|')})$`, 'i');

    return domainsRegex.test(domain);
  }

  public authenticate(req, res, next, options) {
    return passport.authenticate('oidc', options, async (err, user) => {
      if (err) {
        return next(err);
      }
      const isInternal = this.isInternal(user);
      const { loginid, userid } = user;
      const { state } = req.query;
      const browserDetails = JSON.parse(state as string);
      const profile =
        await this.profileRepository.findProfileByIdentityIdUserId(
          loginid,
          userid,
        );
      if (!profile) {
        return next(new Error('Profile is not found'));
      }
      const statusId: number = await this.commonRepository.getStatusId(
        COMMON.STATUS.ACTIVE,
      );
      if (profile.profileStatusId !== statusId) {
        browserDetails.loginSuccess = false;
        await this.storingLoginDetails(browserDetails, profile.id);
        return next(new Error('Profile is not activated'));
      }

      if (isInternal === profile.isExternal) {
        browserDetails.loginSuccess = false;
        await this.storingLoginDetails(browserDetails, profile.id);
        return next(new Error('Internal-External type mismatch'));
      }
      const employeeId = isInternal ? userid : loginid;

      req.logIn(user, async (error) => {
        if (error) {
          browserDetails.loginSuccess = false;
          await this.storingLoginDetails(browserDetails, profile.id);
          return next(error);
        }
        browserDetails.loginSuccess = true;
        await this.storingLoginDetails(browserDetails, profile.id);
        const { sessionID } = req;
        const payload = {
          sessionID,
          username: user.name,
          email: user.email,
          employeeId,
          masterProfileId: profile.id,
          timeZone: profile.timeZone?.name ?? '',
          abbreviation: profile.timeZone?.abbreviation ?? '',
          offset: profile.timeZone?.utcOffset ?? '',
        };
        const token = TokenService.generateToken(payload);
        return res.redirect(`${options.successRedirect}get?token=${token}`);
      });
    })(req, res, next);
  }

  public async refreshToken(refreshToken) {
    return this.client.refresh(refreshToken);
  }

  public logout() {
    return this.client.endSessionUrl();
  }

  public async introspect(token: string) {
    try {
      logger.info('Introspecting token:', token);
      const data = await this.client.introspect(token, 'access_token', {
        token_endpoint_auth_method: 'client_secret_post',
      });

      logger.info('Introspection data:', data);
      return data;
    } catch (error) {
      logger.info('Introspection error:', error);
      throw error;
    }
  }

  public async revoke(token: string, tokenHint: string) {
    const tokenRevoke = await this.client.revoke(token, tokenHint);
    return tokenRevoke;
  }

  public async userdata(token: string) {
    const data = await this.client.userinfo(token);
    return data;
  }

  async storingLoginDetails(
    browserDetails: {
      appName?: string;
      browserName?: string;
      device?: string;
      ip?: string;
      loginSuccess: boolean;
    },
    profileId: number,
  ): Promise<void> {
    try {
      const { appName, browserName, device, ip, loginSuccess } = browserDetails;
      const data = {
        applicationName: appName ?? 'Unknown App',
        browserName: browserName ?? 'Unknown Browser',
        device: device ?? 'Unknown Device',
        profileId,
        sourceIp: ip ?? null,
        isLoginSuccess: loginSuccess,
        loginUrl: null,
      };
      await this.prisma.loginDetails.create({ data });
    } catch (err) {
      logger.error('Error storing login details', { error: err });
      throw new Error('Failed to store login details');
    }
  }
}

export default AuthHandler;

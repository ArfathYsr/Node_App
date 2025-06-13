import { Request } from 'express';

export interface DocUser {
  user: {
    at_hash: string;
    sub: string;
    loginid: string;
    idpid: string;
    amr: string[];
    iss: string;
    groups: string;
    given_name: string;
    userid: string;
    sid: string;
    aud: string;
    c_hash: string;
    upn: string;
    nbf: number;
    azp: string;
    domain: string;
    name: string;
    exp: number;
    iat: number;
    MultiAttributeSeparator: any[];
    family_name: string;
    b2c_idp: string;
    email: string;
    refreshToken: string;
    accessToken: string;
    idToken: string;
  };
  sessionID: string;
  profileId: number;
}
export interface CustomRequest extends Request {
  docUser?: DocUser;
  userRole?: string[];
}

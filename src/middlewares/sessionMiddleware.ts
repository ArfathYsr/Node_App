import session from 'express-session';
import Redis from 'ioredis';
import RedisStore from 'connect-redis';
import config from 'config';

const redisClient = new Redis(config.get<string>('auth.session.redisUrl'));
const sessionStore = new RedisStore({ client: redisClient });

const sessionOptions = {
  store: sessionStore,
  secret: config.get<string>('auth.session.sessionConfigSecret'),
  resave: config.get<boolean>('auth.session.sessionConfigResave'),
  saveUninitialized: config.get<boolean>(
    'auth.session.sessionConfigSaveUninitialized',
  ),
  /*   cookie: {
    maxAge: config.get<number>('cookie.cookieMaxAge'),
    cookieSecure: config.get<boolean>('cookie.cookieSecure'),
   // domain:'https://ngrok.app'
  }, */
};

export default session(sessionOptions);

export { sessionStore };

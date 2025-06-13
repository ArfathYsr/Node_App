import morgan from 'morgan';
import logger from '../libs/logger';

const morganMiddleware = () => {
  return morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim()),
    },
  });
};

export default morganMiddleware;

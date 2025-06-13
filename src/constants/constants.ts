import App from '../app';
import logger from '../libs/logger';

export const setupExitHandlers = async () => {
  process.on('SIGINT', async () => {
    logger.info('SIGINT signal received: closing HTTP server');
    await App.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.info('SIGTERM signal received: closing HTTP server');
    await App.stop();
    process.exit(0);
  });

  process.on('exit', (code) => {
    logger.info(`Process exiting with code: ${code}`);
  });
};

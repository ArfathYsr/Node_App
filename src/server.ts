import 'reflect-metadata';
import config from 'config';
import App from './app';
import logger from './libs/logger';
import { setupExitHandlers } from './constants/constants';

const PORT = config.get<number>('port');

async function main() {
  try {
    await App.start(PORT);

    await setupExitHandlers();
  } catch (error) {
    logger.error('Failed to start the server:', error);
    process.exit(1);
  }
}

main();

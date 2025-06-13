import { exec } from 'child_process';
import { promisify } from 'util';
import logger from '../../libs/logger';

const execAsync = promisify(exec);
const seeds = [
  'src/scripts/load-data/load-countries-data.ts',
  'src/scripts/load-data/load-currencies-data.ts',
  'src/scripts/load-data/load-client-status-data.ts',
  'src/scripts/load-data/load-email-types-data.ts',
  'src/scripts/load-data/load-profile-status-data.ts',
  'src/scripts/load-data/load-profile-types-data.ts',
  'src/scripts/load-data/load-role-category-data.ts',
  'src/scripts/load-data/load-role-criteria-data.ts',
  'src/scripts/load-data/load-relation-table-data.ts',
  'src/scripts/load-data/load-archive-filter-data.ts',
  'src/scripts/load-data/load-common-status-data.ts',
  'src/scripts/load-data/load-fluentLanguages-data.ts',
  'src/scripts/load-data/load-timeZone-data.ts',
  'src/scripts/load-data/load-phone-types-data.ts',
  'src/scripts/load-data/load-address-types-data.ts',
  'src/scripts/load-data/load-locale-type-data.ts',
  'src/scripts/load-data/load-international-prefix-data.ts',
  'src/scripts/load-data/load-state-data.ts',
  'src/scripts/load-data/load-menu-data.ts',
  'src/scripts/load-data/load-city-data.ts',
  'src/scripts/load-data/load-submenu-data.ts',
  'src/scripts/load-data/load-question-type-data.ts',
  'src/scripts/load-data/load-question-category-data.ts',
  'src/scripts/load-data/load-contact-type-data.ts',
  'src/scripts/load-data/load-bio-profession-data.ts',
  'src/scripts/load-data/load-vendor-type-data.ts',
  'src/scripts/load-data/load-vendor-status-data.ts',
  'src/scripts/load-data/load-question-data.ts',
  'src/scripts/load-data/load-question-option-data.ts',
  'src/scripts/load-data/load-type-validation-data.ts',
  'src/scripts/load-data/load-question-validation-data.ts',
  'src/scripts/load-data/load-service-type-data.ts',
  'src/scripts/load-data/load-work-item-action-type-data.ts',
  'src/scripts/load-data/load-work-item-status-data.ts',
  'src/scripts/load-data/load-work-item-data.ts',
  'src/scripts/load-data/load-engagement-av-category-data.ts',
  'src/scripts/load-data/load-engagement-av-data.ts'
];

async function runSeed(seed: string) {
  try {
    const { stdout, stderr } = await execAsync(`npx ts-node ${seed}`);
    if (stderr) {
      logger.error(`Error running seed ${seed}:`, stderr);
      throw new Error(stderr);
    }
    logger.info(`Successfully ran ${seed}:\n${stdout}`);
  } catch (error) {
    logger.error(`Failed to run seed ${seed}:`, error);
    throw error;
  }
}

async function main() {
  try {
    for (const seed of seeds) {
      await runSeed(seed);
    }
    process.exit(0);
  } catch (error) {
    logger.error('Seeding process failed:', error);
    process.exit(1);
  }
}

main();

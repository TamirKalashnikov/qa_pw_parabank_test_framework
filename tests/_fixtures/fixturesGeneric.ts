import { test as base } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { Logger } from '../../src/common/logger/Logger';
import * as allure from 'allure-js-commons';
import { parseTestTreeHierarchy } from '../../src/common/helpers/allureHelpers';

export const test = base.extend<{
  infoTestLog;
  addAllureTestHierarchy;
  logger;
  cleanAllureResults;
}>({
  logger: [
    async ({}, use) => {
      const logger = new Logger('error');

      await use(logger);
    },
    { scope: 'worker' },
  ],
  cleanAllureResults: [
    async ({}, use) => {
      const allureResultsDir = path.resolve(process.cwd(), 'allure-results');

      fs.rmSync(allureResultsDir, { recursive: true, force: true });

      await use('cleanAllureResults');
    },
    { scope: 'worker', auto: true },
  ],
  infoTestLog: [
    async ({ logger }, use, testInfo) => {
      const normalizedFile = testInfo.file.replace(/\\/g, '/');
      const fileName = normalizedFile.substring(
        normalizedFile.indexOf('/tests/') + 7,
      );

      logger.info(`Test started: ${fileName}`);

      await use('infoTestLog');

      logger.info(`Test completed: ${fileName}`);
    },
    { scope: 'test', auto: true },
  ],
  addAllureTestHierarchy: [
    async ({ logger }, use, testInfo) => {
      const [parentSuite, suite, subSuite] = parseTestTreeHierarchy(
        testInfo.file,
        logger,
      );

      await allure.parentSuite(parentSuite);
      await allure.suite(suite);
      if (subSuite) {
        await allure.subSuite(subSuite);
      }

      await use('addAllureTestHierarchy');
    },
    { scope: 'test', auto: true },
  ],
});

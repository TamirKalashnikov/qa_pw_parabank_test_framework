import { test as base } from './fixturesGeneric';
import { TransferFundsPage } from '../../src/ui/pages/payments/TransferFundsPage';
import { BillPayPage } from '../../src/ui/pages/payments/BillPayPage';
import { generatePayeeData } from '../../src/common/testData/generatePayeeData';

export const test = base.extend<{
  transferFundsPage;
  billPayPage;
  payee;
}>({
  transferFundsPage: async ({ page }, use) => {
    await use(new TransferFundsPage(page));
  },
  billPayPage: async ({ page }, use) => {
    await use(new BillPayPage(page));
  },
  payee: async ({}, use) => {
    await use(generatePayeeData());
  },
});

import { test as base } from './fixturesGeneric';
import { TransferFundsPage } from '../../src/ui/pages/payments/TransferFundsPage';

export const test = base.extend<{
  transferFundsPage;
}>({
  transferFundsPage: async ({ page }, use) => {
    await use(new TransferFundsPage(page));
  },
});

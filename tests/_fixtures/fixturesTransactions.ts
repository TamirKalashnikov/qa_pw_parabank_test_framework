import { test as base } from './fixturesGeneric';
import { FindTransactionsPage } from '../../src/ui/pages/transactions/FindTransactionsPage';

export const test = base.extend<{
  findTransactionsPage;
}>({
  findTransactionsPage: async ({ page }, use) => {
    await use(new FindTransactionsPage(page));
  },
});

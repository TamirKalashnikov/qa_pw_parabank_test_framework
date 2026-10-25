import { test as base } from './fixturesGeneric';
import { RequestLoanPage } from '../../src/ui/pages/loans/RequestLoanPage';

export const test = base.extend<{
  requestLoanPage;
}>({
  requestLoanPage: async ({ page }, use) => {
    await use(new RequestLoanPage(page));
  },
});

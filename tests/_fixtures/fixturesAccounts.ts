import { test as base } from './fixturesGeneric';
import { OpenNewAccountPage } from '../../src/ui/pages/accounts/OpenNewAccountPage';
import { UpdateContactInfoPage } from '../../src/ui/pages/profile/UpdateContactInfoPage';
import { AccountsOverviewPage } from '../../src/ui/pages/accounts/AccountsOverviewPage';

export const test = base.extend<{
  openNewAccountPage;
  updateContactInfoPage;
  accountsOverviewPage;
}>({
  openNewAccountPage: async ({ page }, use) => {
    await use(new OpenNewAccountPage(page));
  },
  updateContactInfoPage: async ({ page }, use) => {
    await use(new UpdateContactInfoPage(page));
  },
  accountsOverviewPage: async ({ page }, use) => {
    await use(new AccountsOverviewPage(page));
  },
});
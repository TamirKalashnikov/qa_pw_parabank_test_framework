import { test as base } from './fixturesGeneric';
import { OpenNewAccountPage } from '../../src/ui/pages/accounts/OpenNewAccountPage';
import { UpdateContactInfoPage } from '../../src/ui/pages/profile/UpdateContactInfoPage';
import { AccountsOverviewPage } from '../../src/ui/pages/accounts/AccountsOverviewPage';
import { AccountDetailsPage } from '../../src/ui/pages/accounts/AccountDetailsPage';

export const test = base.extend<{
  openNewAccountPage;
  updateContactInfoPage;
  accountsOverviewPage;
  accountDetailsPage;
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
  accountDetailsPage: async ({ page }, use) => {
    await use(new AccountDetailsPage(page));
  },
});

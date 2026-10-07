import { test as base } from './fixturesGeneric';
import { OpenNewAccountPage } from '../../src/ui/pages/accounts/OpenNewAccountPage';
import { UpdateContactInfoPage } from '../../src/ui/pages/profile/UpdateContactInfoPage';

export const test = base.extend<{
  openNewAccountPage;
  updateContactInfoPage;
}>({
  openNewAccountPage: async ({ page }, use) => {
    await use(new OpenNewAccountPage(page));
  },
  updateContactInfoPage: async ({ page }, use) => {
    await use(new UpdateContactInfoPage(page));
  },
});

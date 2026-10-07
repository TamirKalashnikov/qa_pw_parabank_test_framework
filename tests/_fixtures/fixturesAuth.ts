import { test as base } from './fixturesGeneric';
import { RegisterPage } from '../../src/ui/pages/auth/RegisterPage';
import { generateNewUserData } from '../../src/common/testData/generateNewUserData';

export const test = base.extend<{
  registerPage;
  newUser;
  registeredUser;
}>({
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  newUser: async ({ logger }, use) => {
    await use(generateNewUserData(logger));
  },
  registeredUser: async ({ registerPage, newUser }, use) => {
    await registerPage.open();
    await registerPage.fillRegisterForm(newUser);
    await registerPage.clickRegisterButton();
    await registerPage.assertSuccessfulRegistration(newUser.username);

    await use(newUser);
  },
});

import { test as base } from './fixturesGeneric';
import { RegisterPage } from '../../src/ui/pages/auth/RegisterPage';
import { LogOutPage } from '../../src/ui/pages/auth/LogOutPage';
import { SignInPage } from '../../src/ui/pages/auth/SignInPage';
import { generateNewUserData } from '../../src/common/testData/generateNewUserData';

export const test = base.extend<{
  registerPage;
  logOutPage;
  signInPage;
  newUser;
  registeredUser;
}>({
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  logOutPage: async ({ page }, use) => {
    await use(new LogOutPage(page));
  },
  signInPage: async ({ page }, use) => {
    await use(new SignInPage(page));
  },
  newUser: async ({ logger }, use) => {
    await use(generateNewUserData(logger));
  },
  registeredUser: async ({ registerPage, newUser }, use) => {
    const user = { ...newUser };
    const usernameError = registerPage.page.locator(
      '#customer\\.username\\.errors',
    );

    for (let attempt = 1; attempt <= 3; attempt++) {
      await registerPage.open();
      await registerPage.fillRegisterForm(user);
      await registerPage.clickRegisterButton();

      if (!(await usernameError.isVisible())) {
        break;
      }

      user.username = generateNewUserData().username;
    }

    await registerPage.assertSuccessfulRegistration(user.username);

    await use(user);
  },
});

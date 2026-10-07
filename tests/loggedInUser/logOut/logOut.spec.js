import * as allure from 'allure-js-commons';
import { test } from '../../_fixtures/fixtures';

test('Log out returns the user to the login page', async ({
  registeredUser,
  logOutPage,
}) => {
  await allure.severity('critical');

  await logOutPage.clickLogOutLink();
  await logOutPage.assertLoggedOut();
});

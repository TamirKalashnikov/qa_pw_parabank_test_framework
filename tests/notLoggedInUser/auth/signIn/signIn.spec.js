import * as allure from 'allure-js-commons';
import { test } from '../../../_fixtures/fixtures';

test('Sign in with valid credentials', async ({
  registeredUser,
  logOutPage,
  signInPage,
}) => {
  await allure.severity('blocker');

  await logOutPage.clickLogOutLink();
  await signInPage.signIn(registeredUser.username, registeredUser.password);
  await signInPage.assertSignedIn();
});

const NEGATIVE_CASES = [
  {
    title: 'unknown username and wrong password',
    credentials: () => ({ username: 'nosuchuser999', password: 'wrong' }),
  },
  {
    title: 'registered username and wrong password',
    credentials: (user) => ({
      username: user.username,
      password: `${user.password}x`,
    }),
  },
];

for (const { title, credentials } of NEGATIVE_CASES) {
  test(`Sign in fails with ${title}`, async ({
    registeredUser,
    logOutPage,
    signInPage,
  }) => {
    await allure.severity('critical');

    const { username, password } = credentials(registeredUser);

    await logOutPage.clickLogOutLink();
    await signInPage.signIn(username, password);
    await signInPage.assertSignInFailed();
  });
}

import * as allure from 'allure-js-commons';
import { test } from '../../../_fixtures/fixtures';

const REQUIRED_FIELDS = [
  { key: 'firstName', message: 'First name is required.' },
  { key: 'lastName', message: 'Last name is required.' },
  { key: 'address', message: 'Address is required.' },
  { key: 'city', message: 'City is required.' },
  { key: 'state', message: 'State is required.' },
  { key: 'zipCode', message: 'Zip Code is required.' },
  { key: 'ssn', message: 'Social Security Number is required.' },
];

test('Find login info with the registered user data', async ({
  registeredUser,
  logOutPage,
  lookupPage,
}) => {
  await allure.severity('critical');

  await logOutPage.clickLogOutLink();
  await lookupPage.open();
  await lookupPage.fillForm(registeredUser);
  await lookupPage.clickFindMyLoginInfo();
  await lookupPage.assertLoginInfoFound(
    registeredUser.username,
    registeredUser.password,
  );
});

test('Lookup fails when all fields are empty', async ({ lookupPage }) => {
  await allure.severity('normal');

  await lookupPage.open();
  await lookupPage.clickFindMyLoginInfo();
  for (const { message } of REQUIRED_FIELDS) {
    await lookupPage.assertErrorIsVisible(message);
  }
});

for (const { key, message } of REQUIRED_FIELDS) {
  test(`Lookup fails when '${key}' is empty`, async ({
    lookupPage,
    newUser,
  }) => {
    await allure.severity('normal');

    await lookupPage.open();
    await lookupPage.fillForm({ ...newUser, [key]: '' });
    await lookupPage.clickFindMyLoginInfo();
    await lookupPage.assertErrorIsVisible(message);
  });
}
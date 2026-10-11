import * as allure from 'allure-js-commons';
import { test } from '../../../_fixtures/fixtures';

const REQUIRED_FIELDS = [
  {
    key: 'firstName',
    errorId: 'customer.firstName',
    message: 'First name is required.',
  },
  {
    key: 'lastName',
    errorId: 'customer.lastName',
    message: 'Last name is required.',
  },
  {
    key: 'address',
    errorId: 'customer.address.street',
    message: 'Address is required.',
  },
  {
    key: 'city',
    errorId: 'customer.address.city',
    message: 'City is required.',
  },
  {
    key: 'state',
    errorId: 'customer.address.state',
    message: 'State is required.',
  },
  {
    key: 'zipCode',
    errorId: 'customer.address.zipCode',
    message: 'Zip Code is required.',
  },
  {
    key: 'ssn',
    errorId: 'customer.ssn',
    message: 'Social Security Number is required.',
  },
  {
    key: 'username',
    errorId: 'customer.username',
    message: 'Username is required.',
  },
  {
    key: 'password',
    errorId: 'customer.password',
    message: 'Password is required.',
  },
  {
    key: 'confirmPassword',
    errorId: 'repeatedPassword',
    message: 'Password confirmation is required.',
  },
];

test('Register a new user with valid data', async ({
  registerPage,
  newUser,
}) => {
  await allure.severity('blocker');

  await registerPage.open();
  await registerPage.fillRegisterForm(newUser);
  await registerPage.clickRegisterButton();
  await registerPage.assertSuccessfulRegistration(newUser.username);
});

test('Register a new user without the optional phone number', async ({
  registerPage,
  newUser,
}) => {
  await allure.severity('normal');

  await registerPage.open();
  await registerPage.fillRegisterForm({ ...newUser, phoneNumber: '' });
  await registerPage.clickRegisterButton();
  await registerPage.assertSuccessfulRegistration(newUser.username);
});

for (const { key, errorId, message } of REQUIRED_FIELDS) {
  test(`Register fails when '${key}' is empty`, async ({
    registerPage,
    newUser,
  }) => {
    await allure.severity('normal');

    await registerPage.open();
    await registerPage.fillRegisterForm({ ...newUser, [key]: '' });
    await registerPage.clickRegisterButton();
    await registerPage.assertFieldErrorIsVisible(errorId, message);
  });
}

test('Register fails with an already taken username', async ({
  registeredUser,
  logOutPage,
  registerPage,
  newUser,
}) => {
  await allure.severity('critical');

  await logOutPage.clickLogOutLink();
  await registerPage.open();
  await registerPage.fillRegisterForm({
    ...newUser,
    username: registeredUser.username,
  });
  await registerPage.clickRegisterButton();
  await registerPage.assertFieldErrorIsVisible(
    'customer.username',
    'This username already exists.',
  );
});

test('Register fails when the passwords do not match', async ({
  registerPage,
  newUser,
}) => {
  await allure.severity('normal');

  await registerPage.open();
  await registerPage.fillRegisterForm({
    ...newUser,
    confirmPassword: `${newUser.password}x`,
  });
  await registerPage.clickRegisterButton();
  await registerPage.assertFieldErrorIsVisible(
    'repeatedPassword',
    'Passwords did not match.',
  );
});
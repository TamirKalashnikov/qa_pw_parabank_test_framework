import * as allure from 'allure-js-commons';
import { test } from '../../../_fixtures/fixtures';

const REQUIRED_FIELDS = [
  { key: 'payeeName', message: 'Payee name is required.' },
  { key: 'address', message: 'Address is required.' },
  { key: 'city', message: 'City is required.' },
  { key: 'state', message: 'State is required.' },
  { key: 'zipCode', message: 'Zip Code is required.' },
  { key: 'phoneNumber', message: 'Phone number is required.' },
  { key: 'accountNumber', message: 'Account number is required.' },
  { key: 'verifyAccountNumber', message: 'Account number is required.' },
  { key: 'amount', message: 'The amount cannot be empty.' },
];

test('Bill pay fails when all fields are empty', async ({
  registeredUser,
  billPayPage,
}) => {
  await allure.severity('normal');

  await billPayPage.open();
  await billPayPage.clickSendPayment();
  for (const { key, message } of REQUIRED_FIELDS) {
    await billPayPage.assertFieldError(key, message);
  }
});

for (const { key, message } of REQUIRED_FIELDS) {
  test(`Bill pay fails when '${key}' is empty`, async ({
    registeredUser,
    billPayPage,
    payee,
  }) => {
    await allure.severity('normal');

    await billPayPage.open();
    await billPayPage.pay({
      ...payee,
      verifyAccountNumber: payee.accountNumber,
      amount: '1',
      [key]: '',
    });
    await billPayPage.assertFieldError(key, message);
  });
}

test('Bill pay fails when the account numbers do not match', async ({
  registeredUser,
  billPayPage,
  payee,
}) => {
  await allure.severity('critical');

  await billPayPage.open();
  await billPayPage.pay({
    ...payee,
    verifyAccountNumber: `${payee.accountNumber}1`,
    amount: '1',
  });
  await billPayPage.assertFieldError(
    'verifyAccountNumber',
    'The account numbers do not match.',
  );
});

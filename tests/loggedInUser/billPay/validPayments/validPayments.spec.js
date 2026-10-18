import * as allure from 'allure-js-commons';
import { test } from '../../../_fixtures/fixtures';
import { ACCOUNT_TYPES } from '../../../../src/ui/pages/accounts/OpenNewAccountPage';

const AMOUNTS = ['1', '12.50', '100'];

for (const amount of AMOUNTS) {
  test(`Pay a bill of $${amount} from the first account`, async ({
    registeredUser,
    accountsOverviewPage,
    billPayPage,
    payee,
  }) => {
    await allure.severity('critical');

    await accountsOverviewPage.open();
    const accountId = await accountsOverviewPage.getFirstAccountId();

    await billPayPage.open();
    await billPayPage.pay(
      {
        ...payee,
        verifyAccountNumber: payee.accountNumber,
        amount,
      },
      accountId,
    );
    await billPayPage.assertPaymentComplete(payee.payeeName, amount, accountId);
  });
}

test('Bill payment appears as a debit in the account activity', async ({
  registeredUser,
  accountsOverviewPage,
  billPayPage,
  accountDetailsPage,
  payee,
}) => {
  await allure.severity('critical');

  await accountsOverviewPage.open();
  const accountId = await accountsOverviewPage.getFirstAccountId();

  await billPayPage.open();
  await billPayPage.pay(
    { ...payee, verifyAccountNumber: payee.accountNumber, amount: '5' },
    accountId,
  );
  await billPayPage.assertPaymentComplete(payee.payeeName, '5', accountId);

  await accountDetailsPage.open(accountId);
  await accountDetailsPage.assertTransaction(
    `Bill Payment to ${payee.payeeName}`,
    'debit',
    '$5.00',
  );
});

for (const accountType of Object.values(ACCOUNT_TYPES)) {
  test(`Pay a bill from a new ${accountType.label} account`, async ({
    registeredUser,
    openNewAccountPage,
    billPayPage,
    payee,
  }) => {
    await allure.severity('normal');

    await openNewAccountPage.open();
    await openNewAccountPage.openAccount(accountType);
    await openNewAccountPage.assertAccountOpened();
    const newAccountId = await openNewAccountPage.getNewAccountId();

    await billPayPage.open();
    await billPayPage.pay(
      { ...payee, verifyAccountNumber: payee.accountNumber, amount: '1' },
      newAccountId,
    );
    await billPayPage.assertPaymentComplete(payee.payeeName, '1', newAccountId);
  });
}

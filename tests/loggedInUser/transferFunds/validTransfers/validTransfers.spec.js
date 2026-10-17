import * as allure from 'allure-js-commons';
import { test } from '../../../_fixtures/fixtures';
import { ACCOUNT_TYPES } from '../../../../src/ui/pages/accounts/OpenNewAccountPage';

const VALID_AMOUNTS = ['1', '10', '100'];

for (const amount of VALID_AMOUNTS) {
  test(`Transfer $${amount} to the same account`, async ({
    registeredUser,
    accountsOverviewPage,
    transferFundsPage,
  }) => {
    await allure.severity('critical');

    await accountsOverviewPage.open();
    const accountId = await accountsOverviewPage.getFirstAccountId();

    await transferFundsPage.open();
    await transferFundsPage.transfer(amount, accountId, accountId);
    await transferFundsPage.assertTransferComplete(
      amount,
      accountId,
      accountId,
    );
  });
}

test('Transfer creates sent and received transactions in the activity', async ({
  registeredUser,
  accountsOverviewPage,
  transferFundsPage,
  accountDetailsPage,
}) => {
  await allure.severity('critical');

  await accountsOverviewPage.open();
  const accountId = await accountsOverviewPage.getFirstAccountId();

  await transferFundsPage.open();
  await transferFundsPage.transfer('1', accountId, accountId);
  await transferFundsPage.assertTransferComplete('1', accountId, accountId);

  await accountDetailsPage.open(accountId);
  await accountDetailsPage.assertTransaction(
    'Funds Transfer Sent',
    'debit',
    '$1.00',
  );
  await accountDetailsPage.assertTransaction(
    'Funds Transfer Received',
    'credit',
    '$1.00',
  );
});

for (const accountType of Object.values(ACCOUNT_TYPES)) {
  test(`Transfer from the first account to a new ${accountType.label} account`, async ({
    registeredUser,
    accountsOverviewPage,
    openNewAccountPage,
    transferFundsPage,
  }) => {
    await allure.severity('critical');

    await accountsOverviewPage.open();
    const firstAccountId = await accountsOverviewPage.getFirstAccountId();

    await openNewAccountPage.open();
    await openNewAccountPage.openAccount(accountType);
    await openNewAccountPage.assertAccountOpened();
    const newAccountId = await openNewAccountPage.getNewAccountId();

    await transferFundsPage.open();
    await transferFundsPage.transfer('10', firstAccountId, newAccountId);
    await transferFundsPage.assertTransferComplete(
      '10',
      firstAccountId,
      newAccountId,
    );
  });
}

import * as allure from 'allure-js-commons';
import { test } from '../../../_fixtures/fixtures';
import { ACCOUNT_TYPES } from '../../../../src/ui/pages/accounts/OpenNewAccountPage';

test('Accounts overview shows the accounts table', async ({
  registeredUser,
  accountsOverviewPage,
}) => {
  await allure.severity('critical');

  await accountsOverviewPage.open();
  await accountsOverviewPage.assertOverviewIsShown();
});

test('Total equals the sum of the account balances', async ({
  registeredUser,
  accountsOverviewPage,
}) => {
  await allure.severity('normal');

  await accountsOverviewPage.open();
  await accountsOverviewPage.assertTotalEqualsSumOfBalances();
});

test('Account number opens the account details page', async ({
  registeredUser,
  accountsOverviewPage,
}) => {
  await allure.severity('normal');

  await accountsOverviewPage.open();
  const accountId = await accountsOverviewPage.getFirstAccountId();
  await accountsOverviewPage.clickAccount(accountId);
  await accountsOverviewPage.assertAccountDetailsOpened(accountId);
});

for (const accountType of Object.values(ACCOUNT_TYPES)) {
  test(`New ${accountType.label} account appears in the overview`, async ({
    registeredUser,
    accountsOverviewPage,
    openNewAccountPage,
  }) => {
    await allure.severity('critical');

    await accountsOverviewPage.open();
    const accountsBefore = await accountsOverviewPage.getAccountsCount();

    await openNewAccountPage.open();
    await openNewAccountPage.openAccount(accountType);
    await openNewAccountPage.assertAccountOpened();
    const newAccountId = await openNewAccountPage.getNewAccountId();

    await accountsOverviewPage.open();
    await accountsOverviewPage.assertAccountsCount(accountsBefore + 1);
    await accountsOverviewPage.assertAccountIsListed(newAccountId);
  });
}
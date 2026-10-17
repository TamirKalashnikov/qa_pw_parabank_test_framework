import * as allure from 'allure-js-commons';
import { test } from '../../../_fixtures/fixtures';
import { ACCOUNT_TYPES } from '../../../../src/ui/pages/accounts/OpenNewAccountPage';

test('Account details show the data of the first account', async ({
  registeredUser,
  accountsOverviewPage,
  accountDetailsPage,
}) => {
  await allure.severity('critical');

  await accountsOverviewPage.open();
  const accountId = await accountsOverviewPage.getFirstAccountId();
  await accountDetailsPage.open(accountId);
  await accountDetailsPage.assertDetailsShown(accountId, '(CHECKING|SAVINGS)');
});

for (const accountType of Object.values(ACCOUNT_TYPES)) {
  test(`Account details show the type of a new ${accountType.label} account`, async ({
    registeredUser,
    openNewAccountPage,
    accountDetailsPage,
  }) => {
    await allure.severity('normal');

    await openNewAccountPage.open();
    await openNewAccountPage.openAccount(accountType);
    await openNewAccountPage.assertAccountOpened();
    const accountId = await openNewAccountPage.getNewAccountId();

    await accountDetailsPage.open(accountId);
    await accountDetailsPage.assertDetailsShown(accountId, accountType.label);
  });
}

test('Account activity has the default filters and shows no transactions for an account without them', async ({
  registeredUser,
  accountsOverviewPage,
  accountDetailsPage,
}) => {
  await allure.severity('normal');

  await accountsOverviewPage.open();
  const accountId = await accountsOverviewPage.getFirstAccountId();
  await accountDetailsPage.open(accountId);
  await accountDetailsPage.assertFiltersAreAll();
  await accountDetailsPage.selectFilters('All', 'All');
  await accountDetailsPage.clickGo();
  await accountDetailsPage.assertNoTransactions();
});

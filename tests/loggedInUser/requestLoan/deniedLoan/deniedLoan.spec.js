import * as allure from 'allure-js-commons';
import { test } from '../../../_fixtures/fixtures';

test('Loan request is denied for an excessive amount', async ({
  registeredUser,
  accountsOverviewPage,
  requestLoanPage,
}) => {
  await allure.severity('critical');

  await accountsOverviewPage.open();
  const accountId = await accountsOverviewPage.getFirstAccountId();

  await requestLoanPage.open();
  await requestLoanPage.apply('999999', '10', accountId);
  await requestLoanPage.assertDenied();
});

test('Denied loan does not add a new account', async ({
  registeredUser,
  accountsOverviewPage,
  requestLoanPage,
}) => {
  await allure.severity('normal');

  await accountsOverviewPage.open();
  const accountsBefore = await accountsOverviewPage.getAccountsCount();
  const accountId = await accountsOverviewPage.getFirstAccountId();

  await requestLoanPage.open();
  await requestLoanPage.apply('999999', '10', accountId);
  await requestLoanPage.assertDenied();

  await accountsOverviewPage.open();
  await accountsOverviewPage.assertAccountsCount(accountsBefore);
});

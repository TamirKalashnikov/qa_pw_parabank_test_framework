import * as allure from 'allure-js-commons';
import { test } from '../../../_fixtures/fixtures';

test('Loan request is approved', async ({
  registeredUser,
  accountsOverviewPage,
  requestLoanPage,
}) => {
  await allure.severity('critical');

  await accountsOverviewPage.open();
  const accountId = await accountsOverviewPage.getFirstAccountId();

  await requestLoanPage.open();
  await requestLoanPage.apply('100', '10', accountId);
  await requestLoanPage.assertApproved();
});

test('Approved loan adds a new account to the overview', async ({
  registeredUser,
  accountsOverviewPage,
  requestLoanPage,
}) => {
  await allure.severity('critical');

  await accountsOverviewPage.open();
  const accountsBefore = await accountsOverviewPage.getAccountsCount();
  const accountId = await accountsOverviewPage.getFirstAccountId();

  await requestLoanPage.open();
  await requestLoanPage.apply('100', '10', accountId);
  await requestLoanPage.assertApproved();
  const loanAccountId = await requestLoanPage.getNewAccountId();

  await accountsOverviewPage.open();
  await accountsOverviewPage.assertAccountsCount(accountsBefore + 1);
  await accountsOverviewPage.assertAccountIsListed(loanAccountId);
});

test('Approved loan account has the LOAN type', async ({
  registeredUser,
  accountsOverviewPage,
  requestLoanPage,
  accountDetailsPage,
}) => {
  await allure.severity('normal');

  await accountsOverviewPage.open();
  const accountId = await accountsOverviewPage.getFirstAccountId();

  await requestLoanPage.open();
  await requestLoanPage.apply('100', '10', accountId);
  await requestLoanPage.assertApproved();
  const loanAccountId = await requestLoanPage.getNewAccountId();

  await accountDetailsPage.open(loanAccountId);
  await accountDetailsPage.assertDetailsShown(loanAccountId, 'LOAN');
});

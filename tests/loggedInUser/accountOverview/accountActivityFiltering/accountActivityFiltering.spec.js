import * as allure from 'allure-js-commons';
import { test } from '../../../_fixtures/fixtures';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const currentMonthIndex = new Date().getMonth();
const CURRENT_MONTH = MONTHS[currentMonthIndex];
const OTHER_MONTH = MONTHS[(currentMonthIndex + 6) % 12];

const SENT = 'Funds Transfer Sent';
const RECEIVED = 'Funds Transfer Received';

const CASES = [
  { type: 'All', month: 'All', listed: [SENT, RECEIVED], notListed: [] },
  {
    type: 'All',
    month: CURRENT_MONTH,
    listed: [SENT, RECEIVED],
    notListed: [],
  },
  { type: 'Debit', month: 'All', listed: [SENT], notListed: [RECEIVED] },
  {
    type: 'Debit',
    month: CURRENT_MONTH,
    listed: [SENT],
    notListed: [RECEIVED],
  },
  { type: 'Credit', month: 'All', listed: [RECEIVED], notListed: [SENT] },
  {
    type: 'Credit',
    month: CURRENT_MONTH,
    listed: [RECEIVED],
    notListed: [SENT],
  },
  { type: 'All', month: OTHER_MONTH, listed: [], notListed: [SENT, RECEIVED] },
  {
    type: 'Debit',
    month: OTHER_MONTH,
    listed: [],
    notListed: [SENT, RECEIVED],
  },
  {
    type: 'Credit',
    month: OTHER_MONTH,
    listed: [],
    notListed: [SENT, RECEIVED],
  },
];

for (const { type, month, listed, notListed } of CASES) {
  test(`Activity filter: type '${type}', period '${month}'`, async ({
    registeredUser,
    accountsOverviewPage,
    transferFundsPage,
    accountDetailsPage,
  }) => {
    await allure.severity('normal');

    await accountsOverviewPage.open();
    const accountId = await accountsOverviewPage.getFirstAccountId();

    await transferFundsPage.open();
    await transferFundsPage.transfer('1', accountId, accountId);
    await transferFundsPage.assertTransferComplete('1', accountId, accountId);

    await accountDetailsPage.open(accountId);
    await accountDetailsPage.filterActivity(month, type);

    for (const name of listed) {
      await accountDetailsPage.assertTransactionListed(name);
    }
    for (const name of notListed) {
      await accountDetailsPage.assertTransactionNotListed(name);
    }
    if (listed.length === 0) {
      await accountDetailsPage.assertNoTransactions();
    }
  });
}
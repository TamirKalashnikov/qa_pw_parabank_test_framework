import * as allure from 'allure-js-commons';
import { test } from '../../../_fixtures/fixtures';
import {
  addDays,
  formatSiteDate,
} from '../../../../src/common/helpers/dateHelpers';

const AMOUNT = '15';
const AMOUNT_TEXT = '$15.00';

async function createBillPayment(
  { accountsOverviewPage, billPayPage, payee },
  amount,
) {
  await accountsOverviewPage.open();
  const accountId = await accountsOverviewPage.getFirstAccountId();

  await billPayPage.open();
  await billPayPage.pay(
    { ...payee, verifyAccountNumber: payee.accountNumber, amount },
    accountId,
  );
  await billPayPage.assertPaymentComplete(payee.payeeName, amount, accountId);
}

test('Find a transaction by amount', async ({
  registeredUser,
  accountsOverviewPage,
  billPayPage,
  payee,
  findTransactionsPage,
}) => {
  await allure.severity('critical');

  await createBillPayment(
    { accountsOverviewPage, billPayPage, payee },
    AMOUNT,
  );

  await findTransactionsPage.open();
  await findTransactionsPage.findByAmount(AMOUNT);
  await findTransactionsPage.assertTransaction(
    `Bill Payment to ${payee.payeeName}`,
    'debit',
    AMOUNT_TEXT,
  );
});

test('Find a transaction by its ID', async ({
  registeredUser,
  accountsOverviewPage,
  billPayPage,
  payee,
  findTransactionsPage,
}) => {
  await allure.severity('critical');

  await createBillPayment(
    { accountsOverviewPage, billPayPage, payee },
    AMOUNT,
  );
  const name = `Bill Payment to ${payee.payeeName}`;

  await findTransactionsPage.open();
  await findTransactionsPage.findByAmount(AMOUNT);
  const transactionId = await findTransactionsPage.getTransactionId(name);

  await findTransactionsPage.open();
  await findTransactionsPage.findById(transactionId);
  await findTransactionsPage.assertTransaction(name, 'debit', AMOUNT_TEXT);
});

test('Find a transaction by today date', async ({
  registeredUser,
  accountsOverviewPage,
  billPayPage,
  payee,
  findTransactionsPage,
}) => {
  await allure.severity('normal');

  await createBillPayment(
    { accountsOverviewPage, billPayPage, payee },
    AMOUNT,
  );

  await findTransactionsPage.open();
  await findTransactionsPage.findByDate(formatSiteDate(new Date()));
  await findTransactionsPage.assertTransaction(
    `Bill Payment to ${payee.payeeName}`,
    'debit',
    AMOUNT_TEXT,
  );
});

test('Find a transaction by a date range around today', async ({
  registeredUser,
  accountsOverviewPage,
  billPayPage,
  payee,
  findTransactionsPage,
}) => {
  await allure.severity('normal');

  await createBillPayment(
    { accountsOverviewPage, billPayPage, payee },
    AMOUNT,
  );
  const today = new Date();

  await findTransactionsPage.open();
  await findTransactionsPage.findByDateRange(
    formatSiteDate(addDays(today, -1)),
    formatSiteDate(addDays(today, 1)),
  );
  await findTransactionsPage.assertTransaction(
    `Bill Payment to ${payee.payeeName}`,
    'debit',
    AMOUNT_TEXT,
  );
});

test('Transaction link opens the transaction details', async ({
  registeredUser,
  accountsOverviewPage,
  billPayPage,
  payee,
  findTransactionsPage,
}) => {
  await allure.severity('normal');

  await createBillPayment(
    { accountsOverviewPage, billPayPage, payee },
    AMOUNT,
  );
  const name = `Bill Payment to ${payee.payeeName}`;

  await findTransactionsPage.open();
  await findTransactionsPage.findByAmount(AMOUNT);
  const transactionId = await findTransactionsPage.getTransactionId(name);
  await findTransactionsPage.openTransaction(name);
  await findTransactionsPage.assertTransactionDetails(
    transactionId,
    name,
    'Debit',
  );
});

test('Search by an amount without transactions returns an empty table', async ({
  registeredUser,
  findTransactionsPage,
}) => {
  await allure.severity('normal');

  await findTransactionsPage.open();
  await findTransactionsPage.findByAmount('99999.99');
  await findTransactionsPage.assertNoResults();
});

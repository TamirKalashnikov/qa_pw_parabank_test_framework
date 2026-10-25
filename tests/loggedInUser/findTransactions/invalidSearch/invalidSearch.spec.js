import * as allure from 'allure-js-commons';
import { test } from '../../../_fixtures/fixtures';

const CASES = [
  {
    title: 'transaction ID',
    button: 'id',
    message: 'Invalid transaction ID',
  },
  { title: 'date', button: 'date', message: 'Invalid date format' },
  {
    title: 'date range',
    button: 'dateRange',
    message: 'Invalid date format',
  },
  { title: 'amount', button: 'amount', message: 'Invalid amount' },
];

for (const { title, button, message } of CASES) {
  test(`Search by empty ${title} shows a validation error`, async ({
    registeredUser,
    findTransactionsPage,
  }) => {
    await allure.severity('normal');

    await findTransactionsPage.open();
    await findTransactionsPage.search(
      {},
      button,
      `Submit the empty '${title}' search`,
    );
    await findTransactionsPage.assertSearchError(message);
  });
}

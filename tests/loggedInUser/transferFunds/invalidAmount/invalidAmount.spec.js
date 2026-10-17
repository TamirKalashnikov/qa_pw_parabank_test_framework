import * as allure from 'allure-js-commons';
import { test } from '../../../_fixtures/fixtures';

const INVALID_AMOUNTS = [
  {
    title: 'empty',
    value: '',
    expectedMessage: 'The amount cannot be empty.',
  },
  {
    title: 'letters',
    value: 'ddd',
    expectedMessage: 'Please enter a valid amount.',
  },
];

for (const { title, value, expectedMessage } of INVALID_AMOUNTS) {
  test(`Transfer with ${title} amount shows a validation error`, async ({
    registeredUser,
    accountsOverviewPage,
    transferFundsPage,
  }) => {
    await allure.severity('normal');
    await allure.description(
      'Known defect: the site shows an internal error instead of the validation message',
    );
    test.fail();

    await accountsOverviewPage.open();
    const accountId = await accountsOverviewPage.getFirstAccountId();

    await transferFundsPage.open();
    await transferFundsPage.transfer(value, accountId, accountId);
    await transferFundsPage.assertAmountError(expectedMessage);
  });

  test(`Transfer with ${title} amount currently ends with an internal error`, async ({
    registeredUser,
    accountsOverviewPage,
    transferFundsPage,
  }) => {
    await allure.severity('minor');

    await accountsOverviewPage.open();
    const accountId = await accountsOverviewPage.getFirstAccountId();

    await transferFundsPage.open();
    await transferFundsPage.transfer(value, accountId, accountId);
    await transferFundsPage.assertInternalError();
  });
}

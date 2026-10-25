import * as allure from 'allure-js-commons';
import { test } from '../../../_fixtures/fixtures';

test('Loan request with empty fields currently ends with an internal error', async ({
  registeredUser,
  requestLoanPage,
}) => {
  await allure.severity('minor');
  await allure.description(
    'Known defect: the empty loan form is sent to the server (400 Bad Request) and the site shows an internal error instead of a validation message',
  );

  await requestLoanPage.open();
  await requestLoanPage.apply('', '');
  await requestLoanPage.assertInternalError();
});

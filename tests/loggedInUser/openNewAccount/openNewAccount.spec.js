import * as allure from 'allure-js-commons';
import { test } from '../../_fixtures/fixtures';
import { ACCOUNT_TYPES } from '../../../src/ui/pages/accounts/OpenNewAccountPage';

for (const accountType of Object.values(ACCOUNT_TYPES)) {
  test(`Open a new ${accountType.label} account`, async ({
    registeredUser,
    openNewAccountPage,
  }) => {
    await allure.severity('critical');

    await openNewAccountPage.open();
    await openNewAccountPage.openAccount(accountType);
    await openNewAccountPage.assertAccountOpened();
  });
}

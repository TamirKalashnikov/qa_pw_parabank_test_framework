import * as allure from 'allure-js-commons';
import { test } from '../../_fixtures/fixtures';
import { generateNewUserData } from '../../../src/common/testData/generateNewUserData';

const FIELDS = [
  'firstName',
  'lastName',
  'address',
  'city',
  'state',
  'zipCode',
  'phoneNumber',
];

for (const field of FIELDS) {
  test(`Update only the '${field}' field`, async ({
    registeredUser,
    updateContactInfoPage,
  }) => {
    await allure.severity('normal');

    const newData = generateNewUserData();

    await updateContactInfoPage.open();
    await updateContactInfoPage.updateProfile({ [field]: newData[field] });
    await updateContactInfoPage.assertProfileUpdated();
  });
}

test('Update all contact fields at once', async ({
  registeredUser,
  updateContactInfoPage,
}) => {
  await allure.severity('critical');

  const newData = generateNewUserData();

  await updateContactInfoPage.open();
  await updateContactInfoPage.updateProfile(newData);
  await updateContactInfoPage.assertProfileUpdated();
});

import { expect, testStep } from '../../../common/helpers/pwHelpers';

export class UpdateContactInfoPage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.firstNameField = page.locator('#customer\\.firstName');
    this.lastNameField = page.locator('#customer\\.lastName');
    this.addressField = page.locator('#customer\\.address\\.street');
    this.cityField = page.locator('#customer\\.address\\.city');
    this.stateField = page.locator('#customer\\.address\\.state');
    this.zipCodeField = page.locator('#customer\\.address\\.zipCode');
    this.phoneField = page.locator('#customer\\.phoneNumber');
    this.updateProfileButton = page.locator('input[value="Update Profile"]');
    this.form = page.locator('#updateProfileForm');
    this.result = page.locator('#updateProfileResult');
    this.error = page.locator('#updateProfileError');
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async open() {
    await this.step(`Open the 'Update Contact Info' page`, async () => {
      await this.page.goto('updateprofile.htm');
      await this.page.waitForLoadState('networkidle');
      await expect(this.form).toBeVisible();
    });
  }

  async fillForm(data) {
    await this.step(`Fill the 'Update Contact Info' form`, async () => {
      const fields = {
        firstName: this.firstNameField,
        lastName: this.lastNameField,
        address: this.addressField,
        city: this.cityField,
        state: this.stateField,
        zipCode: this.zipCodeField,
        phoneNumber: this.phoneField,
      };

      for (const [key, field] of Object.entries(fields)) {
        if (data[key] !== undefined) {
          await field.fill(data[key]);
        }
      }
    });
  }

  async clickUpdateProfileButton() {
    await this.step(`Click the 'Update Profile' button`, async () => {
      await this.updateProfileButton.click();
    });
  }

  async updateProfile(data) {
    await this.fillForm(data);
    await this.clickUpdateProfileButton();
  }

  async assertProfileUpdated() {
    await this.step(`Assert the profile is updated`, async () => {
      await expect(this.result).toBeVisible();
      await expect(this.form).toBeHidden();
      await expect(this.result.getByText('Profile Updated')).toBeVisible();
      await expect(
        this.result.getByText(
          'Your updated address and phone number have been added to the system.',
        ),
      ).toBeVisible();
    });
  }
}

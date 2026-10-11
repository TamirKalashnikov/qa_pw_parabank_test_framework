/* eslint-disable max-len */
import { expect, testStep } from '../../../common/helpers/pwHelpers';

export class LookupPage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.form = page.locator('#lookupForm');
    this.rows = {
      firstName: 'First Name:',
      lastName: 'Last Name:',
      address: 'Address:',
      city: 'City:',
      state: 'State:',
      zipCode: 'Zip Code:',
      ssn: 'SSN:',
    };
    this.findButton = page.getByRole('button', { name: 'Find My Login Info' });
    this.rightPanel = page.locator('#rightPanel');
    this.logOutLink = page.getByRole('link', { name: 'Log Out' });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  field(key) {
    return this.form
      .locator('tr', { hasText: this.rows[key] })
      .locator('input');
  }

  async open() {
    await this.step(`Open the 'Forgot login info' page`, async () => {
      await this.page.goto('lookup.htm');
      await this.page.waitForLoadState('networkidle');
      await expect(this.form).toBeVisible();
    });
  }

  async fillForm(user) {
    await this.step(`Fill the 'Customer Lookup' form`, async () => {
      for (const key of Object.keys(this.rows)) {
        await this.field(key).fill(user[key]);
      }
    });
  }

  async clickFindMyLoginInfo() {
    await this.step(`Click the 'Find My Login Info' button`, async () => {
      await this.findButton.click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  async assertErrorIsVisible(message) {
    await this.step(`Assert the error '${message}' is visible`, async () => {
      await expect(this.form.getByText(message, { exact: true })).toBeVisible();
    });
  }

  async assertLoginInfoFound(username, password) {
    await this.step(
      `Assert the login info is shown for '${username}'`,
      async () => {
        await expect(this.rightPanel).toContainText(
          'Your login information was located successfully. You are now logged in.',
        );
        await expect(this.rightPanel).toContainText(`Username: ${username}`);
        await expect(this.rightPanel).toContainText(`Password: ${password}`);
        await expect(this.logOutLink).toBeVisible();
      },
    );
  }
}
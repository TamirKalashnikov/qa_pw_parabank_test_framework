import { expect, testStep } from '../../../common/helpers/pwHelpers';

export class RegisterPage {
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
    this.ssnField = page.locator('#customer\\.ssn');
    this.usernameField = page.locator('#customer\\.username');
    this.passwordField = page.locator('#customer\\.password');
    this.confirmPasswordField = page.locator('#repeatedPassword');
    this.registerButton = page.getByRole('button', { name: 'Register' });
    this.pageTitle = page.locator('#rightPanel h1.title');
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async open() {
    await this.step(`Open the 'Register' page`, async () => {
      await this.page.goto('register.htm');
    });
  }

  async fillRegisterForm(user) {
    await this.step(`Fill the 'Register' form`, async () => {
      await this.firstNameField.fill(user.firstName);
      await this.lastNameField.fill(user.lastName);
      await this.addressField.fill(user.address);
      await this.cityField.fill(user.city);
      await this.stateField.fill(user.state);
      await this.zipCodeField.fill(user.zipCode);
      await this.phoneField.fill(user.phoneNumber);
      await this.ssnField.fill(user.ssn);
      await this.usernameField.fill(user.username);
      await this.passwordField.fill(user.password);
      await this.confirmPasswordField.fill(user.password);
    });
  }

  async clickRegisterButton() {
    await this.step(`Click the 'Register' button`, async () => {
      await this.registerButton.click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  async assertSuccessfulRegistration(username) {
    await this.step(
      `Assert the registration success message for '${username}'`,
      async () => {
        await expect(this.pageTitle).toHaveText(`Welcome ${username}`);
      },
    );
  }

  async assertFieldErrorIsVisible(fieldId, message) {
    await this.step(
      `Assert the error '${message}' is visible for '${fieldId}'`,
      async () => {
        await expect(
          this.page.locator(`#${fieldId}\\.errors`),
        ).toHaveText(message);
      },
    );
  }
}

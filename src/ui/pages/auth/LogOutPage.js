import { expect, testStep } from '../../../common/helpers/pwHelpers';

export class LogOutPage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.logOutLink = page.getByRole('link', { name: 'Log Out' });
    this.usernameField = page.locator('input[name="username"]');
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async clickLogOutLink() {
    await this.step(`Click the 'Log Out' link`, async () => {
      await this.logOutLink.click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  async assertLoggedOut() {
    await this.step(`Assert the user is logged out`, async () => {
      await expect(this.page).toHaveURL(/index\.htm/);
      await expect(this.usernameField).toBeVisible();
      await expect(this.logOutLink).toBeHidden();
    });
  }
}

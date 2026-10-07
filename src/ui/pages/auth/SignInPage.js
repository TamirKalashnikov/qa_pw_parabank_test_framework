import { expect, testStep } from '../../../common/helpers/pwHelpers';

export class SignInPage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.usernameField = page.locator('input[name="username"]');
    this.passwordField = page.locator('input[name="password"]');
    this.logInButton = page.locator('input[value="Log In"]');
    this.logOutLink = page.getByRole('link', { name: 'Log Out' });
    this.accountsTable = page.locator('#accountTable');
    this.errorTitle = page.locator('#rightPanel h1.title');
    this.errorMessage = page.locator('#rightPanel p.error');
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async open() {
    await this.step(`Open the 'Sign In' page`, async () => {
      await this.page.goto('index.htm');
      await this.page.waitForLoadState('networkidle');
      await expect(this.usernameField).toBeVisible();
    });
  }

  async signIn(username, password) {
    await this.step(`Sign in as '${username}'`, async () => {
      await this.usernameField.fill(username);
      await this.passwordField.fill(password);
      await this.logInButton.click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  async assertSignedIn() {
    await this.step(`Assert the user is signed in`, async () => {
      await expect(this.logOutLink).toBeVisible();
      await expect(this.accountsTable).toBeVisible();
    });
  }

  async assertSignInFailed() {
    await this.step(`Assert the sign in error is shown`, async () => {
      await expect(this.errorTitle).toHaveText('Error!');
      await expect(this.errorMessage).toHaveText(
        'The username and password could not be verified.',
      );
      await expect(this.logOutLink).toBeHidden();
    });
  }
}

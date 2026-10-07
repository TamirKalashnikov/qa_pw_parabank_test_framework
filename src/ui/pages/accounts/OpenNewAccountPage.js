import { expect, testStep } from '../../../common/helpers/pwHelpers';

export const ACCOUNT_TYPES = {
  CHECKING: { label: 'CHECKING', value: '0' },
  SAVINGS: { label: 'SAVINGS', value: '1' },
};

export class OpenNewAccountPage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.accountTypeSelect = page.locator('#type');
    this.openAccountButton = page.locator('input[value="Open New Account"]');
    this.form = page.locator('#openAccountForm');
    this.result = page.locator('#openAccountResult');
    this.error = page.locator('#openAccountError');
    this.newAccountId = page.locator('#newAccountId');
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async open() {
    await this.step(`Open the 'Open New Account' page`, async () => {
      await this.page.goto('openaccount.htm');
      await this.page.waitForLoadState('networkidle');
      await expect(this.form).toBeVisible();
    });
  }

  async selectAccountType(accountType) {
    await this.step(
      `Select the account type '${accountType.label}'`,
      async () => {
        await this.accountTypeSelect.selectOption(accountType.value);
      },
    );
  }

  async clickOpenAccountButton() {
    await this.step(`Click the 'Open New Account' button`, async () => {
      await this.openAccountButton.click();
    });
  }

  async openAccount(accountType) {
    await this.selectAccountType(accountType);
    await this.clickOpenAccountButton();
  }

  async assertAccountOpened() {
    await this.step(`Assert the new account is opened`, async () => {
      await expect(this.result).toBeVisible();
      await expect(this.form).toBeHidden();
      await expect(this.result.getByText('Account Opened!')).toBeVisible();
      await expect(this.newAccountId).toHaveText(/^\d+$/);
    });
  }
}

import { expect, testStep } from '../../../common/helpers/pwHelpers';

export class TransferFundsPage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.form = page.locator('#showForm');
    this.amountField = page.locator('#amount');
    this.fromAccount = page.locator('#fromAccountId');
    this.toAccount = page.locator('#toAccountId');
    this.transferButton = page.locator('input[value="Transfer"]');
    this.result = page.locator('#showResult');
    this.internalError = page.locator('#showError');
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async open() {
    await this.step(`Open the 'Transfer Funds' page`, async () => {
      await this.page.goto('transfer.htm');
      await this.page.waitForLoadState('networkidle');
      await expect(this.form).toBeVisible();
      await expect(this.fromAccount.locator('option')).not.toHaveCount(0);
      await expect(this.toAccount.locator('option')).not.toHaveCount(0);
    });
  }

  async fillAmount(amount) {
    await this.step(`Fill the amount '${amount}'`, async () => {
      await this.amountField.fill(amount);
    });
  }

  async selectAccounts(fromId, toId) {
    await this.step(
      `Select the accounts: from '${fromId}' to '${toId}'`,
      async () => {
        await this.fromAccount.selectOption(fromId);
        await this.toAccount.selectOption(toId);
      },
    );
  }

  async clickTransfer() {
    await this.step(`Click the 'Transfer' button`, async () => {
      await this.transferButton.click();
    });
  }

  async transfer(amount, fromId, toId) {
    await this.selectAccounts(fromId, toId);
    await this.fillAmount(amount);
    await this.clickTransfer();
  }

  async assertTransferComplete(amount, fromId, toId) {
    await this.step(`Assert the transfer is complete`, async () => {
      const money = Number(amount).toFixed(2);
      await expect(this.result).toBeVisible();
      await expect(this.form).toBeHidden();
      await expect(this.result).toContainText('Transfer Complete!');
      await expect(this.result).toContainText(
        `$${money} has been transferred from account #${fromId} to account #${toId}.`,
      );
    });
  }

  async assertAmountError(message) {
    await this.step(`Assert the amount error '${message}'`, async () => {
      await expect(this.form.getByText(message, { exact: true })).toBeVisible();
      await expect(this.result).toBeHidden();
    });
  }

  async assertInternalError() {
    await this.step(`Assert the internal error is shown`, async () => {
      await expect(this.internalError).toBeVisible();
      await expect(this.internalError.locator('p.error')).toHaveText(
        'An internal error has occurred and has been logged.',
      );
      await expect(this.result).toBeHidden();
    });
  }
}

import { expect, testStep } from '../../../common/helpers/pwHelpers';

export class AccountDetailsPage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.details = page.locator('#accountDetails');
    this.activity = page.locator('#accountActivity');
    this.monthSelect = page.locator('#month');
    this.typeSelect = page.locator('#transactionType');
    this.goButton = page.getByRole('button', { name: 'Go' });
    this.rightPanel = page.locator('#rightPanel');
    this.transactionTable = page.locator('#transactionTable');
    this.noTransactions = page.locator('#noTransactions');
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  transactionRow(name) {
    return this.transactionTable.locator('tr', { hasText: name });
  }

  async open(accountId) {
    await this.step(
      `Open the details of the account '${accountId}'`,
      async () => {
        await this.page.goto(`activity.htm?id=${accountId}`);
        await this.page.waitForLoadState('networkidle');
        await expect(this.details).toBeVisible();
      },
    );
  }

  async selectFilters(month, type) {
    await this.step(
      `Select the filters: period '${month}', type '${type}'`,
      async () => {
        await this.monthSelect.selectOption({ value: month });
        await this.typeSelect.selectOption({ value: type });
      },
    );
  }

  async clickGo() {
    await this.step(`Click the 'Go' button`, async () => {
      await this.goButton.click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  async filterActivity(month, type) {
    await this.selectFilters(month, type);
    await this.clickGo();
  }

  async assertNoInternalError() {
    await this.step(`Assert there is no internal error`, async () => {
      await expect(this.rightPanel).not.toContainText(
        'An internal error has occurred',
        { useInnerText: true },
      );
    });
  }

  async assertDetailsShown(accountId, accountType) {
    await this.step(
      `Assert the details of the account '${accountId}' are shown`,
      async () => {
        await this.assertNoInternalError();
        await expect(this.details).toContainText(
          new RegExp(`Account Number:\\s*${accountId}`),
        );
        await expect(this.details).toContainText(
          new RegExp(`Account Type:\\s*${accountType}`),
        );
        await expect(this.details).toContainText(/Balance:\s*\$[\d,]+\.\d{2}/);
        await expect(this.details).toContainText(
          /Available:\s*\$[\d,]+\.\d{2}/,
        );
      },
    );
  }

  async assertFiltersAreAll() {
    await this.step(`Assert both filters are set to 'All'`, async () => {
      await expect(this.monthSelect).toHaveValue('All');
      await expect(this.typeSelect).toHaveValue('All');
    });
  }

  async assertNoTransactions() {
    await this.step(`Assert 'No transactions found.' is shown`, async () => {
      await expect(this.noTransactions).toBeVisible();
      await expect(this.noTransactions).toHaveText('No transactions found.');
    });
  }

  async assertTransaction(name, column, amount) {
    await this.step(
      `Assert the transaction '${name}' has ${column} ${amount}`,
      async () => {
        const columnIndex = column === 'debit' ? 2 : 3;
        await expect(
          this.transactionRow(name).locator('td').nth(columnIndex),
        ).toHaveText(amount);
      },
    );
  }

  async assertTransactionListed(name) {
    await this.step(`Assert the transaction '${name}' is listed`, async () => {
      await expect(this.transactionRow(name)).toBeVisible();
    });
  }

  async assertTransactionNotListed(name) {
    await this.step(
      `Assert the transaction '${name}' is not listed`,
      async () => {
        await expect(this.transactionRow(name)).toHaveCount(0);
      },
    );
  }
}
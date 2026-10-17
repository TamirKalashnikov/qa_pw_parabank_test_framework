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
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
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
        await this.monthSelect.selectOption({ label: month });
        await this.typeSelect.selectOption({ label: type });
      },
    );
  }

  async clickGo() {
    await this.step(`Click the 'Go' button`, async () => {
      await this.goButton.click();
      await this.page.waitForLoadState('networkidle');
    });
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
      await expect(this.monthSelect.locator('option:checked')).toHaveText(
        'All',
      );
      await expect(this.typeSelect.locator('option:checked')).toHaveText(
        'All',
      );
    });
  }

  async assertNoTransactions() {
    await this.step(`Assert 'No transactions found.' is shown`, async () => {
      await expect(this.rightPanel).toContainText('No transactions found.');
    });
  }

  async assertTransaction(name, column, amount) {
    await this.step(
      `Assert the transaction '${name}' has ${column} ${amount}`,
      async () => {
        const columnIndex = column === 'debit' ? 2 : 3;
        const row = this.rightPanel.locator('tr', { hasText: name });
        await expect(row.locator('td').nth(columnIndex)).toHaveText(amount);
      },
    );
  }
}

import { expect, testStep } from '../../../common/helpers/pwHelpers';

const INPUT_INDEX = {
  id: 0,
  date: 1,
  fromDate: 2,
  toDate: 3,
  amount: 4,
};

const BUTTON_INDEX = {
  id: 0,
  date: 1,
  dateRange: 2,
  amount: 3,
};

export class FindTransactionsPage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.rightPanel = page.locator('#rightPanel');
    this.form = page.locator('#transactionForm');
    this.resultContainer = page.locator('#resultContainer');
    this.resultTitle = this.resultContainer.locator('h1.title');
    this.resultRows = page.locator('#transactionBody tr');
    this.accountSelect = this.form.locator('select');
    this.inputs = this.form.getByRole('textbox');
    this.buttons = this.form.getByRole('button', {
      name: 'Find Transactions',
    });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  transactionRow(name) {
    return this.resultContainer.locator('tr', { hasText: name });
  }

  async open() {
    await this.step(`Open the 'Find Transactions' page`, async () => {
      await this.page.goto('findtrans.htm');
      await this.page.waitForLoadState('networkidle');
      await expect(this.form).toBeVisible();
      await expect(this.accountSelect.locator('option')).not.toHaveCount(0);
      await expect(this.buttons).toHaveCount(4);
    });
  }

  async search(inputs, buttonKey, description) {
    await this.step(description, async () => {
      for (const [key, value] of Object.entries(inputs)) {
        await this.inputs.nth(INPUT_INDEX[key]).fill(value);
      }
      await this.buttons.nth(BUTTON_INDEX[buttonKey]).click();
    });
  }

  async findById(transactionId) {
    await this.search(
      { id: transactionId },
      'id',
      `Find by transaction ID '${transactionId}'`,
    );
  }

  async findByDate(date) {
    await this.search({ date }, 'date', `Find by date '${date}'`);
  }

  async findByDateRange(fromDate, toDate) {
    await this.search(
      { fromDate, toDate },
      'dateRange',
      `Find by date range '${fromDate}' - '${toDate}'`,
    );
  }

  async findByAmount(amount) {
    await this.search({ amount }, 'amount', `Find by amount '${amount}'`);
  }

  async assertResultsShown() {
    await this.step(`Assert the transaction results are shown`, async () => {
      await expect(this.resultContainer).toBeVisible();
      await expect(this.resultTitle).toHaveText('Transaction Results');
    });
  }

  async assertNoResults() {
    await this.step(`Assert the results table is empty`, async () => {
      await this.assertResultsShown();
      await expect(this.resultRows).toHaveCount(0);
    });
  }

  async assertTransaction(name, column, amount) {
    await this.step(
      `Assert the result '${name}' has ${column} ${amount}`,
      async () => {
        const columnIndex = column === 'debit' ? 2 : 3;
        await this.assertResultsShown();
        await expect(
          this.transactionRow(name).locator('td').nth(columnIndex),
        ).toHaveText(amount);
      },
    );
  }

  async getTransactionId(name) {
    return await this.step(`Read the ID of '${name}'`, async () => {
      const link = this.transactionRow(name).getByRole('link');
      await expect(link).toBeVisible();
      const href = await link.getAttribute('href');
      return href.match(/id=(\d+)/)[1];
    });
  }

  async openTransaction(name) {
    await this.step(`Open the transaction '${name}'`, async () => {
      await this.transactionRow(name).getByRole('link').click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  async assertTransactionDetails(transactionId, description, type) {
    await this.step(
      `Assert the details of the transaction '${transactionId}'`,
      async () => {
        await expect(this.rightPanel).toContainText('Transaction Details', {
          useInnerText: true,
        });
        await expect(this.rightPanel).toContainText(
          new RegExp(`Transaction ID:\\s*${transactionId}`),
          { useInnerText: true },
        );
        await expect(this.rightPanel).toContainText(
          `Description: ${description}`,
          { useInnerText: true },
        );
        await expect(this.rightPanel).toContainText(`Type: ${type}`, {
          useInnerText: true,
        });
      },
    );
  }

  async assertSearchError(message) {
    await this.step(`Assert the search error '${message}'`, async () => {
      await expect(
        this.form.locator(`:text-is("${message}"):visible`).first(),
      ).toBeVisible();
    });
  }
}

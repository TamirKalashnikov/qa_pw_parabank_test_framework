import { expect, testStep } from '../../../common/helpers/pwHelpers';

function moneyToCents(text) {
  return Math.round(Number(text.replace(/[^0-9.-]/g, '')) * 100);
}

export class AccountsOverviewPage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.container = page.locator('#showOverview');
    this.title = this.container.locator('h1.title');
    this.table = page.locator('#accountTable');
    this.tableHead = this.table.locator('thead');
    this.accountLinks = this.table.locator('tbody a[href*="activity.htm"]');
    this.accountRows = this.table.locator('tbody tr', {
      has: page.locator('a[href*="activity.htm"]'),
    });
    this.totalRow = this.table.locator('tbody tr', { hasText: 'Total' });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  async open() {
    await this.step(`Open the 'Accounts Overview' page`, async () => {
      await this.page.goto('overview.htm');
      await this.page.waitForLoadState('networkidle');
      await expect(this.table).toBeVisible();
      await expect(this.accountLinks.first()).toBeVisible();
    });
  }

  async getAccountsCount() {
    return await this.step(`Read the number of accounts`, async () => {
      return await this.accountLinks.count();
    });
  }

  async getFirstAccountId() {
    return await this.step(`Read the first account id`, async () => {
      return (await this.accountLinks.first().textContent()).trim();
    });
  }

  async clickAccount(accountId) {
    await this.step(`Click the account '${accountId}'`, async () => {
      await this.table
        .getByRole('link', { name: accountId, exact: true })
        .click();
      await this.page.waitForLoadState('networkidle');
    });
  }

  async assertOverviewIsShown() {
    await this.step(`Assert the accounts overview is shown`, async () => {
      await expect(this.title).toHaveText('Accounts Overview');
      await expect(this.tableHead).toContainText('Account');
      await expect(this.tableHead).toContainText('Balance*');
      await expect(this.tableHead).toContainText('Available Amount');
      await expect(this.container).toContainText(
        'Balance includes deposits that may be subject to holds',
      );
    });
  }

  async assertAccountsCount(expectedCount) {
    await this.step(
      `Assert the overview lists ${expectedCount} accounts`,
      async () => {
        await expect(this.accountLinks).toHaveCount(expectedCount);
      },
    );
  }

  async assertAccountIsListed(accountId) {
    await this.step(
      `Assert the account '${accountId}' is listed`,
      async () => {
        await expect(
          this.table.getByRole('link', { name: accountId, exact: true }),
        ).toBeVisible();
      },
    );
  }

  async assertTotalEqualsSumOfBalances() {
    await this.step(
      `Assert the total equals the sum of the account balances`,
      async () => {
        await expect(this.totalRow).toContainText('$');
        const balances = await this.accountRows
          .locator('td:nth-child(2)')
          .allTextContents();
        const sum = balances.reduce((acc, text) => acc + moneyToCents(text), 0);
        const totalText = await this.totalRow.textContent();
        const total = moneyToCents(totalText.match(/\$\s*[\d,]+\.\d{2}/)[0]);
        expect(total).toBe(sum);
      },
    );
  }

  async assertAccountDetailsOpened(accountId) {
    await this.step(
      `Assert the details page of '${accountId}' is opened`,
      async () => {
        await expect(this.page).toHaveURL(
          new RegExp(`activity\\.htm\\?id=${accountId}`),
        );
      },
    );
  }
}
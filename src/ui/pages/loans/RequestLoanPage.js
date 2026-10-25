import { expect, testStep } from '../../../common/helpers/pwHelpers';

const LABELS = {
  loanAmount: 'Loan Amount: $',
  downPayment: 'Down Payment: $',
};

export class RequestLoanPage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.rightPanel = page.locator('#rightPanel');
    this.applyButton = page.getByRole('button', { name: 'Apply Now' });
    this.errorBlock = page.locator('#requestLoanError');
    this.resultBlock = page.locator('#requestLoanResult');
    this.provider = page.locator('#loanProviderName');
    this.responseDate = page.locator('#responseDate');
    this.status = page.locator('#loanStatus');
    this.newAccountLink = this.rightPanel.getByRole('link', {
      name: /^\d+$/,
    });
  }

  async step(title, stepToRun) {
    return await testStep(title, stepToRun, this.userId);
  }

  row(label) {
    return this.rightPanel.locator('tr', {
      has: this.page.getByText(label, { exact: true }),
    });
  }

  field(key) {
    return this.row(LABELS[key]).locator('input');
  }

  fromAccountSelect() {
    return this.row('From account #:').locator('select');
  }

  async open() {
    await this.step(`Open the 'Request Loan' page`, async () => {
      await this.page.goto('requestloan.htm');
      await this.page.waitForLoadState('networkidle');
      await expect(this.field('loanAmount')).toBeVisible();
      await expect(this.fromAccountSelect().locator('option')).not.toHaveCount(
        0,
      );
    });
  }

  async apply(loanAmount, downPayment, accountId) {
    await this.step(
      `Apply for a loan of $${loanAmount} with a down payment of $${downPayment}`,
      async () => {
        await this.field('loanAmount').fill(loanAmount);
        await this.field('downPayment').fill(downPayment);
        if (accountId) {
          await this.fromAccountSelect().selectOption(accountId);
        }
        await this.applyButton.click();
      },
    );
  }

  async assertApproved() {
    await this.step(`Assert the loan is approved`, async () => {
      await expect(this.rightPanel).toContainText('Loan Request Processed', {
        useInnerText: true,
      });
      await expect(this.provider).toContainText(
        'Wealth Securities Dynamic Loans (WSDL)',
      );
      await expect(this.responseDate).toHaveText(/^\d{2}-\d{2}-\d{4}$/);
      await expect(this.status).toHaveText('Approved');
      await expect(this.rightPanel).toContainText(
        'Congratulations, your loan has been approved.',
        { useInnerText: true },
      );
      await expect(this.newAccountLink).toBeVisible();
    });
  }

  async assertDenied() {
    await this.step(`Assert the loan is denied`, async () => {
      await expect(this.rightPanel).toContainText('Loan Request Processed', {
        useInnerText: true,
      });
      await expect(this.status).toHaveText('Denied');
      await expect(this.rightPanel).toContainText(
        'We cannot grant a loan in that amount with your available funds.',
        { useInnerText: true },
      );
      await expect(this.newAccountLink).toBeHidden();
    });
  }

  async getNewAccountId() {
    return await this.step(`Read the new loan account id`, async () => {
      return (await this.newAccountLink.textContent()).trim();
    });
  }

  async assertInternalError() {
    await this.step(`Assert the internal error is shown`, async () => {
      await expect(this.errorBlock).toBeVisible();
      await expect(this.errorBlock).toContainText(
        'An internal error has occurred and has been logged.',
        { useInnerText: true },
      );
      await expect(this.resultBlock).toBeHidden();
    });
  }

  async assertNoInternalError() {
    await this.step(`Assert there is no internal error`, async () => {
      await expect(this.errorBlock).toBeHidden();
    });
  }
}

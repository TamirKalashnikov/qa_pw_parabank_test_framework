import { expect, testStep } from '../../../common/helpers/pwHelpers';

const LABELS = {
  payeeName: 'Payee Name:',
  address: 'Address:',
  city: 'City:',
  state: 'State:',
  zipCode: 'Zip Code:',
  phoneNumber: 'Phone #:',
  accountNumber: 'Account #:',
  verifyAccountNumber: 'Verify Account #:',
  amount: 'Amount: $',
};

export class BillPayPage {
  constructor(page, userId = 0) {
    this.page = page;
    this.userId = userId;
    this.rightPanel = page.locator('#rightPanel');
    this.sendPaymentButton = page.getByRole('button', {
      name: 'Send Payment',
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
    await this.step(`Open the 'Bill Pay' page`, async () => {
      await this.page.goto('billpay.htm');
      await this.page.waitForLoadState('networkidle');
      await expect(this.field('payeeName')).toBeVisible();
      await expect(this.fromAccountSelect().locator('option')).not.toHaveCount(
        0,
      );
    });
  }

  async fillForm(data) {
    await this.step(`Fill the 'Bill Pay' form`, async () => {
      for (const key of Object.keys(LABELS)) {
        if (data[key] !== undefined) {
          await this.field(key).fill(data[key]);
        }
      }
    });
  }

  async selectFromAccount(accountId) {
    await this.step(`Select the account '${accountId}'`, async () => {
      await this.fromAccountSelect().selectOption(accountId);
    });
  }

  async clickSendPayment() {
    await this.step(`Click the 'Send Payment' button`, async () => {
      await this.sendPaymentButton.click();
    });
  }

  async pay(data, accountId) {
    await this.fillForm(data);
    if (accountId) {
      await this.selectFromAccount(accountId);
    }
    await this.clickSendPayment();
  }

  async assertPaymentComplete(payeeName, amount, accountId) {
    await this.step(`Assert the payment to '${payeeName}' is complete`, async () => {
      const money = Number(amount).toFixed(2);
      await expect(this.rightPanel).toContainText('Bill Payment Complete', {
        useInnerText: true,
      });
      await expect(this.rightPanel).toContainText(
        `Bill Payment to ${payeeName} in the amount of $${money} from account ${accountId} was successful.`,
        { useInnerText: true },
      );
    });
  }

  async assertFieldError(key, message) {
    await this.step(`Assert the error '${message}' for '${key}'`, async () => {
      await expect(
        this.row(LABELS[key]).getByText(message, { exact: true }),
      ).toBeVisible();
    });
  }
}

import { mergeTests } from '@playwright/test';
import { test as fixturesAuth } from './fixturesAuth';
import { test as fixturesAccounts } from './fixturesAccounts';
import { test as fixturesPayments } from './fixturesPayments';
import { test as fixturesTransactions } from './fixturesTransactions';
import { test as fixturesLoans } from './fixturesLoans';

export const test = mergeTests(
  fixturesAuth,
  fixturesAccounts,
  fixturesPayments,
  fixturesTransactions,
  fixturesLoans,
);

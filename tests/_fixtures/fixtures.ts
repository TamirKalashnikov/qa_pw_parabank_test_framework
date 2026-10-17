import { mergeTests } from '@playwright/test';
import { test as fixturesAuth } from './fixturesAuth';
import { test as fixturesAccounts } from './fixturesAccounts';
import { test as fixturesPayments } from './fixturesPayments';

export const test = mergeTests(
  fixturesAuth,
  fixturesAccounts,
  fixturesPayments,
);

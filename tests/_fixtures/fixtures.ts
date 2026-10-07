import { mergeTests } from '@playwright/test';
import { test as fixturesAuth } from './fixturesAuth';
import { test as fixturesAccounts } from './fixturesAccounts';

export const test = mergeTests(fixturesAuth, fixturesAccounts);

# Task Description

To see the description of the task assignment [follow the link](https://github.com/mate-academy/qa_pw_parabank_test_framework/blob/main/TaskDescription.md). 

# Repository Overview

This repository contains a test automation framework for the [Parabank](https://parabank.parasoft.com/parabank/index.htm) bank application testing. 

# How to use this project

## Installation steps

To install the project follow the next steps:

1. Install Node.js.
2. Run the installation command in the project root.:
```bash
npm ci
```
3. Run the browsers installation in the project root.
```bash
npx playwright install
```
4. Install Allure commandline tool (Allure requires Java 8 or higher).
```bash
npm install -g allure-commandline
```

## How to run the tests

Run all tests:

```bash
npx playwright test
```

Run one area or one file:

```bash
npx playwright test tests/loggedInUser/transferFunds
npx playwright test tests/notLoggedInUser/auth/register
```

Rerun only the failed tests (the public demo site is occasionally unstable):

```bash
npx playwright test --last-failed
```

## How to generate report

Results are written to `allure-results` (it is cleaned before each run). Open the report:

```bash
npx allure serve allure-results
```

Allure needs Java and the JAVA_HOME environment variable.

# Framework Description

Playwright + Allure framework with Page Object Model and `testStep` wrappers for Allure steps. Test data is generated with faker. ESLint, Prettier and Husky check the code on commit.

## Covered areas

Register, Sign In (positive/negative), Forgot login info, Accounts Overview, Account Details, Account Activity filtering (type x month), Open New Account (Checking/Savings), Transfer Funds, Bill Pay, Find Transactions, Update Contact Info, Request Loan, Log Out.

Every test registers a fresh user through the UI, so tests are independent. Parametrization is used for empty required fields, account types, amounts, activity filters and search methods.

## Project structure

- `src/ui/pages` - page objects by area
- `src/common` - helpers, logger, test data generators
- `tests/_fixtures` - fixtures per area, merged with `mergeTests` in `fixtures.ts`
- `tests/notLoggedInUser`, `tests/loggedInUser` - specs by area; the folder path builds the Allure parentSuite/suite/subSuite

## Known site defects

1. **Transfer Funds**: an empty amount or letters in the amount show "An internal error has occurred and has been logged." instead of the validation messages present in the page markup. The expected behaviour is covered by `test.fail()` tests, the current behaviour by separate tests.
2. **Request Loan**: an empty form is sent to the server (400 Bad Request) and the site shows an internal error instead of a validation message. The current behaviour is covered by a test.

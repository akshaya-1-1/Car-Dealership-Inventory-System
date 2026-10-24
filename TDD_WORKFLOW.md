
# Test-Driven Development Workflow

## 1. Introduction

Test-Driven Development (TDD) is a software development approach in which tests are written before implementing the corresponding functionality.

The process follows three main stages:

1. **Red:** Write a test and verify that it fails for the expected reason.
2. **Green:** Implement the minimum code necessary to make the test pass.
3. **Refactor:** Improve code quality while keeping the tests passing.

## 2. Red-Green-Refactor Process

### Step 1: Identify the Requirement

Select a specific feature or behavior to implement.

Example: A customer must not be allowed to restock a vehicle.

### Step 2: Red — Write the Test

- Write a test for the expected behavior.
- Run the test.
- Confirm that it fails for the intended reason.
- Check that the test itself is valid.

### Step 3: Green — Implement the Feature

- Write the minimum code required to satisfy the test.
- Run the test again.
- Confirm that it passes.
- Avoid unrelated changes.

### Step 4: Refactor — Improve the Code

- Improve readability and organization.
- Remove unnecessary duplication.
- Preserve the expected behavior.
- Run the relevant tests again.
- Run the full test suite to detect regressions.

### Step 5: Repeat

Repeat these steps for each feature until the required functionality is implemented and tested.

## 3. Applying TDD to the Car Dealership System

| Feature | Example Test | Expected Behavior |
|---|---|---|
| Registration | Register a user with valid details | User is registered successfully |
| Login | Submit valid credentials | Authentication succeeds |
| Invalid Login | Submit an incorrect password | Authentication is rejected |
| Authentication | Access a protected endpoint without a valid token | Access is denied |
| Role-Based Access | Customer attempts an administrator-only operation | Operation is denied |
| Vehicle Management | Administrator creates or updates a vehicle | Inventory record is updated |
| Search and Filtering | Search using vehicle attributes | Matching vehicles are returned |
| Purchasing | Purchase a vehicle with available stock | Purchase succeeds and stock is updated |
| Stock Validation | Attempt a purchase without sufficient stock | Invalid purchase is rejected |
| Restocking | Administrator restocks a vehicle | Stock quantity increases |
| Restock Authorization | Customer attempts to restock a vehicle | Operation is denied |

## 4. Running the Tests

Run the following command from the appropriate project directory:

```bash
pytest
```

If the project uses a virtual environment, activate it first and install the dependencies listed in the backend requirements file.

After making code changes:

1. Run the relevant test.
2. Confirm that it passes.
3. Run the complete test suite.
4. Record the actual result in TEST_REPORT.md.

## 5. Previously Reported Test Result

During earlier development, the backend test suite was reported to have completed with:

**6 tests passed in 1.25 seconds.**

This is a previously reported result. It should not be treated as a fresh test execution. Run the current code and update the report with the latest output before submission.

## 6. Test Evidence

Useful evidence for the TDD process includes:

- The requirement being implemented.
- The test written for that requirement.
- The initial failing test result, where recorded.
- The implementation made to pass the test.
- The passing test result.
- The result after refactoring.
- The final complete test-suite output.

Do not invent test logs or claim to have captured Red-phase evidence if it was not retained.

## 7. Benefits of TDD

- Encourages clear and testable requirements.
- Helps detect defects earlier.
- Supports safe refactoring.
- Provides regression checks as the application evolves.
- Improves confidence in authentication, permissions, and inventory rules.

## 8. Conclusion

The Red-Green-Refactor process provides a systematic way to implement and validate the Car Dealership Inventory System. The key areas to test include authentication, authorization, inventory management, search and filtering, purchasing, stock validation, and restocking permissions.

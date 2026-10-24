
# Test Report — Car Dealership Inventory System

## 1. Project Overview

**Project:** Car Dealership Inventory System

**Backend:** Python, FastAPI, SQLAlchemy, SQLite

**Frontend:** React, JavaScript, Tailwind CSS

**Authentication:** JWT-based authentication

**Testing Framework:** pytest

The system supports administrator and customer roles, vehicle inventory management, vehicle search and filtering, purchasing, and restocking.

## 2. Testing Objectives

The objectives of testing are to verify that:

- Users can register and log in using valid credentials.
- Invalid login credentials are rejected.
- Protected endpoints require authentication.
- Administrators can manage vehicle inventory.
- Customers cannot access administrator-only operations.
- Vehicle search and filtering return matching results.
- Purchase operations validate stock availability.
- Restocking is restricted to administrators.

## 3. Test Environment

| Component | Technology |
|---|---|
| Backend | FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy |
| Frontend | React |
| Styling | Tailwind CSS |
| Authentication | JWT |
| Testing | pytest |
| Version Control | Git and GitHub |

## 4. Test Cases

| Test ID | Test Scenario | Expected Result | Previously Reported Result |
|---|---|---|---|
| TC-01 | User registration and valid login | User can register and authenticate successfully | Passed |
| TC-02 | Invalid login and unauthenticated access | Invalid credentials are rejected and protected access is denied | Passed |
| TC-03 | Administrator CRUD operations and customer permissions | Administrators can manage vehicles; customers are denied restricted operations | Passed |
| TC-04 | Vehicle search and filtering | Only matching vehicles are returned | Passed |
| TC-05 | Vehicle purchase and stock validation | Valid purchases succeed and invalid stock operations are rejected | Passed |
| TC-06 | Vehicle restocking | Administrators can restock; customers cannot | Passed |

## 5. Test Execution

Run the tests from the project root or backend directory, depending on the project configuration.

```bash
pytest
```

Activate the project's virtual environment and install the required dependencies before running the tests.

## 6. Test Results

The previously reported backend test run completed with:

**6 tests passed in 1.25 seconds.**

This is the result recorded during earlier development. Run the test suite again before submission to verify the current code.

## 7. Limitations

- This report covers the six previously reported backend test areas.
- It does not claim complete automated frontend UI coverage.
- Manual browser testing can supplement the backend tests.
- Results should be updated if the latest test execution differs.

## 8. Conclusion

The reported tests cover authentication, authorization, inventory operations, search and filtering, purchasing, stock validation, and administrator-only restocking.

The previously reported run passed all six tests. The current code should be tested again before final submission.


# AI Prompts and Development Record

## 1. Project Generation Prompt

Build a Car Dealership Inventory System using Python FastAPI, SQLite, React, and Tailwind CSS. Include JWT authentication, administrator and customer roles, inventory APIs, a frontend interface, automated tests, a README, PROMPTS.md, and a test report. Follow a Test-Driven Development (TDD) approach where practical.

## 2. Backend Development

The following prompts describe the major backend development tasks:

- Design a FastAPI backend for a car dealership inventory system.
- Create database models using SQLAlchemy and SQLite.
- Implement user registration and login with secure password handling and JWT authentication.
- Implement role-based access control for administrators and customers.
- Create APIs to list, search, filter, add, update, and delete vehicles.
- Implement purchasing with stock validation.
- Implement vehicle restocking with administrator-only permissions.
- Handle invalid input, missing records, authentication failures, and authorization errors.

## 3. Frontend Development

- Build a React frontend using Tailwind CSS.
- Create login and registration interfaces.
- Develop an administrator dashboard for vehicle management.
- Develop a customer showroom for browsing vehicles.
- Add search and filtering functionality.
- Connect frontend components to backend APIs.
- Display appropriate success and error messages.
- Debug JSX syntax and frontend integration issues.
- Improve usability, layout consistency, and responsiveness.

## 4. Testing and Debugging

- Create pytest tests for user registration and login.
- Test invalid credentials and protected API endpoints.
- Verify role-based permissions for administrators and customers.
- Test vehicle creation, updating, and deletion.
- Test vehicle search and filtering.
- Test purchasing and stock validation.
- Verify that only administrators can restock vehicles.
- Run tests, investigate failures, fix implementation issues, and rerun the suite.
- Check the frontend build and resolve syntax errors.

## 5. Documentation and Version Control

- Prepare README.md with project overview, features, setup, and usage instructions.
- Prepare TEST_REPORT.md with test scenarios and results.
- Document the TDD workflow.
- Organize application screenshots in docs/screenshots/.
- Reference screenshots using repository-relative paths.
- Review Git changes, stage relevant files, commit changes, and push them to GitHub.

## 6. TDD Prompt

Use the Red-Green-Refactor workflow when developing backend features.

First, write a test describing the expected behavior and run it to confirm that it fails for the expected reason (Red). Next, implement the minimum code required to pass the test (Green). Finally, refactor the code for readability and maintainability while keeping the tests passing (Refactor).

Apply this workflow to authentication, authorization, vehicle inventory management, search and filtering, purchasing, stock validation, and restocking.

Record actual test results rather than inventing results.

## 7. Technology Stack

| Component | Technology |
|---|---|
| Backend | Python FastAPI |
| Database | SQLite |
| ORM | SQLAlchemy |
| Frontend | React |
| Programming Language | JavaScript |
| Styling | Tailwind CSS |
| Authentication | JWT |
| Testing | pytest |
| Version Control | Git and GitHub |

## 8. Project Artifacts

- README.md — project overview and setup instructions.
- PROMPTS.md — development prompt record.
- TEST_REPORT.md — test cases and reported results.
- TDD_WORKFLOW.md — Test-Driven Development process.
- docs/screenshots/ — application screenshots.

## 9. Transparency Note

This file is a structured record of the principal prompts and development tasks. It is not a verbatim transcript of the complete ChatGPT conversation.

If raw, unedited conversation logs are explicitly required by the evaluator, this structured record should not be presented as a substitute for those logs.

AI assistance was used as a development aid for planning, implementation guidance, debugging, testing, and documentation. The final implementation and test results should be verified before submission.


# Car Dealership Inventory System

A full-stack web application for managing car dealership inventory, built with **FastAPI, SQLAlchemy, SQLite, React, and Tailwind CSS**. The system supports JWT-based authentication, customer and admin roles, vehicle search, purchases, and inventory restocking.

## Features

- **User Authentication:** Register and log in using JWT authentication.
- **Role-Based Access Control:** Separate customer and administrator permissions.
- **Vehicle Inventory:** View vehicle details and search available inventory.
- **Search and Filtering:** Filter vehicles by keyword, category, and stock availability.
- **Vehicle Purchases:** Authenticated customers can purchase vehicles subject to stock availability.
- **Inventory Restocking:** Administrators can restock vehicles.
- **Vehicle Management:** Administrators can add, update, and delete vehicle records.
- **REST API:** FastAPI endpoints with interactive Swagger documentation.
- **Automated Testing:** Pytest tests for authentication, permissions, inventory operations, and stock rules.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| Backend | Python, FastAPI |
| ORM | SQLAlchemy |
| Database | SQLite |
| Authentication | JWT |
| Testing | Pytest |
| API Documentation | Swagger UI |

## Project Structure

```text
Car-Dealership-Inventory-System/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   └── make_admin.py
│   ├── tests/
│   │   ├── conftest.py
│   │   └── test_api.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
├── README.md
├── TDD_WORKFLOW.md
├── TEST_REPORT.md
└── PROMPTS.md
```

*Note: This is a high-level structure. Adjust it to match the actual files and folders in your repository.*

## Prerequisites

Install the following before running the project:

- Python 3.10 or later
- Node.js 18 or later
- npm

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/akshaya-1-1/Car-Dealership-Inventory-System.git
cd Car-Dealership-Inventory-System
```

### 2. Set Up the Backend

Navigate to the backend directory:

```bash
cd backend
```

Create and activate a virtual environment.

**Windows PowerShell:**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**macOS/Linux:**

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Install the dependencies:

```bash
python -m pip install -r requirements.txt
```

Start the FastAPI development server:

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

- API base URL: http://127.0.0.1:8000
- Swagger documentation: http://127.0.0.1:8000/docs

Keep this terminal running.

### 3. Set Up the Frontend

Open a second terminal at the project root and navigate to the frontend directory:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

If PowerShell blocks the npm script on Windows, use:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the URL displayed by Vite, usually:

http://localhost:5173

If your frontend requires a custom API URL, create `frontend/.env` with:

```env
VITE_API_URL=http://127.0.0.1:8000
```

## Administrator Setup

Public registration creates customer accounts only.

To promote an existing registered user to administrator, run the following command from the `backend` directory:

```bash
python -m app.make_admin email@example.com
```

Replace `email@example.com` with the email address of the account to promote.

Only use this administrative command in a trusted local or authorized environment.

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a customer |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Get the authenticated user's details |

### Vehicles and Inventory

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/vehicles` | Vehicle listing and search |
| GET | `/api/vehicles/{id}` | Vehicle details |
| POST | `/api/vehicles` | Admin only |
| PUT | `/api/vehicles/{id}` | Admin only |
| DELETE | `/api/vehicles/{id}` | Admin only |
| POST | `/api/vehicles/{id}/restock` | Admin only |
| POST | `/api/vehicles/{id}/purchase` | Authenticated users |

Example vehicle search:

```text
GET /api/vehicles?q=toyota&category=sedan&in_stock=true
```

For request schemas, response formats, and interactive endpoint testing, visit the Swagger documentation at `/docs` while the backend is running.

## Running the Tests

From the project root, navigate to the backend directory:

```bash
cd backend
```

Run the automated tests:

```bash
python -m pytest -v
```

Run tests with coverage reporting:

```bash
python -m pytest --cov=app --cov-report=term-missing
```

### Test Results

The backend test suite was previously executed with the following result:

```text
6 passed
```

This result confirms that the six existing backend tests passed in that run. Rerun the tests after your final code changes and update this section if the results differ.

Coverage percentages should be added only after running the coverage command.

## Screenshots

Add screenshots of the actual running application to demonstrate its interface and functionality.

Suggested screenshots:

- Application home or vehicle listing page
- Vehicle search and filtering
- Login or registration page
- Vehicle details and purchase workflow
- Administrator inventory management
- Swagger API documentation
- Successful automated test results

Replace this section with embedded screenshots once you have added the actual image files to the repository.

Example:

```markdown
![Vehicle Inventory](screenshots/vehicle-inventory.png)
```

## Test-Driven Development (TDD)

The project includes a TDD workflow document describing the intended Red-Green-Refactor process.

See [TDD_WORKFLOW.md](TDD_WORKFLOW.md) for details.

A genuine test-first workflow should be supported by the actual Git history, including commits that demonstrate failing tests before implementation, passing tests after implementation, and subsequent refactoring.

## AI Usage and Acknowledgements

AI tools were used to assist with implementation scaffolding, test development, documentation, and debugging.

All generated code and documentation should be reviewed and understood by the project author.

See [PROMPTS.md](PROMPTS.md) for the project's AI usage records. Include the required raw, unedited conversation logs or an appropriate public conversation link before submission, according to the assignment requirements.

Relevant commits should include any required AI co-author trailers specified by the assignment.

## Additional Documentation

- [TDD Workflow](TDD_WORKFLOW.md)
- [Test Report](TEST_REPORT.md)
- [AI Prompts and Usage Records](PROMPTS.md)

## Security Notes

- Use a strong, unique `JWT_SECRET_KEY` outside development.
- Do not commit passwords, private keys, production secrets, or sensitive environment files.
- Restrict administrative operations to authorized users.
- Use a production-appropriate configuration before deploying the application.

## License

Add a license here if the project is distributed under a specific open-source license.

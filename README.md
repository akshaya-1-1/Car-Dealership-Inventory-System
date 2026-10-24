# Car Dealership Inventory System
FastAPI + SQLAlchemy + SQLite REST API with JWT authentication, customer/admin roles, React + Tailwind SPA, inventory search, purchase/restock, and pytest tests.

## Run
Backend (Python 3.10+):
```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate ; macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Docs: http://127.0.0.1:8000/docs. Set `JWT_SECRET_KEY` to a strong secret before deployment.
Frontend (Node 18+, second terminal):
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. Optional `frontend/.env`: `VITE_API_URL=http://127.0.0.1:8000`.

Registering publicly creates customers only. Promote a registered user locally from `backend/` with `python -m app.make_admin email@example.com`.

## API
`POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`; `GET /api/vehicles?q=toyota&category=sedan&in_stock=true`; `GET /api/vehicles/{id}`; admin-only `POST /api/vehicles`, `PUT/DELETE /api/vehicles/{id}`, `POST /api/vehicles/{id}/restock`; authenticated `POST /api/vehicles/{id}/purchase`.

## Tests
From `backend/`: `pytest -q` and `pytest --cov=app --cov-report=term-missing`. `TEST_REPORT.md` does not claim execution; record actual output and coverage after running locally.

## TDD / AI / submission
See `TDD_WORKFLOW.md`. A generated zip cannot honestly include a real test-first Git history; make real Red-Green-Refactor commits and verify with `git log`. Review and understand all code. AI was used to scaffold implementation, tests, and docs. Add required AI co-author trailers to relevant commits. Add real UI screenshots and append/export raw unedited AI chat logs or a public chat link to `PROMPTS.md` before submission.

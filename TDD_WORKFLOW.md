# Red → Green → Refactor
Use genuine incremental commits; this is a suggested workflow, not a claim that historical TDD commits already exist.
1. Registration: write success/duplicate tests (Red), implement hashing and registration (Green), extract security helpers (Refactor).
2. JWT: test invalid credentials/protected endpoint, implement token issue/validation, centralize config.
3. Search: test text/category/stock filters, implement query filters, refactor query logic.
4. Admin CRUD: test customer/anonymous restrictions, implement role dependency and CRUD, reuse authorization.
5. Purchase/restock: test decrement, zero-stock rejection, admin-only restock; implement; add boundary cases.
Suggested commits: `test: specify registration behavior`, `feat: implement registration`, `test: cover stock boundaries`, `feat: implement stock rules`. Never fabricate commit history.

import os
DATABASE_URL=os.getenv("DATABASE_URL","sqlite:///./car_dealership.db")
JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY","development-only-change-this-secret")
JWT_ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES","60"))
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]
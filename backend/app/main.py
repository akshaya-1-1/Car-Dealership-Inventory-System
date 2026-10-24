from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import CORS_ORIGINS
from app.database import Base,engine
from app.routers import auth,vehicles
Base.metadata.create_all(bind=engine)
app=FastAPI(title="Car Dealership Inventory API",version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://192.168.1.204:5173",
    ],
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|192\.168\.1\.204)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,prefix="/api"); app.include_router(vehicles.router,prefix="/api")
@app.get("/health")
def health(): return {"status":"ok"}

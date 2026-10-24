import os
os.environ["JWT_SECRET_KEY"]="test-secret-only"
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.database import Base,get_db
from app.main import app
from app.models import User
@pytest.fixture
def client():
 engine=create_engine("sqlite://",connect_args={"check_same_thread":False},poolclass=StaticPool)
 Local=sessionmaker(bind=engine,autoflush=False,autocommit=False); Base.metadata.create_all(engine)
 def override():
  db=Local()
  try: yield db
  finally: db.close()
 app.dependency_overrides[get_db]=override
 with TestClient(app) as c: yield c
 app.dependency_overrides.clear(); Base.metadata.drop_all(engine); engine.dispose()
@pytest.fixture
def customer(client):
 r=client.post("/api/auth/register",json={"email":"customer@example.com","full_name":"Customer","password":"password123"}); assert r.status_code==201
 t=client.post("/api/auth/login",json={"email":"customer@example.com","password":"password123"}).json()["access_token"]
 return {"token":t,"id":r.json()["id"]}
@pytest.fixture
def admin(client):
 r=client.post("/api/auth/register",json={"email":"admin@example.com","full_name":"Admin","password":"password123"}); assert r.status_code==201
 gen=app.dependency_overrides[get_db](); db=next(gen)
 try: db.get(User,r.json()["id"]).role="admin"; db.commit()
 finally:
  try: next(gen)
  except StopIteration: pass
 t=client.post("/api/auth/login",json={"email":"admin@example.com","password":"password123"}).json()["access_token"]
 return {"token":t}
@pytest.fixture
def vehicle_payload(): return {"make":"Toyota","model":"Corolla","category":"Sedan","price":22000,"quantity":3}
def auth(token): return {"Authorization":f"Bearer {token}"}

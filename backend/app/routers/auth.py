from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user
from app.models import User
from app.schemas import LoginRequest,TokenResponse,UserCreate,UserPublic
from app.security import create_access_token,hash_password,verify_password
router=APIRouter(prefix="/auth",tags=["Authentication"])
@router.post("/register",response_model=UserPublic,status_code=201)
def register(data:UserCreate,db:Session=Depends(get_db)):
 email=str(data.email).lower()
 if db.scalar(select(User).where(User.email==email)): raise HTTPException(409,"Email is already registered")
 user=User(email=email,full_name=data.full_name.strip(),password_hash=hash_password(data.password),role="customer")
 db.add(user); db.commit(); db.refresh(user); return user
@router.post("/login",response_model=TokenResponse)
def login(data:LoginRequest,db:Session=Depends(get_db)):
 user=db.scalar(select(User).where(User.email==str(data.email).lower()))
 if not user or not verify_password(data.password,user.password_hash): raise HTTPException(401,"Incorrect email or password")
 return TokenResponse(access_token=create_access_token(str(user.id)))
@router.get("/me",response_model=UserPublic)
def me(user:User=Depends(get_current_user)): return user

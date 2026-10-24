from fastapi import Depends,HTTPException
from fastapi.security import HTTPAuthorizationCredentials,HTTPBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User
from app.security import decode_access_token
bearer=HTTPBearer(auto_error=False)
def get_current_user(credentials:HTTPAuthorizationCredentials|None=Depends(bearer),db:Session=Depends(get_db))->User:
 if not credentials: raise HTTPException(401,"Valid bearer token required",headers={"WWW-Authenticate":"Bearer"})
 sub=decode_access_token(credentials.credentials)
 if not sub or not sub.isdigit(): raise HTTPException(401,"Invalid token")
 user=db.get(User,int(sub))
 if not user: raise HTTPException(401,"User not found")
 return user
def require_admin(user:User=Depends(get_current_user))->User:
 if user.role!="admin": raise HTTPException(403,"Administrator access required")
 return user

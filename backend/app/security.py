from datetime import datetime,timedelta,timezone
from jose import JWTError,jwt
from pwdlib import PasswordHash
from app.config import ACCESS_TOKEN_EXPIRE_MINUTES,JWT_ALGORITHM,JWT_SECRET_KEY
ph=PasswordHash.recommended()
def hash_password(p:str)->str: return ph.hash(p)
def verify_password(p:str,h:str)->bool:
 try: return ph.verify(p,h)
 except Exception: return False
def create_access_token(sub:str)->str:
 exp=datetime.now(timezone.utc)+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
 return jwt.encode({"sub":sub,"exp":exp},JWT_SECRET_KEY,algorithm=JWT_ALGORITHM)
def decode_access_token(token:str)->str|None:
 try:
  sub=jwt.decode(token,JWT_SECRET_KEY,algorithms=[JWT_ALGORITHM]).get("sub")
  return sub if isinstance(sub,str) else None
 except JWTError: return None

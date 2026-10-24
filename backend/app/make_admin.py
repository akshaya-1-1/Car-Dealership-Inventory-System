import sys
from sqlalchemy import select
from app.database import SessionLocal
from app.models import User
if __name__=="__main__":
 if len(sys.argv)!=2: raise SystemExit("Usage: python -m app.make_admin email@example.com")
 with SessionLocal() as db:
  user=db.scalar(select(User).where(User.email==sys.argv[1].lower()))
  if not user: raise SystemExit("User not found; register first.")
  user.role="admin"; db.commit(); print(f"{user.email} is now an admin.")

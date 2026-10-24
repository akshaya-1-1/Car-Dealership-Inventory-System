from datetime import datetime,timezone
from sqlalchemy import DateTime,Float,ForeignKey,Integer,String
from sqlalchemy.orm import Mapped,mapped_column,relationship
from app.database import Base
def now(): return datetime.now(timezone.utc)
class User(Base):
 __tablename__="users"
 id:Mapped[int]=mapped_column(Integer,primary_key=True,index=True)
 email:Mapped[str]=mapped_column(String(320),unique=True,index=True,nullable=False)
 full_name:Mapped[str]=mapped_column(String(120),nullable=False)
 password_hash:Mapped[str]=mapped_column(String(255),nullable=False)
 role:Mapped[str]=mapped_column(String(20),default="customer",nullable=False)
 created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=now)
class Vehicle(Base):
 __tablename__="vehicles"
 id:Mapped[int]=mapped_column(Integer,primary_key=True,index=True)
 make:Mapped[str]=mapped_column(String(80),index=True,nullable=False)
 model:Mapped[str]=mapped_column(String(100),index=True,nullable=False)
 category:Mapped[str]=mapped_column(String(60),index=True,nullable=False)
 price:Mapped[float]=mapped_column(Float,nullable=False)
 quantity:Mapped[int]=mapped_column(Integer,default=0,nullable=False)
 created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=now)
 updated_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=now,onupdate=now)
class Purchase(Base):
 __tablename__="purchases"
 id:Mapped[int]=mapped_column(Integer,primary_key=True)
 user_id:Mapped[int]=mapped_column(ForeignKey("users.id"),nullable=False)
 vehicle_id:Mapped[int]=mapped_column(ForeignKey("vehicles.id"),nullable=False)
 price_at_purchase:Mapped[float]=mapped_column(Float,nullable=False)
 created_at:Mapped[datetime]=mapped_column(DateTime(timezone=True),default=now)
 user:Mapped[User]=relationship()
 vehicle:Mapped[Vehicle]=relationship()

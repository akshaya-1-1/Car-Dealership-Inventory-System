from fastapi import APIRouter,Depends,HTTPException,Query
from sqlalchemy import or_,select
from sqlalchemy.orm import Session
from app.database import get_db
from app.dependencies import get_current_user,require_admin
from app.models import Purchase,User,Vehicle
from app.schemas import MessageResponse,PurchasePublic,RestockRequest,VehicleCreate,VehiclePublic,VehicleUpdate
router=APIRouter(prefix="/vehicles",tags=["Vehicles"])
@router.get("",response_model=list[VehiclePublic])
def list_vehicles(q:str|None=Query(None,max_length=120),category:str|None=Query(None,max_length=60),in_stock:bool|None=None,db:Session=Depends(get_db)):
 stmt=select(Vehicle)
 if q and q.strip():
  term=f"%{q.strip()}%"; stmt=stmt.where(or_(Vehicle.make.ilike(term),Vehicle.model.ilike(term)))
 if category and category.strip(): stmt=stmt.where(Vehicle.category.ilike(category.strip()))
 if in_stock is True: stmt=stmt.where(Vehicle.quantity>0)
 if in_stock is False: stmt=stmt.where(Vehicle.quantity==0)
 return list(db.scalars(stmt.order_by(Vehicle.id.desc())).all())
@router.get("/{vehicle_id}",response_model=VehiclePublic)
def get_vehicle(vehicle_id:int,db:Session=Depends(get_db)):
 v=db.get(Vehicle,vehicle_id)
 if not v: raise HTTPException(404,"Vehicle not found")
 return v
@router.post("",response_model=VehiclePublic,status_code=201)
def create_vehicle(data:VehicleCreate,db:Session=Depends(get_db),_:User=Depends(require_admin)):
 v=Vehicle(**data.model_dump()); db.add(v); db.commit(); db.refresh(v); return v
@router.put("/{vehicle_id}",response_model=VehiclePublic)
def update_vehicle(vehicle_id:int,data:VehicleUpdate,db:Session=Depends(get_db),_:User=Depends(require_admin)):
 v=db.get(Vehicle,vehicle_id)
 if not v: raise HTTPException(404,"Vehicle not found")
 for k,val in data.model_dump(exclude_unset=True).items():
  if val is not None: setattr(v,k,val)
 db.commit(); db.refresh(v); return v
@router.delete("/{vehicle_id}",response_model=MessageResponse)
def delete_vehicle(vehicle_id:int,db:Session=Depends(get_db),_:User=Depends(require_admin)):
 v=db.get(Vehicle,vehicle_id)
 if not v: raise HTTPException(404,"Vehicle not found")
 db.delete(v); db.commit(); return MessageResponse(message="Vehicle deleted successfully")
@router.post("/{vehicle_id}/purchase",response_model=PurchasePublic,status_code=201)
def purchase_vehicle(vehicle_id:int,db:Session=Depends(get_db),user:User=Depends(get_current_user)):
 v=db.get(Vehicle,vehicle_id)
 if not v: raise HTTPException(404,"Vehicle not found")
 if v.quantity<1: raise HTTPException(409,"Vehicle is out of stock")
 v.quantity-=1; p=Purchase(user_id=user.id,vehicle_id=v.id,price_at_purchase=v.price); db.add(p); db.commit(); db.refresh(p)
 return PurchasePublic(id=p.id,vehicle_id=v.id,quantity_remaining=v.quantity,price_paid=p.price_at_purchase,message="Purchase completed successfully")
@router.post("/{vehicle_id}/restock",response_model=VehiclePublic)
def restock_vehicle(vehicle_id:int,data:RestockRequest,db:Session=Depends(get_db),_:User=Depends(require_admin)):
 v=db.get(Vehicle,vehicle_id)
 if not v: raise HTTPException(404,"Vehicle not found")
 v.quantity+=data.quantity; db.commit(); db.refresh(v); return v

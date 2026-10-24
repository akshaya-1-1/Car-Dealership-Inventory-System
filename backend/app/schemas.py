import re
from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
    field_validator,
)
from datetime import datetime
from typing import Literal
from pydantic import BaseModel,ConfigDict,EmailStr,Field
class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=120)
    password: str = Field(min_length=8, max_length=16)

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        if not re.search(r"[A-Z]", value):
            raise ValueError(
                "Password must contain at least one uppercase letter"
            )

        if not re.search(r"[a-z]", value):
            raise ValueError(
                "Password must contain at least one lowercase letter"
            )

        if not re.search(r"\d", value):
            raise ValueError(
                "Password must contain at least one number"
            )

        if not any(not ch.isalnum() for ch in value):
            raise ValueError(
                "Password must contain at least one special character"
            )

        return value
class UserPublic(BaseModel):
 model_config=ConfigDict(from_attributes=True)
 id:int; email:EmailStr; full_name:str; role:Literal["customer","admin"]; created_at:datetime
class LoginRequest(BaseModel):
 email:EmailStr
 password:str
class TokenResponse(BaseModel):
 access_token:str
 token_type:str="bearer"
class VehicleCreate(BaseModel):
 make:str=Field(min_length=1,max_length=80)
 model:str=Field(min_length=1,max_length=100)
 category:str=Field(min_length=1,max_length=60)
 price:float=Field(gt=0)
 quantity:int=Field(ge=0)
class VehicleUpdate(BaseModel):
 make:str|None=Field(default=None,min_length=1,max_length=80)
 model:str|None=Field(default=None,min_length=1,max_length=100)
 category:str|None=Field(default=None,min_length=1,max_length=60)
 price:float|None=Field(default=None,gt=0)
 quantity:int|None=Field(default=None,ge=0)
class VehiclePublic(BaseModel):
 model_config=ConfigDict(from_attributes=True)
 id:int; make:str; model:str; category:str; price:float; quantity:int; created_at:datetime; updated_at:datetime
class RestockRequest(BaseModel): quantity:int=Field(gt=0)
class PurchasePublic(BaseModel):
 id:int; vehicle_id:int; quantity_remaining:int; price_paid:float; message:str
class MessageResponse(BaseModel): message:str

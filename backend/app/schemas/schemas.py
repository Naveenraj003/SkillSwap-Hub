from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from uuid import UUID

class ProfileBase(BaseModel):
    full_name: str
    profile_image: Optional[str] = None
    bio: Optional[str] = None
    experience: Optional[str] = None

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    profile_image: Optional[str] = None
    bio: Optional[str] = None
    experience: Optional[str] = None

class ProfileOut(ProfileBase):
    profile_id: UUID
    user_id: UUID
    
    model_config = ConfigDict(from_attributes=True)

class UserBase(BaseModel):
    email: str

class UserRegister(UserBase):
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    refresh_token: Optional[str] = None

class UserOut(UserBase):
    user_id: UUID
    skillswap_id: str
    created_at: datetime
    status: str
    
    model_config = ConfigDict(from_attributes=True)

class UserWithProfileOut(UserOut):
    profile: Optional[ProfileOut] = None
    
    model_config = ConfigDict(from_attributes=True)

class PublicUserOut(BaseModel):
    user_id: UUID
    skillswap_id: str
    created_at: datetime
    status: str
    profile: Optional[ProfileOut] = None
    
    model_config = ConfigDict(from_attributes=True)

class SkillOut(BaseModel):
    skill_id: UUID
    skill_name: str
    verified: bool
    
    model_config = ConfigDict(from_attributes=True)

class UserSkillCreate(BaseModel):
    skill_id: UUID
    skill_type: str # 'Teaching' or 'Learning'
    skill_level: str # 'Beginner', 'Intermediate', 'Advanced', 'Expert'

class UserSkillOut(BaseModel):
    user_skill_id: UUID
    user_id: UUID
    skill_id: UUID
    skill_type: str
    skill_level: str
    skill: SkillOut
    
    model_config = ConfigDict(from_attributes=True)

class SearchResultUser(BaseModel):
    user_id: UUID
    skillswap_id: str
    full_name: str
    profile_image: Optional[str] = None
    bio: Optional[str] = None
    skill_name: str
    skill_level: str
    
    model_config = ConfigDict(from_attributes=True)



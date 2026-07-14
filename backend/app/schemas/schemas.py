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
    is_admin: bool
    
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
    skill_id: UUID
    skill_level: str
    
    model_config = ConfigDict(from_attributes=True)

class ConnectionRequestCreate(BaseModel):
    receiver_id: UUID
    requested_skill: UUID
    message: Optional[str] = None

class ConnectionRequestOut(BaseModel):
    request_id: UUID
    sender_id: UUID
    receiver_id: UUID
    requested_skill: UUID
    message: Optional[str] = None
    status: str
    created_at: datetime
    sender: PublicUserOut
    receiver: PublicUserOut
    skill: SkillOut
    
    model_config = ConfigDict(from_attributes=True)

class ConnectionOut(BaseModel):
    connection_id: UUID
    user_one: UUID
    user_two: UUID
    created_at: datetime
    user1: PublicUserOut
    user2: PublicUserOut
    
    model_config = ConfigDict(from_attributes=True)

class NotificationOut(BaseModel):
    notification_id: UUID
    user_id: UUID
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class BlockCreate(BaseModel):
    blocked_user_id: UUID
    reason: Optional[str] = None

class BlockOut(BaseModel):
    block_id: UUID
    blocker_id: UUID
    blocked_user_id: UUID
    reason: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class RestrictionCreate(BaseModel):
    restricted_user_id: UUID
    reason: Optional[str] = None

class RestrictionOut(BaseModel):
    restriction_id: UUID
    restricter_id: UUID
    restricted_user_id: UUID
    reason: Optional[str] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class MessageCreate(BaseModel):
    content: str

class MessageOut(BaseModel):
    message_id: UUID
    conversation_id: UUID
    sender_id: UUID
    receiver_id: UUID
    content: str
    is_read: bool
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class ConversationOut(BaseModel):
    conversation_id: UUID
    user_one: UUID
    user_two: UUID
    created_at: datetime
    updated_at: datetime
    user1: PublicUserOut
    user2: PublicUserOut
    unread_count: Optional[int] = 0
    last_message: Optional[str] = None
    last_message_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class ConversationCreate(BaseModel):
    receiver_id: UUID

class SessionCreate(BaseModel):
    receiver_id: UUID
    skill_id: UUID
    topic: str
    description: Optional[str] = None
    proposed_date: str
    proposed_time: str
    duration: int

class SessionOut(BaseModel):
    session_id: UUID
    requester_id: UUID
    receiver_id: UUID
    skill_id: UUID
    topic: str
    description: Optional[str] = None
    proposed_date: str
    proposed_time: str
    duration: int
    status: str
    meeting_url: Optional[str] = None
    created_at: datetime
    requester: PublicUserOut
    receiver: PublicUserOut
    skill: SkillOut
    
    model_config = ConfigDict(from_attributes=True)

class ReportCreate(BaseModel):
    reported_user_id: UUID
    reason: str
    description: str

class ReportOut(BaseModel):
    report_id: UUID
    reporter_id: UUID
    reported_user_id: UUID
    reason: str
    description: str
    status: str
    created_at: datetime
    reporter: PublicUserOut
    reported_user: PublicUserOut
    
    model_config = ConfigDict(from_attributes=True)

class AdminActionOut(BaseModel):
    action_id: UUID
    admin_id: UUID
    action_type: str
    target_id: Optional[UUID] = None
    details: str
    created_at: datetime
    admin: PublicUserOut
    
    model_config = ConfigDict(from_attributes=True)

class MeetingOut(BaseModel):
    meeting_id: UUID
    session_id: UUID
    meeting_url: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)








import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"
    
    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(Text, nullable=True)
    skillswap_id = Column(String(50), unique=True, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    status = Column(String(50), default="Active")
    
    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"
    
    profile_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    profile_image = Column(Text, nullable=True)
    bio = Column(Text, nullable=True)
    experience = Column(Text, nullable=True)
    
    user = relationship("User", back_populates="profile")

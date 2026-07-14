import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Boolean, UniqueConstraint
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
    user_skills = relationship("UserSkill", back_populates="user", cascade="all, delete-orphan")

class Profile(Base):
    __tablename__ = "profiles"
    
    profile_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    profile_image = Column(Text, nullable=True)
    bio = Column(Text, nullable=True)
    experience = Column(Text, nullable=True)
    
    user = relationship("User", back_populates="profile")

class Skill(Base):
    __tablename__ = "skills"
    
    skill_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    skill_name = Column(String(100), unique=True, nullable=False, index=True)
    verified = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    user_skills = relationship("UserSkill", back_populates="skill", cascade="all, delete-orphan")

class UserSkill(Base):
    __tablename__ = "user_skills"
    
    user_skill_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills.skill_id", ondelete="CASCADE"), nullable=False)
    skill_type = Column(String(50), nullable=False) # 'Teaching' or 'Learning'
    skill_level = Column(String(50), nullable=False) # 'Beginner', 'Intermediate', 'Advanced', 'Expert'
    
    user = relationship("User", back_populates="user_skills")
    skill = relationship("Skill", back_populates="user_skills")
    
    # Unique constraint to prevent duplicate skills of the same type for a user
    __table_args__ = (
        UniqueConstraint('user_id', 'skill_id', 'skill_type', name='uq_user_skill_type'),
    )


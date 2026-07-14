import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Boolean, UniqueConstraint, Integer
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

class ConnectionRequest(Base):
    __tablename__ = "connection_requests"
    
    request_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    receiver_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    requested_skill = Column(UUID(as_uuid=True), ForeignKey("skills.skill_id", ondelete="CASCADE"), nullable=False)
    message = Column(Text, nullable=True)
    status = Column(String(50), default="Pending")
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])
    skill = relationship("Skill")

class Connection(Base):
    __tablename__ = "connections"
    
    connection_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_one = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    user_two = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    user1 = relationship("User", foreign_keys=[user_one])
    user2 = relationship("User", foreign_keys=[user_two])
    
    __table_args__ = (
        UniqueConstraint('user_one', 'user_two', name='uq_connection_pair'),
    )

class Notification(Base):
    __tablename__ = "notifications"
    
    notification_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    user = relationship("User")

class Block(Base):
    __tablename__ = "blocks"
    
    block_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    blocker_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    blocked_user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    blocker = relationship("User", foreign_keys=[blocker_id])
    blocked_user = relationship("User", foreign_keys=[blocked_user_id])
    
    __table_args__ = (
        UniqueConstraint('blocker_id', 'blocked_user_id', name='uq_blocker_blocked'),
    )

class Restriction(Base):
    __tablename__ = "restrictions"
    
    restriction_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    restricter_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    restricted_user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    restricter = relationship("User", foreign_keys=[restricter_id])
    restricted_user = relationship("User", foreign_keys=[restricted_user_id])
    
    __table_args__ = (
        UniqueConstraint('restricter_id', 'restricted_user_id', name='uq_restricter_restricted'),
    )

class Conversation(Base):
    __tablename__ = "conversations"
    
    conversation_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_one = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    user_two = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    user1 = relationship("User", foreign_keys=[user_one])
    user2 = relationship("User", foreign_keys=[user_two])
    
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")
    
    __table_args__ = (
        UniqueConstraint('user_one', 'user_two', name='uq_conversation_pair'),
    )

class Message(Base):
    __tablename__ = "messages"
    
    message_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.conversation_id", ondelete="CASCADE"), nullable=False)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    receiver_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    content = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow, index=True)
    
    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])

class SessionSwap(Base):
    __tablename__ = "sessions"
    
    session_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    requester_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    receiver_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills.skill_id", ondelete="CASCADE"), nullable=False)
    topic = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    proposed_date = Column(String(50), nullable=False)
    proposed_time = Column(String(50), nullable=False)
    duration = Column(Integer, nullable=False) # Duration in minutes
    status = Column(String(50), default="Requested")
    meeting_url = Column(String(512), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    
    requester = relationship("User", foreign_keys=[requester_id])
    receiver = relationship("User", foreign_keys=[receiver_id])
    skill = relationship("Skill")





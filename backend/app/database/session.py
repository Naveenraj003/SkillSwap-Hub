from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.orm import Session
from sqlalchemy.pool import NullPool
from typing import Generator
from app.core.config import settings

# Use NullPool for Supabase PgBouncer (transaction-mode pooler on port 6543).
# PgBouncer does not support persistent/pooled connections — NullPool creates
# a fresh connection per request and closes it immediately after, preventing
# "connection was closed" errors that QueuePool causes with PgBouncer.
engine = create_engine(
    settings.DATABASE_URL,
    poolclass=NullPool,
)

# Session configuration
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all ORM models (SQLAlchemy 2.0 style)
class Base(DeclarativeBase):
    pass

# FastAPI dependency: yields a DB session and closes it after the request
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

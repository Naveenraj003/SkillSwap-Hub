from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import engine, Base
from app.models import models
from app.api.v1.auth import router as auth_router
from app.api.v1.profile import router as profile_router
from app.api.v1.skills import router as skills_router
from app.api.v1.search import router as search_router
from app.api.v1.connections import router as connections_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.privacy import router as privacy_router
from app.api.v1.chat import router as chat_router
from app.api.v1.sessions import router as sessions_router
from app.api.v1.meetings import router as meetings_router
from app.api.v1.reports import router as reports_router
from app.api.v1.admin import router as admin_router

def seed_default_skills():
    from app.database.session import SessionLocal
    from app.models.models import Skill, User
    db = SessionLocal()
    try:
        # Promote first registered user to admin if no admin exists
        first_user = db.query(User).order_by(User.created_at).first()
        if first_user and not db.query(User).filter(User.is_admin == True).first():
            first_user.is_admin = True
            db.commit()
            print(f"Promoted user {first_user.email} to Admin")
            
        if db.query(Skill).count() == 0:
            default_skills = [
                "Python", "Java", "JavaScript", "React", "Machine Learning", 
                "UI/UX Design", "Data Structures", "SQL", "FastAPI", "HTML/CSS"
            ]
            for skill_name in default_skills:
                db.add(Skill(skill_name=skill_name, verified=True))
            db.commit()
            print("Successfully seeded default verified skills.")
    except Exception as e:
        print(f"Warning: Failed to seed default skills: {e}")
    finally:
        db.close()

# Create database tables automatically
try:
    Base.metadata.create_all(bind=engine)
    seed_default_skills()
except Exception as e:
    print(f"Warning: Database connection failed. Tables could not be created: {e}")


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configurable in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(profile_router, prefix=settings.API_V1_STR)
app.include_router(skills_router, prefix=settings.API_V1_STR)
app.include_router(search_router, prefix=settings.API_V1_STR)
app.include_router(connections_router, prefix=settings.API_V1_STR)
app.include_router(notifications_router, prefix=settings.API_V1_STR)
app.include_router(privacy_router, prefix=settings.API_V1_STR)
app.include_router(chat_router, prefix=settings.API_V1_STR)
app.include_router(sessions_router, prefix=settings.API_V1_STR)
app.include_router(meetings_router, prefix=settings.API_V1_STR)
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)






@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME}


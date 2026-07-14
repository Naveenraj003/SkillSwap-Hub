from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.session import engine, Base
from app.models import models
from app.api.v1.auth import router as auth_router
from app.api.v1.profile import router as profile_router

# Create database tables automatically
try:
    Base.metadata.create_all(bind=engine)
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

@app.get("/")
def read_root():
    return {"message": f"Welcome to {settings.PROJECT_NAME} API"}

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME}


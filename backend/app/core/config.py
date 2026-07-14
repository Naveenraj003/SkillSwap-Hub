from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkillSwap Hub"
    API_V1_STR: str = "/api/v1"
    
    # Database Settings
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/skillswap"
    
    # Supabase Settings
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    model_config = ConfigDict(case_sensitive=True, env_file=".env")

settings = Settings()

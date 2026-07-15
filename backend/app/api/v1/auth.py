import random
import string
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Profile
from app.schemas.schemas import UserRegister, UserLogin, Token, UserOut
from app.authentication.auth import supabase_client

router = APIRouter(prefix="/auth", tags=["auth"])

def generate_unique_skillswap_id(db: Session) -> str:
    while True:
        chars = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
        skillswap_id = f"SSH-{chars}"
        exists = db.query(User).filter(User.skillswap_id == skillswap_id).first()
        if not exists:
            return skillswap_id

@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    if not supabase_client:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase credentials are not configured on the server"
        )
    # Check if user already exists locally
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
        
    try:
        # Create user in Supabase Auth
        credentials = {"email": user_in.email, "password": user_in.password}
        supabase_auth_response = supabase_client.auth.sign_up(credentials)
        
        supabase_user = supabase_auth_response.user
        if not supabase_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to register user in Auth provider"
            )
            
        # Generate SSH ID
        ssh_id = generate_unique_skillswap_id(db)
        
        # Check if first user in database
        is_first_user = db.query(User).count() == 0
        
        # Create user record locally
        db_user = User(
            user_id=supabase_user.id,
            email=user_in.email,
            skillswap_id=ssh_id,
            status="Active",
            is_admin=is_first_user
        )
        db.add(db_user)
        
        # Create profile record locally
        db_profile = Profile(
            user_id=supabase_user.id,
            full_name=user_in.full_name
        )
        db.add(db_profile)
        
        db.commit()
        db.refresh(db_user)
        return db_user
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Registration failed: {str(e)}"
        )

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    if not supabase_client:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase credentials are not configured on the server"
        )
    try:
        # Authenticate with Supabase Auth
        auth_response = supabase_client.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })
        
        # Check local status to see if blocked
        user = db.query(User).filter(User.user_id == auth_response.user.id).first()
        if not user:
            is_first_user = db.query(User).count() == 0
            ssh_id = generate_unique_skillswap_id(db)
            user = User(
                user_id=auth_response.user.id,
                email=auth_response.user.email,
                skillswap_id=ssh_id,
                status="Active",
                is_admin=is_first_user
            )
            db.add(user)
            
            full_name = "User"
            if auth_response.user.user_metadata:
                full_name = auth_response.user.user_metadata.get("full_name", "User")
                
            db_profile = Profile(
                user_id=auth_response.user.id,
                full_name=full_name
            )
            db.add(db_profile)
            db.commit()
            db.refresh(user)
            
        if user.status == "Blocked":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This user account has been blocked"
            )
            
        return Token(
            access_token=auth_response.session.access_token,
            token_type="bearer",
            refresh_token=auth_response.session.refresh_token
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Login failed: {str(e)}"
        )

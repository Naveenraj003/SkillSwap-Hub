from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Profile
from app.schemas.schemas import ProfileOut, ProfileUpdate, UserWithProfileOut, PublicUserOut
from app.authentication.auth import get_current_user
from uuid import UUID

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/me", response_model=UserWithProfileOut)
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return current_user

@router.get("/{user_id}", response_model=PublicUserOut)
def get_user_profile(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/update", response_model=ProfileOut)
def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.user_id).first()
    if not profile:
        profile = Profile(user_id=current_user.user_id, full_name="User")
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
    for field, value in profile_data.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
        
    try:
        db.commit()
        db.refresh(profile)
        return profile
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update profile: {str(e)}"
        )

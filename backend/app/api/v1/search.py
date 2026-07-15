from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.models import User, Profile, UserSkill, Skill
from app.schemas.schemas import SearchResultUser, PublicUserOut
from app.authentication.auth import get_current_user

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/skill", response_model=List[SearchResultUser])
def search_by_skill(
    skill_name: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not skill_name.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Skill name search query cannot be empty"
        )
        
    rows = db.query(
        User.user_id,
        User.skillswap_id,
        Profile.full_name,
        Profile.profile_image,
        Profile.bio,
        Skill.skill_name,
        Skill.skill_id,
        UserSkill.skill_level
    ).join(Profile, User.user_id == Profile.user_id)\
     .join(UserSkill, User.user_id == UserSkill.user_id)\
     .join(Skill, UserSkill.skill_id == Skill.skill_id)\
     .filter(
         UserSkill.skill_type == "Teaching",
         Skill.skill_name.ilike(f"%{skill_name.strip()}%"),
         User.status == "Active",
         User.user_id != current_user.user_id
     ).all()
     
    return [
        {
            "user_id": r.user_id,
            "skillswap_id": r.skillswap_id,
            "full_name": r.full_name,
            "profile_image": r.profile_image,
            "bio": r.bio,
            "skill_name": r.skill_name,
            "skill_id": r.skill_id,
            "skill_level": r.skill_level,
        }
        for r in rows
    ]

@router.get("/id", response_model=PublicUserOut)
def search_by_id(
    skillswap_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not skillswap_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="SkillSwap ID query cannot be empty"
        )
        
    user = db.query(User).filter(
        User.skillswap_id == skillswap_id.strip(),
        User.status == "Active",
        User.user_id != current_user.user_id
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with this SkillSwap ID not found"
        )
        
    return user

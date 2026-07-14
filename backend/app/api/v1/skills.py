from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.session import get_db
from app.models.models import User, Skill, UserSkill
from app.schemas.schemas import SkillOut, UserSkillCreate, UserSkillOut
from app.authentication.auth import get_current_user
from uuid import UUID

router = APIRouter(prefix="/skills", tags=["skills"])

@router.get("", response_model=List[SkillOut])
def get_available_skills(db: Session = Depends(get_db)):
    return db.query(Skill).filter(Skill.verified == True).order_by(Skill.skill_name).all()

@router.get("/user", response_model=List[UserSkillOut])
def get_user_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(UserSkill).filter(UserSkill.user_id == current_user.user_id).all()

@router.post("/user", response_model=UserSkillOut, status_code=status.HTTP_201_CREATED)
def add_user_skill(
    skill_in: UserSkillCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if skill_in.skill_type not in ["Teaching", "Learning"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Skill type must be either 'Teaching' or 'Learning'"
        )
    if skill_in.skill_level not in ["Beginner", "Intermediate", "Advanced", "Expert"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Skill level must be 'Beginner', 'Intermediate', 'Advanced', or 'Expert'"
        )
        
    skill = db.query(Skill).filter(Skill.skill_id == skill_in.skill_id).first()
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found in database"
        )
        
    # Check duplicate
    existing_skill = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.user_id,
        UserSkill.skill_id == skill_in.skill_id,
        UserSkill.skill_type == skill_in.skill_type
    ).first()
    if existing_skill:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"You have already added this skill to your '{skill_in.skill_type}' list"
        )
        
    db_user_skill = UserSkill(
        user_id=current_user.user_id,
        skill_id=skill_in.skill_id,
        skill_type=skill_in.skill_type,
        skill_level=skill_in.skill_level
    )
    
    try:
        db.add(db_user_skill)
        db.commit()
        db.refresh(db_user_skill)
        return db_user_skill
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to add skill: {str(e)}"
        )

@router.delete("/user/{user_skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_user_skill(
    user_skill_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_user_skill = db.query(UserSkill).filter(UserSkill.user_skill_id == user_skill_id).first()
    if not db_user_skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User skill not found"
        )
        
    if db_user_skill.user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to remove this skill"
        )
        
    try:
        db.delete(db_user_skill)
        db.commit()
        return
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to remove skill: {str(e)}"
        )

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List
from app.database.session import get_db
from app.models.models import User, Block, Restriction, Connection, ConnectionRequest
from app.schemas.schemas import BlockCreate, BlockOut, RestrictionCreate, RestrictionOut, PublicUserOut
from app.authentication.auth import get_current_user
from uuid import UUID

router = APIRouter(prefix="/privacy", tags=["privacy"])

@router.post("/block", response_model=BlockOut, status_code=status.HTTP_201_CREATED)
def block_user(
    block_in: BlockCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.user_id == block_in.blocked_user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot block yourself"
        )
        
    target = db.query(User).filter(User.user_id == block_in.blocked_user_id).first()
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    existing_block = db.query(Block).filter(
        Block.blocker_id == current_user.user_id,
        Block.blocked_user_id == block_in.blocked_user_id
    ).first()
    if existing_block:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already blocked this user"
        )
        
    db_block = Block(
        blocker_id=current_user.user_id,
        blocked_user_id=block_in.blocked_user_id,
        reason=block_in.reason
    )
    
    try:
        db.add(db_block)
        
        # Remove active connections between blocker and blocked user
        u1, u2 = min(current_user.user_id, block_in.blocked_user_id), max(current_user.user_id, block_in.blocked_user_id)
        db.query(Connection).filter(
            Connection.user_one == u1,
            Connection.user_two == u2
        ).delete(synchronize_session=False)
        
        # Cancel any pending requests between blocker and blocked user
        db.query(ConnectionRequest).filter(
            or_(
                and_(ConnectionRequest.sender_id == current_user.user_id, ConnectionRequest.receiver_id == block_in.blocked_user_id),
                and_(ConnectionRequest.sender_id == block_in.blocked_user_id, ConnectionRequest.receiver_id == current_user.user_id)
            )
        ).delete(synchronize_session=False)
        
        db.commit()
        db.refresh(db_block)
        return db_block
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to block user: {str(e)}"
        )

@router.post("/unblock", status_code=status.HTTP_204_NO_CONTENT)
def unblock_user(
    blocked_user_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_block = db.query(Block).filter(
        Block.blocker_id == current_user.user_id,
        Block.blocked_user_id == blocked_user_id
    ).first()
    
    if not db_block:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Block record not found"
        )
        
    try:
        db.delete(db_block)
        db.commit()
        return
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to unblock user: {str(e)}"
        )

@router.post("/restrict", response_model=RestrictionOut, status_code=status.HTTP_201_CREATED)
def restrict_user(
    restrict_in: RestrictionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.user_id == restrict_in.restricted_user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot restrict yourself"
        )
        
    existing_restriction = db.query(Restriction).filter(
        Restriction.restricter_id == current_user.user_id,
        Restriction.restricted_user_id == restrict_in.restricted_user_id
    ).first()
    if existing_restriction:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already restricted this user"
        )
        
    db_restriction = Restriction(
        restricter_id=current_user.user_id,
        restricted_user_id=restrict_in.restricted_user_id,
        reason=restrict_in.reason
    )
    
    try:
        db.add(db_restriction)
        db.commit()
        db.refresh(db_restriction)
        return db_restriction
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to restrict user: {str(e)}"
        )

@router.post("/unrestrict", status_code=status.HTTP_204_NO_CONTENT)
def unrestrict_user(
    restricted_user_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_restriction = db.query(Restriction).filter(
        Restriction.restricter_id == current_user.user_id,
        Restriction.restricted_user_id == restricted_user_id
    ).first()
    
    if not db_restriction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Restriction record not found"
        )
        
    try:
        db.delete(db_restriction)
        db.commit()
        return
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to unrestrict user: {str(e)}"
        )

@router.get("/blocked", response_model=List[PublicUserOut])
def get_blocked_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    blocked_records = db.query(Block).filter(Block.blocker_id == current_user.user_id).all()
    user_ids = [b.blocked_user_id for b in blocked_records]
    if not user_ids:
        return []
    return db.query(User).filter(User.user_id.in_(user_ids)).all()

@router.get("/restricted", response_model=List[PublicUserOut])
def get_restricted_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    restricted_records = db.query(Restriction).filter(Restriction.restricter_id == current_user.user_id).all()
    user_ids = [r.restricted_user_id for r in restricted_records]
    if not user_ids:
        return []
    return db.query(User).filter(User.user_id.in_(user_ids)).all()

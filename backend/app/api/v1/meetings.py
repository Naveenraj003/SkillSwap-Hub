from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.database.session import get_db
from app.models.models import User, SessionSwap, Meeting, Block
from app.schemas.schemas import MeetingOut
from app.authentication.auth import get_current_user
from uuid import UUID

router = APIRouter(prefix="/meetings", tags=["meetings"])

@router.get("/{session_id}/join", response_model=MeetingOut)
def join_meeting(
    session_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    session_record = db.query(SessionSwap).filter(SessionSwap.session_id == session_id).first()
    if not session_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
        
    if current_user.user_id not in [session_record.requester_id, session_record.receiver_id]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to join this meeting room"
        )
        
    if session_record.status not in ["Accepted", "Scheduled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot join meeting. Session must be in Accepted or Scheduled status."
        )
        
    block = db.query(Block).filter(
        or_(
            and_(Block.blocker_id == session_record.requester_id, Block.blocked_user_id == session_record.receiver_id),
            and_(Block.blocker_id == session_record.receiver_id, Block.blocked_user_id == session_record.requester_id)
        )
    ).first()
    
    if block:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot join meeting due to block restrictions between participants"
        )
        
    meeting = db.query(Meeting).filter(Meeting.session_id == session_id).first()
    if not meeting:
        meeting = Meeting(
            session_id=session_id,
            meeting_url=f"https://meet.jit.si/SkillSwap-{session_id}"
        )
        try:
            db.add(meeting)
            db.commit()
            db.refresh(meeting)
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to create meeting room record: {str(e)}"
            )
            
    return meeting

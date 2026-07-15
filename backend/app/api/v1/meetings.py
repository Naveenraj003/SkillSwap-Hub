from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from app.database.session import get_db
from app.models.models import User, SessionSwap, Meeting, Block
from app.schemas.schemas import MeetingOut
from app.authentication.auth import get_current_user
from uuid import UUID
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/meetings", tags=["meetings"])

@router.get("/{session_id}/join", response_model=MeetingOut)
def join_meeting(
    session_id: UUID,
    client_time: Optional[str] = None,
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

    # Time locked availability validation
    if client_time:
        try:
            # Clean up timezone or ms suffix
            cleaned = client_time.split('.')[0] if '.' in client_time else client_time
            cleaned = cleaned.replace('Z', '').split('+')[0]
            client_dt = datetime.fromisoformat(cleaned)
            
            # Format: '2026-07-15' '10:30' -> '%Y-%m-%d %H:%M'
            session_dt = datetime.strptime(
                f"{session_record.proposed_date} {session_record.proposed_time}",
                "%Y-%m-%d %H:%M"
            )
            
            if client_dt < session_dt:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot join meeting yet. It will be available at the scheduled time."
                )
        except HTTPException:
            raise
        except Exception:
            # Fall back to server time if client parsing fails
            server_dt = datetime.now()
            session_dt = datetime.strptime(
                f"{session_record.proposed_date} {session_record.proposed_time}",
                "%Y-%m-%d %H:%M"
            )
            if server_dt < session_dt:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Cannot join meeting yet. It will be available at the scheduled time."
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

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List
from app.database.session import get_db
from app.models.models import User, Connection, Block, SessionSwap, Notification, Skill
from app.schemas.schemas import SessionCreate, SessionOut
from app.authentication.auth import get_current_user
from uuid import UUID

router = APIRouter(prefix="/sessions", tags=["sessions"])

def check_relationship_allowed(user_id_1: UUID, user_id_2: UUID, db: Session):
    block = db.query(Block).filter(
        or_(
            and_(Block.blocker_id == user_id_1, Block.blocked_user_id == user_id_2),
            and_(Block.blocker_id == user_id_2, Block.blocked_user_id == user_id_1)
        )
    ).first()
    if block:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot interact with blocked user"
        )

    u1, u2 = min(user_id_1, user_id_2), max(user_id_1, user_id_2)
    conn = db.query(Connection).filter(
        Connection.user_one == u1,
        Connection.user_two == u2
    ).first()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be connected to schedule sessions"
        )

@router.post("/request", response_model=SessionOut, status_code=status.HTTP_201_CREATED)
def propose_session(
    session_in: SessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.user_id == session_in.receiver_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot schedule a session with yourself"
        )
        
    check_relationship_allowed(current_user.user_id, session_in.receiver_id, db)
    
    receiver = db.query(User).filter(User.user_id == session_in.receiver_id).first()
    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient user not found"
        )
        
    skill = db.query(Skill).filter(Skill.skill_id == session_in.skill_id).first()
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found"
        )
        
    db_session = SessionSwap(
        requester_id=current_user.user_id,
        receiver_id=session_in.receiver_id,
        skill_id=session_in.skill_id,
        topic=session_in.topic,
        description=session_in.description,
        proposed_date=session_in.proposed_date,
        proposed_time=session_in.proposed_time,
        duration=session_in.duration,
        status="Requested"
    )
    
    requester_name = current_user.profile.full_name if current_user.profile else "A user"
    db_notification = Notification(
        user_id=session_in.receiver_id,
        title="New Session Proposal",
        message=f"{requester_name} proposed a session for skill '{skill.skill_name}' on topic '{session_in.topic}'.",
        type="session_proposed"
    )
    
    try:
        db.add(db_session)
        db.add(db_notification)
        db.commit()
        db.refresh(db_session)
        return db_session
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to propose session: {str(e)}"
        )

@router.get("/requests/received", response_model=List[SessionOut])
def get_received_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(SessionSwap).filter(
        SessionSwap.receiver_id == current_user.user_id,
        SessionSwap.status == "Requested"
    ).order_by(SessionSwap.created_at.desc()).all()

@router.get("/requests/sent", response_model=List[SessionOut])
def get_sent_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(SessionSwap).filter(
        SessionSwap.requester_id == current_user.user_id,
        SessionSwap.status == "Requested"
    ).order_by(SessionSwap.created_at.desc()).all()

@router.post("/{session_id}/accept", response_model=SessionOut)
def accept_session(
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
        
    if session_record.receiver_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to accept this proposal"
        )
        
    if session_record.status != "Requested":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot accept session in status '{session_record.status}'"
        )
        
    check_relationship_allowed(session_record.requester_id, session_record.receiver_id, db)
    
    session_record.status = "Accepted"
    session_record.meeting_url = f"https://meet.jit.si/SkillSwap-{session_record.session_id}"
    
    receiver_name = current_user.profile.full_name if current_user.profile else "A user"
    db_notification = Notification(
        user_id=session_record.requester_id,
        title="Session Proposal Accepted",
        message=f"{receiver_name} accepted your proposed session on '{session_record.topic}'.",
        type="session_accepted"
    )
    
    try:
        db.add(db_notification)
        db.commit()
        db.refresh(session_record)
        return session_record
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to accept session: {str(e)}"
        )

@router.post("/{session_id}/schedule", response_model=SessionOut)
def schedule_session(
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
            detail="You are not a participant in this session"
        )
        
    if session_record.status != "Accepted":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot schedule session. It must be Accepted first. Current status is '{session_record.status}'"
        )
        
    session_record.status = "Scheduled"
    
    other_user_id = session_record.receiver_id if current_user.user_id == session_record.requester_id else session_record.requester_id
    user_name = current_user.profile.full_name if current_user.profile else "A user"
    db_notification = Notification(
        user_id=other_user_id,
        title="Session Scheduled",
        message=f"{user_name} marked the session on '{session_record.topic}' as Scheduled.",
        type="session_scheduled"
    )
    
    try:
        db.add(db_notification)
        db.commit()
        db.refresh(session_record)
        return session_record
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to schedule session: {str(e)}"
        )

@router.post("/{session_id}/reject", response_model=SessionOut)
def reject_session(
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
        
    if session_record.receiver_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to reject this proposal"
        )
        
    if session_record.status != "Requested":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session proposal is already resolved"
        )
        
    session_record.status = "Rejected"
    
    receiver_name = current_user.profile.full_name if current_user.profile else "A user"
    db_notification = Notification(
        user_id=session_record.requester_id,
        title="Session Proposal Declined",
        message=f"{receiver_name} declined your proposed session on '{session_record.topic}'.",
        type="session_rejected"
    )
    
    try:
        db.add(db_notification)
        db.commit()
        db.refresh(session_record)
        return session_record
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to reject session: {str(e)}"
        )

@router.post("/{session_id}/cancel", response_model=SessionOut)
def cancel_session(
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
            detail="You are not a participant in this session"
        )
        
    if session_record.status in ["Completed", "Cancelled", "Rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel session. Current status is '{session_record.status}'"
        )
        
    session_record.status = "Cancelled"
    
    other_user_id = session_record.receiver_id if current_user.user_id == session_record.requester_id else session_record.requester_id
    user_name = current_user.profile.full_name if current_user.profile else "A user"
    db_notification = Notification(
        user_id=other_user_id,
        title="Session Cancelled",
        message=f"{user_name} has cancelled the session on '{session_record.topic}'.",
        type="session_cancelled"
    )
    
    try:
        db.add(db_notification)
        db.commit()
        db.refresh(session_record)
        return session_record
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to cancel session: {str(e)}"
        )

@router.post("/{session_id}/complete", response_model=SessionOut)
def complete_session(
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
            detail="You are not a participant in this session"
        )
        
    if session_record.status not in ["Accepted", "Scheduled"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot complete session in status '{session_record.status}'"
        )
        
    session_record.status = "Completed"
    
    other_user_id = session_record.receiver_id if current_user.user_id == session_record.requester_id else session_record.requester_id
    user_name = current_user.profile.full_name if current_user.profile else "A user"
    db_notification = Notification(
        user_id=other_user_id,
        title="Session Completed",
        message=f"{user_name} marked the session on '{session_record.topic}' as completed.",
        type="session_completed"
    )
    
    try:
        db.add(db_notification)
        db.commit()
        db.refresh(session_record)
        return session_record
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to complete session: {str(e)}"
        )

@router.get("/active", response_model=List[SessionOut])
def get_active_sessions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(SessionSwap).filter(
        or_(
            SessionSwap.requester_id == current_user.user_id,
            SessionSwap.receiver_id == current_user.user_id
        ),
        SessionSwap.status.in_(["Accepted", "Scheduled"])
    ).order_by(SessionSwap.proposed_date.asc(), SessionSwap.proposed_time.asc()).all()
    for s in sessions:
        db.expunge(s)
        s.meeting_url = None
    return sessions

@router.get("/history", response_model=List[SessionOut])
def get_session_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    sessions = db.query(SessionSwap).filter(
        or_(
            SessionSwap.requester_id == current_user.user_id,
            SessionSwap.receiver_id == current_user.user_id
        ),
        SessionSwap.status.in_(["Completed", "Cancelled", "Rejected"])
    ).order_by(SessionSwap.proposed_date.desc(), SessionSwap.proposed_time.desc()).all()
    for s in sessions:
        db.expunge(s)
        s.meeting_url = None
    return sessions

@router.get("/{session_id}", response_model=SessionOut)
def get_session_details(
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
            detail="You are not authorized to view this session"
        )
        
    db.expunge(session_record)
    session_record.meeting_url = None
    return session_record

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List
from app.database.session import get_db
from app.models.models import User, Skill, ConnectionRequest, Connection, Notification, Block
from app.schemas.schemas import ConnectionRequestCreate, ConnectionRequestOut, PublicUserOut
from app.authentication.auth import get_current_user
from uuid import UUID

router = APIRouter(prefix="/connections", tags=["connections"])

def is_blocked(user_id_1: UUID, user_id_2: UUID, db: Session) -> bool:
    block = db.query(Block).filter(
        or_(
            and_(Block.blocker_id == user_id_1, Block.blocked_user_id == user_id_2),
            and_(Block.blocker_id == user_id_2, Block.blocked_user_id == user_id_1)
        )
    ).first()
    return block is not None

@router.post("/request", response_model=ConnectionRequestOut, status_code=status.HTTP_201_CREATED)
def send_connection_request(
    request_in: ConnectionRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.user_id == request_in.receiver_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot send a connection request to yourself"
        )
        
    if is_blocked(current_user.user_id, request_in.receiver_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot interact with this user due to block restrictions"
        )
        
    receiver = db.query(User).filter(User.user_id == request_in.receiver_id).first()
    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receiver user not found"
        )
        
    skill = db.query(Skill).filter(Skill.skill_id == request_in.requested_skill).first()
    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Requested skill not found"
        )

    u1, u2 = min(current_user.user_id, request_in.receiver_id), max(current_user.user_id, request_in.receiver_id)
    existing_connection = db.query(Connection).filter(
        Connection.user_one == u1,
        Connection.user_two == u2
    ).first()
    if existing_connection:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You are already connected with this user"
        )

    existing_request = db.query(ConnectionRequest).filter(
        or_(
            and_(ConnectionRequest.sender_id == current_user.user_id, ConnectionRequest.receiver_id == request_in.receiver_id),
            and_(ConnectionRequest.sender_id == request_in.receiver_id, ConnectionRequest.receiver_id == current_user.user_id)
        ),
        ConnectionRequest.status == "Pending"
    ).first()
    
    if existing_request:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A pending connection request already exists between you and this user"
        )

    db_request = ConnectionRequest(
        sender_id=current_user.user_id,
        receiver_id=request_in.receiver_id,
        requested_skill=request_in.requested_skill,
        message=request_in.message,
        status="Pending"
    )
    
    sender_name = current_user.profile.full_name if current_user.profile else "A user"
    db_notification = Notification(
        user_id=request_in.receiver_id,
        title="New Connection Request",
        message=f"{sender_name} has requested to connect with you for skill '{skill.skill_name}'.",
        type="connection_request"
    )
    
    try:
        db.add(db_request)
        db.add(db_notification)
        db.commit()
        db.refresh(db_request)
        return db_request
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to send request: {str(e)}"
        )

@router.get("/requests/received", response_model=List[ConnectionRequestOut])
def get_received_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(ConnectionRequest).filter(
        ConnectionRequest.receiver_id == current_user.user_id,
        ConnectionRequest.status == "Pending"
    ).order_by(ConnectionRequest.created_at.desc()).all()

@router.get("/requests/sent", response_model=List[ConnectionRequestOut])
def get_sent_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(ConnectionRequest).filter(
        ConnectionRequest.sender_id == current_user.user_id,
        ConnectionRequest.status == "Pending"
    ).order_by(ConnectionRequest.created_at.desc()).all()

@router.post("/request/{request_id}/accept", response_model=ConnectionRequestOut)
def accept_connection_request(
    request_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    request = db.query(ConnectionRequest).filter(ConnectionRequest.request_id == request_id).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
        
    if request.receiver_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to accept this request"
        )
        
    if request.status != "Pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot accept request. Current status is '{request.status}'"
        )
        
    if is_blocked(request.sender_id, request.receiver_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot establish connection due to block restrictions"
        )

    u1, u2 = min(request.sender_id, request.receiver_id), max(request.sender_id, request.receiver_id)
    db_connection = Connection(user_one=u1, user_two=u2)
    request.status = "Accepted"
    
    receiver_name = current_user.profile.full_name if current_user.profile else "A user"
    db_notification = Notification(
        user_id=request.sender_id,
        title="Connection Request Accepted",
        message=f"{receiver_name} accepted your connection request.",
        type="connection_accepted"
    )
    
    try:
        db.add(db_connection)
        db.add(db_notification)
        db.commit()
        db.refresh(request)
        return request
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to accept request: {str(e)}"
        )

@router.post("/request/{request_id}/reject", response_model=ConnectionRequestOut)
def reject_connection_request(
    request_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    request = db.query(ConnectionRequest).filter(ConnectionRequest.request_id == request_id).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
        
    if request.receiver_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to reject this request"
        )
        
    if request.status != "Pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Request is already resolved"
        )
        
    request.status = "Rejected"
    
    receiver_name = current_user.profile.full_name if current_user.profile else "A user"
    db_notification = Notification(
        user_id=request.sender_id,
        title="Connection Request Declined",
        message=f"{receiver_name} declined your connection request.",
        type="connection_rejected"
    )
    
    try:
        db.add(db_notification)
        db.commit()
        db.refresh(request)
        return request
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to reject request: {str(e)}"
        )

@router.delete("/request/{request_id}/cancel", status_code=status.HTTP_204_NO_CONTENT)
def cancel_connection_request(
    request_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    request = db.query(ConnectionRequest).filter(ConnectionRequest.request_id == request_id).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
        
    if request.sender_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to cancel this request"
        )
        
    if request.status != "Pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot cancel request, it has already been resolved"
        )
        
    try:
        db.delete(request)
        db.commit()
        return
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to cancel request: {str(e)}"
        )

@router.get("", response_model=List[PublicUserOut])
def get_active_connections(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    connections = db.query(Connection).filter(
        or_(
            Connection.user_one == current_user.user_id,
            Connection.user_two == current_user.user_id
        )
    ).all()
    
    other_user_ids = []
    for c in connections:
        if c.user_one == current_user.user_id:
            other_user_ids.append(c.user_two)
        else:
            other_user_ids.append(c.user_one)
            
    if not other_user_ids:
        return []
        
    return db.query(User).filter(User.user_id.in_(other_user_ids)).all()

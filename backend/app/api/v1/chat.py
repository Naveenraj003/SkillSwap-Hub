from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, desc
from typing import List
from datetime import datetime
from app.database.session import get_db
from app.models.models import User, Connection, Block, Conversation, Message
from app.schemas.schemas import ConversationCreate, ConversationOut, MessageCreate, MessageOut
from app.authentication.auth import get_current_user
from uuid import UUID

router = APIRouter(prefix="/chat", tags=["chat"])

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
            detail="Cannot communicate with blocked user"
        )

    u1, u2 = min(user_id_1, user_id_2), max(user_id_1, user_id_2)
    conn = db.query(Connection).filter(
        Connection.user_one == u1,
        Connection.user_two == u2
    ).first()
    if not conn:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be connected to communicate"
        )

@router.post("/conversations", response_model=ConversationOut)
def get_or_create_conversation(
    conv_in: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.user_id == conv_in.receiver_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot start conversation with yourself"
        )
        
    check_relationship_allowed(current_user.user_id, conv_in.receiver_id, db)
    
    receiver = db.query(User).filter(User.user_id == conv_in.receiver_id).first()
    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient user not found"
        )

    u1, u2 = min(current_user.user_id, conv_in.receiver_id), max(current_user.user_id, conv_in.receiver_id)
    
    conv = db.query(Conversation).filter(
        Conversation.user_one == u1,
        Conversation.user_two == u2
    ).first()
    
    if conv:
        unread = db.query(Message).filter(
            Message.conversation_id == conv.conversation_id,
            Message.receiver_id == current_user.user_id,
            Message.is_read == False
        ).count()
        
        last_msg = db.query(Message).filter(
            Message.conversation_id == conv.conversation_id
        ).order_by(desc(Message.created_at)).first()
        
        return ConversationOut(
            conversation_id=conv.conversation_id,
            user_one=conv.user_one,
            user_two=conv.user_two,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
            user1=conv.user1,
            user2=conv.user2,
            unread_count=unread,
            last_message=last_msg.content if last_msg else None,
            last_message_at=last_msg.created_at if last_msg else conv.updated_at
        )

    db_conv = Conversation(user_one=u1, user_two=u2)
    try:
        db.add(db_conv)
        db.commit()
        db.refresh(db_conv)
        return ConversationOut(
            conversation_id=db_conv.conversation_id,
            user_one=db_conv.user_one,
            user_two=db_conv.user_two,
            created_at=db_conv.created_at,
            updated_at=db_conv.updated_at,
            user1=db_conv.user1,
            user2=db_conv.user2,
            unread_count=0,
            last_message=None,
            last_message_at=db_conv.created_at
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create conversation: {str(e)}"
        )

@router.get("/conversations", response_model=List[ConversationOut])
def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conversations = db.query(Conversation).filter(
        or_(
            Conversation.user_one == current_user.user_id,
            Conversation.user_two == current_user.user_id
        )
    ).all()
    
    out_list = []
    for c in conversations:
        blocked = db.query(Block).filter(
            or_(
                and_(Block.blocker_id == c.user_one, Block.blocked_user_id == c.user_two),
                and_(Block.blocker_id == c.user_two, Block.blocked_user_id == c.user_one)
            )
        ).first()
        if blocked:
            continue
            
        unread = db.query(Message).filter(
            Message.conversation_id == c.conversation_id,
            Message.receiver_id == current_user.user_id,
            Message.is_read == False
        ).count()
        
        last_msg = db.query(Message).filter(
            Message.conversation_id == c.conversation_id
        ).order_by(desc(Message.created_at)).first()
        
        out_list.append(ConversationOut(
            conversation_id=c.conversation_id,
            user_one=c.user_one,
            user_two=c.user_two,
            created_at=c.created_at,
            updated_at=c.updated_at,
            user1=c.user1,
            user2=c.user2,
            unread_count=unread,
            last_message=last_msg.content if last_msg else None,
            last_message_at=last_msg.created_at if last_msg else c.updated_at
        ))
        
    out_list.sort(key=lambda x: x.last_message_at or x.created_at, reverse=True)
    return out_list

@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageOut])
def get_conversation_messages(
    conversation_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(Conversation.conversation_id == conversation_id).first()
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
        
    if current_user.user_id not in [conv.user_one, conv.user_two]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to view this conversation"
        )
        
    return db.query(Message).filter(
        Message.conversation_id == conversation_id
    ).order_by(Message.created_at).all()

@router.post("/conversations/{conversation_id}/messages", response_model=MessageOut)
def send_message(
    conversation_id: UUID,
    msg_in: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(Conversation.conversation_id == conversation_id).first()
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
        
    if current_user.user_id not in [conv.user_one, conv.user_two]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not a participant in this conversation"
        )
        
    receiver_id = conv.user_two if current_user.user_id == conv.user_one else conv.user_one
    check_relationship_allowed(current_user.user_id, receiver_id, db)
    
    unread_count = db.query(Message).filter(
        Message.conversation_id == conversation_id,
        Message.sender_id == current_user.user_id,
        Message.receiver_id == receiver_id,
        Message.is_read == False
    ).count()
    
    if unread_count >= 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unread message limit reached. You can only send up to 3 unread messages before the recipient reads them."
        )
        
    db_msg = Message(
        conversation_id=conversation_id,
        sender_id=current_user.user_id,
        receiver_id=receiver_id,
        content=msg_in.content,
        is_read=False
    )
    
    conv.updated_at = datetime.utcnow()
    
    try:
        db.add(db_msg)
        db.commit()
        db.refresh(db_msg)
        return db_msg
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to send message: {str(e)}"
        )

@router.put("/conversations/{conversation_id}/read", status_code=status.HTTP_204_NO_CONTENT)
def mark_messages_as_read(
    conversation_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    conv = db.query(Conversation).filter(Conversation.conversation_id == conversation_id).first()
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
        
    if current_user.user_id not in [conv.user_one, conv.user_two]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not authorized to access this conversation"
        )
        
    try:
        db.query(Message).filter(
            Message.conversation_id == conversation_id,
            Message.receiver_id == current_user.user_id,
            Message.is_read == False
        ).update({Message.is_read: True}, synchronize_session=False)
        db.commit()
        return
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to mark messages as read: {str(e)}"
        )

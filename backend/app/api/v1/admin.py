from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from typing import List
from app.database.session import get_db
from app.models.models import User, Report, AdminAction
from app.schemas.schemas import PublicUserOut, ReportOut, AdminActionOut
from app.authentication.auth import get_current_user
from uuid import UUID

router = APIRouter(prefix="/admin", tags=["admin"])

def verify_admin(current_user: User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required"
        )
    return current_user

@router.get("/users", response_model=List[PublicUserOut])
def list_users(
    search: str = "",
    current_admin: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    query = db.query(User)
    if search:
        query = query.filter(
            or_(
                User.email.ilike(f"%{search}%"),
                User.skillswap_id.ilike(f"%{search}%")
            )
        )
    return query.order_by(User.created_at.desc()).all()

@router.post("/users/{user_id}/suspend", response_model=PublicUserOut)
def suspend_user(
    user_id: UUID,
    reason: str = "Inappropriate platform behavior",
    current_admin: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    user.status = "Suspended"
    
    audit = AdminAction(
        admin_id=current_admin.user_id,
        action_type="SUSPEND_USER",
        target_id=user_id,
        details=f"Suspended user account. Reason: {reason}"
    )
    
    try:
        db.add(audit)
        db.commit()
        db.refresh(user)
        return user
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to suspend user: {str(e)}"
        )

@router.post("/users/{user_id}/activate", response_model=PublicUserOut)
def activate_user(
    user_id: UUID,
    current_admin: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
        
    user.status = "Active"
    
    audit = AdminAction(
        admin_id=current_admin.user_id,
        action_type="ACTIVATE_USER",
        target_id=user_id,
        details="Re-activated user account."
    )
    
    try:
        db.add(audit)
        db.commit()
        db.refresh(user)
        return user
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to activate user: {str(e)}"
        )

@router.get("/reports", response_model=List[ReportOut])
def get_reports(
    current_admin: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    return db.query(Report).order_by(desc(Report.created_at)).all()

@router.put("/reports/{report_id}/status", response_model=ReportOut)
def update_report_status(
    report_id: UUID,
    status_str: str,
    current_admin: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    if status_str not in ["Pending", "Reviewed", "Resolved"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid report status"
        )
        
    report = db.query(Report).filter(Report.report_id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found"
        )
        
    report.status = status_str
    
    audit = AdminAction(
        admin_id=current_admin.user_id,
        action_type="RESOLVE_REPORT",
        target_id=report_id,
        details=f"Updated report status to '{status_str}'."
    )
    
    try:
        db.add(audit)
        db.commit()
        db.refresh(report)
        return report
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update report status: {str(e)}"
        )

@router.get("/actions", response_model=List[AdminActionOut])
def get_admin_audit_logs(
    current_admin: User = Depends(verify_admin),
    db: Session = Depends(get_db)
):
    return db.query(AdminAction).order_by(desc(AdminAction.created_at)).all()

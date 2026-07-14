from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Report
from app.schemas.schemas import ReportCreate, ReportOut
from app.authentication.auth import get_current_user

router = APIRouter(prefix="/reports", tags=["reports"])

@router.post("", response_model=ReportOut, status_code=status.HTTP_201_CREATED)
def submit_report(
    report_in: ReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.user_id == report_in.reported_user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot report yourself"
        )
        
    reported_user = db.query(User).filter(User.user_id == report_in.reported_user_id).first()
    if not reported_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Reported user not found"
        )
        
    db_report = Report(
        reporter_id=current_user.user_id,
        reported_user_id=report_in.reported_user_id,
        reason=report_in.reason,
        description=report_in.description,
        status="Pending"
    )
    
    try:
        db.add(db_report)
        db.commit()
        db.refresh(db_report)
        return db_report
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to submit report: {str(e)}"
        )

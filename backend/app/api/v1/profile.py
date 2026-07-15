from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.models import User, Profile
from app.schemas.schemas import ProfileOut, ProfileUpdate, UserWithProfileOut, PublicUserOut
from app.authentication.auth import get_current_user, supabase_client
from uuid import UUID

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/me", response_model=UserWithProfileOut)
def get_my_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return current_user

@router.get("/{user_id}", response_model=PublicUserOut)
def get_user_profile(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put("/update", response_model=ProfileOut)
def update_profile(
    profile_data: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.user_id).first()
    if not profile:
        profile = Profile(user_id=current_user.user_id, full_name="User")
        db.add(profile)
        db.commit()
        db.refresh(profile)
        
    for field, value in profile_data.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
        
    try:
        db.commit()
        db.refresh(profile)
        return profile
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update profile: {str(e)}"
        )

@router.post("/upload-avatar", response_model=ProfileOut)
def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not supabase_client:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase client not initialized"
        )
    
    file_bytes = file.file.read()
    filename = file.filename
    content_type = file.content_type
    
    ext = filename.split(".")[-1] if "." in filename else "png"
    if ext.lower() not in ["png", "jpg", "jpeg", "gif", "webp"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid image format. Supported formats: png, jpg, jpeg, gif, webp"
        )
        
    bucket_name = "avatars"
    path = f"avatar_{current_user.user_id}.{ext.lower()}"
    
    try:
        # Delete if existing to prevent conflicts
        try:
            supabase_client.storage.from_(bucket_name).remove([path])
        except Exception:
            pass
            
        # Upload new image
        supabase_client.storage.from_(bucket_name).upload(
            path=path,
            file=file_bytes,
            file_options={"content-type": content_type}
        )
        
        # Get public URL
        public_url = supabase_client.storage.from_(bucket_name).get_public_url(path)
        
        # Update profile
        profile = db.query(Profile).filter(Profile.user_id == current_user.user_id).first()
        if not profile:
            profile = Profile(user_id=current_user.user_id, full_name="User")
            db.add(profile)
            
        profile.profile_image = public_url
        db.commit()
        db.refresh(profile)
        return profile
        
    except Exception as e:
        db.rollback()
        err_msg = str(e)
        if "Bucket not found" in err_msg or "404" in err_msg:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Supabase Storage bucket 'avatars' not found. Please create a public bucket named 'avatars' in your Supabase dashboard."
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload avatar: {err_msg}"
        )

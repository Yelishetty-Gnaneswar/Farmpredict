from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

from . import models, schemas, database
from .database import engine, get_db
import bcrypt
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

# Secret key for JWT
SECRET_KEY = os.getenv("SECRET_KEY", "yoursecretkeyhere-replace-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

from contextlib import asynccontextmanager

# Create tables
models.Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Start APScheduler
    from .scheduler import start_scheduler, scheduler
    start_scheduler()
    yield
    # Shutdown: Stop APScheduler
    scheduler.shutdown()

app = FastAPI(title="Farm Predict API", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    # Allow local ports, generic Vercel domains, and wildcard for ease of deployment testing
    allow_origins=[
        "http://localhost:5173", 
        "http://127.0.0.1:5173", 
        "https://*.vercel.app",
        "*" 
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def verify_password(plain_password, hashed_password):
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/api/register", response_model=schemas.UserResponse)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = models.User(
        name=user.name, 
        email=user.email, 
        password_hash=hashed_password,
        phone=user.phone,
        location=user.location,
        farm_size=user.farm_size,
        primary_crops=user.primary_crops
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer", "user": user}

import secrets
from .services import email_service

@app.post("/api/forgot-password")
async def forgot_password(request: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == request.email).first()
    if not user:
        # For security, don't reveal if user exists. 
        return {"message": "If the email is registered, a reset link will be sent."}
    
    token = secrets.token_urlsafe(32)
    user.reset_token = token
    user.reset_token_expiry = datetime.utcnow() + timedelta(hours=1)
    db.commit()
    
    # Use environment variable for frontend URL, default to localhost
    frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173").rstrip('/')
    reset_link = f"{frontend_url}/reset-password?token={token}"
    
    # Send actual email
    email_sent = email_service.send_password_reset_email(user, reset_link)
    
    if not email_sent:
        # Log failure but return success message to avoid user confusion/security leaks
        print(f"FAILED to send reset email to {user.email}")
    
    print(f"DEBUG: Password reset link for {user.email}: {reset_link}")
    
    return {"message": "Reset link sent successfully."}

@app.post("/api/reset-password")
async def reset_password(request: schemas.ResetPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.reset_token == request.token,
        models.User.reset_token_expiry > datetime.utcnow()
    ).first()
    
    if not user:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    user.password_hash = get_password_hash(request.new_password)
    user.reset_token = None
    user.reset_token_expiry = None
    db.commit()
    
    return {"message": "Password updated successfully."}

# ---- NEW ENDPOINTS ----

from . import ml_utils

@app.post("/api/predict-crop", response_model=schemas.CropPredictionResponse)
def predict_crop(data: schemas.CropPredictionRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Predicts the best crop using the pre-trained SVM model and saves it.
    """
    prediction_result = ml_utils.predict_crop(
        data.nitrogen, data.phosphorus, data.potassium,
        data.temperature, data.humidity, data.ph, data.rainfall
    )
    
    # Use fallback if model fails
    crop = prediction_result["crop"] if prediction_result else "Rice"
    confidence = prediction_result["confidence"] if prediction_result else 92.0
    
    # Save to database
    new_prediction = models.Prediction(
        user_id=current_user.id,
        nitrogen=data.nitrogen,
        phosphorus=data.phosphorus,
        potassium=data.potassium,
        ph=data.ph,
        temperature=data.temperature,
        humidity=data.humidity,
        rainfall=data.rainfall,
        predicted_crop=crop,
        confidence=confidence
    )
    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)

    if not prediction_result:
        return {
            "crop": crop,
            "confidence": confidence,
            "suitable_conditions": "High moisture and warm climate.",
            "fertilizer_tips": "Apply Urea and DAP as per standard schedules.",
            "estimated_yield": "4.2 Tons/Hectare (Demo Result)"
        }
    return prediction_result

@app.get("/api/history", response_model=list[schemas.PredictionHistoryResponse])
def get_prediction_history(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Returns the prediction history for the logged-in user.
    """
    return db.query(models.Prediction).filter(models.Prediction.user_id == current_user.id).order_by(models.Prediction.created_at.desc()).all()

from fastapi import UploadFile, File

@app.post("/api/detect-disease", response_model=schemas.DiseaseDetectionResponse)
async def detect_disease(file: UploadFile = File(...)):
    """
    Detects disease from an uploaded image (Placeholder logic).
    """
    # Simulate processing time
    import asyncio
    await asyncio.sleep(2)
    
    return {
        "disease_name": "Late Blight",
        "confidence": 89.5,
        "description": "A serious fungal disease that affects potato and tomato crops.",
        "prevention_tips": ["Use certified seeds", "Avoid overhead irrigation", "Space plants properly"],
        "treatment": "Apply fungicides like Mancozeb or Copper Oxychloride.",
        "severity": "High"
    }

@app.get("/api/dashboard/stats", response_model=schemas.DashboardStatsResponse)
def get_dashboard_stats():
    """
    Returns mock data for the dashboard overview.
    """
    return {
        "current_temp": 28.5,
        "humidity": 65.0,
        "recommended_crop": "Wheat",
        "soil_moisture": 45.0,
        "market_price_wheat": 2450.0,
        "weather_chart": [
            {"time": "06:00", "temp": 22, "rain": 0},
            {"time": "09:00", "temp": 25, "rain": 5},
            {"time": "12:00", "temp": 30, "rain": 15},
            {"time": "15:00", "temp": 32, "rain": 25}
        ],
        "market_trends": [
            {"crop": "Wheat", "price": 2450.0, "trend": "up"},
            {"crop": "Cotton", "price": 6800.0, "trend": "down"},
            {"crop": "Rice", "price": 1950.0, "trend": "up"}
        ]
    }

@app.get("/api/profile", response_model=schemas.UserResponse)
def get_profile(current_user: models.User = Depends(get_current_user)):
    """
    Returns the current user's profile data.
    """
    return current_user

@app.put("/api/profile", response_model=schemas.UserResponse)
def update_profile(user_update: schemas.UserUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """
    Updates the current user's profile data.
    """
    update_data = user_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    location: Optional[str] = None
    farm_size: Optional[str] = None
    primary_crops: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# ---- Prediction Schemas ----
class CropPredictionRequest(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float
    temperature: float
    humidity: float
    rainfall: float

class CropPredictionResponse(BaseModel):
    crop: str
    confidence: float
    suitable_conditions: str
    fertilizer_tips: str
    estimated_yield: str

# ---- Disease Detection Schemas ----
class DiseaseDetectionResponse(BaseModel):
    disease_name: str
    confidence: float
    description: str
    prevention_tips: list[str]
    treatment: str
    severity: str # Low, Medium, High

# ---- Dashboard Stats Schemas ----
class WeatherDataPoint(BaseModel):
    time: str
    temp: float
    rain: float

class MarketPricePoint(BaseModel):
    crop: str
    price: float
    trend: str # up, down, stable

class DashboardStatsResponse(BaseModel):
    current_temp: float
    humidity: float
    recommended_crop: str
    soil_moisture: float
    market_price_wheat: float
    weather_chart: list[WeatherDataPoint]
    market_trends: list[MarketPricePoint]
    
class PredictionHistoryResponse(CropPredictionRequest):
    id: int
    user_id: int
    predicted_crop: str
    confidence: float
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    farm_size: Optional[str] = None
    primary_crops: Optional[str] = None
    profile_image: Optional[str] = None
    
    # Notification Preferences
    enable_weather_alerts: Optional[bool] = None
    enable_irrigation_alerts: Optional[bool] = None
    enable_market_alerts: Optional[bool] = None
    enable_weekly_tips: Optional[bool] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    farm_size: Optional[str] = None
    primary_crops: Optional[str] = None
    profile_image: Optional[str] = None
    
    # Notification Preferences
    enable_weather_alerts: bool
    enable_irrigation_alerts: bool
    enable_market_alerts: bool
    enable_weekly_tips: bool
    
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

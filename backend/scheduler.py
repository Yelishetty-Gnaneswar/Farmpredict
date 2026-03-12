from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlalchemy.orm import Session
from .database import engine, SessionLocal
from .models import User
from .services import email_service
import asyncio

scheduler = AsyncIOScheduler()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def job_morning_weather():
    """6:00 AM daily - Morning Weather Reminder"""
    print("Executing job_morning_weather...")
    db = SessionLocal()
    try:
        users = db.query(User).filter(User.enable_weather_alerts == 1).all()
        for user in users:
            # In a real app, you'd fetch real weather data here based on user.location
            weather_data = {
                "temp": 24,
                "humidity": 65,
                "rain": 0,
                "condition": "Clear Sky",
                "tips": ["Good time for fertilizer application.", "Check for early pest activity."]
            }
            email_service.send_weather_alert(user, weather_data)
    finally:
        db.close()

async def job_crop_monitoring():
    """8:00 AM daily - Crop Monitoring Reminder"""
    print("Executing job_crop_monitoring...")
    db = SessionLocal()
    try:
        users = db.query(User).filter(User.enable_weekly_tips == 1).all()
        for user in users:
            email_service.send_crop_monitoring_reminder(user)
    finally:
        db.close()

async def job_irrigation_reminder():
    """5:00 PM daily - Irrigation Reminder"""
    print("Executing job_irrigation_reminder...")
    db = SessionLocal()
    try:
        users = db.query(User).filter(User.enable_irrigation_alerts == 1).all()
        for user in users:
            irrigation_data = {
                "soil_moisture": 42.5,
                "recommendation": "Irrigate field sector B for 45 minutes."
            }
            email_service.send_irrigation_reminder(user, irrigation_data)
    finally:
        db.close()

async def job_market_price():
    """7:00 PM daily - Market Price Update"""
    print("Executing job_market_price...")
    db = SessionLocal()
    try:
        users = db.query(User).filter(User.enable_market_alerts == 1).all()
        for user in users:
            market_data = {
                "market_trends": [
                    {"crop": "Wheat", "price": 2450.0, "trend": "up", "change": 1.2},
                    {"crop": "Cotton", "price": 6800.0, "trend": "down", "change": 0.5},
                    {"crop": "Rice", "price": 1950.0, "trend": "stable", "change": 0}
                ]
            }
            email_service.send_market_price_alert(user, market_data)
    finally:
        db.close()

async def job_weekly_tips():
    """Sunday 9:00 AM - Weekly Soil Health Tips"""
    print("Executing job_weekly_tips...")
    db = SessionLocal()
    try:
        users = db.query(User).filter(User.enable_weekly_tips == 1).all()
        for user in users:
            tips = [
                {"title": "Soil Nitrate Management", "description": "Ensure split application of nitrogen to prevent leaching during early growth stages."},
                {"title": "Organic Matter Boost", "description": "Consider incorporating crop residues post-harvest to improve soil structure."}
            ]
            email_service.send_weekly_farming_tips(user, tips)
    finally:
        db.close()

def start_scheduler():
    # Weather Reminder: 6:00 AM daily
    scheduler.add_job(job_morning_weather, CronTrigger(hour=6, minute=0))
    
    # Crop Monitoring Reminder: 8:00 AM daily
    scheduler.add_job(job_crop_monitoring, CronTrigger(hour=8, minute=0))
    
    # Irrigation Reminder: 5:00 PM daily
    scheduler.add_job(job_irrigation_reminder, CronTrigger(hour=17, minute=0))
    
    # Market Price Update: 7:00 PM daily
    scheduler.add_job(job_market_price, CronTrigger(hour=19, minute=0))
    
    # Weekly Soil Health Tips: Sunday 9:00 AM
    scheduler.add_job(job_weekly_tips, CronTrigger(day_of_week='sun', hour=9, minute=0))
    
    scheduler.start()
    print("APScheduler started successfully with 5 farming jobs.")

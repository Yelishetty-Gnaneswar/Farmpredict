import os
import smtplib
from email.message import EmailMessage
from jinja2 import Environment, FileSystemLoader
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# SMTP Configuration
SMTP_HOST = os.getenv("EMAIL_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("EMAIL_PORT", "587"))
SMTP_USER = os.getenv("EMAIL_USER")
SMTP_PASSWORD = os.getenv("EMAIL_PASSWORD")

# Jinja2 Environment setup
TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), '..', 'templates')
env = Environment(loader=FileSystemLoader(TEMPLATES_DIR))

def _send_email(to_email: str, subject: str, html_content: str):
    """
    Internal helper to send an HTML email using smtplib.
    """
    if not SMTP_USER or not SMTP_PASSWORD:
        logger.warning(f"SMTP credentials missing. Cannot send email to {to_email}")
        # For local testing without real credentials, just print that it would send
        print(f"--- FAKE EMAIL SENT TO {to_email} ---")
        print(f"Subject: {subject}")
        print("--- END FAKE EMAIL ---")
        return True

    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = SMTP_USER
    msg['To'] = to_email
    
    msg.set_content("This email requires an HTML compatible viewer.")
    msg.add_alternative(html_content, subtype='html')
    
    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            # Credentials guaranteed by check above
            server.login(str(SMTP_USER), str(SMTP_PASSWORD))
            server.send_message(msg)
        logger.info(f"Successfully sent email to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {e}")
        return False

def send_weather_alert(user, weather_data: dict):
    if not user.email or not user.enable_weather_alerts:
        return
    template = env.get_template('weather_email.html')
    html_out = template.render(user=user, weather_data=weather_data)
    _send_email(user.email, "Weather Update for Your Farm", html_out)

def send_irrigation_reminder(user, irrigation_data: dict):
    if not user.email or not user.enable_irrigation_alerts:
        return
    template = env.get_template('irrigation_email.html')
    html_out = template.render(user=user, data=irrigation_data)
    _send_email(user.email, "Irrigation Reminder for Your Crops", html_out)

def send_market_price_alert(user, market_data: dict):
    if not user.email or not user.enable_market_alerts:
        return
    template = env.get_template('market_alert_email.html')
    html_out = template.render(user=user, data=market_data)
    _send_email(user.email, "Crop Market Price Update", html_out)

def send_crop_monitoring_reminder(user):
    if not user.email or not user.enable_weekly_tips: # Sharing this flag for daily monitoring tips
        return
    template = env.get_template('crop_monitoring_email.html')
    html_out = template.render(user=user)
    _send_email(user.email, "Daily Crop Monitoring Reminder", html_out)

def send_weekly_farming_tips(user, tips: list):
    if not user.email or not user.enable_weekly_tips:
        return
    template = env.get_template('weekly_tips_email.html')
    html_out = template.render(user=user, tips=tips)
    _send_email(user.email, "Farm Predict Weekly Insights", html_out)

def send_password_reset_email(user, reset_link: str):
    """
    Sends a secure password reset link to the user.
    """
    if not user.email:
        return
    template = env.get_template('password_reset_email.html')
    html_out = template.render(user=user, reset_link=reset_link)
    _send_email(user.email, "Reset Your Farm Predict Password", html_out)

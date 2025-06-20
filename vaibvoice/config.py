"""
Configuration module for VaibVoice.
Centralizes configuration settings for the application.
"""

import os
import sqlite3
from dotenv import load_dotenv

# Determina la radice del progetto (indipendente dalla directory di lavoro corrente)
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables from .env file for initial configuration
load_dotenv()

# API Server Configuration
API_HOST = os.getenv("API_HOST", "127.0.0.1")
API_PORT = int(os.getenv("API_PORT", "5000"))

# GUI Server Configuration
GUI_HOST = os.getenv("GUI_HOST", "127.0.0.1")
GUI_PORT = int(os.getenv("GUI_PORT", "8000"))

# Database Configuration
DB_PATH = os.path.join(PROJECT_ROOT, os.getenv("DB_PATH", "transcription_history.db"))

# Audio Configuration
AUDIO_TEMP_DIR = os.getenv("AUDIO_TEMP_DIR", "audio_temp")
SAMPLE_RATE = int(os.getenv("SAMPLE_RATE", "44100"))
CHANNELS = int(os.getenv("CHANNELS", "1"))

# Default values for user-configurable settings
START_SOUND = os.getenv("START_SOUND", "beep.mp3")
END_SOUND = os.getenv("END_SOUND", "stop.mp3")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", None)
TRANSCRIPTION_LANGUAGE = os.getenv("TRANSCRIPTION_LANGUAGE", None)
WHISPER_MODEL = os.getenv("WHISPER_MODEL", "gpt-4o-transcribe")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
RECORD_KEY = os.getenv("RECORD_KEY", "ctrl")

# Try to load user-configurable settings from the database
try:
    # Check if the settings table exists
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='settings'")
    table_exists = cursor.fetchone() is not None

    if table_exists:
        # Load settings from the database
        cursor.execute("SELECT * FROM settings WHERE id = 1")
        row = cursor.fetchone()

        if row:
            # Update settings from the database
            RECORD_KEY = row[1]
            OPENAI_API_KEY = row[2]
            WHISPER_MODEL = row[3]
            TRANSCRIPTION_LANGUAGE = row[4]
            LLM_MODEL = row[5]
            START_SOUND = row[6]
            END_SOUND = row[7]

    conn.close()
except Exception as e:
    # If there's an error loading from the database, use the values from .env
    print(f"Error loading settings from database: {str(e)}")
    print("Using settings from .env file instead.")

"""
VaibVoice - Command Line Interface
This module provides the main entry point for the VaibVoice application.
"""

import os
from dotenv import load_dotenv

from src.keyboard.recorder import key_recording

# Load environment variables from .env file
load_dotenv()

if __name__ == "__main__":
    # Ensure the audio_temp directory exists
    os.makedirs("audio_temp", exist_ok=True)

    # Start the key recording mode
    key_recording()

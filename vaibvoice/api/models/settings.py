"""
API models for settings.
Defines Pydantic models for the settings API.
"""

from pydantic import BaseModel, Field
from typing import Optional


class SettingsResponse(BaseModel):
    """
    Response model for settings.
    """
    record_key: str
    openai_api_key: Optional[str] = None
    transcription_model: str = "gpt-4o-transcribe"
    transcription_language: Optional[str] = None
    llm_model: str = "gpt-4o-mini"
    start_sound: str = "beep.mp3"
    end_sound: str = "stop.mp3"


class UpdateSettingsRequest(BaseModel):
    """
    Request model for updating settings.
    """
    record_key: str
    openai_api_key: Optional[str] = None
    transcription_model: Optional[str] = None
    transcription_language: Optional[str] = None
    llm_model: Optional[str] = None
    start_sound: Optional[str] = None
    end_sound: Optional[str] = None

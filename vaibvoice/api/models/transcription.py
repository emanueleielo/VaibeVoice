"""
API models for transcriptions.
Defines Pydantic models for the API.
"""

from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Dict, Any

class TranscriptionBase(BaseModel):
    """Base model for transcriptions."""
    text: str
    duration: float
    word_count: int

class TranscriptionCreate(TranscriptionBase):
    """Model for creating a transcription."""
    audio_path: str

class TranscriptionResponse(BaseModel):
    """Model for returning a transcription."""
    id: int
    timestamp: str
    audio_path: str
    text: str
    duration: float
    word_count: int

class StatsResponse(BaseModel):
    """Model for returning statistics."""
    totalTranscriptions: int
    totalDuration: int  # in minutes
    totalWords: int
    avgWordsPerMinute: int
    todayStats: Dict[str, Any]
    recentTranscriptions: List[Dict[str, Any]]
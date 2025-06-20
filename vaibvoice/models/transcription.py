"""
Domain models for transcriptions.
"""

from datetime import datetime
from typing import Optional

class Transcription:
    """
    Domain model for a transcription.
    
    Attributes:
        id (int): Unique identifier for the transcription
        timestamp (datetime): When the transcription was created
        audio_path (str): Path to the audio file
        text (str): Transcribed text
        duration (float): Duration of the audio in seconds
        word_count (int): Number of words in the transcription
    """
    
    def __init__(
        self,
        id: Optional[int] = None,
        timestamp: Optional[datetime] = None,
        audio_path: str = "",
        text: str = "",
        duration: float = 0.0,
        word_count: Optional[int] = None
    ):
        """
        Initialize a Transcription object.
        
        Args:
            id (int, optional): Unique identifier for the transcription
            timestamp (datetime, optional): When the transcription was created
            audio_path (str): Path to the audio file
            text (str): Transcribed text
            duration (float): Duration of the audio in seconds
            word_count (int, optional): Number of words in the transcription
        """
        self.id = id
        self.timestamp = timestamp or datetime.now()
        self.audio_path = audio_path
        self.text = text
        self.duration = duration
        
        # Calculate word count if not provided
        if word_count is None and text:
            self.word_count = len(text.split())
        else:
            self.word_count = word_count or 0
    
    def to_dict(self):
        """
        Convert the Transcription object to a dictionary.
        
        Returns:
            dict: Dictionary representation of the Transcription
        """
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "audio_path": self.audio_path,
            "text": self.text,
            "duration": self.duration,
            "word_count": self.word_count
        }
    
    @classmethod
    def from_dict(cls, data: dict):
        """
        Create a Transcription object from a dictionary.
        
        Args:
            data (dict): Dictionary containing transcription data
            
        Returns:
            Transcription: A new Transcription object
        """
        timestamp = data.get("timestamp")
        if timestamp and isinstance(timestamp, str):
            timestamp = datetime.fromisoformat(timestamp.split('.')[0])
            
        return cls(
            id=data.get("id"),
            timestamp=timestamp,
            audio_path=data.get("audio_path", ""),
            text=data.get("text", ""),
            duration=data.get("duration", 0.0),
            word_count=data.get("word_count")
        )
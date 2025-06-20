"""
Service for transcription operations.
Implements business logic for transcriptions.
"""

from typing import List, Optional

from vaibvoice.db.repositories.transcription_repository import TranscriptionRepository
from vaibvoice.models.transcription import Transcription

class TranscriptionService:
    """
    Service for transcription operations.
    Implements business logic for transcriptions.
    
    Attributes:
        repository (TranscriptionRepository): Repository for transcription data access
    """
    
    def __init__(self, repository: Optional[TranscriptionRepository] = None):
        """
        Initialize the TranscriptionService with the specified repository.
        
        Args:
            repository (TranscriptionRepository, optional): Repository for transcription data access
        """
        self.repository = repository or TranscriptionRepository()
    
    def add_transcription(self, audio_path: str, text: str, duration: float, word_count: Optional[int] = None) -> bool:
        """
        Add a new transcription.
        
        Args:
            audio_path (str): Path to the audio file
            text (str): Transcribed text
            duration (float): Duration of the audio in seconds
            word_count (int, optional): Number of words in the transcription
            
        Returns:
            bool: True if the transcription was added successfully, False otherwise
        """
        transcription = Transcription(
            audio_path=audio_path,
            text=text,
            duration=duration,
            word_count=word_count
        )
        
        return self.repository.add(transcription)
    
    def get_all_transcriptions(self) -> List[Transcription]:
        """
        Get all transcriptions.
        
        Returns:
            List[Transcription]: List of all transcriptions
        """
        return self.repository.get_all()
    
    def get_transcription_by_id(self, transcription_id: int) -> Optional[Transcription]:
        """
        Get a transcription by its ID.
        
        Args:
            transcription_id (int): ID of the transcription to get
            
        Returns:
            Optional[Transcription]: The transcription if found, None otherwise
        """
        return self.repository.get_by_id(transcription_id)
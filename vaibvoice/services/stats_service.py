"""
Service for statistics operations.
Implements business logic for transcription statistics.
"""

from typing import Dict, Any, Optional

from vaibvoice.db.repositories.transcription_repository import TranscriptionRepository

class StatsService:
    """
    Service for statistics operations.
    Implements business logic for transcription statistics.
    
    Attributes:
        repository (TranscriptionRepository): Repository for transcription data access
    """
    
    def __init__(self, repository: Optional[TranscriptionRepository] = None):
        """
        Initialize the StatsService with the specified repository.
        
        Args:
            repository (TranscriptionRepository, optional): Repository for transcription data access
        """
        self.repository = repository or TranscriptionRepository()
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the transcriptions.
        
        Returns:
            Dict[str, Any]: Dictionary containing statistics
        """
        return self.repository.get_stats()
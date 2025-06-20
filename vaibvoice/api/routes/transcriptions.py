"""
API routes for transcriptions.
Defines FastAPI routes for transcription operations.
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List

from vaibvoice.api.models.transcription import TranscriptionResponse
from vaibvoice.services.transcription_service import TranscriptionService

router = APIRouter()

@router.get("/transcriptions", response_model=List[TranscriptionResponse])
async def get_transcriptions(
    service: TranscriptionService = Depends(lambda: TranscriptionService())
):
    """
    Get all transcriptions.
    
    Returns:
        List[TranscriptionResponse]: List of all transcriptions
    """
    transcriptions = service.get_all_transcriptions()
    
    # Convert domain models to API response models
    response = []
    for t in transcriptions:
        response.append(TranscriptionResponse(
            id=t.id,
            timestamp=t.timestamp.isoformat(),
            audio_path=t.audio_path,
            text=t.text,
            duration=t.duration,
            word_count=t.word_count
        ))
    
    return response

@router.get("/transcriptions/{transcription_id}", response_model=TranscriptionResponse)
async def get_transcription(
    transcription_id: int,
    service: TranscriptionService = Depends(lambda: TranscriptionService())
):
    """
    Get a transcription by ID.
    
    Args:
        transcription_id (int): ID of the transcription to get
        
    Returns:
        TranscriptionResponse: The transcription
        
    Raises:
        HTTPException: If the transcription is not found
    """
    transcription = service.get_transcription_by_id(transcription_id)
    
    if not transcription:
        raise HTTPException(status_code=404, detail="Transcription not found")
    
    return TranscriptionResponse(
        id=transcription.id,
        timestamp=transcription.timestamp.isoformat(),
        audio_path=transcription.audio_path,
        text=transcription.text,
        duration=transcription.duration,
        word_count=transcription.word_count
    )
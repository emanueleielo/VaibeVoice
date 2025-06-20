"""
API routes for statistics.
Defines FastAPI routes for statistics operations.
"""

from fastapi import APIRouter, Depends
from typing import Dict, Any

from vaibvoice.api.models.transcription import StatsResponse
from vaibvoice.services.stats_service import StatsService

router = APIRouter()

@router.get("/stats", response_model=StatsResponse)
async def get_stats(
    service: StatsService = Depends(lambda: StatsService())
):
    """
    Get statistics about the transcriptions.
    
    Returns:
        StatsResponse: Statistics about the transcriptions
    """
    stats = service.get_stats()
    
    return StatsResponse(
        totalTranscriptions=stats["totalTranscriptions"],
        totalDuration=stats["totalDuration"],
        totalWords=stats["totalWords"],
        avgWordsPerMinute=stats["avgWordsPerMinute"],
        todayStats=stats["todayStats"],
        recentTranscriptions=stats["recentTranscriptions"]
    )
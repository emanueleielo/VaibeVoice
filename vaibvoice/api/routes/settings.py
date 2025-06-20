"""
API routes for settings.
Defines FastAPI routes for settings operations.
"""

import os
import sys
import sqlite3
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv

from vaibvoice.api.models.settings import SettingsResponse, UpdateSettingsRequest
import vaibvoice.config as config
from vaibvoice.db.repositories.transcription_repository import TranscriptionRepository
from vaibvoice.db.repositories.settings_repository import SettingsRepository
from vaibvoice.models.settings import Settings

# Create router
router = APIRouter()


@router.get("/settings", response_model=SettingsResponse)
async def get_settings():
    """
    Get current settings.

    Returns:
        SettingsResponse: Current settings
    """
    # Get settings from the database
    repo = SettingsRepository()
    settings = repo.get()

    # Update config module with the latest settings
    config.RECORD_KEY = settings.record_key
    config.OPENAI_API_KEY = settings.openai_api_key
    config.WHISPER_MODEL = settings.transcription_model
    config.TRANSCRIPTION_LANGUAGE = settings.transcription_language
    config.LLM_MODEL = settings.llm_model
    config.START_SOUND = settings.start_sound
    config.END_SOUND = settings.end_sound

    return SettingsResponse(
        record_key=settings.record_key,
        openai_api_key=settings.openai_api_key,
        transcription_model=settings.transcription_model,
        transcription_language=settings.transcription_language,
        llm_model=settings.llm_model,
        start_sound=settings.start_sound,
        end_sound=settings.end_sound
    )


@router.post("/settings", response_model=SettingsResponse)
async def update_settings(settings_request: UpdateSettingsRequest):
    """
    Update settings.

    Args:
        settings_request (UpdateSettingsRequest): New settings

    Returns:
        SettingsResponse: Updated settings
    """
    try:
        # Get current settings from the database
        repo = SettingsRepository()
        current_settings = repo.get()

        # Update settings with new values
        current_settings.record_key = settings_request.record_key
        if settings_request.openai_api_key is not None:
            current_settings.openai_api_key = settings_request.openai_api_key
        if settings_request.transcription_model is not None:
            current_settings.transcription_model = settings_request.transcription_model
        if settings_request.transcription_language is not None:
            current_settings.transcription_language = settings_request.transcription_language
        if settings_request.llm_model is not None:
            current_settings.llm_model = settings_request.llm_model
        if settings_request.start_sound is not None:
            current_settings.start_sound = settings_request.start_sound
        if settings_request.end_sound is not None:
            current_settings.end_sound = settings_request.end_sound

        # Save updated settings to the database
        if not repo.save(current_settings):
            raise Exception("Failed to save settings to the database")

        # Update the config module values
        config.RECORD_KEY = current_settings.record_key
        config.OPENAI_API_KEY = current_settings.openai_api_key
        config.WHISPER_MODEL = current_settings.transcription_model
        config.TRANSCRIPTION_LANGUAGE = current_settings.transcription_language
        config.LLM_MODEL = current_settings.llm_model
        config.START_SOUND = current_settings.start_sound
        config.END_SOUND = current_settings.end_sound

        return SettingsResponse(
            record_key=current_settings.record_key,
            openai_api_key=current_settings.openai_api_key,
            transcription_model=current_settings.transcription_model,
            transcription_language=current_settings.transcription_language,
            llm_model=current_settings.llm_model,
            start_sound=current_settings.start_sound,
            end_sound=current_settings.end_sound
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update settings: {str(e)}")


@router.post("/settings/reset", response_model=SettingsResponse)
async def reset_settings():
    """
    Reset all settings to default values and clear the database.

    Returns:
        SettingsResponse: Default settings
    """
    try:
        # Reset settings to default values
        settings_repo = SettingsRepository()
        if not settings_repo.reset():
            raise Exception("Failed to reset settings to default values")

        # Get the default settings
        default_settings = settings_repo.get()

        # Update config module values
        config.RECORD_KEY = default_settings.record_key
        config.OPENAI_API_KEY = default_settings.openai_api_key
        config.WHISPER_MODEL = default_settings.transcription_model
        config.TRANSCRIPTION_LANGUAGE = default_settings.transcription_language
        config.LLM_MODEL = default_settings.llm_model
        config.START_SOUND = default_settings.start_sound
        config.END_SOUND = default_settings.end_sound

        # Clear transcriptions table
        transcription_repo = TranscriptionRepository()
        transcription_repo.execute_query("DELETE FROM transcriptions")

        return SettingsResponse(
            record_key=default_settings.record_key,
            openai_api_key=default_settings.openai_api_key,
            transcription_model=default_settings.transcription_model,
            transcription_language=default_settings.transcription_language,
            llm_model=default_settings.llm_model,
            start_sound=default_settings.start_sound,
            end_sound=default_settings.end_sound
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reset settings: {str(e)}")

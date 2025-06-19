import logging
import os
import openai
import pyautogui
from typing import Optional

def transcribe_audio_stream(audio_path):
    """
    Transcribe an audio file using the OpenAI API with streaming enabled.
    The transcription is streamed directly to the input as it's received.

    Args:
        audio_path (str): Path to the audio file to transcribe.

    Returns:
        str: The complete transcription text.
    """
    # Set up OpenAI API key
    openai.api_key = os.getenv("OPENAI_API_KEY")
    language = os.getenv("TRANSCRIPTION_LANGUAGE", "en")
    model = os.getenv("WHISPER_MODEL", "gpt-4o-transcribe")

    # Initialize variables to store the complete transcription
    full_transcription = ""

    try:
        # Open the audio file
        with open(audio_path, 'rb') as audio_file:
            # Create a streaming request to the OpenAI API
            stream = openai.audio.transcriptions.create(
                model=model,
                file=audio_file,
                language=language,
                stream=True
            )


            # Process the streaming response
            for event in stream:
                # Handle TranscriptionTextDeltaEvent
                if event.type == 'transcript.text.delta' and hasattr(event, 'delta'):
                    # Get the transcription delta
                    delta = event.delta
                    if delta:
                        # Type the delta directly to the input
                        pyautogui.write(delta)
                        # Append to the full transcription
                        full_transcription += delta
                # Handle TranscriptionTextDoneEvent
                elif event.type == 'transcript.text.done' and hasattr(event, 'text'):
                    # This event contains the complete transcription
                    # We already have the full text from the delta events, so we can just log it
                    print(f"Transcription complete: {event.text}")

            return full_transcription

    except Exception as e:
        print(f"Error during streaming transcription: {e}")
        return ""

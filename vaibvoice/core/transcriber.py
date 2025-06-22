"""
Core functionality for transcribing audio.
Provides functions for transcribing audio using the OpenAI API.
"""

import os
import openai
import pyautogui
import platform
import pyperclip
from typing import Optional

import vaibvoice.config as config
from vaibvoice.core.formatter import format_transcription

def transcribe_audio(audio_path: str, type_directly: bool = False) -> str:
    """
    Transcribe an audio file using the OpenAI API.

    Args:
        audio_path (str): Path to the audio file to transcribe
        type_directly (bool): Whether to type the transcription directly using pyautogui

    Returns:
        str: The transcription text
    """
    # Set up OpenAI API key
    openai.api_key = config.OPENAI_API_KEY

    # Initialize variables to store the complete transcription
    full_transcription = ""

    try:
        # Open the audio file
        with open(audio_path, 'rb') as audio_file:
            if config.WHISPER_MODEL == "whisper-1":
                # Whisper-1 does not support streaming
                response = openai.audio.transcriptions.create(
                    model=config.WHISPER_MODEL,
                    file=audio_file,
                    language=config.TRANSCRIPTION_LANGUAGE
                )
                if hasattr(response, "text"):
                    full_transcription = response.text
                else:
                    full_transcription = str(response)
            else:
                # Create a streaming request to the OpenAI API
                stream = openai.audio.transcriptions.create(
                    model=config.WHISPER_MODEL,
                    file=audio_file,
                    language=config.TRANSCRIPTION_LANGUAGE,
                    stream=True
                )

                # Process the streaming response
                for event in stream:
                    # Handle TranscriptionTextDeltaEvent
                    if event.type == 'transcript.text.delta' and hasattr(event, 'delta'):
                        # Get the transcription delta
                        delta = event.delta
                        if delta:
                            # Append to the full transcription
                            full_transcription += delta
                    # Handle TranscriptionTextDoneEvent
                    elif event.type == 'transcript.text.done' and hasattr(event, 'text'):
                        # This event contains the complete transcription
                        print(f"Transcription complete: {event.text}")

            # Format the transcription
            formatted_transcription = format_transcription(full_transcription)

            # If type_directly is True, we need to replace the text in the textbox with the formatted text
            if type_directly:
                # Select all text (Ctrl+A on Windows/Linux, Command+A on macOS)
                if platform.system() == 'Darwin':  # macOS
                    pyautogui.hotkey('command', 'a')
                else:  # Windows or Linux
                    pyautogui.hotkey('ctrl', 'a')

                # Delete the selected text
                # After selecting all text, we can use either delete or backspace
                # Using backspace is more reliable across different operating systems and contexts
                pyautogui.press('backspace')

                # Copy the formatted text to the clipboard
                pyperclip.copy(formatted_transcription)

                # Paste the text using keyboard shortcut
                if platform.system() == 'Darwin':  # macOS
                    pyautogui.hotkey('command', 'v')
                else:  # Windows or Linux
                    pyautogui.hotkey('ctrl', 'v')

            return formatted_transcription

    except Exception as e:
        print(f"Error during streaming transcription: {e}")
        return ""

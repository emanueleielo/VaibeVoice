"""
Menu module for VaibVoice.
Provides functionality for displaying menus and handling user input.
"""

import sys
from datetime import datetime

from src.audio.recorder import AudioRecorder
from src.db.history import TranscriptionHistory
from src.api.transcription import transcribe_audio_stream
from src.typing.animation import type_with_animation

def record_and_transcribe():
    """
    Record audio from the microphone, transcribe it, and save to history.
    """
    recorder = AudioRecorder()

    print("\nPress [ENTER] to start recording...")
    input()

    if not recorder.start_recording():
        print("Failed to start recording.")
        return

    print("Recording... Press [ENTER] to stop.")
    input()

    audio_path, duration = recorder.stop_recording()

    if not audio_path:
        print("No audio was recorded.")
        return

    print("\nTranscribing audio...")
    transcription = transcribe_audio_stream(audio_path)

    print("\nTranscription:")
    print(transcription)

    # Always save the transcription to history
    history = TranscriptionHistory()
    if history.add_transcription(audio_path, transcription, duration):
        print("Transcription saved to history.")
    else:
        print("Failed to save transcription to history.")

    # Type the transcription with animation
    print("\nTyping transcription with animation...")
    type_with_animation(transcription)

def view_history():
    """
    Display the transcription history.
    """
    history = TranscriptionHistory()
    transcriptions = history.get_all_transcriptions()

    if not transcriptions:
        print("\nNo transcriptions in history.")
        return

    print("\nTranscription History:")
    print("-" * 80)

    for t in transcriptions:
        id, timestamp, audio_path, text, duration, word_count = t

        # Format the timestamp for display
        try:
            # Parse ISO format timestamp
            dt = datetime.fromisoformat(timestamp)
            formatted_date = dt.strftime("%Y-%m-%d %H:%M:%S")
        except:
            formatted_date = timestamp

        # Create a preview of the text (first 50 characters)
        text_preview = text[:50] + "..." if len(text) > 50 else text

        print(f"Date: {formatted_date}")
        print(f"Duration: {duration:.2f} seconds")
        print(f"Text: {text_preview}")
        print(f"Audio file: {audio_path}")
        print("-" * 80)

def main_menu():
    """
    Display the main menu and handle user input.
    """
    while True:
        print("\nVaibVoice - Main Menu")
        print("1. Record and transcribe audio")
        print("2. View history")
        print("3. Exit")

        choice = input("\nEnter your choice (1-3): ")

        if choice == '1':
            record_and_transcribe()
        elif choice == '2':
            view_history()
        elif choice == '3':
            print("Exiting VaibVoice. Goodbye!")
            sys.exit(0)
        else:
            print("Invalid choice. Please enter a number between 1 and 3.")
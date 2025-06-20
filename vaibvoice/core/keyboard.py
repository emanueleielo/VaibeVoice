"""
Core functionality for keyboard recording.
Provides functions for recording audio using keyboard controls.
"""

import sys
import time
import platform
from pynput import keyboard

from vaibvoice.core.recorder import AudioRecorder
from vaibvoice.core.transcriber import transcribe_audio
from vaibvoice.services.transcription_service import TranscriptionService
import vaibvoice.config as config

def key_recording():
    """
    Record audio when a specific key is pressed and transcribe when released.
    Uses Ctrl key by default, but can be configured in the .env file.
    """
    recorder = AudioRecorder()
    service = TranscriptionService()
    recording_in_progress = False

    # Determine the key to use for recording based on configuration
    if config.RECORD_KEY.lower() == "ctrl":
        RECORD_KEY_OBJ = keyboard.Key.ctrl
        print("\nUsing Ctrl key for recording.")
    else:
        # Try to use the specified key, fallback to Ctrl if not valid
        try:
            RECORD_KEY_OBJ = getattr(keyboard.Key, config.RECORD_KEY.lower())
        except AttributeError:
            RECORD_KEY_OBJ = keyboard.Key.ctrl
            print(f"\nInvalid key '{config.RECORD_KEY}'. Using Ctrl key for recording.")

    def on_press(key):
        nonlocal recording_in_progress
        try:
            if key == RECORD_KEY_OBJ:
                if not recording_in_progress:
                    recording_in_progress = True
                    print("\nRecording key pressed. Starting recording...")
                    recorder.start_recording()
        except AttributeError:
            pass

    def on_release(key):
        nonlocal recording_in_progress
        try:
            if key == RECORD_KEY_OBJ:
                if recording_in_progress:
                    recording_in_progress = False
                    print("\nRecording key released. Stopping recording...")
                    audio_path, duration = recorder.stop_recording()

                    if not audio_path:
                        print("No audio was recorded.")
                        return

                    print("\nTranscribing audio and typing directly...")
                    transcription = transcribe_audio(audio_path, type_directly=True)

                    print("\nTranscription:")
                    print(transcription)

                    # Save the transcription to history
                    if service.add_transcription(audio_path, transcription, duration):
                        print("Transcription saved to history.")
                    else:
                        print("Failed to save transcription to history.")
        except AttributeError:
            pass

    # Start listening for key events
    listener = keyboard.Listener(on_press=on_press, on_release=on_release)
    listener.start()

    print("\nVaibVoice is running.")
    print(f"Press and hold the {config.RECORD_KEY} key to record, release to transcribe.")
    print("The transcription will be automatically saved to history.")
    print("The text will be typed into the currently selected input box.")
    print("Press Ctrl+C to exit.")

    try:
        # Keep the program running
        while True:
            time.sleep(0.1)
    except KeyboardInterrupt:
        print("\nExiting VaibVoice. Goodbye!")
        listener.stop()
        sys.exit(0)

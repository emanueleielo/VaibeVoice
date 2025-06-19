"""
Keyboard recorder module for VaibVoice.
Provides functionality for recording audio using keyboard controls.
"""

import sys
import time
import platform
from pynput import keyboard

from src.audio.recorder import AudioRecorder
from src.db.history import TranscriptionHistory
from src.api.transcription import transcribe_audio_stream

def key_recording():
    """
    Record audio when a specific key is pressed and transcribe when released.
    Uses Fn key on macOS and Ctrl key as fallback.
    """
    recorder = AudioRecorder()
    recording_in_progress = False

    # Determine the key to use for recording based on platform
    system = platform.system()
    if system == "Darwin":  # macOS
        # On macOS, we'll try to use the Fn key, but it's not directly accessible
        # So we'll use the Ctrl key as a fallback
        RECORD_KEY = keyboard.Key.ctrl
        print("\nUsing Ctrl key for recording (Fn key not directly accessible).")
    else:
        # On other platforms, use Ctrl key
        RECORD_KEY = keyboard.Key.ctrl
        print("\nUsing Ctrl key for recording.")

    def on_press(key):
        nonlocal recording_in_progress
        try:
            if key == RECORD_KEY:
                if not recording_in_progress:
                    recording_in_progress = True
                    print("\nRecording key pressed. Starting recording...")
                    recorder.start_recording()
        except AttributeError:
            pass

    def on_release(key):
        nonlocal recording_in_progress
        try:
            if key == RECORD_KEY:
                if recording_in_progress:
                    recording_in_progress = False
                    print("\nRecording key released. Stopping recording...")
                    audio_path, duration = recorder.stop_recording()

                    if not audio_path:
                        print("No audio was recorded.")
                        return

                    print("\nTranscribing audio and typing directly...")
                    transcription = transcribe_audio_stream(audio_path)

                    print("\nTranscription:")
                    print(transcription)

                    # Always save the transcription to history
                    history = TranscriptionHistory()
                    if history.add_transcription(audio_path, transcription, duration):
                        print("Transcription saved to history.")
                    else:
                        print("Failed to save transcription to history.")
        except AttributeError:
            pass

    # Start listening for key events
    listener = keyboard.Listener(on_press=on_press, on_release=on_release)
    listener.start()

    print("\nVaibVoice is running.")
    print("Press and hold the Ctrl key to record, release to transcribe.")
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

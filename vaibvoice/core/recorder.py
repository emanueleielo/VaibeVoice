"""
Core functionality for recording audio.
Provides classes for recording audio from the microphone.
"""

import os
import time
import datetime
import sounddevice as sd
import soundfile as sf
import numpy as np
from typing import Tuple, Optional
import threading

import vaibvoice.config as config

def play_sound(sound_file: str):
    """
    Play a sound file.

    Args:
        sound_file (str): Path to the sound file
    """
    if not sound_file or sound_file == "none":
        return

    try:
        # Check if the file exists
        if not os.path.isfile(sound_file):
            # Try to find the file in the current directory or gui/public
            if os.path.isfile(os.path.join("gui", "public", sound_file)):
                sound_file = os.path.join("gui", "public", sound_file)
            else:
                print(f"Sound file not found: {sound_file}")
                return

        # Load the sound file
        data, samplerate = sf.read(sound_file)

        # Play the sound in a separate thread to avoid blocking
        def _play():
            try:
                sd.play(data, samplerate)
                sd.wait()
            except Exception as e:
                print(f"Error playing sound: {str(e)}")

        threading.Thread(target=_play).start()
    except Exception as e:
        print(f"Error playing sound: {str(e)}")

class AudioRecorder:
    """
    Class for recording audio from the microphone and saving it as WAV files.

    Attributes:
        sample_rate (int): The sample rate for recording
        channels (int): Number of audio channels
        recording (bool): Flag indicating if recording is in progress
        frames (list): List to store recorded audio frames
    """

    def __init__(self, sample_rate: int = None, channels: int = None):
        """
        Initialize the AudioRecorder with specified parameters.

        Args:
            sample_rate (int): The sample rate for recording
            channels (int): Number of audio channels
        """
        self.sample_rate = sample_rate if sample_rate is not None else config.SAMPLE_RATE
        self.channels = channels if channels is not None else config.CHANNELS
        self.recording = False
        self.frames = []

        # Ensure audio_temp directory exists
        os.makedirs(config.AUDIO_TEMP_DIR, exist_ok=True)

    def start_recording(self) -> bool:
        """
        Start recording audio from the microphone.

        Returns:
            bool: True if recording started successfully, False otherwise
        """
        if self.recording:
            print("Recording is already in progress.")
            return False

        try:
            self.frames = []
            self.recording = True
            self.start_time = time.time()

            def callback(indata, frames, time, status):
                """Callback function for the InputStream."""
                if status:
                    print(f"Stream status: {status}")
                if self.recording:
                    self.frames.append(indata.copy())

            # Start the input stream
            self.stream = sd.InputStream(
                samplerate=self.sample_rate,
                channels=self.channels,
                callback=callback
            )
            self.stream.start()

            # Play the start sound
            play_sound(config.START_SOUND)

            print("Recording started...")
            return True

        except Exception as e:
            self.recording = False
            print(f"Error starting recording: {str(e)}")

            # Handle specific errors
            if "Invalid input device" in str(e):
                print("Microphone not found or not accessible.")
            elif "Permission denied" in str(e):
                print("Permission denied when accessing the microphone.")
            else:
                print("An unexpected error occurred while accessing the microphone.")

            return False

    def stop_recording(self) -> Tuple[Optional[str], float]:
        """
        Stop recording, save the audio as a WAV file, and return the file path and duration.

        Returns:
            tuple: (file_path, duration_seconds) if successful, (None, 0) otherwise
        """
        if not self.recording:
            print("No recording in progress.")
            return None, 0

        try:
            # Stop recording
            self.recording = False
            self.stream.stop()
            self.stream.close()
            duration = time.time() - self.start_time

            # Check if any frames were recorded
            if not self.frames:
                print("No audio data was recorded.")
                return None, 0

            # Concatenate all recorded frames
            audio_data = np.concatenate(self.frames, axis=0)

            # Generate a filename with timestamp
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            file_path = os.path.join(config.AUDIO_TEMP_DIR, f"recording_{timestamp}.wav")

            # Save the audio data to a WAV file
            sf.write(file_path, audio_data, self.sample_rate)
            print(f"Recording saved to {file_path}")

            # Play the end sound
            play_sound(config.END_SOUND)

            return file_path, duration

        except Exception as e:
            print(f"Error stopping recording: {str(e)}")
            return None, 0

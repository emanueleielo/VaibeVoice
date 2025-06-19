"""
Audio recorder module for VaibVoice.
Provides functionality to record audio from the microphone and save it as WAV files.
"""

import os
import time
import datetime
import sounddevice as sd
import soundfile as sf
import numpy as np

class AudioRecorder:
    """
    Class for recording audio from the microphone and saving it as WAV files.
    
    Attributes:
        sample_rate (int): The sample rate for recording (default: 44100 Hz)
        channels (int): Number of audio channels (default: 1 for mono)
        recording (bool): Flag indicating if recording is in progress
        frames (list): List to store recorded audio frames
    """
    
    def __init__(self, sample_rate=44100, channels=1):
        """
        Initialize the AudioRecorder with specified parameters.
        
        Args:
            sample_rate (int): The sample rate for recording (default: 44100 Hz)
            channels (int): Number of audio channels (default: 1 for mono)
        """
        self.sample_rate = sample_rate
        self.channels = channels
        self.recording = False
        self.frames = []
        
        # Ensure audio_temp directory exists
        os.makedirs("audio_temp", exist_ok=True)
    
    def start_recording(self):
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
    
    def stop_recording(self):
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
            file_path = os.path.join("audio_temp", f"recording_{timestamp}.wav")
            
            # Save the audio data to a WAV file
            sf.write(file_path, audio_data, self.sample_rate)
            print(f"Recording saved to {file_path}")
            
            return file_path, duration
            
        except Exception as e:
            print(f"Error stopping recording: {str(e)}")
            return None, 0
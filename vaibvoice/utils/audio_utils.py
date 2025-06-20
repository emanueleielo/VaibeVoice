"""
Utility functions for audio processing.
"""

import os
import soundfile as sf
import numpy as np
from typing import Tuple, Optional

import vaibvoice.config as config

def get_audio_duration(audio_path: str) -> float:
    """
    Get the duration of an audio file in seconds.

    Args:
        audio_path (str): Path to the audio file

    Returns:
        float: Duration of the audio file in seconds
    """
    try:
        info = sf.info(audio_path)
        return info.duration
    except Exception as e:
        print(f"Error getting audio duration: {str(e)}")
        return 0.0

def get_audio_sample_rate(audio_path: str) -> int:
    """
    Get the sample rate of an audio file.

    Args:
        audio_path (str): Path to the audio file

    Returns:
        int: Sample rate of the audio file
    """
    try:
        info = sf.info(audio_path)
        return info.samplerate
    except Exception as e:
        print(f"Error getting audio sample rate: {str(e)}")
        return config.SAMPLE_RATE

def convert_audio_format(audio_path: str, output_format: str = "wav") -> Optional[str]:
    """
    Convert an audio file to a different format.

    Args:
        audio_path (str): Path to the audio file
        output_format (str): Output format (default: "wav")

    Returns:
        Optional[str]: Path to the converted audio file, or None if conversion failed
    """
    try:
        # Get the base name and directory
        base_name = os.path.basename(audio_path)
        base_name_without_ext = os.path.splitext(base_name)[0]

        # Create the output path
        output_path = os.path.join(config.AUDIO_TEMP_DIR, f"{base_name_without_ext}.{output_format}")

        # Read the audio file
        data, samplerate = sf.read(audio_path)

        # Write the audio file in the new format
        sf.write(output_path, data, samplerate)

        return output_path
    except Exception as e:
        print(f"Error converting audio format: {str(e)}")
        return None

def normalize_audio(audio_path: str) -> Optional[str]:
    """
    Normalize the volume of an audio file.

    Args:
        audio_path (str): Path to the audio file

    Returns:
        Optional[str]: Path to the normalized audio file, or None if normalization failed
    """
    try:
        # Get the base name and directory
        base_name = os.path.basename(audio_path)
        base_name_without_ext = os.path.splitext(base_name)[0]

        # Create the output path
        output_path = os.path.join(config.AUDIO_TEMP_DIR, f"{base_name_without_ext}_normalized.wav")

        # Read the audio file
        data, samplerate = sf.read(audio_path)

        # Normalize the audio
        normalized_data = data / np.max(np.abs(data))

        # Write the normalized audio file
        sf.write(output_path, normalized_data, samplerate)

        return output_path
    except Exception as e:
        print(f"Error normalizing audio: {str(e)}")
        return None

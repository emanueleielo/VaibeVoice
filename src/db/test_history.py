"""
Test script for the TranscriptionHistory class.
"""

import os
import sys
from history import TranscriptionHistory

def test_transcription_history():
    """Test the TranscriptionHistory class functionality."""
    # Use a test database file
    test_db_path = "test_transcription_history.db"
    
    # Remove the test database if it exists
    if os.path.exists(test_db_path):
        os.remove(test_db_path)
    
    # Create a new TranscriptionHistory instance
    history = TranscriptionHistory(test_db_path)
    
    # Test adding a transcription
    audio_path = "audio_temp/recording_20230601_120000.wav"
    text = "This is a test transcription."
    duration = 5.5
    
    success = history.add_transcription(audio_path, text, duration)
    print(f"Added transcription: {success}")
    
    # Test adding another transcription with explicit word count
    audio_path2 = "audio_temp/recording_20230601_120030.wav"
    text2 = "This is another test transcription with more words."
    duration2 = 8.2
    word_count2 = 9  # Explicitly count the words
    
    success2 = history.add_transcription(audio_path2, text2, duration2, word_count2)
    print(f"Added second transcription: {success2}")
    
    # Test retrieving all transcriptions
    transcriptions = history.get_all_transcriptions()
    print(f"Retrieved {len(transcriptions)} transcriptions:")
    
    for t in transcriptions:
        print(f"ID: {t[0]}, Timestamp: {t[1]}, Audio: {t[2]}, Text: {t[3]}, Duration: {t[4]}s, Words: {t[5]}")
    
    # Clean up - remove the test database
    if os.path.exists(test_db_path):
        os.remove(test_db_path)
        print(f"Removed test database: {test_db_path}")

if __name__ == "__main__":
    test_transcription_history()
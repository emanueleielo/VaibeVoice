"""
History module for VaibVoice.
Provides functionality to save and retrieve transcription history using SQLite.
"""

import os
import sqlite3
import datetime
from typing import List, Tuple, Optional

class TranscriptionHistory:
    """
    Class for managing transcription history in a SQLite database.
    
    Attributes:
        db_path (str): Path to the SQLite database file
    """
    
    def __init__(self, db_path: str = "transcription_history.db"):
        """
        Initialize the TranscriptionHistory with the specified database path.
        
        Args:
            db_path (str): Path to the SQLite database file (default: "transcription_history.db")
        """
        self.db_path = db_path
        self._initialize_db()
    
    def _initialize_db(self):
        """
        Initialize the database by creating the necessary tables if they don't exist.
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        # Create the transcriptions table if it doesn't exist
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS transcriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            audio_path TEXT NOT NULL,
            text TEXT NOT NULL,
            duration REAL NOT NULL,
            word_count INTEGER NOT NULL
        )
        ''')
        
        conn.commit()
        conn.close()
    
    def add_transcription(self, audio_path: str, text: str, duration: float, word_count: Optional[int] = None) -> bool:
        """
        Add a new transcription to the history database.
        
        Args:
            audio_path (str): Path to the audio file
            text (str): Transcribed text
            duration (float): Duration of the audio in seconds
            word_count (int, optional): Number of words in the transcription. 
                                       If None, it will be calculated from the text.
        
        Returns:
            bool: True if the transcription was added successfully, False otherwise
        """
        try:
            # Calculate word count if not provided
            if word_count is None:
                word_count = len(text.split())
            
            # Get current timestamp
            timestamp = datetime.datetime.now().isoformat()
            
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute(
                "INSERT INTO transcriptions (timestamp, audio_path, text, duration, word_count) VALUES (?, ?, ?, ?, ?)",
                (timestamp, audio_path, text, duration, word_count)
            )
            
            conn.commit()
            conn.close()
            
            return True
        except Exception as e:
            print(f"Error adding transcription to history: {str(e)}")
            return False
    
    def get_all_transcriptions(self) -> List[Tuple]:
        """
        Retrieve all transcriptions from the history database.
        
        Returns:
            List[Tuple]: List of tuples containing (id, timestamp, audio_path, text, duration, word_count)
        """
        try:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            
            cursor.execute("SELECT * FROM transcriptions ORDER BY timestamp DESC")
            transcriptions = cursor.fetchall()
            
            conn.close()
            
            return transcriptions
        except Exception as e:
            print(f"Error retrieving transcriptions from history: {str(e)}")
            return []
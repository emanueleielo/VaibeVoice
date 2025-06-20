"""
Repository for transcription data access.
Implements the Repository pattern for transcription data.
"""

import datetime
from typing import List, Optional, Tuple

from vaibvoice.db.base import Database
from vaibvoice.models.transcription import Transcription

class TranscriptionRepository(Database):
    """
    Repository for transcription data access.
    Implements the Repository pattern for transcription data.

    Attributes:
        db_path (str): Path to the SQLite database file
    """

    def __init__(self, db_path: str = None):
        """
        Initialize the TranscriptionRepository with the specified database path.

        Args:
            db_path (str, optional): Path to the SQLite database file
        """
        super().__init__(db_path)
        self.initialize_db()

    def initialize_db(self):
        """
        Initialize the database by creating the necessary tables if they don't exist.
        Always creates the table if it doesn't exist, regardless of whether the database file exists.
        """
        # Always create the table if it doesn't exist
        query = '''
        CREATE TABLE IF NOT EXISTS transcriptions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            audio_path TEXT NOT NULL,
            text TEXT NOT NULL,
            duration REAL NOT NULL,
            word_count INTEGER NOT NULL
        )
        '''
        self.execute_query(query)

    def add(self, transcription: Transcription) -> bool:
        """
        Add a new transcription to the database.

        Args:
            transcription (Transcription): The transcription to add

        Returns:
            bool: True if the transcription was added successfully, False otherwise
        """
        query = '''
        INSERT INTO transcriptions (timestamp, audio_path, text, duration, word_count)
        VALUES (?, ?, ?, ?, ?)
        '''
        params = (
            transcription.timestamp.isoformat(),
            transcription.audio_path,
            transcription.text,
            transcription.duration,
            transcription.word_count
        )

        try:
            self.execute_query(query, params)
            return True
        except Exception as e:
            print(f"Error adding transcription: {str(e)}")
            return False

    def get_all(self) -> List[Transcription]:
        """
        Get all transcriptions from the database.

        Returns:
            List[Transcription]: List of all transcriptions
        """
        query = "SELECT * FROM transcriptions ORDER BY timestamp DESC"
        rows = self.execute_query(query, fetch=True)

        transcriptions = []
        for row in rows:
            transcription = Transcription(
                id=row[0],
                timestamp=datetime.datetime.fromisoformat(row[1].split('.')[0]),
                audio_path=row[2],
                text=row[3],
                duration=row[4],
                word_count=row[5]
            )
            transcriptions.append(transcription)

        return transcriptions

    def get_by_id(self, transcription_id: int) -> Optional[Transcription]:
        """
        Get a transcription by its ID.

        Args:
            transcription_id (int): ID of the transcription to get

        Returns:
            Optional[Transcription]: The transcription if found, None otherwise
        """
        query = "SELECT * FROM transcriptions WHERE id = ?"
        row = self.execute_query(query, (transcription_id,), fetch=True, fetch_all=False)

        if row:
            return Transcription(
                id=row[0],
                timestamp=datetime.datetime.fromisoformat(row[1].split('.')[0]),
                audio_path=row[2],
                text=row[3],
                duration=row[4],
                word_count=row[5]
            )

        return None

    def get_stats(self) -> dict:
        """
        Get statistics about the transcriptions.

        Returns:
            dict: Dictionary containing statistics
        """
        # Get total counts
        count_query = "SELECT COUNT(*), SUM(duration), SUM(word_count) FROM transcriptions"
        count_row = self.execute_query(count_query, fetch=True, fetch_all=False)

        total_transcriptions = count_row[0] if count_row and count_row[0] else 0
        total_duration = count_row[1] if count_row and count_row[1] else 0
        total_words = count_row[2] if count_row and count_row[2] else 0

        # Calculate average words per minute
        avg_words_per_minute = int((total_words / total_duration) * 60) if total_duration > 0 else 0

        # Get today's stats
        today_query = "SELECT COUNT(*), SUM(duration), SUM(word_count) FROM transcriptions WHERE date(timestamp) = date('now')"
        today_row = self.execute_query(today_query, fetch=True, fetch_all=False)

        today_count = today_row[0] if today_row and today_row[0] else 0
        today_duration = today_row[1] if today_row and today_row[1] else 0
        today_words = today_row[2] if today_row and today_row[2] else 0

        # Get recent transcriptions
        recent_query = "SELECT * FROM transcriptions ORDER BY timestamp DESC LIMIT 3"
        recent_rows = self.execute_query(recent_query, fetch=True)

        recent_transcriptions = []
        if recent_rows:  # Check if recent_rows is not None
            for row in recent_rows:
                recent_transcriptions.append({
                    'id': row[0],
                    'timestamp': row[1],
                    'text': row[3],
                    'duration': row[4],
                    'words': row[5]
                })

        return {
            'totalTranscriptions': total_transcriptions,
            'totalDuration': int(total_duration / 60),  # Convert to minutes
            'totalWords': total_words,
            'avgWordsPerMinute': avg_words_per_minute,
            'todayStats': {
                'transcriptions': today_count,
                'duration': int(today_duration / 60),  # Convert to minutes
                'words': today_words
            },
            'recentTranscriptions': recent_transcriptions
        }

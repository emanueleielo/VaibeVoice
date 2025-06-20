"""
Repository for settings data access.
Implements the Repository pattern for settings data.
"""

from typing import Optional

from vaibvoice.db.base import Database
from vaibvoice.models.settings import Settings

class SettingsRepository(Database):
    """
    Repository for settings data access.
    Implements the Repository pattern for settings data.

    Attributes:
        db_path (str): Path to the SQLite database file
    """

    def __init__(self, db_path: str = None):
        """
        Initialize the SettingsRepository with the specified database path.

        Args:
            db_path (str, optional): Path to the SQLite database file
        """
        super().__init__(db_path)
        self.initialize_db()

    def initialize_db(self):
        """
        Initialize the database by creating the necessary tables if they don't exist.
        Always checks if the settings table exists and creates it if it doesn't.

        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Always create tables if they don't exist
            query = '''
     CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY,
    record_key TEXT NOT NULL,
    openai_api_key TEXT,
    transcription_model TEXT NOT NULL,
    transcription_language TEXT,
    llm_model TEXT NOT NULL,
    start_sound TEXT NOT NULL,
    end_sound TEXT NOT NULL
)
            '''
            result = self.execute_query(query)
            if result is None:
                print("Error creating settings table.")
                return False

            # Check if settings record exists, if not create it with default values
            check_query = "SELECT COUNT(*) FROM settings WHERE id = 1"
            count = self.execute_query(check_query, fetch=True, fetch_all=False)

            # Handle case where execute_query returns None (error occurred)
            if count is None:
                print("Error checking if settings record exists. Creating default settings.")
                return self._insert_default_settings()

            # If count is not None, proceed normally
            if count[0] == 0:
                return self._insert_default_settings()

            return True
        except Exception as e:
            print(f"Error initializing database: {str(e)}")
            return False

    def get(self) -> Settings:
        """
        Get the current settings from the database.

        Returns:
            Settings: The current settings
        """
        try:
            # Ensure the settings table exists
            if not self.initialize_db():
                print("Failed to initialize database. Returning default settings.")
                return Settings()

            query = "SELECT * FROM settings WHERE id = 1"
            row = self.execute_query(query, fetch=True, fetch_all=False)

            if row:
                return Settings(
                    id=row[0],
                    record_key=row[1],
                    openai_api_key=row[2],
                    transcription_model=row[3],
                    transcription_language=row[4],
                    llm_model=row[5],
                    start_sound=row[6],
                    end_sound=row[7]
                )

            # If no settings found, create and return default settings
            default_settings = Settings()
            if not self._insert_default_settings():
                print("Failed to insert default settings. Returning default settings object.")
            return default_settings
        except Exception as e:
            print(f"Error getting settings: {str(e)}")
            # Return default settings if there's an error
            return Settings()

    def save(self, settings: Settings) -> bool:
        """
        Save settings to the database.

        Args:
            settings (Settings): The settings to save

        Returns:
            bool: True if the settings were saved successfully, False otherwise
        """
        try:
            # Ensure the settings table exists
            if not self.initialize_db():
                print("Failed to initialize database. Cannot save settings.")
                return False

            # Check if settings record exists
            check_query = "SELECT COUNT(*) FROM settings WHERE id = 1"
            count_result = self.execute_query(check_query, fetch=True, fetch_all=False)

            # Handle case where execute_query returns None (error occurred)
            if count_result is None:
                print("Error checking if settings record exists. Cannot save settings.")
                return False

            count = count_result[0]

            if count == 0:
                # Insert new settings
                query = '''
                INSERT INTO settings (id, record_key, openai_api_key, transcription_model, 
                                     transcription_language, llm_model, start_sound, end_sound)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                '''
            else:
                # Update existing settings
                query = '''
                UPDATE settings SET 
                    record_key = ?, 
                    openai_api_key = ?, 
                    transcription_model = ?, 
                    transcription_language = ?, 
                    llm_model = ?, 
                    start_sound = ?, 
                    end_sound = ?
                WHERE id = 1
                '''

            params = (
                settings.record_key,
                settings.openai_api_key,
                settings.transcription_model,
                settings.transcription_language,
                settings.llm_model,
                settings.start_sound,
                settings.end_sound
            )

            if count == 0:
                params = (1,) + params

            result = self.execute_query(query, params)
            if result is None:
                print("Error executing query to save settings.")
                return False

            return True
        except Exception as e:
            print(f"Error saving settings: {str(e)}")
            return False

    def _insert_default_settings(self):
        """
        Insert default settings directly into the database.
        This is a private helper method to avoid circular dependencies.

        Returns:
            bool: True if successful, False otherwise
        """
        try:
            default_settings = Settings()
            query = '''
            INSERT OR REPLACE INTO settings (
                id, record_key, openai_api_key, transcription_model, 
                transcription_language, llm_model, start_sound, end_sound
            ) VALUES (1, ?, ?, ?, ?, ?, ?, ?)
            '''
            params = (
                default_settings.record_key,
                default_settings.openai_api_key,
                default_settings.transcription_model,
                default_settings.transcription_language,
                default_settings.llm_model,
                default_settings.start_sound,
                default_settings.end_sound
            )
            result = self.execute_query(query, params)
            if result is None:
                print("Error executing query to insert default settings.")
                return False
            return True
        except Exception as e:
            print(f"Error inserting default settings: {str(e)}")
            return False

    def reset(self) -> bool:
        """
        Reset settings to default values.

        Returns:
            bool: True if the settings were reset successfully, False otherwise
        """
        try:
            # Directly insert default settings without calling save
            self._insert_default_settings()
            return True
        except Exception as e:
            print(f"Error resetting settings: {str(e)}")
            return False

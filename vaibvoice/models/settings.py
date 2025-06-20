"""
Domain models for settings.
"""

from typing import Optional

class Settings:
    """
    Domain model for application settings.

    Attributes:
        id (int): Unique identifier for the settings (always 1 as we only have one settings record)
        record_key (str): Key used for recording
        openai_api_key (str): OpenAI API key
        transcription_model (str): Model used for transcription
        transcription_language (str): Language used for transcription
        llm_model (str): Model used for LLM
        start_sound (str): Sound played when recording starts
        end_sound (str): Sound played when recording ends
    """

    def __init__(
        self,
        id: int = 1,
        record_key: str = "ctrl",
        openai_api_key: Optional[str] = None,
        transcription_model: str = "gpt-4o-transcribe",
        transcription_language: Optional[str] = None,
        llm_model: str = "gpt-4o-mini",
        start_sound: str = "beep.mp3",
        end_sound: str = "stop.mp3"
    ):
        """
        Initialize a Settings object.

        Args:
            id (int): Unique identifier for the settings (always 1)
            record_key (str): Key used for recording
            openai_api_key (str, optional): OpenAI API key
            transcription_model (str): Model used for transcription
            transcription_language (str, optional): Language used for transcription
            llm_model (str): Model used for LLM
            start_sound (str): Sound played when recording starts
            end_sound (str): Sound played when recording ends
        """
        self.id = id
        self.record_key = record_key
        self.openai_api_key = openai_api_key
        self.transcription_model = transcription_model
        self.transcription_language = transcription_language
        self.llm_model = llm_model
        self.start_sound = start_sound
        self.end_sound = end_sound

    def to_dict(self):
        """
        Convert the Settings object to a dictionary.

        Returns:
            dict: Dictionary representation of the Settings
        """
        return {
            "id": self.id,
            "record_key": self.record_key,
            "openai_api_key": self.openai_api_key,
            "transcription_model": self.transcription_model,
            "transcription_language": self.transcription_language,
            "llm_model": self.llm_model,
            "start_sound": self.start_sound,
            "end_sound": self.end_sound
        }

    @classmethod
    def from_dict(cls, data: dict):
        """
        Create a Settings object from a dictionary.

        Args:
            data (dict): Dictionary containing settings data

        Returns:
            Settings: A new Settings object
        """
        return cls(
            id=data.get("id", 1),
            record_key=data.get("record_key", "ctrl"),
            openai_api_key=data.get("openai_api_key"),
            transcription_model=data.get("transcription_model", "gpt-4o-transcribe"),
            transcription_language=data.get("transcription_language"),
            llm_model=data.get("llm_model", "gpt-4o-mini"),
            start_sound=data.get("start_sound", "beep.mp3"),
            end_sound=data.get("end_sound", "stop.mp3")
        )

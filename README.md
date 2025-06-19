# VaibVoice

VaibVoice is an audio processing application that provides audio manipulation capabilities with API integration and database storage.

## Project Structure

```
VaibVoice/
├── src/
│   ├── audio/    # Audio processing modules
│   ├── api/      # API integration components
│   └── db/       # Database interaction modules
├── README.md
└── requirements.txt
```

## Dependencies

This project requires the following Python packages:
- sounddevice: For audio playback and recording
- soundfile: For reading and writing audio files
- numpy: For numerical operations on audio data
- requests: For API communication

## Installation

1. Clone the repository:
```
git clone https://github.com/yourusername/VaibVoice.git
cd VaibVoice
```

2. Install the required dependencies:
```
pip install -r requirements.txt
```

## Getting Started

To start using VaibVoice:

1. Ensure all dependencies are installed
2. Run the CLI application:
```
python -m src.main
```

## Command Line Interface

VaibVoice provides a command-line interface with the following options:

1. **Record and transcribe audio**
   - Press [ENTER] to start recording
   - Press [ENTER] again to stop recording
   - The audio will be transcribed and you'll be asked if you want to save it to history

2. **View history**
   - Displays a list of all transcriptions in the history
   - For each transcription, shows:
     - Date and time
     - Duration
     - Preview of the transcribed text
     - Path to the audio file

3. **Exit**
   - Exits the application

## License

[Specify license information here]

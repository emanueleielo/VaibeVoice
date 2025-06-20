"""
Core functionality for formatting transcriptions.
Provides functions for formatting transcriptions using the OpenAI API.
"""

import openai
from typing import Optional

import vaibvoice.config as config

def format_transcription(text: str) -> str:
    """
    Format a transcription using the OpenAI API.
    Detects if the transcription is an email, prompt, or message and formats it accordingly.

    Args:
        text (str): The transcription text to format

    Returns:
        str: The formatted transcription text
    """
    # Set up OpenAI API key
    openai.api_key = config.OPENAI_API_KEY

    # If the text is empty, return it as is
    if not text.strip():
        return text

    try:
        # Create a prompt for the OpenAI API
        prompt = f"""
        Please format the following transcription appropriately. 
        Detect if it's an email, a prompt, or a general message, and format it accordingly.
        If it starts with instructions like "This is an email..." or "Format this as...", 
        follow those instructions for formatting.

        IMPORTANT: Format the text as plain text only. DO NOT use markdown formatting.
        Only use line breaks where appropriate. No special formatting characters.
        
        IMPORTANT: If the user provide specific instruction for example "this is an email" or some prompt instruction remove it,
        because your duty is just to convert a voice prompt message to a formatted text useful to be sent.

        Transcription: {text}

        Formatted version:
        """

        # Call the OpenAI API
        response = openai.chat.completions.create(
            model=config.LLM_MODEL,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that formats text appropriately based on its content and any formatting instructions provided. Always use plain text only, never use markdown or any special formatting characters. Only use line breaks where appropriate."},
                {"role": "user", "content": prompt}
            ],
            temperature=0,
            max_tokens=12000
        )

        # Extract the formatted text from the response
        formatted_text = response.choices[0].message.content.strip()

        return formatted_text

    except Exception as e:
        print(f"Error during formatting: {e}")
        # If there's an error, return the original text
        return text

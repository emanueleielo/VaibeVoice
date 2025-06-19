"""
Typing animation module for VaibVoice.
Provides functionality to type text with animation effects.
"""

import time
import pyautogui

def type_with_animation(text, delay=0.001):
    """
    Type the text with an animation effect.

    Args:
        text (str): The text to type
        delay (float): Delay between characters in seconds
    """
    i = 0
    while i < len(text):
        # Get current chunk (2 characters or remaining if less)
        chunk = text[i:i+2]
        pyautogui.write(chunk)
        time.sleep(delay)
        i += 2
#!/usr/bin/env python3
"""
Run script for VaibVoice.
Provides a unified entry point for the application.
"""

import os
import sys
import subprocess
import importlib.util

def check_dependencies():
    """
    Check if all required dependencies are installed.
    """
    required_packages = [
        "fastapi", "uvicorn", "pydantic", "sounddevice", "soundfile", 
        "numpy", "python-dotenv", "pynput", "pyautogui", "openai"
    ]

    missing_packages = []
    for package in required_packages:
        if importlib.util.find_spec(package) is None:
            missing_packages.append(package)

    if missing_packages:
        print(f"Installing missing dependencies: {', '.join(missing_packages)}")
        subprocess.run([sys.executable, "-m", "pip", "install", *missing_packages])

def check_gui_build():
    """
    Check if the GUI is built.
    """
    gui_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "gui")
    build_dir = os.path.join(gui_dir, "dist")

    # Remove the build directory if it exists
    if os.path.exists(build_dir):
        print("Removing existing build directory...")
        try:
            subprocess.run(["rm", "-rf", build_dir], check=True)
        except subprocess.CalledProcessError as e:
            print(f"Error removing build directory: {e}")
            sys.exit(1)

    # Only remove and rebuild the GUI if the build directory doesn't exist
    if not os.path.exists(build_dir):
        print("Building GUI...")
        # Check if Node.js is installed
        try:
            subprocess.run(["node", "--version"], check=True, stdout=subprocess.PIPE)
        except (subprocess.CalledProcessError, FileNotFoundError):
            print("Error: Node.js is required to build the GUI.")
            print("Please install Node.js from https://nodejs.org/")
            sys.exit(1)



        # Install dependencies and build the GUI
        subprocess.run(["npm", "install"], cwd=gui_dir, check=True)
        subprocess.run(["npm", "run", "build"], cwd=gui_dir, check=True)

def main():
    """
    Main function that starts the VaibVoice application.
    """
    # Check dependencies
    check_dependencies()

    # Check if the GUI is built
    check_gui_build()

    # Start the application
    from vaibvoice.main import main as start_main_app
    start_main_app()

if __name__ == "__main__":
    main()

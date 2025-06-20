"""
Main module for VaibVoice.
Provides the entry point for the application.
"""

import os
import sys
import time
import webbrowser
import threading
import pathlib
from http.server import HTTPServer, SimpleHTTPRequestHandler

import vaibvoice.config as config
from vaibvoice.core.keyboard import key_recording
from vaibvoice.api.server import start_api_server_thread

class SPAHandler(SimpleHTTPRequestHandler):
    """
    Custom HTTP request handler for Single Page Applications.
    Serves index.html for all routes that don't correspond to static files.
    """
    def do_GET(self):
        # Parse the requested path
        url_parts = self.path.split('?')
        request_path = url_parts[0]

        # Check if the requested file exists
        file_path = self.translate_path(request_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            # If the file exists, serve it normally
            return SimpleHTTPRequestHandler.do_GET(self)
        else:
            # If the file doesn't exist, serve index.html
            self.path = '/index.html'
            return SimpleHTTPRequestHandler.do_GET(self)

def start_gui_server(host: str = None, port: int = None):
    """
    Start a simple HTTP server to serve the GUI.

    Args:
        host (str): Host to bind the server to
        port (int): Port to bind the server to

    Returns:
        threading.Thread: The thread running the GUI server
    """
    host = host if host is not None else config.GUI_HOST
    port = port if port is not None else config.GUI_PORT
    # Verify if the GUI is built
    gui_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "gui")
    build_dir = os.path.join(gui_dir, "dist")

    if not os.path.exists(build_dir):
        print("Building GUI...")
        os.system(f"cd {gui_dir} && npm run build")

    # Change directory to serve static files
    os.chdir(build_dir)

    # Start a simple HTTP server with the custom SPA handler
    server = HTTPServer((host, port), SPAHandler)
    server_thread = threading.Thread(target=server.serve_forever)
    server_thread.daemon = True
    server_thread.start()

    # Open the browser
    webbrowser.open(f'http://{host}:{port}')

    return server_thread

def main():
    """
    Main function that starts the VaibVoice application.
    """
    # Ensure the audio_temp directory exists
    os.makedirs(config.AUDIO_TEMP_DIR, exist_ok=True)

    # Start the API server in a separate thread
    api_thread = start_api_server_thread(host=config.API_HOST, port=config.API_PORT)
    print(f"API server running at http://{config.API_HOST}:{config.API_PORT}")

    # Start the GUI server in a separate thread
    gui_thread = start_gui_server(host=config.GUI_HOST, port=config.GUI_PORT)
    print(f"GUI running at http://{config.GUI_HOST}:{config.GUI_PORT}")

    # Start the key recording mode
    try:
        key_recording()
    except KeyboardInterrupt:
        print("\nExiting VaibVoice. Goodbye!")
        sys.exit(0)

if __name__ == "__main__":
    main()

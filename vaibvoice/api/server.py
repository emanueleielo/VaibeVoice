"""
FastAPI server for VaibVoice.
Provides API endpoints for the GUI to consume.
"""

import threading
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import vaibvoice.config as config

def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.

    Returns:
        FastAPI: The configured FastAPI application
    """
    app = FastAPI(
        title="VaibVoice API",
        description="API for the VaibVoice application",
        version="1.0.0"
    )

    # Configure CORS to allow requests from the GUI
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[f"http://{config.API_HOST}:{config.API_PORT}", "http://localhost:8000", "http://127.0.0.1:8000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Import routes here to avoid circular imports
    from vaibvoice.api.routes.transcriptions import router as transcriptions_router
    from vaibvoice.api.routes.stats import router as stats_router
    from vaibvoice.api.routes.settings import router as settings_router

    # Include routers
    app.include_router(transcriptions_router, prefix="/api", tags=["transcriptions"])
    app.include_router(stats_router, prefix="/api", tags=["stats"])
    app.include_router(settings_router, prefix="/api", tags=["settings"])

    return app

def run_api_server(host: str = None, port: int = None):
    """
    Run the FastAPI server.

    Args:
        host (str): Host to bind the server to
        port (int): Port to bind the server to
    """
    host = host if host is not None else config.API_HOST
    port = port if port is not None else config.API_PORT
    app = create_app()
    uvicorn.run(app, host=host, port=port)

def start_api_server_thread(host: str = None, port: int = None):
    """
    Start the FastAPI server in a separate thread.

    Args:
        host (str): Host to bind the server to
        port (int): Port to bind the server to

    Returns:
        threading.Thread: The thread running the API server
    """
    host = host if host is not None else config.API_HOST
    port = port if port is not None else config.API_PORT
    api_thread = threading.Thread(target=run_api_server, args=(host, port))
    api_thread.daemon = True  # The thread will terminate when the main thread terminates
    api_thread.start()
    return api_thread

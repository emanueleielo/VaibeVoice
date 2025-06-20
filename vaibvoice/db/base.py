"""
Base module for database operations.
Provides functionality for database connections and initialization.
"""

import os
import sqlite3
from typing import Optional

import vaibvoice.config as config

class Database:
    """
    Base class for database operations.

    Attributes:
        db_path (str): Path to the SQLite database file
    """

    def __init__(self, db_path: str = None):
        """
        Initialize the Database with the specified database path.

        Args:
            db_path (str): Path to the SQLite database file
        """
        self.db_path = db_path if db_path is not None else config.DB_PATH
        self.db_exists = os.path.exists(self.db_path)

    def get_connection(self):
        """
        Get a connection to the database.

        Returns:
            sqlite3.Connection: A connection to the database
        """
        return sqlite3.connect(self.db_path)

    def execute_query(self, query: str, params: tuple = (), fetch: bool = False, fetch_all: bool = True):
        """
        Execute a SQL query on the database.

        Args:
            query (str): SQL query to execute
            params (tuple): Parameters for the query
            fetch (bool): Whether to fetch results
            fetch_all (bool): Whether to fetch all results or just one

        Returns:
            Optional[Union[list, tuple, bool]]:
                - Query results if fetch is True
                - True if the query was executed successfully without fetch
                - None if there was an error
        """
        conn = self.get_connection()
        cursor = conn.cursor()

        try:
            cursor.execute(query, params)

            if fetch:
                return cursor.fetchall() if fetch_all else cursor.fetchone()
            else:
                conn.commit()
                return True

        except Exception as e:
            print(f"Error executing query: {str(e)}\nQuery: {query}\nParams: {params}")
            return None
        finally:
            conn.close()

    def initialize_db(self):
        """
        Initialize the database by creating the necessary tables if they don't exist.
        This method should be overridden by subclasses.
        """
        pass

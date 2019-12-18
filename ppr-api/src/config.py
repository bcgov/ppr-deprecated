"""
Handle environment-specific configuration settings.

Uses dotenv to read the configuration settings:
 - for local development, the filesystem will be walked up until a .env file is found.
 - for OpenShift deployment, the value is read from a deploymentconfig environment variable.
"""

import os

import dotenv

dotenv.load_dotenv()

IMS_API_URL = os.getenv("PPR_API_IMS_API_URL")
DB_HOSTNAME = os.getenv('PPR_API_DB_HOSTNAME')
DB_PORT = int(os.getenv('PPR_API_DB_PORT', '5432'))
DB_NAME = os.getenv('PPR_API_DB_NAME')
DB_USERNAME = os.getenv('PPR_API_DB_USERNAME')
DB_PASSWORD = os.getenv('PPR_API_DB_PASSWORD')

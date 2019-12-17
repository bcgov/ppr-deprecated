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

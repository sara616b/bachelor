from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from project.secrets import MONGO_PASSWORD
from urllib.parse import quote_plus


mongo_client = MongoClient(
    f'mongodb+srv://sarah:{quote_plus(MONGO_PASSWORD)}@bachelor.rjkfkr1.mongodb.net/?retryWrites=true&w=majority',  # noqa
    server_api=ServerApi('1')
)

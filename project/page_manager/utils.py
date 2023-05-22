from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from project.settings.secrets import MONGO_PASSWORD
from urllib.parse import quote_plus


mongo_client = MongoClient(
    f'mongodb+srv://sarah:{quote_plus(MONGO_PASSWORD)}@bachelor.rjkfkr1.mongodb.net/?retryWrites=true&w=majority',  # noqa
    server_api=ServerApi('1')
)

customization_data = {
    "Title": {
        "component": "Title",
        "values": {
            "name": "Title",
            "title_color": "#000",
            "text": "New Title",
            "alignment": "center",
            "bold": "false"
        },
        "customization": {
            "text": {
                "type": "text",
                "name": "Title Text"
            },
            "title_color": {
                "type": "color",
                "name": "Title Color"
            },
            "alignment": {
                "type": "alignment",
                "name": "Title Alignment"
            },
            "bold": {
                "type": "boolean",
                "name": "Bold"
            }
        }
    },
    "Text": {
        "component": "Text",
        "values": {
            "name": "Text",
            "text_color": "#000",
            "text": "New Text",
            "alignment": "center"
        },
        "customization": {
            "text": {
                "type": "textarea",
                "name": "Text Text"
            },
            "text_color": {
                "type": "color",
                "name": "Text Color"
            },
            "alignment": {
                "type": "alignment",
                "name": "Text Alignment"
            }
        }
    },
    "Image": {
        "component": "Image",
        "values": {
            "name": "Image",
            "link": "",
            "alignment": "center"
        },
        "customization": {
            "link": {
                "type": "text",
                "name": "Link"
            }
        }
    }
}

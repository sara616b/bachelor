

def get_put_data(request):
    if not request.content_type == 'application/json':
        if hasattr(request, '_post'):
            del request._post
            del request._files

        try:
            request.method = 'POST'
            request._load_post_and_files()
            request.method = 'PUT'
        except AttributeError:
            request.META['REQUEST_METHOD'] = 'POST'
            request._load_post_and_files()
            request.META['REQUEST_METHOD'] = 'PUT'
        request.PUT = request.POST
    return request


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
    },
    "CardSlider": {
        "component": "CardSlider",
        "values": {
            "name": "CardSlider",
            "image_links": "",
            "links": "",
            "titles": "",
        },
        "customization": {
            "image_links": {
                "type": "list",
                "name": "Image Links"
            },
            "titles": {
                "type": "list",
                "name": "Titles"
            },
            "links": {
                "type": "list",
                "name": "Links"
            },
        }
    },
}

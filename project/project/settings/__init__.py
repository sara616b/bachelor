import os

site = os.environ.get('SITE')

if site in ['cms']:
    from .cms import *
else:
    from .website import *

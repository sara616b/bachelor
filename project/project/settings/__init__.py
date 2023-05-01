import os
# flake8: noqa

site = os.environ.get('SITE')

if site in ['cms']:
    from .cms import *
else:
    from .website import *

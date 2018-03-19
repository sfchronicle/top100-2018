import os
import sys

from app import app, assets, Environment, freezer
from project import *

BUILD_DIR = os.path.join(os.path.realpath(os.path.dirname(__file__)), 'build')
ROOT_URL = '//extras.sfgate.com'
STAGING_PATH = app.config['TEST_PROJECT_PATH'] + '/' + app.config['STAGING_PATH']
PRODUCTION_PATH = app.config['PROJECT_YEAR'] + '/' + app.config['PRODUCTION_PATH']
DEV_PATH =  '/' 

if __name__ == '__main__':
    app.config['DEBUG'] = False
    app.config['ASSETS_DEBUG'] = False
    app.config['DEV'] = False

    args = sys.argv[1:]
    
    if args:
        for arg in args: 
            if arg == 'staging':
                app.config['FREEZER_BASE_URL'] = '{}/{}'.format(ROOT_URL, STAGING_PATH)
                app.config['FREEZER_STATIC_IGNORE'] = ['*.less', '.webassets-cache']
                freezer.freeze()

            elif arg == 'production':
                app.config['FREEZER_BASE_URL'] = '{}/{}'.format(ROOT_URL, PRODUCTION_PATH)
                app.config['FREEZER_STATIC_IGNORE'] = ['*.less', '.webassets-cache']
                freezer.freeze()

            elif arg == 'dev':
                app.config['DEV'] = True
                app.config['FREEZER_BASE_URL'] = '{}/{}'.format(ROOT_URL, DEV_PATH)
                app.config['FREEZER_STATIC_IGNORE'] = ['*.less', '.webassets-cache']
                freezer.freeze()

    else:
        print('Please specify whether to build for `staging` or for `production`')
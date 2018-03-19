from flask import Flask
from flask_frozen import Freezer
from flask_assets import Environment

# Create application
app = Flask(__name__)

# asset management
assets =  Environment(app)

# building
freezer = Freezer(app)
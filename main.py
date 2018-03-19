import os
import json
from app import app
from project import *


if __name__ == '__main__':

	# freezer.run(debug=True)
	
	# Start app
	app.config['DEBUG'] = True
	app.run(host='0.0.0.0')

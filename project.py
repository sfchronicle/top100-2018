from flask import render_template, redirect, url_for, request, json
from app import app, freezer
from itertools import tee, islice, chain, izip

import os

app.config['TEST_PROJECT_PATH'] = 'test-proj'
app.config['PROJECT_YEAR'] = '2017'

# Site paths
app.config['STAGING_PATH'] = 'top2017'
app.config['PRODUCTION_PATH'] = 'top-100-restaurants'

# Publication date 
app.config['DATE'] = '2017-04-01'

# Hashtag
app.config['HASHTAG'] = 'Top100restaurants'



SITE_ROOT = os.path.realpath(os.path.dirname(__file__))

info = os.path.join(SITE_ROOT, "data", "info.sheet.json")
print info
with open(info) as rest:
  print rest
  restaurants = json.load(rest)

docs_info = os.path.join(SITE_ROOT, "data", "top_100_2017_digital_text.json")
with open(docs_info) as info:
  rinfo = json.load(info)
  text = rinfo['restaurants']


@app.route("/")
def index():

  restaurant_info = [x for x in restaurants]
  restaurant = restaurant_info[0]
  article = [y for y in text]

  return render_template(
    'index.html',
    restaurant=restaurant,
    article=article,
    restaurants=restaurants
  )

@app.route('/<slug>/')
def restaurant_view(slug):
  
  restaurant_info = [x for x in restaurants if x['slug'] == slug]
  restaurant = restaurant_info[0]
  article = [y for y in text if y['slug'] == slug]

  next_article = [y for y in restaurants if y['slug'] == restaurant['next']]
  prev_article = [y for y in restaurants if y['slug'] == restaurant['previous']]
  nextone_article = [y for y in restaurants if y['slug'] == restaurant['nextone']]


  return render_template(
    'restaurant.html',
    restaurant=restaurant,
    article=article,
    restaurants=restaurants,
    prev_article=prev_article,
    next_article=next_article,
    nextone_article=nextone_article
  )


@app.errorhandler(500)
def internal_error(error):
  return "500 error"

@freezer.register_generator
def restaurant_view():
  for restaurant in restaurants:
    yield { 'slug': restaurant['slug']}

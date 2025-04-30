from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/eshop_db"
mongo = PyMongo(app)

@app.route('/search', methods=['GET'])
def search_products():
    name = request.args.get('name', '')
    
    if name == '':
        products = list(mongo.db.products.find({}, {'_id': 0}))
    else:
        query = {'$text': {'$search': name}}
        products = list(mongo.db.products.find(query, {'_id': 0}).sort('likes', -1))
    
    return jsonify(products)

@app.route('/like', methods=['POST'])
def like_product():
    product_id = request.json.get('id')
    mongo.db.products.update_one(
        {'id': product_id},
        {'$inc': {'likes': 1}}
    )
    return jsonify({'status': 'success'})

@app.route('/popular-products', methods=['GET'])
def popular_products():
    products = list(mongo.db.products.find({}, {'_id': 0}).sort('likes', -1).limit(5))
    return jsonify(products)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
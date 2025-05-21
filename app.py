from flask import Flask, jsonify, request, render_template
from flask_pymongo import PyMongo
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/eshop_db"
mongo = PyMongo(app)
db = mongo.db  # έτσι γράφουμε πιο καθαρά (αντί να γράφεις mongo.db παντού)

@app.route('/')
def home():
    return render_template('homepage.html')

@app.route('/products')
def products():
    return render_template('products.html')

@app.route('/search', methods=['GET'])
def search_products():
    name = request.args.get('name', '')
    if name == '':
        products = list(db.products.find({}, {'_id': 0}))
    else:
        #query = {"name": {"$regex": f"^{name}$", "$options": "i"}} # Search for exact match (case insensitive)
        query = {"name": {"$regex": name.replace(" ", ".*"), "$options": "i"}}  # Οπως στο τελικο project

        products = list(db.products.find(query, {'_id': 0}).sort('likes', -1))
    return jsonify(products)

@app.route('/search-by-category', methods=['GET'])
def search_by_category():
    category = request.args.get('category', '')
    if not category:
        return jsonify({'error': 'Missing category parameter'}), 400
    
    query = {"category": {"$regex": f"^{category}$", "$options": "i"}}
    products = list(db.products.find(query, {'_id': 0}).sort('likes', -1))
    
    return jsonify(products)


@app.route('/like', methods=['POST'])
def like_product():
    try:
        # Λαμβάνει το ID από το JSON body
        product_id = request.json.get('id')
        
        # Έλεγχος αν το ID είναι έγκυρο (ακέραιος > 0)
        if not isinstance(product_id, int) or product_id < 1:
            return jsonify({
                'status': 'failed',
                'message': 'Invalid ID: ID must be a positive integer'
            }), 400  # 400 = Bad Request

        # Έλεγχος ύπαρξης προϊόντος στη βάση
        if not db.products.find_one({'id': product_id}):
            return jsonify({
                'status': 'failed',
                'message': f'Product with ID {product_id} not found'
            }), 200 

        # Αν όλα είναι OK, κάνε like
        db.products.update_one(
            {'id': product_id},
            {'$inc': {'likes': 1}}
        )

        # Επιστροφή επιτυχίας + νέου αριθμού likes (προαιρετικό)
        updated_product = db.products.find_one({'id': product_id}, {'_id': 0, 'likes': 1})
        return jsonify({
            'status': 'success',
            'new_likes': updated_product['likes']
        })

    except Exception as e:
        # Χειρισμός τυχόν άλλων εξαιρέσεων (π.χ. σφάλμα βάσης)
        return jsonify({
            'status': 'error',
            'message': f'An error occurred: {str(e)}'
        }), 500  # 500 = Internal Server Error

@app.route('/popular-products', methods=['GET'])
def popular_products():
    products = list(db.products.find({}, {'_id': 0}).sort('likes', -1).limit(5))
    return jsonify(products)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)


from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timezone 
import config

app = Flask(__name__)
CORS(app)

# Load configuration from config.py
app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = config.SQLALCHEMY_TRACK_MODIFICATIONS

# Initialize SQLAlchemy
db = SQLAlchemy(app)

class TagTree(db.Model):
    __tablename__ = 'tag_tree'
    
    id = db.Column(db.Integer, primary_key=True)
    tree = db.Column(db.JSON, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc)) 
    updated_at = db.Column(db.DateTime, onupdate=lambda: datetime.now(timezone.utc))  

# Create the database tables if they don't exist
with app.app_context():
    db.create_all()

# Define routes

@app.route('/', methods=['GET'])
def get_data():
    data = {"message": "Hello, Flask!"}
    return jsonify(data)



# GET all trees
@app.route('/api/trees', methods=['GET'])
def get_trees():
    trees = TagTree.query.all()
    tree_list = [
        {"id": tree.id, "tree": tree.tree, "created_at": tree.created_at, "updated_at": tree.updated_at}
        for tree in trees
    ]
    return jsonify(tree_list), 200

# POST a new tree
@app.route('/api/trees', methods=['POST'])
def create_tree():
    data = request.json
    tree_data = data.get('tree')
    
    if not tree_data:
        return jsonify({"error": "Tree data is required"}), 400

    new_tree = TagTree(tree=tree_data)
    db.session.add(new_tree)
    db.session.commit()

    return jsonify({"id": new_tree.id, "tree": new_tree.tree, "created_at": new_tree.created_at}), 201

# PUT update an existing tree
@app.route('/api/trees/<int:tree_id>', methods=['PUT'])
def update_tree(tree_id):
    tree = TagTree.query.get(tree_id)
    if not tree:
        return jsonify({"error": "Tree not found"}), 404

    data = request.json
    tree.tree = data.get('tree', tree.tree)
    db.session.commit()

    return jsonify({"id": tree.id, "tree": tree.tree, "updated_at": tree.updated_at}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)

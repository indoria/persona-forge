"""
NLP endpoints (for debugging/demo).
"""

from flask import Blueprint, request, jsonify
from backend.nlp import preprocess, extract_entities

nlp_bp = Blueprint("nlp", __name__)

@nlp_bp.route("/preprocess", methods=["POST"])
def preprocess_text():
    data = request.get_json()
    text = data["text"]
    tokens = preprocess(text)
    return jsonify({"tokens": tokens})

@nlp_bp.route("/entities", methods=["POST"])
def get_entities():
    data = request.get_json()
    text = data["text"]
    entities = extract_entities(text)
    return jsonify({"entities": entities})
"""
Knowledge base endpoints.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.knowledge_base import add_kb_entry, get_kb_entries, update_kb_entry, delete_kb_entry

kb_bp = Blueprint("kb", __name__)

@kb_bp.route("/", methods=["GET"])
@jwt_required()
def list_kb():
    user_id = get_jwt_identity()
    entries = get_kb_entries(user_id)
    return jsonify([{
        "id": e.id, "question": e.question, "answer": e.answer
    } for e in entries])

@kb_bp.route("/", methods=["POST"])
@jwt_required()
def add_kb():
    user_id = get_jwt_identity()
    data = request.get_json()
    entry = add_kb_entry(user_id, data["question"], data["answer"])
    return jsonify({
        "id": entry.id, "question": entry.question, "answer": entry.answer
    }), 201

@kb_bp.route("/<int:entry_id>", methods=["PUT"])
@jwt_required()
def update_kb(entry_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    entry = update_kb_entry(entry_id, user_id, data["question"], data["answer"])
    if entry:
        return jsonify({
            "id": entry.id, "question": entry.question, "answer": entry.answer
        })
    return {"error": "Entry not found"}, 404

@kb_bp.route("/<int:entry_id>", methods=["DELETE"])
@jwt_required()
def delete_kb(entry_id):
    user_id = get_jwt_identity()
    if delete_kb_entry(entry_id, user_id):
        return {}, 204
    return {"error": "Entry not found"}, 404
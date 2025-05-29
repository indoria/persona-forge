"""
Conversation endpoints.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import Persona
from backend.knowledge_base import get_kb_entries
from backend.conversation import generate_response

conv_bp = Blueprint("conversation", __name__)

@conv_bp.route("/", methods=["POST"])
@jwt_required()
def converse():
    user_id = get_jwt_identity()
    data = request.get_json()
    persona_id = data["persona_id"]
    mode = data.get("mode", "educator")
    user_input = data["input"]

    persona = Persona.query.get(persona_id)
    kb = get_kb_entries(user_id)
    response = generate_response(user_input, persona, mode, user_id, kb)
    return jsonify({"response": response})
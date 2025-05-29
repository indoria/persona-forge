"""
Persona endpoints.
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.persona import get_predefined_personas, create_persona, get_user_personas, persona_to_dict

persona_bp = Blueprint("persona", __name__)

@persona_bp.route("/", methods=["GET"])
@jwt_required()
def list_personas():
    user_id = get_jwt_identity()
    result = [persona_to_dict(p) for p in get_predefined_personas()]
    result += [persona_to_dict(p) for p in get_user_personas(user_id)]
    return jsonify(result)

@persona_bp.route("/", methods=["POST"])
@jwt_required()
def add_persona():
    user_id = get_jwt_identity()
    data = request.get_json()
    persona = create_persona(
        user_id=user_id,
        name=data["name"],
        description=data.get("description", ""),
        training_data=data.get("training_data", "")
    )
    return jsonify(persona_to_dict(persona)), 201
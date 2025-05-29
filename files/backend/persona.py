"""
Persona module: Defines persona characteristics, behaviors, and training logic.
"""

from backend.models import Persona, db
from flask import jsonify

def get_predefined_personas():
    return Persona.query.filter_by(is_predefined=True).all()

def create_persona(user_id, name, description, training_data):
    persona = Persona(
        name=name,
        description=description,
        owner_id=user_id,
        training_data=training_data,
        is_predefined=False
    )
    db.session.add(persona)
    db.session.commit()
    return persona

def get_user_personas(user_id):
    return Persona.query.filter_by(owner_id=user_id).all()

def persona_to_dict(persona):
    return {
        "id": persona.id,
        "name": persona.name,
        "description": persona.description,
        "is_predefined": persona.is_predefined
    }
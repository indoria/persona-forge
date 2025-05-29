"""
Conversation module: manages conversation flow and AI persona response generation.
"""

from backend.nlp import preprocess, extract_entities
from backend.persona import persona_to_dict
from backend.mode import get_mode
from backend.knowledge_base import get_kb_entries

def generate_response(user_input, persona, mode, user_id, kb_entries):
    """
    Generates a response based on persona, mode, knowledge base, and NLP analysis.
    """
    tokens = preprocess(user_input)
    entities = extract_entities(user_input)
    # Try to match a KB entry
    for entry in kb_entries:
        if entry.question.lower() in user_input.lower():
            return entry.answer

    # Fallback: Persona-driven, mode-influenced template
    persona_data = persona_to_dict(persona)
    mode_data = get_mode(mode)
    response = (
        f"[{persona_data['name']} - {mode.title()}]: "
        f"As someone who is {mode_data['tone']}, "
        f"I think about your question: '{user_input}'. (No KB answer found.)"
    )
    return response
"""
Registers all Flask blueprints in the views directory.
"""

from .user_views import user_bp
from .persona_views import persona_bp
from .kb_views import kb_bp
from .conversation_views import conv_bp
from .nlp_views import nlp_bp
from backend.auth import auth_bp

def register_blueprints(app):
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(user_bp, url_prefix="/api")
    app.register_blueprint(persona_bp, url_prefix="/api/persona")
    app.register_blueprint(kb_bp, url_prefix="/api/kb")
    app.register_blueprint(conv_bp, url_prefix="/api/conversation")
    app.register_blueprint(nlp_bp, url_prefix="/api/nlp")
"""
Main Flask application entrypoint.
Initializes app, database, JWT, blueprints, and config.
"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from backend.config import Config
from backend.views import register_blueprints

db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__, static_folder=None)
    app.config.from_object(Config)

    CORS(app, origins=app.config.get('CORS_ORIGINS', '*'))

    db.init_app(app)
    jwt.init_app(app)

    register_blueprints(app)

    @app.route("/health")
    def health_check():
        return {"status": "ok"}

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
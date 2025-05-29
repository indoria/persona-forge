# Architecture Decisions

## Authentication

- **OTP login** via email or phone. No passwords are stored.
- **JWT** used for securing API endpoints.

## Personas

- **Predefined personas**: Seeded in DB. Mimic real professionals.
- **User personas**: Training data supplied by user (freeform text for now).

## Knowledge Base

- Each user has their own Q&A entries.
- CRUD supported via REST endpoints.

## NLP/ML

- **spaCy**: preprocessing, lemmatization, NER.
- **NLTK**: optional text processing.
- **scikit-learn**: for intent classification (placeholder).

## Database

- **PostgreSQL**, managed by SQLAlchemy ORM.
- Alembic/Flask-Migrate suggested for migrations.

## Frontend

- **Vanilla JS, HTML, CSS** for simplicity and portability.
- Stateless, talks to backend via REST+JWT.

## API Security

- All non-auth endpoints require valid JWT.
- CORS enabled for frontend domain.

## Deployment

- Use `requirements.txt` and `package.json` for dependencies.
- Backend and frontend can be containerized or deployed separately.

## Folder Structure

- `backend/`: Flask app, views, modules, models
- `frontend/`: Static files
- `database/`: Schema and seed data

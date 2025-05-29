# AI Personas Web Application

This app allows users to interact with AI personas (predefined or custom) in different conversational modes, manage a personal knowledge base, and chat using a web interface.

## Features

- **User authentication** via email/phone with OTP
- **Predefined personas** (e.g., Christopher Hitchens, Bill Byrne, Hajira Amla) + user-created personas
- **Knowledge base**: users can add/edit/delete Q&A
- **Conversation modes**: interviewer, critic, educator, etc.
- **NLP-based conversation** using NLTK, spaCy, scikit-learn
- **JWT API security**
- **Python Flask backend, PostgreSQL DB, Vanilla JS frontend**

## Quickstart

### Backend

1. **Create virtualenv and install dependencies:**
   ```
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Set up PostgreSQL:**
   - Create a database, e.g. `aipersonas`
   - Run database/init.sql and database/seed_personas.sql

3. **Configure environment variables:**
   - `DATABASE_URL`, `SECRET_KEY`, `JWT_SECRET_KEY` as needed

4. **Run the backend:**
   ```
   python backend/app.py
   ```

### Frontend

1. **Serve the frontend:**
   ```
   cd frontend
   npm install
   npm run dev
   ```

   Or use any static server.

2. **Frontend available at:** http://localhost:3000

### System Architecture

See `architecture.mmd` and `workflow.mmd` (render with https://mermaid.live).

### Design Decisions

See `ARCHITECTURE.md`.

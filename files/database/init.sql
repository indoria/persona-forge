-- PostgreSQL schema for initial setup.
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    email VARCHAR(120) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE otp (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES "user"(id),
    otp_code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE
);

CREATE TABLE persona (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) UNIQUE NOT NULL,
    description TEXT,
    owner_id INTEGER REFERENCES "user"(id),
    is_predefined BOOLEAN DEFAULT FALSE,
    training_data TEXT
);

CREATE TABLE knowledge_entry (
    id SERIAL PRIMARY KEY,
    question VARCHAR(256) NOT NULL,
    answer TEXT NOT NULL,
    user_id INTEGER REFERENCES "user"(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```markdown
# Database Migrations

Use alembic or Flask-Migrate for schema migrations.
This folder may contain migration scripts.

## Initial Setup

- Run `psql -U <user> -d <db> -f init.sql` to initialize the schema.
- Run `psql -U <user> -d <db> -f seed_personas.sql` to add predefined personas.
```
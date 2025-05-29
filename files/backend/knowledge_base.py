"""
Knowledge base module: CRUD operations for Q&A entries.
"""

from backend.models import KnowledgeEntry, db

def add_kb_entry(user_id, question, answer):
    entry = KnowledgeEntry(user_id=user_id, question=question, answer=answer)
    db.session.add(entry)
    db.session.commit()
    return entry

def get_kb_entries(user_id):
    return KnowledgeEntry.query.filter_by(user_id=user_id).all()

def update_kb_entry(entry_id, user_id, question, answer):
    entry = KnowledgeEntry.query.filter_by(id=entry_id, user_id=user_id).first()
    if entry:
        entry.question = question
        entry.answer = answer
        db.session.commit()
    return entry

def delete_kb_entry(entry_id, user_id):
    entry = KnowledgeEntry.query.filter_by(id=entry_id, user_id=user_id).first()
    if entry:
        db.session.delete(entry)
        db.session.commit()
        return True
    return False
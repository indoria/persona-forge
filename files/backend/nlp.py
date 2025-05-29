"""
NLP module: uses NLTK, spaCy, scikit-learn for preprocessing and intent detection.
"""

import spacy
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer

nlp = spacy.load("en_core_web_sm")

def preprocess(text):
    doc = nlp(text)
    tokens = [token.lemma_.lower() for token in doc if not token.is_stop and not token.is_punct]
    return tokens

def classify_intent(text, vectorizer, classifier):
    # Placeholder for intent classification
    X = vectorizer.transform([text])
    return classifier.predict(X)[0]

def extract_entities(text):
    doc = nlp(text)
    return [(ent.text, ent.label_) for ent in doc.ents]
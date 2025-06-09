# tokenization, POS tagging, lemmatization, named entity recognition, noun chunking

## Using NLTK
```python
import nltk
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag
from nltk.stem import WordNetLemmatizer
from nltk.chunk import ne_chunk
from nltk.chunk import RegexpParser

# Download necessary NLTK data (if not already downloaded)
# You might need to run these lines once
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    nltk.download('averaged_perceptron_tagger')
try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')
try:
    nltk.data.find('chunkers/maxent_ne_chunker')
except LookupError:
    nltk.download('maxent_ne_chunker')
try:
    nltk.data.find('corpora/words')
except LookupError:
    nltk.download('words')

# Sample text
text = "Apple Inc. was founded by Steve Jobs, Steve Wozniak, and Ronald Wayne on April 1, 1976, to develop and sell home computers."

print(f"Original Text: {text}\n")

# 1. Tokenization
# Breaking the text into individual words or tokens.
tokens = word_tokenize(text)
print(f"1. Tokens: {tokens}\n")

# 2. POS Tagging
# Assigning a part-of-speech tag (e.g., noun, verb, adjective) to each token.
pos_tags = pos_tag(tokens)
print(f"2. POS Tags: {pos_tags}\n")

# 3. Lemmatization
# Reducing words to their base or dictionary form (lemma).
lemmatizer = WordNetLemmatizer()
lemmas = [lemmatizer.lemmatize(word, pos='v') if tag.startswith('V') else lemmatizer.lemmatize(word) for word, tag in pos_tags]
print(f"3. Lemmas: {lemmas}\n")

# 4. Named Entity Recognition (NER)
# Identifying and classifying named entities (e.g., persons, organizations, locations).
# NLTK's ne_chunk creates a tree structure.
named_entities_tree = ne_chunk(pos_tags)
print("4. Named Entities (Tree Structure):\n")
print(named_entities_tree)

# Extracting named entities from the tree for a flatter list
named_entities = []
for subtree in named_entities_tree.subtrees():
    if subtree.label() in ['PERSON', 'ORGANIZATION', 'GPE', 'LOCATION', 'DATE']: # Common NER labels
        entity_name = " ".join([leaf[0] for leaf in subtree.leaves()])
        entity_type = subtree.label()
        named_entities.append((entity_name, entity_type))
print(f"\nExtracted Named Entities: {named_entities}\n")

# 5. Noun Chunking
# Identifying noun phrases (groups of words that act as a noun).
# NLTK uses a RegexpParser for rule-based chunking.
# NP: {<DT>?<JJ>*<NN.*>+} is a common grammar for noun phrases:
# Optional Determiner (DT), zero or more Adjectives (JJ), one or more Nouns (NN, NNS, NNP, NNPS).
grammar = r"""
    NP: {<DT|JJ|NN.*>+}          # Noun Phrase
    """
chunk_parser = RegexpParser(grammar)
noun_chunks_tree = chunk_parser.parse(pos_tags)
print("5. Noun Chunks (Tree Structure):\n")
print(noun_chunks_tree)

# Extracting noun chunks from the tree
noun_chunks = []
for subtree in noun_chunks_tree.subtrees():
    if subtree.label() == 'NP':
        chunk_words = " ".join([word for word, tag in subtree.leaves()])
        noun_chunks.append(chunk_words)
print(f"\nExtracted Noun Chunks: {noun_chunks}\n")
```

## Using spacy
```python
import spacy

# Load a pre-trained spaCy model
# You might need to download a model if you haven't already:
# python -m spacy download en_core_web_sm
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("SpaCy model 'en_core_web_sm' not found. Please run: python -m spacy download en_core_web_sm")
    exit()

# Sample text
text = "Apple Inc. was founded by Steve Jobs, Steve Wozniak, and Ronald Wayne on April 1, 1976, to develop and sell home computers."

print(f"Original Text: {text}\n")

# Process the text with spaCy's NLP pipeline
doc = nlp(text)

# 1. Tokenization
# Iterating through the doc object automatically gives tokens.
tokens = [token.text for token in doc]
print(f"1. Tokens: {tokens}\n")

# 2. POS Tagging
# Each token has a .pos_ attribute for its part-of-speech.
pos_tags = [(token.text, token.pos_) for token in doc]
print(f"2. POS Tags: {pos_tags}\n")

# 3. Lemmatization
# Each token has a .lemma_ attribute for its base form.
lemmas = [token.lemma_ for token in doc]
print(f"3. Lemmas: {lemmas}\n")

# 4. Named Entity Recognition (NER)
# Named entities are available in doc.ents.
named_entities = [(ent.text, ent.label_) for ent in doc.ents]
print(f"4. Named Entities: {named_entities}\n")

# 5. Noun Chunking
# Noun chunks are available in doc.noun_chunks.
noun_chunks = [chunk.text for chunk in doc.noun_chunks]
print(f"5. Noun Chunks: {noun_chunks}\n")
```

## Transformers and Stanza
```python
import torch
from transformers import AutoTokenizer, AutoModelForTokenClassification
from transformers import pipeline
import stanza

# --- Setup for Transformers (for Tokenization and NER) ---
# Load a pre-trained BERT-based tokenizer and model for Named Entity Recognition
# Using 'dslim/bert-base-NER' which is fine-tuned for NER
try:
    tokenizer = AutoTokenizer.from_pretrained("dslim/bert-base-NER")
    model = AutoModelForTokenClassification.from_pretrained("dslim/bert-base-NER")
    # Create a NER pipeline
    ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer, aggregation_strategy="simple")
except Exception as e:
    print(f"Could not load Hugging Face Transformers model for NER. Error: {e}")
    print("Please ensure you have 'transformers' installed: pip install transformers")
    exit()

# --- Setup for Stanza (for POS Tagging, Lemmatization, Noun Chunking) ---
# Download and load an English Stanza model
# You might need to run stanza.download('en') once
try:
    stanza.download('en') # Download the English model if not already present
    nlp_stanza = stanza.Pipeline('en')
except Exception as e:
    print(f"Could not load Stanza model. Error: {e}")
    print("Please ensure you have 'stanza' installed: pip install stanza")
    print("And the English model downloaded: stanza.download('en')")
    exit()


# Sample text
text = "Apple Inc. was founded by Steve Jobs, Steve Wozniak, and Ronald Wayne on April 1, 1976, to develop and sell home computers."

print(f"Original Text: {text}\n")

# --- 1. Tokenization (using Transformers tokenizer) ---
# Note: Transformers tokenizers often add special tokens (like [CLS], [SEP]) and handle subword tokenization.
# We'll get the raw tokens for display here.
tokens_from_transformer = tokenizer.tokenize(text)
print(f"1. Tokens (from Transformers): {tokens_from_transformer}\n")

# Process text with Stanza for other tasks
doc_stanza = nlp_stanza(text)

# --- 2. POS Tagging (using Stanza) ---
pos_tags = [(word.text, word.upos) for sent in doc_stanza.sentences for word in sent.words]
print(f"2. POS Tags (from Stanza): {pos_tags}\n")

# --- 3. Lemmatization (using Stanza) ---
lemmas = [word.lemma for sent in doc_stanza.sentences for word in sent.words]
print(f"3. Lemmas (from Stanza): {lemmas}\n")

# --- 4. Named Entity Recognition (NER) (using Transformers pipeline) ---
ner_results = ner_pipeline(text)
# Format the NER results for cleaner output
formatted_ner_results = [(entity['word'], entity['entity_group']) for entity in ner_results]
print(f"4. Named Entities (from Transformers): {formatted_ner_results}\n")

# --- 5. Noun Chunking (using Stanza) ---
# Stanza processes sentences and identifies noun phrases
noun_chunks = []
for sentence in doc_stanza.sentences:
    for chunk in sentence.chunks:
        if chunk.type == 'NP': # Noun Phrase
            noun_chunks.append(chunk.text)
print(f"5. Noun Chunks (from Stanza): {noun_chunks}\n")
```
## Spacy example
```python
import spacy

nlp = spacy.load("en_core_web_sm")

pitch_text = "Barkha Dutt is a renowned Indian journalist. Known for her journalism style."
doc = nlp(pitch_text)

#----- Analysis 1
print("Text:", doc.text)
print("Number of tokens:", len(doc))
print("Named Entities:", [(ent.text, ent.label_) for ent in doc.ents])
print("Noun Chunks:", [chunk.text for chunk in doc.noun_chunks])


#----- Analysis 2
for token in doc:
    print(f"{token.text} - POS: {token.pos_}, Lemma: {token.lemma_}, Is Stop: {token.is_stop}")


print("--- Tokenization, POS Tagging, and Lemmatization ---")
print("{:<15} {:<10} {:<10} {:<10}".format("Token", "POS", "Dependency", "Lemma"))
print("-" * 55)
for token in doc:
    # Tokenization: token.text
    # POS Tagging: token.pos_ (coarse-grained tag) and token.tag_ (fine-grained tag)
    # Dependency Parser: token.dep_ (syntactic dependency relation) and token.head.text (the head token)
    # Lemmatization: token.lemma_
    print(f"{token.text:<15} {token.pos_:<10} {token.dep_:<10} {token.lemma_:<10}")

print("\n--- Named Entity Recognition (NER) ---")
if doc.ents:
    for ent in doc.ents:
        # ent.text: The entity text
        # ent.label_: The label assigned by NER (e.g., PERSON, GPE, ORG)
        print(f"Entity: {ent.text:<20} Label: {ent.label_:<10} ({spacy.explain(ent.label_):<30})")
else:
    print("No named entities found.")

print("\n--- Sentences ---")
for sent in doc.sents:
    print(f"Sentence: {sent.text}")


#----- Analysis 3
print("--- Document Summary ---")
print(f"Text: {doc.text}")
print(f"Number of tokens: {len(doc)}")

print("\n--- Named Entities ---")
if doc.ents:
    for ent in doc.ents:
        print(f"  - Entity: {ent.text:<20} Label: {ent.label_:<10} ({spacy.explain(ent.label_):<30})")
else:
    print("No named entities found.")

print("\n--- Noun Chunks ---")
if doc.noun_chunks:
    for chunk in doc.noun_chunks:
        print(f"  - {chunk.text:<20} (Root: {chunk.root.text}, Root POS: {chunk.root.pos_}, Root Dep: {chunk.root.dep_})")
else:
    print("No noun chunks found.")

print("\n--- Token Details (Token, POS, Lemma, Dependency, Stop Word) ---")
print("{:<15} {:<10} {:<10} {:<15} {:<10}".format("Token", "POS", "Lemma", "Dependency", "Is Stop?"))
print("-" * 65)
for token in doc:
    print(f"{token.text:<15} {token.pos_:<10} {token.lemma_:<10} {token.dep_:<15} {str(token.is_stop):<10}")

print("\n--- Sentence Segmentation ---")
for i, sent in enumerate(doc.sents):
    print(f"Sentence {i+1}: {sent.text}")
```

### Spacy NER
In spaCy, you can get the list of all entity labels supported by a loaded model through the `ner` pipeline component.


```python
import spacy

# Load a spaCy model (e.g., 'en_core_web_sm' for English)
# Make sure you have downloaded the model first: python -m spacy download en_core_web_sm
nlp = spacy.load("en_core_web_sm")

# Access the 'ner' pipeline component
if "ner" in nlp.pipe_names:
    ner_component = nlp.get_pipe("ner")
    labels = ner_component.labels
    print("List of NER labels supported by this model:")
    for label in sorted(labels): # Sort for cleaner output
        print(f"- {label}")
else:
    print("The loaded spaCy model does not have an 'ner' pipeline component.")

print("\n--- Explanations for common labels ---")
# You can also get explanations for what each label means
# Note: Not all labels might have an explanation in spacy.explain()
common_labels = ["ORG", "PRODUCT", "PERSON", "GPE", "LOC", "DATE", "NORP", "FAC", "EVENT", "WORK_OF_ART", "LAW", "LANGUAGE", "MONEY"]
for label in common_labels:
    explanation = spacy.explain(label)
    if explanation:
        print(f"{label:<15}: {explanation}")
    else:
        print(f"{label:<15}: No specific explanation found (or it's a custom label)")

```

**Explanation:**

1.  **`nlp = spacy.load("en_core_web_sm")`**: You first load a pre-trained spaCy model. These models contain various NLP components, including the Named Entity Recognizer (NER).
2.  **`if "ner" in nlp.pipe_names:`**: This checks if the loaded `nlp` object actually has an "ner" component in its processing pipeline. Most standard `en_core_web_xx` models do.
3.  **`ner_component = nlp.get_pipe("ner")`**: This retrieves the specific Named Entity Recognizer component from the pipeline.
4.  **`labels = ner_component.labels`**: The `labels` attribute of the `ner_component` holds a `tuple` (or `set`) of all the named entity types that the model is trained to recognize.
5.  **`spacy.explain(label)`**: This is a very useful function provided by spaCy that gives a brief explanation for common linguistic features and entity labels. It's great for understanding what each label signifies.

This will output a list of labels like:

```
List of NER labels supported by this model:
- CARDINAL
- DATE
- EVENT
- FAC
- GPE
- LANGUAGE
- LAW
- LOC
- MONEY
- NORP
- ORDINAL
- ORG
- PERCENT
- PERSON
- PRODUCT
- QUANTITY
- TIME
- WORK_OF_ART

--- Explanations for common labels ---
ORG            : Companies, agencies, institutions, etc.
PRODUCT        : Objects, vehicles, foods, etc. (Not services.)
PERSON         : People, including fictional.
GPE            : Countries, cities, states.
LOC            : Non-GPE locations, mountain ranges, bodies of water.
DATE           : Absolute or relative dates or periods.
NORP           : Nationalities or religious or political groups.
FAC            : Buildings, airports, highways, bridges, etc.
EVENT          : Named hurricanes, battles, wars, sports events, etc.
WORK_OF_ART    : Titles of books, songs, etc.
LAW            : Named documents made into laws.
LANGUAGE       : Any named language.
MONEY          : Monetary values, including unit.
```


## NLTK
```python
import nltk
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.tag import pos_tag
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet

# Download necessary NLTK data (run these lines once)
try:
    nltk.data.find('tokenizers/punkt')
except nltk.downloader.DownloadError:
    nltk.download('punkt')
try:
    nltk.data.find('taggers/averaged_perceptron_tagger')
except nltk.downloader.DownloadError:
    nltk.download('averaged_perceptron_tagger')
try:
    nltk.data.find('corpora/wordnet')
except nltk.downloader.DownloadError:
    nltk.download('wordnet')
try:
    nltk.data.find('chunkers/maxent_ne_chunker')
except nltk.downloader.DownloadError:
    nltk.download('maxent_ne_chunker')
try:
    nltk.data.find('corpora/words')
except nltk.downloader.DownloadError:
    nltk.download('words')

pitch_text = "Barkha Dutt is a renowned Indian journalist. Known for her journalism style."

# Initialize the lemmatizer
lemmatizer = WordNetLemmatizer()

# --- Analysis 1: Basic Text Properties ---
print("--- Basic Text Properties ---")
print("Text:", pitch_text)

# Tokenization: NLTK provides separate functions for word and sentence tokenization
tokens = word_tokenize(pitch_text)
print("Number of tokens:", len(tokens))

# Named Entities: NLTK's NER is typically done after POS tagging and then chunking
# We'll do this in Analysis 2 for better integration

# Noun Chunks: NLTK doesn't have a direct 'noun_chunks' property like spaCy.
# You'd typically extract noun phrases using a shallower parser or regex patterns
# after POS tagging. For this example, we'll focus on the core functionalities.
print("Noun Chunks: (NLTK requires explicit grammar rules or shallow parsing for direct extraction)")


# --- Analysis 2: Token-level Analysis (POS, Lemma, Stop Words) ---
print("\n--- Tokenization, POS Tagging, and Lemmatization ---")
print("{:<15} {:<10} {:<10} {:<10}".format("Token", "POS", "Lemma", "Is Stop"))
print("-" * 55)

# POS Tagging
pos_tags = pos_tag(tokens)

# Function to convert NLTK POS tag to WordNet POS tag for lemmatization
def get_wordnet_pos(tag):
    if tag.startswith('J'):
        return wordnet.ADJ
    elif tag.startswith('V'):
        return wordnet.VERB
    elif tag.startswith('N'):
        return wordnet.NOUN
    elif tag.startswith('R'):
        return wordnet.ADV
    else:
        return wordnet.NOUN # Default to Noun

# Stop words check
from nltk.corpus import stopwords
stop_words = set(stopwords.words('english'))

for token, tag in pos_tags:
    lemma = lemmatizer.lemmatize(token, get_wordnet_pos(tag))
    is_stop = token.lower() in stop_words
    print(f"{token:<15} {tag:<10} {lemma:<10} {str(is_stop):<10}")

print("\n--- Named Entity Recognition (NER) ---")
# NLTK's NER
# The ne_chunk function builds a parse tree, with named entities as subtrees
named_entities = nltk.ne_chunk(pos_tags)

found_entities = False
for tree in named_entities:
    if hasattr(tree, 'label'):
        print(f"Entity: {' '.join([leaf[0] for leaf in tree.leaves()]):<20} Label: {tree.label():<10}")
        found_entities = True
if not found_entities:
    print("No named entities found.")


print("\n--- Sentences ---")
sentences = sent_tokenize(pitch_text)
for i, sent in enumerate(sentences):
    print(f"Sentence {i+1}: {sent}")


# --- Analysis 3: Document Summary (recap and structured output) ---
print("\n--- Document Summary ---")
print(f"Text: {pitch_text}")
print(f"Number of tokens: {len(tokens)}")

print("\n--- Named Entities ---")
found_entities_summary = False
for tree in named_entities:
    if hasattr(tree, 'label'):
        print(f"  - Entity: {' '.join([leaf[0] for leaf in tree.leaves()]):<20} Label: {tree.label():<10}")
        found_entities_summary = True
if not found_entities_summary:
    print("No named entities found.")

print("\n--- Noun Chunks (Approximation using POS tags) ---")
# This is a very basic approximation. For true noun chunks, you'd use a RegexpParser.
noun_phrase_grammar = r"""
  NP: {<DT|PP\$>?<JJ.*>*<NN.*>+}   # Chunk sequences of DT, JJ, NN
      {<NNP>+}                        # Chunk sequences of proper nouns
"""
cp = nltk.RegexpParser(noun_phrase_grammar)
chunked_text = cp.parse(pos_tags)

found_noun_chunks = False
for subtree in chunked_text.subtrees():
    if subtree.label() == 'NP':
        print(f"  - {' '.join([token for token, pos in subtree.leaves()]):<20}")
        found_noun_chunks = True
if not found_noun_chunks:
    print("No noun chunks found using basic regex grammar.")


print("\n--- Token Details (Token, POS, Lemma, Is Stop?) ---")
print("{:<15} {:<10} {:<10} {:<10}".format("Token", "POS", "Lemma", "Is Stop?"))
print("-" * 50)
for token, tag in pos_tags:
    lemma = lemmatizer.lemmatize(token, get_wordnet_pos(tag))
    is_stop = token.lower() in stop_words
    print(f"{token:<15} {tag:<10} {lemma:<10} {str(is_stop):<10}")

print("\n--- Sentence Segmentation ---")
for i, sent in enumerate(sentences):
    print(f"Sentence {i+1}: {sent}")
```
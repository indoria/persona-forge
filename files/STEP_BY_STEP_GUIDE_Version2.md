# Step-by-Step Guide: Building the AI Personas Backend (Novice-Friendly, Colab Focus)

This guide will help you, as a beginner, understand how to create the AI backend for the AI Personas project. It uses **Python**, **Flask**, **SQLAlchemy**, **NLTK**, **spaCy**, and **scikit-learn**—all of which you can experiment with in Google Colab. You will see code examples and clear explanations along the way.

---

## 1. **Understand the Components**

### What You’re Building

- **User authentication**: Login with email/phone + OTP.
- **Personas**: Predefined (like Christopher Hitchens) and user-created.
- **Knowledge Base**: Users can add Q&A pairs.
- **AI Conversation**: Chat with personas; responses depend on persona, mode, and knowledge.
- **NLP/ML**: Uses NLTK, spaCy, and scikit-learn for text processing and simple ML.

---

## 2. **Prepare Your Colab Notebook**

### a. **Install Dependencies**

In a Colab cell, run:

```python
!pip install flask flask_sqlalchemy flask_jwt_extended flask_cors psycopg2-binary nltk spacy scikit-learn
!python -m spacy download en_core_web_sm
import nltk
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('stopwords')
```

### b. **Set Up Your Project Structure (in Colab)**

In Colab, you can simulate module files using `%%writefile`:

```python
# Example: Writing a module file in Colab
%%writefile persona.py
# (Paste the persona.py code here)
```

Repeat this for each module (persona.py, mode.py, etc.) as you go.

---

## 3. **Write the Core AI/NLP Modules**

### a. **Persona Module**

```python name=persona.py
"""
Persona module: Defines persona characteristics, behaviors, and training logic.
"""

class Persona:
    def __init__(self, name, description, training_data, is_predefined=True):
        self.name = name
        self.description = description
        self.training_data = training_data
        self.is_predefined = is_predefined

# Predefined personas
PREDEFINED_PERSONAS = [
    Persona(
        name="Christopher Hitchens",
        description="Journalist, polemicist, author. Style: witty, erudite, incisive.",
        training_data="Argue with clarity, wit, and erudition.",
        is_predefined=True,
    ),
    Persona(
        name="Bill Byrne",
        description="Brand marketing expert. Style: pragmatic, results-driven, creative.",
        training_data="Focus on practical marketing advice.",
        is_predefined=True,
    ),
    Persona(
        name="Hajira Amla",
        description="Digital journalist. Style: curious, analytical, engaging.",
        training_data="Ask probing questions and be engaging.",
        is_predefined=True,
    ),
]
```

### b. **Mode Module**

```python name=mode.py
"""
Conversation mode module: Provides mode logic.
"""

MODES = {
    "interviewer": {
        "description": "Acts as an interviewer, asking insightful questions.",
        "tone": "curious, probing"
    },
    "critic": {
        "description": "Acts as a critic, giving constructive feedback.",
        "tone": "critical, analytical"
    },
    "educator": {
        "description": "Acts as an educator, explaining concepts clearly.",
        "tone": "clear, informative"
    }
}

def get_mode(mode_name):
    return MODES.get(mode_name, MODES["educator"])
```

### c. **Knowledge Base Module**

```python name=knowledge_base.py
"""
Knowledge base: Simple in-memory Q&A.
"""

class KnowledgeBase:
    def __init__(self):
        self.entries = []

    def add_entry(self, question, answer):
        self.entries.append({'question': question, 'answer': answer})

    def find_answer(self, user_input):
        for entry in self.entries:
            if entry['question'].lower() in user_input.lower():
                return entry['answer']
        return None
```

### d. **NLP Module**

```python name=nlp.py
"""
NLP module: uses NLTK, spaCy for preprocessing and entity extraction.
"""
import spacy
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

nlp = spacy.load("en_core_web_sm")
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

def preprocess(text):
    # Lowercase and tokenize
    tokens = nltk.word_tokenize(text.lower())
    # Lemmatize and remove stopwords/punctuation
    tokens = [lemmatizer.lemmatize(tok) for tok in tokens if tok.isalpha() and tok not in stop_words]
    return tokens

def extract_entities(text):
    doc = nlp(text)
    return [(ent.text, ent.label_) for ent in doc.ents]
```

### e. **Conversation Module**

```python name=conversation.py
"""
Conversation module: manages conversation flow and AI persona response generation.
"""
from nlp import preprocess, extract_entities

def generate_response(user_input, persona, mode, knowledge_base):
    tokens = preprocess(user_input)
    entities = extract_entities(user_input)
    # Try to match a KB entry
    kb_answer = knowledge_base.find_answer(user_input)
    if kb_answer:
        return kb_answer

    # Fallback: Persona-driven, mode-influenced template
    mode_data = mode
    response = (
        f"[{persona.name} - {list(mode_data.keys())[0].title()}]: "
        f"As someone who is {mode_data['tone']}, "
        f"I think about your question: '{user_input}'. (No KB answer found.)"
    )
    return response
```

---

## 4. **Test the AI Logic in Colab**

### a. **Set Up a Test Script**

```python
from persona import PREDEFINED_PERSONAS, Persona
from mode import get_mode
from knowledge_base import KnowledgeBase
from conversation import generate_response

# Create user KB and add an entry
kb = KnowledgeBase()
kb.add_entry("What is branding?", "Branding is the process of creating a unique identity for a product.")

# Choose a persona and mode
persona = PREDEFINED_PERSONAS[1]  # Bill Byrne
mode = get_mode("educator")

# Simulate a user input
user_input = "Can you explain what is branding?"

# Generate a response
response = generate_response(user_input, persona, mode, kb)
print(response)
```

---

## 5. **Takeaways and Next Steps**

- You can **extend** this by adding intent classifiers (with scikit-learn) or more complex persona logic.
- **Experiment**: Change personas, training data, and modes to see different AI behaviors.
- Once happy, you can integrate this logic into a Flask API.

---

## 6. **(Optional) Flask Integration in Colab**

You can run a Flask app inside Colab using the `flask` command, but for the AI logic, start with the above.

**Sample Flask Endpoint in Colab:**

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/conversation', methods=['POST'])
def conversation_api():
    data = request.json
    persona_name = data.get('persona', 'Bill Byrne')
    mode_name = data.get('mode', 'educator')
    user_input = data['input']

    persona = next((p for p in PREDEFINED_PERSONAS if p.name == persona_name), PREDEFINED_PERSONAS[0])
    mode = get_mode(mode_name)
    kb = KnowledgeBase()  # In real app, fetch user's KB
    kb.add_entry("What is branding?", "Branding is the process of creating a unique identity for a product.")

    response = generate_response(user_input, persona, mode, kb)
    return jsonify({"response": response})

# In Colab, run: !flask run --port=5000
```

**Note:** For persistent storage, you’d need a real database, which is outside Colab’s scope. Use in-memory objects for testing and learning.

---

## 7. **Tips for Novices**

- **Write, run, and experiment** frequently. Change the code and observe.
- **Read error messages**—they help you learn!
- **Refer to [Python docs](https://docs.python.org/3/), [NLTK](https://www.nltk.org/), [spaCy](https://spacy.io/), and [Flask](https://flask.palletsprojects.com/)** for help.
- **Ask questions** and use tutorials for each tool as needed.

---

You now have a practical, hands-on foundation for building the AI part of your personas project!
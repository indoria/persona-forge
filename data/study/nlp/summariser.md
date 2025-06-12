# Spacy based
```python
import spacy
from collections import defaultdict
from heapq import nlargest

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    print("SpaCy model 'en_core_web_sm' not found. Please run: python -m spacy download en_core_web_sm")
    exit()

def summarize_text_spacy(text, num_sentences=3):
    doc = nlp(text)

    sentences = [str(sent).strip() for sent in doc.sents]

    if len(sentences) <= num_sentences:
        return text

    word_frequencies = defaultdict(int)
    for token in doc:
        if not token.is_stop and not token.is_punct and token.text.strip():
            word_frequencies[token.lemma_.lower()] += 1

    if not word_frequencies:
        return text

    max_frequency = max(word_frequencies.values())
    for word in word_frequencies:
        word_frequencies[word] = (word_frequencies[word] / max_frequency)

    sentence_scores = defaultdict(int)
    for i, sentence in enumerate(sentences):
        sentence_doc = nlp(sentence)
        for token in sentence_doc:
            lemma = token.lemma_.lower()
            if lemma in word_frequencies:
                sentence_scores[i] += word_frequencies[lemma]

    summary_sentence_indices = nlargest(num_sentences, sentence_scores, key=sentence_scores.get)
    summary_sentence_indices.sort()

    summary = [sentences[i] for i in summary_sentence_indices]
    return " ".join(summary)

long_text = """
Natural Language Processing (NLP) is a field of artificial intelligence that focuses on enabling computers to understand, interpret, and generate human language. It combines computational linguistics—rule-based modeling of human language—with statistical, machine learning, and deep learning models. NLP techniques are used in various applications, including translation services, spam detection, sentiment analysis, and virtual assistants. The goal of NLP is to bridge the gap between human communication and computer understanding. Recent advancements in deep learning, particularly with transformer models, have significantly improved NLP capabilities, leading to more accurate and nuanced language processing. Artificial intelligence continues to evolve rapidly, influencing many sectors beyond just language. Its impact on data analysis and automation is profound, transforming industries and creating new opportunities.
"""

print("Original Text:\n", long_text)

short_summary = summarize_text_spacy(long_text, num_sentences=2)
print("\n--- Summary (2 sentences) using spaCy ---")
print(short_summary)

long_summary = summarize_text_spacy(long_text, num_sentences=4)
print("\n--- Summary (4 sentences) using spaCy ---")
print(long_summary)

if "ner" in nlp.pipe_names:
    ner_component = nlp.get_pipe("ner")
    labels = ner_component.labels
    print("List of NER labels supported by this model:")
    for label in sorted(labels): # Sort for cleaner output
        print(f"- {label}")
else:
    print("The loaded spaCy model does not have an 'ner' pipeline component.")

print("\n--- Explanations for common labels ---")
common_labels = ["ORG", "PRODUCT", "PERSON", "GPE", "LOC", "DATE", "NORP", "FAC", "EVENT", "WORK_OF_ART", "LAW", "LANGUAGE", "MONEY"]
for label in common_labels:
    explanation = spacy.explain(label)
    if explanation:
        print(f"{label:<15}: {explanation}")
    else:
        print(f"{label:<15}: No specific explanation found (or it's a custom label)")

```



# Transformer based
```python
!pip install transformers torch
from transformers import pipeline

def summarize_with_transformer(text):
    #summarizer = pipeline("summarization", model="sshleifer/distilbart-cnn-12-6", framework="pt")
    summarizer = pipeline("summarization")

    summary = summarizer(text, max_length=130, min_length=30, do_sample=False)

    return summary[0]['summary_text']

summary_result_transformer = summarize_with_transformer(input_data)
print("\nTransformer Summary:")
print_w(summary_result_transformer)
```

# NLTK based 1
```python
from urllib.request import urlopen
from urllib.error import URLError, HTTPError
from bs4 import BeautifulSoup

import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize

nltk.download('stopwords')
nltk.download('punkt')
nltk.download('punkt_tab')

import re


def print_w(text, wcount = 10):
    words = text.split()
    word_count = 0

    for word in words:
        print(word, end=" ")
        word_count += 1

        if word_count == wcount:
            print()
            word_count = 0

def fetch_html_content(url):
    try:
        with urlopen(url) as response:
            return response.read().decode('utf8')
    except HTTPError as e:
        print(f"HTTP Error: {e.code} - {e.reason}")
        return None
    except URLError as e:
        print(f"URL Error: {e.reason}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None


def extract_article_text(html_content):
    if not html_content:
        return ""

    soup = BeautifulSoup(html_content, 'html.parser')
    article_paragraphs = []
    for paragraph in soup.find_all(['p', 'div', 'span']):
        if paragraph.get_text(strip=True) and not paragraph.find_parents(['header', 'footer', 'nav', 'aside']):
            article_paragraphs.append(paragraph.get_text(separator=' ', strip=True))
    
    return " ".join(article_paragraphs)

def calculate_word_frequencies(text_string):
    stop_words = set(stopwords.words('english'))
    words = word_tokenize(text_string)
    frequency = {}

    for word in words:
        word = word.lower()
        if word.isalpha() and word not in stop_words:
            frequency[word] = frequency.get(word, 0) + 1

    if not frequency:
        return {}

    max_freq = max(frequency.values())
    frequency_table = {word: freq / max_freq for word, freq in frequency.items()}
    print(frequency_table)
    return frequency_table


def score_sentences(sentences, word_frequencies):
    sentence_scores = {}
    for sentence in sentences:
        print(word_tokenize(sentence))
        temp_score = sum(word_frequencies.get(word.lower(), 0) for word in word_tokenize(sentence))
        if sentence:
            sentence_scores[sentence] = temp_score

    print(sentence_scores)
    return sentence_scores


def generate_summary_text(sentence_scores, sentences, threshold_multiplier=1.3):
    if not sentence_scores:
        return ""

    threshold = threshold_multiplier * (sum(sentence_scores.values()) / len(sentence_scores))
    summary_sentences = [sentence for sentence in sentences if sentence_scores.get(sentence, 0) > threshold]
    return " ".join(summary_sentences)


def summarize_content(input_data):
    article_text = ""

    if re.match(r'^https?://', input_data):  # It's a URL
        print("Input recognized as a URL.")
        html_content = fetch_html_content(input_data)
        if not html_content:
            return "Error: Could not retrieve content from the URL."
        article_text = extract_article_text(html_content)
    elif "<body>" in input_data or "<html" in input_data or "<!DOCTYPE html>" in input_data:  # It's likely HTML
        print("Input recognized as HTML content.")
        article_text = extract_article_text(input_data)
    else:  # Assume it's raw text
        print("Input recognized as raw text.")
        article_text = input_data

    if not article_text.strip():
        return "Warning: Could not extract significant text or input was empty."

    word_frequencies = calculate_word_frequencies(article_text)
    sentences = sent_tokenize(article_text)

    if not sentences:
        return "No summary generated. Could not tokenize any sentences."

    sentence_scores = score_sentences(sentences, word_frequencies)
    if not sentence_scores:
        return "No summary generated. Could not calculate sentence scores."

    summary = generate_summary_text(sentence_scores, sentences)
    return summary


# input_data = 'https://timesofindia.indiatimes.com/india/meghalaya-honeymoon-murder-4-days-after-wedding-sonam-came-to-parents-home-to-plot-murder-cops-say/articleshow/121738101.cms'

input_data = "Natural language processing (NLP) is a subfield of artificial intelligence. It focuses on enabling computers to understand, interpret, and generate human language. NLP combines computational linguistics. It also integrates machine learning. The goal is to bridge the gap between human communication and computer understanding."

summary_result = summarize_content(input_data)
print_w(summary_result)
```

# NLTK based 2

Here's a concise text summarizer using NLTK. This summarizer works by:

1.  **Tokenizing** the text into sentences.
2.  **Calculating word frequencies** to identify important words.
3.  **Scoring each sentence** based on the frequency of its words.
4.  **Selecting the top-scoring sentences** to form the summary.

```python
import nltk
from nltk.tokenize import sent_tokenize, word_tokenize
from nltk.corpus import stopwords
from collections import defaultdict
from heapq import nlargest # For efficient selection of top sentences

# Download necessary NLTK data (run these lines once)
try:
    nltk.data.find('tokenizers/punkt')
except nltk.downloader.DownloadError:
    nltk.download('punkt')
try:
    nltk.data.find('corpora/stopwords')
except nltk.downloader.DownloadError:
    nltk.download('stopwords')

def summarize_text(text, num_sentences=3):
    """
    Generates a summary of the given text using NLTK.

    Args:
        text (str): The input text to summarize.
        num_sentences (int): The desired number of sentences in the summary.

    Returns:
        str: The summarized text.
    """
    # 1. Tokenize text into sentences
    sentences = sent_tokenize(text)

    # If the text has fewer sentences than requested, return the original text
    if len(sentences) <= num_sentences:
        return text

    # 2. Calculate word frequencies
    stop_words = set(stopwords.words('english'))
    word_frequencies = defaultdict(int)

    for sentence in sentences:
        for word in word_tokenize(sentence.lower()):
            if word.isalnum() and word not in stop_words:
                word_frequencies[word] += 1

    # If no significant words found, return original text or a message
    if not word_frequencies:
        return text

    # Normalize frequencies (optional, but good practice for longer texts)
    max_frequency = max(word_frequencies.values())
    for word in word_frequencies:
        word_frequencies[word] = (word_frequencies[word] / max_frequency)

    # 3. Score each sentence
    sentence_scores = defaultdict(int)
    for i, sentence in enumerate(sentences):
        for word in word_tokenize(sentence.lower()):
            if word in word_frequencies:
                sentence_scores[i] += word_frequencies[word]

    # 4. Select the top-scoring sentences
    # nlargest returns a list of the n largest elements from an iterable.
    # Here, we get tuples of (score, sentence_index) and then extract the indices.
    summary_sentence_indices = nlargest(num_sentences, sentence_scores, key=sentence_scores.get)
    summary_sentence_indices.sort() # Sort to maintain original sentence order

    summary = [sentences[i] for i in summary_sentence_indices]
    return " ".join(summary)

# --- Example Usage ---
if __name__ == "__main__":
    long_text = """
    Natural Language Processing (NLP) is a field of artificial intelligence that focuses on enabling computers to understand, interpret, and generate human language. It combines computational linguistics—rule-based modeling of human language—with statistical, machine learning, and deep learning models. NLP techniques are used in various applications, including translation services, spam detection, sentiment analysis, and virtual assistants. The goal of NLP is to bridge the gap between human communication and computer understanding. Recent advancements in deep learning, particularly with transformer models, have significantly improved NLP capabilities, leading to more accurate and nuanced language processing.
    """

    short_summary = summarize_text(long_text, num_sentences=2)
    print("Original Text:\n", long_text)
    print("\n--- Summary (2 sentences) ---")
    print(short_summary)

    long_summary = summarize_text(long_text, num_sentences=4)
    print("\n--- Summary (4 sentences) ---")
    print(long_summary)
```

### How it works:

* **`nltk.tokenize.sent_tokenize`**: Splits the input text into a list of individual sentences.
* **`nltk.tokenize.word_tokenize`**: Breaks down each sentence into words.
* **`nltk.corpus.stopwords`**: Provides a list of common words (like "the", "is", "a") that are usually filtered out because they don't carry much meaning for summarization.
* **`collections.defaultdict`**: Used to easily count word frequencies.
* **`heapq.nlargest`**: An efficient way to find the `num_sentences` with the highest scores.

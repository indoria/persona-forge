# Deep Dive: AI Personality System Components

## 1. Personality Authenticity Algorithms

### Overview
Personality authenticity algorithms ensure that AI-generated responses maintain consistency with the target personality's documented behavior, speech patterns, and thought processes. These algorithms operate at multiple levels to validate and score response authenticity.

### 1.1 Multi-Layer Authenticity Framework

#### Layer 1: Lexical Authenticity
```python
class LexicalAuthenticityScorer:
    def __init__(self, personality_corpus):
        self.personality_vocabulary = self.extract_vocabulary_profile(personality_corpus)
        self.phrase_patterns = self.extract_phrase_patterns(personality_corpus)
        self.word_frequency_distribution = self.build_frequency_model(personality_corpus)
    
    def score_lexical_authenticity(self, response_text):
        # Vocabulary overlap with personality corpus
        vocab_score = self.calculate_vocabulary_overlap(response_text)
        
        # Phrase pattern matching
        phrase_score = self.match_characteristic_phrases(response_text)
        
        # Word frequency distribution similarity
        frequency_score = self.compare_frequency_distributions(response_text)
        
        return {
            'vocabulary_overlap': vocab_score,
            'phrase_patterns': phrase_score,
            'frequency_distribution': frequency_score,
            'weighted_score': 0.3 * vocab_score + 0.4 * phrase_score + 0.3 * frequency_score
        }
```

#### Layer 2: Syntactic Authenticity
```python
class SyntacticAuthenticityScorer:
    def __init__(self, personality_corpus):
        self.sentence_structure_patterns = self.analyze_syntax_patterns(personality_corpus)
        self.complexity_metrics = self.calculate_complexity_baseline(personality_corpus)
    
    def score_syntactic_authenticity(self, response_text):
        parsed_sentences = self.parse_syntax(response_text)
        
        # Sentence length distribution
        length_score = self.compare_sentence_lengths(parsed_sentences)
        
        # Syntactic complexity
        complexity_score = self.compare_syntactic_complexity(parsed_sentences)
        
        # Sentence structure patterns
        structure_score = self.match_structure_patterns(parsed_sentences)
        
        return {
            'sentence_length': length_score,
            'complexity': complexity_score,
            'structure_patterns': structure_score,
            'weighted_score': 0.3 * length_score + 0.4 * complexity_score + 0.3 * structure_score
        }
```

#### Layer 3: Semantic Authenticity
```python
class SemanticAuthenticityScorer:
    def __init__(self, personality_corpus):
        self.topic_embeddings = self.create_topic_embeddings(personality_corpus)
        self.concept_networks = self.build_concept_networks(personality_corpus)
        self.argumentation_patterns = self.extract_argumentation_patterns(personality_corpus)
    
    def score_semantic_authenticity(self, response_text, context):
        # Topic coherence with personality's known interests
        topic_score = self.calculate_topic_coherence(response_text)
        
        # Conceptual reasoning patterns
        reasoning_score = self.analyze_reasoning_patterns(response_text)
        
        # Argumentation style consistency
        argument_score = self.match_argumentation_style(response_text)
        
        return {
            'topic_coherence': topic_score,
            'reasoning_patterns': reasoning_score,
            'argumentation_style': argument_score,
            'weighted_score': 0.4 * topic_score + 0.3 * reasoning_score + 0.3 * argument_score
        }
```

### 1.2 Feature-Based Authenticity Validation

#### Personality Trait Consistency Checker
```python
class PersonalityTraitValidator:
    def __init__(self, personality_config):
        self.expected_traits = personality_config.personality_traits
        self.speaking_style = personality_config.speaking_style
        
    def validate_trait_expression(self, response_text):
        detected_traits = {}
        
        # Directness detection
        detected_traits['directness'] = self.measure_directness(response_text)
        
        # Enthusiasm detection
        detected_traits['enthusiasm'] = self.measure_enthusiasm(response_text)
        
        # Formality detection
        detected_traits['formality'] = self.measure_formality(response_text)
        
        # Calculate deviation from expected traits
        trait_deviations = {}
        consistency_score = 0
        
        for trait, expected_value in self.expected_traits.items():
            if trait in detected_traits:
                deviation = abs(detected_traits[trait] - expected_value)
                trait_deviations[trait] = deviation
                consistency_score += max(0, 1 - deviation)  # Penalty for large deviations
        
        return {
            'detected_traits': detected_traits,
            'expected_traits': self.expected_traits,
            'deviations': trait_deviations,
            'consistency_score': consistency_score / len(self.expected_traits)
        }
    
    def measure_directness(self, text):
        # Analyze linguistic markers for directness
        direct_markers = ['clearly', 'obviously', 'simply', 'just', 'exactly']
        hedging_markers = ['perhaps', 'maybe', 'might', 'could', 'possibly']
        imperative_sentences = self.count_imperatives(text)
        
        direct_score = sum([text.lower().count(marker) for marker in direct_markers])
        hedge_score = sum([text.lower().count(marker) for marker in hedging_markers])
        
        # Normalize and combine scores
        return min(1.0, (direct_score + imperative_sentences * 0.5) / max(1, hedge_score + 1))
```

### 1.3 Contextual Authenticity Assessment

#### Expertise Domain Validator
```python
class ExpertiseValidator:
    def __init__(self, personality_config):
        self.expertise_domains = personality_config.expertise.domains
        self.confidence_levels = personality_config.expertise.confidence_levels
        
    def validate_expertise_expression(self, response_text, topic_context):
        # Determine if response is within personality's expertise
        topic_domain = self.classify_topic_domain(topic_context)
        expected_confidence = self.confidence_levels.get(topic_domain, 0.5)
        
        # Analyze confidence markers in response
        detected_confidence = self.measure_confidence_level(response_text)
        
        # Check for appropriate technical depth
        technical_depth = self.measure_technical_depth(response_text, topic_domain)
        expected_depth = self.get_expected_technical_depth(topic_domain)
        
        return {
            'topic_domain': topic_domain,
            'expected_confidence': expected_confidence,
            'detected_confidence': detected_confidence,
            'confidence_match': 1 - abs(expected_confidence - detected_confidence),
            'technical_depth_match': 1 - abs(expected_depth - technical_depth),
            'expertise_authenticity': (confidence_match + technical_depth_match) / 2
        }
    
    def measure_confidence_level(self, text):
        # Confidence indicators
        high_confidence = ['definitely', 'certainly', 'absolutely', 'clearly', 'obviously']
        low_confidence = ['probably', 'likely', 'perhaps', 'might', 'could be']
        uncertainty = ['not sure', 'unclear', 'difficult to say', 'depends']
        
        high_score = sum([text.lower().count(phrase) for phrase in high_confidence])
        low_score = sum([text.lower().count(phrase) for phrase in low_confidence])
        uncertain_score = sum([text.lower().count(phrase) for phrase in uncertainty])
        
        # Normalize to 0-1 scale
        total_indicators = high_score + low_score + uncertain_score
        if total_indicators == 0:
            return 0.5  # Neutral confidence
        
        return (high_score - uncertain_score) / total_indicators * 0.5 + 0.5
```

### 1.4 Composite Authenticity Scoring

```python
class CompositeAuthenticityScorer:
    def __init__(self, personality_config, personality_corpus):
        self.lexical_scorer = LexicalAuthenticityScorer(personality_corpus)
        self.syntactic_scorer = SyntacticAuthenticityScorer(personality_corpus)
        self.semantic_scorer = SemanticAuthenticityScorer(personality_corpus)
        self.trait_validator = PersonalityTraitValidator(personality_config)
        self.expertise_validator = ExpertiseValidator(personality_config)
        
        # Weights for different authenticity dimensions
        self.weights = {
            'lexical': 0.15,
            'syntactic': 0.15,
            'semantic': 0.25,
            'personality_traits': 0.25,
            'expertise': 0.20
        }
    
    def calculate_overall_authenticity(self, response_text, context):
        scores = {}
        
        # Individual component scores
        scores['lexical'] = self.lexical_scorer.score_lexical_authenticity(response_text)['weighted_score']
        scores['syntactic'] = self.syntactic_scorer.score_syntactic_authenticity(response_text)['weighted_score']
        scores['semantic'] = self.semantic_scorer.score_semantic_authenticity(response_text, context)['weighted_score']
        scores['personality_traits'] = self.trait_validator.validate_trait_expression(response_text)['consistency_score']
        scores['expertise'] = self.expertise_validator.validate_expertise_expression(response_text, context)['expertise_authenticity']
        
        # Calculate weighted composite score
        composite_score = sum([scores[component] * self.weights[component] for component in scores])
        
        return {
            'component_scores': scores,
            'composite_score': composite_score,
            'authenticity_rating': self.get_authenticity_rating(composite_score),
            'improvement_suggestions': self.generate_improvement_suggestions(scores)
        }
    
    def get_authenticity_rating(self, score):
        if score >= 0.9: return "Excellent"
        elif score >= 0.8: return "Good"
        elif score >= 0.7: return "Acceptable"
        elif score >= 0.6: return "Needs Improvement"
        else: return "Poor"
```

---

## 2. Knowledge Ingestion Pipeline

### Overview
The knowledge ingestion pipeline processes diverse content sources to build personality-specific knowledge bases that maintain authenticity and relevance for response generation.

### 2.1 Content Source Processing

#### Multi-Format Content Extractor
```python
class ContentExtractor:
    def __init__(self):
        self.extractors = {
            'pdf': self.extract_from_pdf,
            'audio': self.extract_from_audio,
            'video': self.extract_from_video,
            'web': self.extract_from_web,
            'text': self.extract_from_text,
            'epub': self.extract_from_epub
        }
    
    def extract_content(self, source):
        content_type = self.detect_content_type(source)
        extractor = self.extractors.get(content_type)
        
        if not extractor:
            raise ValueError(f"Unsupported content type: {content_type}")
        
        raw_content = extractor(source)
        
        return ContentDocument(
            source=source,
            content_type=content_type,
            raw_text=raw_content['text'],
            metadata=raw_content['metadata'],
            structure=raw_content.get('structure', {}),
            timestamp=datetime.now()
        )
    
    def extract_from_audio(self, audio_source):
        # Transcribe using Whisper or similar
        transcript = self.transcribe_audio(audio_source.path)
        
        # Extract speaker information and timestamps
        speaker_segments = self.diarize_speakers(audio_source.path)
        
        return {
            'text': transcript,
            'metadata': {
                'source_type': 'audio',
                'duration': audio_source.duration,
                'speakers': speaker_segments,
                'quality_score': self.assess_audio_quality(audio_source.path)
            },
            'structure': {
                'segments': speaker_segments,
                'topics': self.extract_topic_boundaries(transcript)
            }
        }
    
    def extract_from_video(self, video_source):
        # Extract audio for transcription
        audio_path = self.extract_audio_from_video(video_source.path)
        audio_content = self.extract_from_audio(AudioSource(audio_path))
        
        # Extract visual information
        visual_context = self.extract_visual_context(video_source.path)
        
        return {
            'text': audio_content['text'],
            'metadata': {
                **audio_content['metadata'],
                'source_type': 'video',
                'visual_elements': visual_context,
                'slides_extracted': len(visual_context.get('slides', []))
            },
            'structure': {
                **audio_content['structure'],
                'visual_timeline': visual_context.get('timeline', [])
            }
        }
```

### 2.2 Content Quality Assessment

#### Authenticity and Relevance Scorer
```python
class ContentQualityAssessor:
    def __init__(self, personality_id):
        self.personality_id = personality_id
        self.personality_profile = self.load_personality_profile(personality_id)
        
    def assess_content_quality(self, content_document):
        quality_metrics = {}
        
        # Source reliability
        quality_metrics['source_reliability'] = self.assess_source_reliability(content_document.source)
        
        # Content authenticity (actually from the personality)
        quality_metrics['authenticity'] = self.assess_content_authenticity(content_document)
        
        # Relevance to personality's expertise
        quality_metrics['relevance'] = self.assess_content_relevance(content_document)
        
        # Information quality
        quality_metrics['information_quality'] = self.assess_information_quality(content_document)
        
        # Temporal relevance
        quality_metrics['temporal_relevance'] = self.assess_temporal_relevance(content_document)
        
        # Calculate composite quality score
        composite_score = self.calculate_composite_quality(quality_metrics)
        
        return QualityAssessment(
            metrics=quality_metrics,
            composite_score=composite_score,
            recommendations=self.generate_quality_recommendations(quality_metrics),
            should_include=composite_score >= 0.7
        )
    
    def assess_content_authenticity(self, content_document):
        # Check if content is actually from the personality
        source_indicators = {
            'direct_quotes': self.find_direct_quotes(content_document.raw_text),
            'first_person_narrative': self.detect_first_person(content_document.raw_text),
            'biographical_consistency': self.check_biographical_facts(content_document.raw_text),
            'writing_style_match': self.compare_writing_style(content_document.raw_text)
        }
        
        # Weight different authenticity indicators
        authenticity_score = (
            source_indicators['direct_quotes'] * 0.3 +
            source_indicators['first_person_narrative'] * 0.2 +
            source_indicators['biographical_consistency'] * 0.3 +
            source_indicators['writing_style_match'] * 0.2
        )
        
        return {
            'score': authenticity_score,
            'indicators': source_indicators,
            'confidence': self.calculate_authenticity_confidence(source_indicators)
        }
    
    def assess_content_relevance(self, content_document):
        # Topic relevance to personality's expertise
        content_topics = self.extract_topics(content_document.raw_text)
        expertise_overlap = self.calculate_expertise_overlap(content_topics)
        
        # Contextual relevance (time period, cultural context)
        contextual_relevance = self.assess_contextual_relevance(content_document)
        
        return {
            'expertise_overlap': expertise_overlap,
            'contextual_relevance': contextual_relevance,
            'topic_depth': self.assess_topic_depth(content_document.raw_text),
            'composite_relevance': (expertise_overlap + contextual_relevance) / 2
        }
```

### 2.3 Intelligent Content Chunking

#### Context-Aware Chunker
```python
class ContextAwareChunker:
    def __init__(self, personality_id):
        self.personality_id = personality_id
        self.chunk_size_range = (500, 1500)  # tokens
        self.overlap_ratio = 0.1
        
    def chunk_content(self, content_document):
        # Analyze document structure
        structure = self.analyze_document_structure(content_document)
        
        # Choose chunking strategy based on content type
        if structure['type'] == 'lecture':
            return self.chunk_by_topic_segments(content_document, structure)
        elif structure['type'] == 'interview':
            return self.chunk_by_qa_pairs(content_document, structure)
        elif structure['type'] == 'article':
            return self.chunk_by_paragraphs(content_document, structure)
        else:
            return self.chunk_by_semantic_similarity(content_document)
    
    def chunk_by_topic_segments(self, content_document, structure):
        chunks = []
        topic_boundaries = structure.get('topic_boundaries', [])
        
        for i, boundary in enumerate(topic_boundaries):
            start_pos = boundary['start']
            end_pos = topic_boundaries[i + 1]['start'] if i + 1 < len(topic_boundaries) else len(content_document.raw_text)
            
            segment_text = content_document.raw_text[start_pos:end_pos]
            
            # Further chunk if segment is too large
            if len(segment_text.split()) > self.chunk_size_range[1]:
                sub_chunks = self.split_large_segment(segment_text)
                for sub_chunk in sub_chunks:
                    chunks.append(self.create_chunk_object(sub_chunk, boundary['topic'], content_document))
            else:
                chunks.append(self.create_chunk_object(segment_text, boundary['topic'], content_document))
        
        return chunks
    
    def chunk_by_qa_pairs(self, content_document, structure):
        chunks = []
        qa_pairs = structure.get('qa_pairs', [])
        
        for qa_pair in qa_pairs:
            # Combine question and answer into single chunk
            chunk_text = f"Q: {qa_pair['question']}\nA: {qa_pair['answer']}"
            
            chunk = self.create_chunk_object(
                text=chunk_text,
                topic=qa_pair.get('topic', 'general'),
                source_document=content_document,
                chunk_type='qa_pair',
                metadata={
                    'question': qa_pair['question'],
                    'answer': qa_pair['answer'],
                    'speaker': qa_pair.get('speaker', self.personality_id)
                }
            )
            chunks.append(chunk)
        
        return chunks
    
    def create_chunk_object(self, text, topic, source_document, chunk_type='general', metadata=None):
        return ContentChunk(
            text=text,
            topic=topic,
            chunk_type=chunk_type,
            personality_id=self.personality_id,
            source_reference=source_document.source,
            metadata=metadata or {},
            embedding=None,  # Will be populated later
            quality_score=None,  # Will be calculated
            created_at=datetime.now()
        )
```

### 2.4 Knowledge Graph Construction

#### Personality Knowledge Graph Builder
```python
class PersonalityKnowledgeGraphBuilder:
    def __init__(self, personality_id):
        self.personality_id = personality_id
        self.graph = nx.MultiDiGraph()
        self.entity_extractor = self.initialize_entity_extractor()
        self.relation_extractor = self.initialize_relation_extractor()
    
    def build_knowledge_graph(self, content_chunks):
        # Extract entities and relationships from all chunks
        for chunk in content_chunks:
            entities = self.extract_entities(chunk.text)
            relationships = self.extract_relationships(chunk.text, entities)
            
            # Add entities to graph
            for entity in entities:
                self.add_entity_to_graph(entity, chunk)
            
            # Add relationships to graph
            for relationship in relationships:
                self.add_relationship_to_graph(relationship, chunk)
        
        # Calculate entity importance scores
        self.calculate_entity_importance()
        
        # Identify key concepts and themes
        self.identify_key_concepts()
        
        return self.graph
    
    def extract_entities(self, text):
        # Use NER to extract persons, organizations, concepts, etc.
        doc = nlp(text)
        entities = []
        
        for ent in doc.ents:
            entity = {
                'text': ent.text,
                'label': ent.label_,
                'start': ent.start_char,
                'end': ent.end_char,
                'confidence': self.calculate_entity_confidence(ent)
            }
            entities.append(entity)
        
        # Extract domain-specific concepts
        domain_concepts = self.extract_domain_concepts(text)
        entities.extend(domain_concepts)
        
        return entities
    
    def extract_relationships(self, text, entities):
        relationships = []
        
        # Dependency parsing for relationships
        doc = nlp(text)
        
        for token in doc:
            if token.dep_ in ['nsubj', 'dobj', 'pobj']:
                # Extract subject-verb-object relationships
                if token.head.pos_ == 'VERB':
                    relationship = {
                        'subject': token.text,
                        'predicate': token.head.text,
                        'object': self.find_object(token.head),
                        'confidence': 0.8
                    }
                    relationships.append(relationship)
        
        # Extract co-occurrence relationships
        cooccurrence_relationships = self.extract_cooccurrence_relationships(entities, text)
        relationships.extend(cooccurrence_relationships)
        
        return relationships
    
    def add_entity_to_graph(self, entity, source_chunk):
        entity_id = self.create_entity_id(entity)
        
        if not self.graph.has_node(entity_id):
            self.graph.add_node(entity_id, **{
                'text': entity['text'],
                'type': entity['label'],
                'mentions': [],
                'importance': 0,
                'contexts': []
            })
        
        # Add mention information
        self.graph.nodes[entity_id]['mentions'].append({
            'chunk_id': source_chunk.id,
            'position': (entity['start'], entity['end']),
            'confidence': entity['confidence']
        })
        
        # Add context information
        context_window = self.extract_context_window(entity, source_chunk.text)
        self.graph.nodes[entity_id]['contexts'].append(context_window)
```

### 2.5 Vector Database Population

#### Embedding Generation and Storage
```python
class VectorDatabasePopulator:
    def __init__(self, personality_id):
        self.personality_id = personality_id
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        self.vector_db = self.initialize_vector_db()
        
    def populate_vector_database(self, content_chunks, knowledge_graph):
        processed_chunks = []
        
        for chunk in content_chunks:
            # Generate embeddings
            chunk_embedding = self.generate_chunk_embedding(chunk)
            
            # Enhance with graph context
            graph_context = self.extract_graph_context(chunk, knowledge_graph)
            enhanced_embedding = self.enhance_embedding_with_context(chunk_embedding, graph_context)
            
            # Create metadata
            metadata = self.create_chunk_metadata(chunk, graph_context)
            
            # Store in vector database
            self.store_chunk_vector(chunk, enhanced_embedding, metadata)
            
            processed_chunks.append({
                'chunk': chunk,
                'embedding': enhanced_embedding,
                'metadata': metadata
            })
        
        return processed_chunks
    
    def generate_chunk_embedding(self, chunk):
        # Generate base text embedding
        text_embedding = self.embedding_model.encode(chunk.text)
        
        # Generate topic embedding
        topic_embedding = self.embedding_model.encode(chunk.topic)
        
        # Combine embeddings (concatenate or weighted average)
        combined_embedding = np.concatenate([text_embedding, topic_embedding * 0.3])
        
        return combined_embedding
    
    def enhance_embedding_with_context(self, base_embedding, graph_context):
        # Add personality-specific context
        personality_context_embedding = self.get_personality_context_embedding()
        
        # Add temporal context
        temporal_context_embedding = self.get_temporal_context_embedding(graph_context)
        
        # Weighted combination
        enhanced_embedding = np.concatenate([
            base_embedding * 0.7,
            personality_context_embedding * 0.2,
            temporal_context_embedding * 0.1
        ])
        
        return enhanced_embedding
    
    def create_chunk_metadata(self, chunk, graph_context):
        return {
            'personality_id': self.personality_id,
            'chunk_id': chunk.id,
            'topic': chunk.topic,
            'chunk_type': chunk.chunk_type,
            'source_reference': chunk.source_reference,
            'quality_score': chunk.quality_score,
            'entities': [entity['text'] for entity in graph_context.get('entities', [])],
            'key_concepts': graph_context.get('key_concepts', []),
            'timestamp': chunk.created_at.isoformat(),
            'word_count': len(chunk.text.split()),
            'authenticity_score': graph_context.get('authenticity_score', 0.5)
        }
```

---

## 3. Feature Extraction and Annotation from Source Material

### Overview
Feature extraction involves systematically analyzing source material to quantify personality traits, speaking patterns, and behavioral characteristics that define each personality.

### 3.1 Speaking Style Feature Extraction

#### Formality Level Detection
```python
class FormalityAnalyzer:
    def __init__(self):
        self.formal_indicators = {
            'lexical': [
                'therefore', 'consequently', 'furthermore', 'moreover', 'nevertheless',
                'subsequently', 'accordingly', 'hence', 'thus', 'wherein'
            ],
            'grammatical': [
                'passive_voice', 'complex_sentences', 'subordinate_clauses',
                'formal_pronouns', 'complete_sentences'
            ],
            'stylistic': [
                'third_person', 'impersonal_constructions', 'hedging',
                'qualifications', 'precise_terminology'
            ]
        }
        
        self.informal_indicators = {
            'lexical': [
                'gonna', 'wanna', 'yeah', 'ok', 'cool', 'awesome',
                'stuff', 'things', 'guys', 'basically', 'pretty much'
            ],
            'grammatical': [
                'contractions', 'sentence_fragments', 'dangling_modifiers',
                'colloquial_grammar', 'ellipsis'
            ],
            'stylistic': [
                'direct_address', 'personal_anecdotes', 'humor',
                'exclamations', 'rhetorical_questions'
            ]
        }
    
    def analyze_formality(self, text_corpus):
        formal_scores = []
        informal_scores = []
        
        sentences = self.split_into_sentences(text_corpus)
        
        for sentence in sentences:
            formal_score = self.calculate_formal_score(sentence)
            informal_score = self.calculate_informal_score(sentence)
            
            formal_scores.append(formal_score)
            informal_scores.append(informal_score)
        
        # Calculate overall formality (0 = very informal, 1 = very formal)
        avg_formal = np.mean(formal_scores)
        avg_informal = np.mean(informal_scores)
        
        # Normalize to 0-1 scale
        formality_score = avg_formal / (avg_formal + avg_informal + 0.001)
        
        return {
            'formality_score': formality_score,
            'formal_indicators_per_sentence': avg_formal,
            'informal_indicators_per_sentence': avg_informal,
            'sentence_analysis': list(zip(sentences, formal_scores, informal_scores))
        }
    
    def calculate_formal_score(self, sentence):
        score = 0
        
        # Lexical formality
        for indicator in self.formal_indicators['lexical']:
            score += sentence.lower().count(indicator)
        
        # Grammatical formality
        score += self.count_passive_voice(sentence) * 2
        score += self.count_complex_sentences(sentence)
        score += self.count_subordinate_clauses(sentence)
        
        # Stylistic formality  
        if self.uses_third_person(sentence):
            score += 1
        if self.has_hedging(sentence):
            score += 1
            
        return score
```

#### Enthusiasm Level Detection
```python
class EnthusiasmAnalyzer:
    def __init__(self):
        self.enthusiasm_indicators = {
            'punctuation': ['!', '!!', '!!!'],
            'intensifiers': [
                'really', 'very', 'extremely', 'incredibly', 'absolutely',
                'totally', 'completely', 'amazingly', 'fantastic', 'awesome'
            ],
            'emotional_words': [
                'excited', 'thrilled', 'delighted', 'amazing', 'wonderful',
                'brilliant', 'excellent', 'outstanding', 'spectacular'
            ],
            'superlatives': [
                'best', 'greatest', 'most', 'highest', 'maximum',
                'ultimate', 'perfect', 'ideal'
            ],
            'capital_emphasis': r'[A-Z]{2,}',  # Words in ALL CAPS
            'repetition': r'(\w+)\s+\1'  # Word repetition for emphasis
        }
    
    def analyze_enthusiasm(self, text_corpus):
        sentences = self.split_into_sentences(text_corpus)
        enthusiasm_scores = []
        
        for sentence in sentences:
            score = self.calculate_enthusiasm_score(sentence)
            enthusiasm_scores.append(score)
        
        # Calculate statistics
        mean_enthusiasm = np.mean(enthusiasm_scores)
        enthusiasm_variance = np.var(enthusiasm_scores)
        peak_enthusiasm = np.max(enthusiasm_scores)
        
        # Normalize to 0-1 scale
        normalized_score = min(1.0, mean_enthusiasm / 10.0)  # Assuming max possible score is ~10
        
        return {
            'enthusiasm_score': normalized_score,
            'enthusiasm_variance': enthusiasm_variance,
            'peak_enthusiasm': peak_enthusiasm,
            'sentence_scores': enthusiasm_scores,
            'distribution': self.analyze_enthusiasm_distribution(enthusiasm_scores)
        }
    
    def calculate_enthusiasm_score(self, sentence):
        score = 0
        
        # Punctuation enthusiasm
        score += sentence.count('!') * 2
        score += sentence.count('?') * 0.5  # Rhetorical questions
        
        # Intensifier words
        for intensifier in self.enthusiasm_indicators['intensifiers']:
            score += sentence.lower().count(intensifier)
        
        # Emotional words
        for emotion_word in self.enthusiasm_indicators['emotional_words']:
            score +=
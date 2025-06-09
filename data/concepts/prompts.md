``
RAG => Retrieval Augmented Generation
CAG => Context Augmented Generation, Cache Augmented Generation
COT => Chain Of Thought
ReACT => Generate reasoning and task specific actions => Reasoning and ACTing
DSP => Direct Stimulus Prompting



Creating a Knowledge base system for an AI system
```
[Getting data ready](https://www.youtube.com/watch?v=9lBTS5dM27c)
[Github repo](https://github.com/daveebbelaar/ai-cookbook/tree/main/knowledge/docling)
//docling.document_converter => dc = new DocumentConverter => document = dc.convert(url) => dc.[export_to_dict(), export_to_markdown()]
Extraction
Parsing
// Heirarchical chunking, hybrid chunker (considers embedding model input size), 
Chunking
Embedding
Retrieval
```

```
Graph Rag
[knowledge graph](https://www.youtube.com/watch?v=O-T_6KOXML4)
[Graph RAG](https://www.youtube.com/watch?v=knDDGYHnnSI)

[Graph Rag](https://www.youtube.com/watch?v=6vG_amAshTk)
[Graph Rag Microsoft]( https://microsoft.github.io/graphrag/)
[Graph Rag Google](https://blog.google/products/search/introducing-knowledge-graph-things-not/)
[Graph Rag example](https://github.com/ALucek/GraphRAG-Breakdown)
```


```
OCR => Optical Character Recognition : Converting image of text into machine readable text
```


```
NLP Tasks
- Text classification (spam detection, topic detection)
- NER (Name Entitiy Recognizition: Name of person, organization etc.)
- Word Similrity, word analogy (King => Queen, Man => ?)
- Q and A systems. Clustering similar articales, finding related articles, recommending similar items.

Train on Wikipedia
- Tokenization and removing stop words and punctuations.
- Sliding context window identifies target and context words to learn word relationships.

Embeddings
- Frequency based like BOW, TF-IDF
- Prediction based (capture semantic relationship and contexual information b/w words)
- Contextual based embedding


word2vec
- Contineous Bag Of Word => Predict target word given a context word.
- SKIP GRAM => Predict context word given a target word.

GLOVE (Global Vectors For Word Representation)
- Uses co-occurrence statistics to create word vector.
```



```
Statquest list
[word2vec](https://www.youtube.com/watch?v=viZrOnJclY0)
[Neural Network](https://www.youtube.com/watch?v=zxagGtF9MeU&list=PLblh5JKOoLUIxGDQs4LFFD--41Vzf-ME1)
[Decoders only transformers](https://www.youtube.com/watch?v=bQ5BoolX9Ag)
[Encoder only transformers](https://www.youtube.com/watch?v=GDN649X_acE)
[Pytorch](https://www.youtube.com/watch?v=FHdlXe1bSe4)

[3b1b linear algebra](https://www.youtube.com/watch?v=fNk_zzaMoSs&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab)
[3b1b Neural Networks](https://www.youtube.com/watch?v=aircAruvnKk&list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi)

[work2vec CBOW](https://www.youtube.com/watch?v=UqRCEmrv1gQ)
```
Great — below is a **comparison table** of the two journalist personas and an **exhaustive list of parameters** that can go into your **Persona Config Panel** (editable by admins or power users).

---

## ✅ Persona Comparison Table

| Attribute               | **Barkha Dutt**                                   | **Palki Sharma Upadhyay**                                 |
| ----------------------- | ------------------------------------------------- | --------------------------------------------------------- |
| **Tone**                | Analytical, Conversational, Medium-formality      | Firm, Formal, High-formality                              |
| **Primary Interests**   | Conflict zones, Human rights, Grassroots politics | Geopolitics, Foreign policy, Global diplomacy             |
| **Aversions**           | Sensationalism, Elite bias                        | Propaganda, Lack of context, Soft coverage of autocracies |
| **Evaluation Focus**    | Human angle, Relevance, Risk awareness            | Global context, Data integrity, Objectivity               |
| **Preferred Formats**   | Human interest feature, On-ground report          | Geopolitical commentary, Editorial analysis               |
| **Sources Favored**     | On-ground reports, NGO narratives                 | Think tanks, UN briefings, Policy papers                  |
| **Response Structure**  | Scorecard with feedback                           | Editorial assessment with references                      |
| **Current Focus Areas** | Kashmir, Elections, Climate impact on poor        | US-China, BRICS, Middle East, India’s foreign strategy    |

---

## 🔧 Config Panel: Full Persona Parameters List

Here's an **exhaustive set of fields** for your persona configuration UI, broken into editable sections:

---

### 1. 🧠 **Identity & Meta**

| Field         | Type   | Description                                |
| ------------- | ------ | ------------------------------------------ |
| `id`          | string | Unique machine-readable identifier         |
| `name`        | string | Display name of the persona                |
| `bio`         | text   | Summary of persona's journalism background |
| `avatar_url`  | string | (Optional) Profile image                   |
| `origin_type` | enum   | `real`, `fictional`, `hybrid`              |

---

### 2. 🗣️ **Tone & Style**

| Field              | Type | Description                                 |
| ------------------ | ---- | ------------------------------------------- |
| `tone.voice`       | enum | `firm`, `analytical`, `empathetic`, etc.    |
| `tone.style`       | enum | `formal`, `conversational`, `neutral`, etc. |
| `tone.formality`   | enum | `low`, `medium`, `high`                     |
| `preferred_length` | enum | `short`, `medium`, `detailed`               |
| `language_level`   | enum | `simplified`, `professional`, `academic`    |

---

### 3. 🎯 **Focus Areas**

| Field           | Type      | Description                                |
| --------------- | --------- | ------------------------------------------ |
| `interests`     | string\[] | Topics the persona prioritizes             |
| `aversions`     | string\[] | Topics or behaviors they dislike           |
| `current_focus` | string\[] | Timely focus areas (for dynamic grounding) |
| `influences`    | string\[] | Trusted source types or thought leaders    |

---

### 4. 🧪 **Evaluation Framework**

| Field                 | Type               | Description                                                |
| --------------------- | ------------------ | ---------------------------------------------------------- |
| `evaluation_criteria` | object             | Each criterion has a `question` and a `weight`             |
| `evaluation_scale`    | enum               | `1–5`, `1–10`, `pass/fail`, etc.                           |
| `scorecard_labels`    | map\<number, text> | Optional mapping (e.g., `9`: "Excellent", `5`: "Adequate") |
| `force_scoring?`      | boolean            | Require numeric scores in response?                        |

---

### 5. 📄 **Output Formatting**

| Field                       | Type      | Description                                             |
| --------------------------- | --------- | ------------------------------------------------------- |
| `response_format.structure` | enum      | `scorecard_with_feedback`, `editorial_assessment`, etc. |
| `response_format.sections`  | string\[] | Custom section headers (e.g. Summary, Feedback)         |
| `use_markdown?`             | boolean   | Allow Markdown formatting                               |
| `include_references?`       | boolean   | Attach source citations when generating response        |

---

### 6. 🔁 **Behavioral Settings**

| Field                     | Type    | Description                                        |
| ------------------------- | ------- | -------------------------------------------------- |
| `mode`                    | enum    | `real-time`, `queued`                              |
| `requires_retrieval?`     | boolean | Whether persona always performs RAG                |
| `requires_summary_first?` | boolean | Whether input must be summarized before evaluation |
| `preferred_prompt_style`  | enum    | `zero-shot`, `few-shot`, `CoT`, `role`             |

---

### 7. 🧩 **Advanced Hooks (Optional)**

| Field                    | Type          | Description                                        |
| ------------------------ | ------------- | -------------------------------------------------- |
| `custom_prompt_template` | string (text) | Allows persona to override full system prompt      |
| `pre_response_hook`      | function      | Pre-generation transformer (e.g., tone adjustment) |
| `post_response_hook`     | function      | After generation, edit or reformat response        |

---

### Example Config Panel UI Sections:

```
[✓] Identity  
   - Name, Bio, Avatar, Type  

[✓] Voice & Style  
   - Tone, Formality, Length  

[✓] Topical Focus  
   - Interests, Aversions, Current Focus  

[✓] Evaluation Settings  
   - Rubric, Weights, Labels  

[✓] Output Control  
   - Sections, Structure, Markdown  

[✓] AI Behavior  
   - RAG, Prompting Style, Real-Time Mode  
```

---

Would you like a `config-schema.json` file or UI wireframe suggestion next?

Here’s both:

---

## ✅ 1. `persona-config.schema.json` (JSON Schema File)

You can use this with config UIs, validators, or as a backend model definition.

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "PersonaConfig",
  "type": "object",
  "required": ["id", "name", "bio", "tone", "interests", "evaluation_criteria", "response_format"],
  "properties": {
    "id": { "type": "string" },
    "name": { "type": "string" },
    "bio": { "type": "string" },
    "avatar_url": { "type": "string", "format": "uri" },
    "origin_type": {
      "type": "string",
      "enum": ["real", "fictional", "hybrid"]
    },
    "tone": {
      "type": "object",
      "properties": {
        "voice": { "type": "string" },
        "style": { "type": "string", "enum": ["formal", "conversational", "neutral"] },
        "formality": { "type": "string", "enum": ["low", "medium", "high"] }
      },
      "required": ["voice", "style", "formality"]
    },
    "interests": {
      "type": "array",
      "items": { "type": "string" }
    },
    "aversions": {
      "type": "array",
      "items": { "type": "string" }
    },
    "current_focus": {
      "type": "array",
      "items": { "type": "string" }
    },
    "influences": {
      "type": "array",
      "items": { "type": "string" }
    },
    "evaluation_criteria": {
      "type": "object",
      "patternProperties": {
        "^[a-zA-Z0-9_]+$": {
          "type": "object",
          "properties": {
            "question": { "type": "string" },
            "weight": { "type": "number", "minimum": 0, "maximum": 1 }
          },
          "required": ["question", "weight"]
        }
      },
      "minProperties": 1
    },
    "evaluation_scale": {
      "type": "string",
      "enum": ["1-5", "1-10", "pass/fail"]
    },
    "scorecard_labels": {
      "type": "object",
      "additionalProperties": { "type": "string" }
    },
    "response_format": {
      "type": "object",
      "properties": {
        "structure": {
          "type": "string",
          "enum": ["scorecard_with_feedback", "editorial_assessment"]
        },
        "sections": {
          "type": "array",
          "items": { "type": "string" }
        }
      },
      "required": ["structure", "sections"]
    },
    "use_markdown": { "type": "boolean" },
    "include_references": { "type": "boolean" },
    "mode": { "type": "string", "enum": ["real-time", "queued"] },
    "requires_retrieval": { "type": "boolean" },
    "requires_summary_first": { "type": "boolean" },
    "preferred_prompt_style": {
      "type": "string",
      "enum": ["zero-shot", "few-shot", "CoT", "role"]
    },
    "custom_prompt_template": { "type": "string" },
    "pre_response_hook": { "type": "string" },
    "post_response_hook": { "type": "string" }
  }
}
```

---

## ✅ 2. UI Wireframe (Text Mockup)

Here's a **wireframe** for how the **Persona Config Panel** might look in a settings UI:

```
┌────────────────────────────────────────────┐
│          [🧠 Persona Configuration]         │
├────────────────────────────────────────────┤
│ Identity                                   │
│ ┌────────────┬───────────────────────────┐ │
│ │ Name       │ [ Barkha Dutt           ] │ │
│ │ ID         │ [ barkha_dutt           ] │ │
│ │ Origin     │ (x) Real  ( ) Fictional   │ │
│ │ Avatar URL │ [ http://...            ] │ │
│ └────────────┴───────────────────────────┘ │

│ Voice & Style                              │
│ ┌────────────┬───────────────────────────┐ │
│ │ Voice      │ [ Analytical             ] │ │
│ │ Style      │ (x) Conversational         │ │
│ │ Formality  │ ( ) Low (x) Medium ( ) High│ │
│ └────────────┴───────────────────────────┘ │

│ Topical Focus                              │
│ ┌────────────────────────────────────────┐ │
│ │ Interests:      [ + Add Topic ]        │ │
│ │ - Conflict zones                        │ │
│ │ - Grassroots politics                   │ │
│ │ Aversions:                              │ │
│ │ - Sensationalism                        │ │
│ │ - Elitism                               │ │
│ │ Current Focus:                          │ │
│ │ - Elections 2024                        │ │
│ └────────────────────────────────────────┘ │

│ Evaluation Criteria                        │
│ ┌─────────────┬────────────────────┬─────┐ │
│ │ Criteria    │ Question           │ %   │ │
│ │-------------|--------------------|-----│ │
│ │ Relevance   │ Is pitch relevant? │ 30% │ │
│ │ Human Angle │ Is there emotion?  │ 20% │ │
│ └─────────────┴────────────────────┴─────┘ │

│ Output Preferences                         │
│ ┌──────────────┬─────────────────────────┐ │
│ │ Structure     │ Scorecard with feedback│ │
│ │ Sections      │ [ Summary, Feedback ]  │ │
│ │ Markdown      │ [x] Enable             │ │
│ │ References    │ [ ] Include            │ │
│ └──────────────┴─────────────────────────┘ │

│ AI Behavior                                │
│ ┌────────────────────────────────────────┐ │
│ │ Mode:            (x) Real-time ( ) Queued│
│ │ Retrieval:       [x] Enable             │
│ │ Summary First:   [x] Required           │
│ │ Prompt Style:    [ Few-shot           ] │
│ └────────────────────────────────────────┘ │

│ [ Save Changes ]                          │
└────────────────────────────────────────────┘
```

---

Would you like this as a web-based config tool (HTML+JS or React) or saved as a component schema for integration into your admin panel?

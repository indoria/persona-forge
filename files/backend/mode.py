"""
Conversation mode module: Provides mode logic (interviewer, critic, educator, etc.).
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
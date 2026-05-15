from spellchecker import SpellChecker

spell = SpellChecker()

CUSTOM_WORDS = {
    "HLO": "HELLO",
    "HW": "HOW",
    "GD": "GOOD",
}


def correct_text(text):

    text = text.upper()

    if text in CUSTOM_WORDS:
        return CUSTOM_WORDS[text]

    words = text.split()

    corrected_words = []

    for word in words:

        corrected = spell.correction(word)

        if corrected is None:
            corrected = word

        corrected_words.append(corrected.upper())

    return " ".join(corrected_words)
# PlacePrep — Placement Preparation Guide (Software & AI roles)

A complete, static study and revision site for campus placements:
DSA (with code in both **Python and C++**), OOP, DBMS & SQL, Operating Systems, Computer Networks, System Design,
Machine Learning, Deep Learning & GenAI, Aptitude, and HR/interview strategy.

**Revision tools:** one-page cheat sheets (with a blur self-test mode), spaced-repetition flashcards, quizzes with explanations,
a 5-minute rapid-fire mode, bookmarks, per-topic notes and a 30-day study plan. Progress is stored in the browser (localStorage).

## Run locally
No build step. Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 5178
```

## Add or edit content
Each subject lives in `data/<subject>.js` as `{ topics, flashcards, quiz }`. Topic content is Markdown inside a template literal
(escape backticks as \`). A `~~~python` block followed directly by a `~~~cpp` block renders as one block with a Python/C++ switch.

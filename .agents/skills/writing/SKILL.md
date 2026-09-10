---
name: writing
description: House style for project prose: docs, plans, PR and commit bodies, review comments, code comments, TSDoc. Concise and declarative, rationale inline, every sentence load-bearing. Use when writing or editing documentation, PR descriptions, commit bodies, review comments, code comments or TSDoc, or standards/process docs (not product/site copy, which is the design's voice).
---

# Writing

Project prose: docs, PR and commit bodies, review comments, code comments, and TSDoc. This
skill owns the sentences, not where facts live. Product and site copy is out of scope: its
voice is the design's.

Short and scannable is the point. A reader finds the rule they need in seconds, so when
another rule here pulls against brevity, brevity wins.

## Rules

1. **Cut whole points, not words.** Every sentence carries a fact, a rule, or a reason, in
   the present tense, with no hedging and no filler. Trim by dropping a point, never by
   compressing a sentence into shorthand.
2. **Length comes out of explanation, never out of substance.** Requirements, caveats, open
   questions, asks of the reader, measured numbers, and non-obvious rationale survive every
   trim. `Closes #NNN` and `Fixes #NNN` stay verbatim: dropping one unlinks the issue.
   Checkbox state stays as written: it records what a human did.
3. **Cut these first.** Restatement of the title or the diff, process narration ("then I
   updated"), verification transcripts, command dumps, per-file walkthroughs, superseded
   iteration history, and background the reader has. A PR body says what changed, why, and
   what the reviewer must decide.
4. **A rule carries its why in the same sentence**, after a colon, semicolon, or
   parenthesis, never as a separate paragraph of justification.
5. **Summarize and point, never restate.** A neighboring doc's fact appears as a pointer or
   a one-line summary. Link at first mention and use plain text after; section references
   are `§Section`. Standards name the docs around them by role ("the design contract's
   concern"), not by path, so they stay portable.
6. **In code, explain why, not what.** A comment that paraphrases the line below it gets
   deleted, not reworded. TSDoc gives one line of summary, then contracts, units, side
   effects, and failure modes, never a type the signature already carries.
7. **Rules are numbered, each opening with a bold lead**, most consequential first, one line
   where one line does. A doc opens with what it owns rather than a table of contents,
   headings are sentence case and name what the section owns, and tables hold enumerable
   facts while the reasoning stays in the prose around them.

## Mechanics

- Filenames, tokens, commands, and identifiers in `code` format.
- **Bold** for rule leads and load-bearing terms, _italics_ for one word of stress at a
  time. Asterisk emphasis, never underscores.
- No em dashes. Join clauses with a colon, a semicolon, parentheses, or a new sentence.
- Words over symbols in prose ("and", not "&").

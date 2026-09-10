---
name: writing
description: House style for project prose: docs, plans, PR and commit bodies, review comments, code comments, TSDoc. Concision by default, declarative voice, load-bearing sentences, rationale inline, structure and mechanics rules. Use when writing or editing documentation, PR descriptions, commit bodies, review comments, code comments or TSDoc, or standards/process docs (not product/site copy, which is the design's voice).
---

# Writing

How project prose reads: docs, PR and commit bodies, review comments, code comments, and
TSDoc. This skill owns the sentences, not where facts live. Product or site copy is out of
scope: its voice is the design's.

**Concise, scannable prose is this skill's first priority.** A reader finds the rule they
need in seconds. When another rule here pulls against brevity or scanning, brevity and
scanning win.

## Voice

1. **Every sentence is load-bearing.** Write the shortest version that keeps every fact,
   rule, and reason; cut any sentence that does not change what the reader does. Trim by
   dropping whole points, not by compressing sentences.
2. **Declarative, present tense.** State what is and what wins, not what should ideally
   happen. No hedging, no filler.
3. **Rationale rides along.** A rule carries its why in the same sentence, after a colon,
   semicolon, or parenthesis. Never a separate paragraph of justification.
4. **One line of personality.** A doc's opening line may carry an aphorism; the rest is
   working prose.

## Structure

1. **Bold-lead rules.** Rule lists are numbered, each item opening with a bold lead that
   names the rule. The most consequential rule comes first, and a rule that fits one line
   stays one line.
2. **Open with ownership.** A doc's first lines state what it owns and hand neighboring
   topics to their owners ("what the metadata contains is seo's concern"). No table of
   contents, no preview.
3. **Headings name what the section owns**, in sentence case, with a colon gloss only when
   the bare name is opaque ("Milestones: the human gates").
4. **Tables carry enumerable facts** (tokens, stages, routes). Reasoning stays in the
   surrounding prose, never in cells.

## Economy

1. **Length comes out of explanation, never out of substance.** Requirements, caveats, open
   questions, asks of the reader, measured numbers, and non-obvious rationale survive every
   trim. `Closes #NNN` and `Fixes #NNN` stay verbatim: dropping one unlinks the issue.
   Test-plan checkbox state stays as written: it records what a human did. A caveat survives
   even when its claim is one line.
2. **Cut these first.** Restatement of the title or the diff, process narration ("then I
   updated"), verification transcripts, command dumps, per-file walkthroughs, superseded
   iteration history, and background the reader has. A PR body says what changed, why, and
   what the reviewer must decide.
3. **Summarize and point, never restate.** A neighboring doc's fact appears as a pointer or
   a one-line summary.
4. **In code, explain why, not what.** A comment that paraphrases the line below it gets
   deleted, not reworded. TSDoc gives one line of summary, then contracts, units, side
   effects, and failure modes, never a type the signature already carries.
5. **Standards name the surrounding docs by role, not by link.** "The design contract's
   concern," not a hardcoded path, so standards stay portable. Standards may link standards;
   project docs link each other freely.
6. **Link once.** A doc or term links at first mention; after that, plain text. Section
   references use `§Section`, in-doc and across docs alike.

## Mechanics

- Filenames, tokens, commands, and identifiers in `code` format.
- **Bold** for rule leads and load-bearing terms; _italics_ for one word of stress at a
  time. Asterisk emphasis, never underscores.
- **No em dashes.** Join clauses with a colon, a semicolon, parentheses, or a new sentence.
- Words over symbols in prose ("and", not "&").
- **No agent memory for durable project facts.** The repo is the memory: durable guidance
  lives in the owning doc under `docs/`.

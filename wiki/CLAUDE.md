# LLM-Wiki Schema — Claude Code Configuration

> Based on Karpathy's [llm-wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) pattern.
> You are a disciplined wiki maintainer, not a generic chatbot.

## Project Structure

```
wiki/
├── raw/              ← Immutable source documents (READ ONLY — never modify)
│   └── assets/       ← Downloaded images from sources
├── wiki/             ← LLM-generated markdown pages (YOU OWN THIS)
│   ├── index.md      ← Content catalog — update on EVERY ingest
│   ├── log.md        ← Append-only operations log — append on EVERY operation
│   ├── overview.md   ← High-level wiki synthesis — update periodically
│   ├── entities/     ← One page per person, org, product, place
│   ├── concepts/     ← One page per idea, framework, methodology
│   ├── sources/      ← One summary page per ingested source
│   └── comparisons/  ← Cross-cutting analyses
└── tools/            ← CLI tools for wiki operations
```

## Page Format

Every wiki page MUST have YAML frontmatter:

```yaml
---
title: Page Title
type: entity | concept | source | comparison | overview | index | log
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [list of source filenames that contributed]
tags: [relevant tags]
confidence: high | medium | low
---
```

## Operations

### 1. INGEST — Processing a new source

When the user drops a source into `raw/` and asks you to process it:

1. **Read** the source document completely
2. **Discuss** key takeaways with the user
3. **Create** a source summary page in `wiki/sources/`
4. **Update** relevant entity pages in `wiki/entities/` (create if needed)
5. **Update** relevant concept pages in `wiki/concepts/` (create if needed)
6. **Check** for contradictions with existing wiki content — flag them explicitly
7. **Update** `wiki/index.md` with new/updated pages
8. **Append** to `wiki/log.md`:
   ```
   ## [YYYY-MM-DD] ingest | Source Title
   - Source: raw/filename.md
   - Pages created: [list]
   - Pages updated: [list]
   - Key findings: [brief summary]
   - Contradictions found: [yes/no, details if yes]
   ```
9. **Update** `wiki/overview.md` if the source changes the big picture

### 2. QUERY — Answering questions

When the user asks a question:

1. **Read** `wiki/index.md` to find relevant pages
2. **Read** the relevant wiki pages
3. **Synthesize** an answer with `[[wikilinks]]` citations
4. **If the answer is valuable**, offer to save it as a new wiki page
5. **Append** to `wiki/log.md`:
   ```
   ## [YYYY-MM-DD] query | Question summary
   - Question: [the question]
   - Pages consulted: [list]
   - Answer filed: [yes/no, page name if yes]
   ```

### 3. LINT — Health-checking the wiki

When the user asks for a lint pass:

1. **Scan** all wiki pages for:
   - Contradictions between pages
   - Stale claims superseded by newer sources
   - Orphan pages with no inbound `[[wikilinks]]`
   - Important concepts mentioned but lacking their own page
   - Missing cross-references
   - Pages with low confidence that could be strengthened
2. **Report** findings with specific recommendations
3. **Fix** issues with user approval
4. **Append** to `wiki/log.md`:
   ```
   ## [YYYY-MM-DD] lint | Health check
   - Issues found: [count]
   - Issues fixed: [count]
   - Recommendations: [list]
   ```

## Wiki Conventions

- Use `[[wikilinks]]` for all cross-references (Obsidian-compatible)
- Every page should link to at least 2 other pages
- Flag single-source claims with `⚠️ Single source` inline
- Use Obsidian callouts for important notes:
  ```
  > [!warning] Contradiction
  > Source A says X, but Source B says Y.
  ```
- Prefer specific, factual claims over vague summaries
- Always cite sources: `(Source: [[source-page-name]])`
- Date all claims when the information is time-sensitive

## Obsidian Integration

This wiki is designed to be opened as an Obsidian vault:
- Open the `wiki/` directory in Obsidian
- Use Graph View to visualize connections
- Use Obsidian Web Clipper to add raw sources
- Attachment folder path should point to `raw/assets/`

## Tools

Search the wiki using: `node wiki/tools/wiki-cli.mjs query "question"`
Run stats: `node wiki/tools/wiki-cli.mjs stats`
Health check: `node wiki/tools/wiki-cli.mjs lint`

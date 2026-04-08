---
name: llm-wiki
description: Build and maintain a persistent knowledge wiki using the LLM-Wiki pattern. Ingest sources, query knowledge, and lint the wiki for health.
---

# LLM-Wiki Skill

## When to Use

- User wants to **ingest a source** into the knowledge wiki
- User asks a **question** that should be answered from compiled knowledge
- User wants to **health-check** or **lint** the wiki
- User mentions the wiki, knowledge base, Obsidian, or knowledge management
- User drops a file into `wiki/raw/` and wants it processed

## How It Works

This skill implements Karpathy's [llm-wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — a persistent, compounding knowledge wiki maintained by the LLM.

### Architecture

```
wiki/
├── raw/              ← Immutable source documents (READ ONLY)
│   └── assets/       ← Downloaded images
├── wiki/             ← LLM-maintained markdown pages
│   ├── index.md      ← Content catalog (update on every ingest)
│   ├── log.md        ← Append-only operations log
│   ├── overview.md   ← High-level synthesis
│   ├── entities/     ← Person/org/product/place pages
│   ├── concepts/     ← Idea/framework/methodology pages
│   ├── sources/      ← Source summary pages
│   └── comparisons/  ← Cross-cutting analyses
├── CLAUDE.md         ← Claude Code schema
├── AGENTS.md         ← Codex CLI schema
├── GEMINI.md         ← Gemini CLI schema
└── tools/
    ├── wiki-cli.mjs  ← CLI tool (stats/ingest/query/lint/log)
    ├── search.mjs    ← BM25 search engine
    └── utils.mjs     ← Shared utilities
```

### Three Operations

#### 1. INGEST — Processing a new source

```
User: "Ingest wiki/raw/article.md into the wiki"
```

Steps:
1. Read the source completely
2. Discuss key takeaways
3. Create a source summary in `wiki/wiki/sources/`
4. Update/create entity pages in `wiki/wiki/entities/`
5. Update/create concept pages in `wiki/wiki/concepts/`
6. Flag contradictions with existing content
7. Update `wiki/wiki/index.md`
8. Append to `wiki/wiki/log.md`
9. Update `wiki/wiki/overview.md` if needed

#### 2. QUERY — Answering questions

```
User: "Search the wiki for: how does X relate to Y?"
```

Steps:
1. Read `wiki/wiki/index.md` to find relevant pages
2. Read relevant pages
3. Synthesize answer with `[[wikilinks]]` citations
4. Offer to file valuable answers as new wiki pages
5. Append to log

#### 3. LINT — Health-checking

```
User: "Lint the wiki" or "Health-check the wiki"
```

Steps:
1. Scan for contradictions, orphans, stale claims
2. Find missing cross-references
3. Report and fix with approval
4. Append to log

### CLI Tools

```bash
# Show wiki statistics
node wiki/tools/wiki-cli.mjs stats

# Search wiki pages
node wiki/tools/wiki-cli.mjs query "your question"

# Health-check
node wiki/tools/wiki-cli.mjs lint

# Show recent log entries
node wiki/tools/wiki-cli.mjs log 5
```

### Page Format

Every wiki page uses this frontmatter:

```yaml
---
title: Page Title
type: entity | concept | source | comparison | overview
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: [contributing source filenames]
tags: [tags]
confidence: high | medium | low
---
```

### Conventions

- Use `[[wikilinks]]` for all cross-references (Obsidian-compatible)
- Every page should link to at least 2 other pages
- Flag single-source claims with `⚠️ Single source`
- Always cite: `(Source: [[source-page]])`
- Never modify files in `raw/`
- The `wiki/` directory IS the Obsidian vault

### Obsidian Integration

Open the `wiki/` directory as an Obsidian vault:
- Graph View shows the knowledge network
- Web Clipper saves sources to `raw/`
- Set attachment folder to `raw/assets/`
- Dataview plugin can query frontmatter

## Examples

### Ingest a new research paper
```
"I dropped a paper on transformer architectures into wiki/raw/. 
Please ingest it and update the wiki."
```

### Query compiled knowledge
```
"What are the key differences between attention mechanisms 
discussed across our sources?"
```

### Run a lint pass
```
"Run a health check on the wiki. Find orphans and contradictions."
```

---
description: Operate the LLM knowledge wiki — ingest sources, query knowledge, lint for health, show stats. Based on Karpathy's llm-wiki pattern.
---

# /wiki Workflow

Operate the **LLM-Wiki** knowledge base following the [llm-wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).

## Quick Start

1. Drop a source file into `wiki/raw/`
2. Tell the agent: `"Ingest wiki/raw/filename.md into the wiki"`
3. Open `wiki/` in **Obsidian** to browse results

## Operations

### Ingest a source
```
/wiki ingest wiki/raw/my-article.md
```
The agent will:
- Read the source → create summary → update entities/concepts
- Update `wiki/wiki/index.md` and `wiki/wiki/log.md`
- Flag contradictions with existing content

### Query the wiki
```
/wiki query "how does X relate to Y?"
```
The agent will:
- Read `wiki/wiki/index.md` → find relevant pages → synthesize answer
- Offer to file valuable answers as new wiki pages

### Lint (health check)
```
/wiki lint
```
The agent will:
- Scan for contradictions, orphans, stale claims, missing cross-refs
- Report findings and fix with your approval

### Show stats
```
node wiki/tools/wiki-cli.mjs stats
```

## CLI Tool

```powershell
# Stats
node wiki/tools/wiki-cli.mjs stats

# BM25 search
node wiki/tools/wiki-cli.mjs query "your question"

# Health check
node wiki/tools/wiki-cli.mjs lint

# Recent log
node wiki/tools/wiki-cli.mjs log 5
```

## Cross-CLI Compatibility

| CLI | Schema File | How to Start |
|-----|------------|--------------|
| Claude Code | `wiki/CLAUDE.md` | `cd wiki && claude` |
| Codex CLI | `wiki/AGENTS.md` | `cd wiki && codex` |
| Gemini CLI | `wiki/GEMINI.md` | `cd wiki && gemini` |

Each schema contains identical wiki maintenance instructions adapted to the CLI's format.

## Obsidian Integration

- Open `wiki/` as an Obsidian vault
- Graph View → color-coded by page type (entity=cyan, concept=purple, source=blue)
- Attachment folder → `raw/assets/`
- Web Clipper → saves directly to `raw/`

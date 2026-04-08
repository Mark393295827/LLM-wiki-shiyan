---
description: Operate the LLM knowledge wiki — ingest sources, query knowledge, lint for health, show stats
---

# /wiki Command

Operate the **LLM-Wiki** knowledge base. This command delegates to the llm-wiki skill.

## Usage

```
/wiki ingest <filename>   — Process a raw source into the wiki
/wiki query <question>    — Search and answer from compiled knowledge
/wiki lint                — Health-check the wiki
/wiki stats               — Show wiki statistics
```

## Workflow

1. Read the [llm-wiki SKILL.md](../../skills/llm-wiki/SKILL.md) for full instructions
2. Follow the schema in `wiki/CLAUDE.md` (or `AGENTS.md` / `GEMINI.md`)
3. Execute the requested operation
4. Always update `wiki/wiki/index.md` and `wiki/wiki/log.md`

## Quick Reference

- **Sources go in**: `wiki/raw/`
- **Wiki pages live in**: `wiki/wiki/`
- **Schema files**: `wiki/CLAUDE.md`, `wiki/AGENTS.md`, `wiki/GEMINI.md`
- **CLI tool**: `node wiki/tools/wiki-cli.mjs <command>`
- **Obsidian vault**: Open `wiki/` directory in Obsidian

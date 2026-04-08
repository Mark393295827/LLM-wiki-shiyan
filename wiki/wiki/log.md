---
title: Wiki Operations Log
type: log
updated: 2026-04-08
---

# 📋 Operations Log

> Chronological, append-only record of all wiki operations.
> Each entry uses a consistent prefix for easy parsing:
> `## [YYYY-MM-DD] operation | Description`
>
> Parse with: `grep "^## \[" wiki/wiki/log.md | tail -10`

---

## [2026-04-08] init | Wiki initialized

- Created wiki structure following Karpathy's llm-wiki pattern
- Architecture: raw/ (immutable sources) → wiki/ (LLM-maintained pages) → schema files
- Operations: ingest, query, lint
- Compatible with: Claude Code, Codex CLI, Gemini CLI
- Linked to local Obsidian vault for real-time browsing

## [2026-04-08] ingest | LLM-Wiki: Building Personal Knowledge Bases Using LLMs

- Source: raw/karpathy-llm-wiki.md
- Pages created: andrej-karpathy, llm-wiki-pattern, rag, memex, karpathy-llm-wiki (source summary)
- Pages updated: index.md, overview.md
- Key findings: LLM-wiki proposes persistent compiled knowledge over RAG; the LLM maintains the wiki, human curates sources; architecture has 3 layers (raw, wiki, schema) and 3 operations (ingest, query, lint)
- Contradictions found: no (first source ingested)
- Historical connection: Vannevar Bush's Memex (1945) was the spiritual predecessor

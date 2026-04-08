# LLM-Wiki: Building Personal Knowledge Bases Using LLMs

**Author:** Andrej Karpathy
**Date:** April 2026
**Source:** https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f

## Summary

Most people's experience with LLMs and documents looks like RAG: upload files, LLM retrieves relevant chunks at query time, generates an answer. This works but the LLM is rediscovering knowledge from scratch on every question. There's no accumulation.

The idea here is different. Instead of just retrieving from raw documents at query time, the LLM incrementally builds and maintains a persistent wiki — a structured, interlinked collection of markdown files. When you add a new source, the LLM reads it, extracts key information, and integrates it into the existing wiki — updating entity pages, revising topic summaries, noting contradictions, strengthening the evolving synthesis.

**Key Insight:** The wiki is a persistent, compounding artifact. Knowledge is compiled once and kept current, not re-derived on every query.

## Architecture

Three layers:
1. **Raw sources** — curated collection of source documents. Immutable.
2. **The wiki** — LLM-generated markdown files. Summaries, entity pages, concept pages. LLM owns this layer.
3. **The schema** — CLAUDE.md/AGENTS.md telling the LLM how the wiki is structured.

## Operations

- **Ingest** — Process a new source, create/update 10-15 wiki pages
- **Query** — Answer questions from the wiki, file valuable answers back
- **Lint** — Health-check for contradictions, orphans, stale claims

## Key Quote

> You never (or rarely) write the wiki yourself — the LLM writes and maintains all of it. You're in charge of sourcing, exploration, and asking the right questions. The LLM does all the grunt work — the summarizing, cross-referencing, filing, and bookkeeping that makes a knowledge base actually useful over time.

## Reference

> Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase.

## Related Concepts

- Vannevar Bush's Memex (1945) — personal, curated knowledge store with associative trails
- RAG (Retrieval-Augmented Generation) — the pattern this improves upon
- Knowledge Graphs — structured knowledge representation
- Zettelkasten — note-taking method with atomic, interlinked notes

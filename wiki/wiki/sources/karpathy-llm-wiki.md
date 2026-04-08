---
title: "LLM-Wiki: Building Personal Knowledge Bases Using LLMs"
type: source
created: 2026-04-08
updated: 2026-04-08
sources: ["karpathy-llm-wiki.md"]
tags: ["llm", "knowledge-management", "wiki", "rag", "obsidian"]
confidence: high
---

# LLM-Wiki: Building Personal Knowledge Bases Using LLMs

**Author:** [[Andrej Karpathy]]
**Published:** April 2026
**Original:** [GitHub Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)

## Key Thesis

Most LLM-document workflows (RAG, NotebookLM, ChatGPT file uploads) force the LLM to **rediscover knowledge from scratch** on every question. The llm-wiki pattern proposes instead an **incremental compilation** approach: the LLM builds and maintains a persistent wiki that compounds knowledge over time.

> "The wiki is a persistent, compounding artifact. Knowledge is compiled once and kept current, not re-derived on every query."

## Architecture

The system has three layers:
1. **[[Raw Sources]]** — Immutable curated documents. The LLM reads but never modifies.
2. **The Wiki** — LLM-generated interlinked markdown pages. The LLM owns this layer entirely.
3. **The Schema** — Configuration files (CLAUDE.md, AGENTS.md) that make the LLM a disciplined wiki maintainer.

## Three Core Operations

1. **Ingest** — Process a new source, touch 10-15 wiki pages per source
2. **[[Query Pattern|Query]]** — Answer questions from compiled knowledge, file valuable answers back as pages
3. **[[Lint Operation|Lint]]** — Health-check for contradictions, orphans, stale claims

## Key Analogy

> "Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase."

## Why It Works

The tedious part of knowledge management is not reading or thinking — it's the **bookkeeping**. Updating cross-references, keeping summaries current, noting contradictions. Humans abandon wikis because maintenance burden grows faster than value. LLMs don't get bored and can touch 15 files in one pass.

## Historical Context

Related to [[Vannevar Bush]]'s [[Memex]] concept (1945) — a personal, curated knowledge store with associative trails. Bush's vision was closer to this pattern than to what the web became. The part he couldn't solve was **who does the maintenance**. The LLM handles that.

## Practical Tips

- Use [[Obsidian Web Clipper]] to capture web sources as markdown
- Download images locally for LLM reference
- Use [[Obsidian Graph View]] to visualize the knowledge network
- The wiki is just a git repo — version history for free
- [[Marp]] for slide decks, [[Dataview]] for frontmatter queries

(Source: [[karpathy-llm-wiki]])

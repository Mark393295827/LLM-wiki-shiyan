---
title: LLM-Wiki Pattern
type: concept
created: 2026-04-08
updated: 2026-04-08
sources: ["karpathy-llm-wiki.md"]
tags: ["knowledge-management", "llm", "wiki", "compounding", "methodology"]
confidence: high
---

# LLM-Wiki Pattern

A methodology for building personal knowledge bases where the LLM incrementally builds and maintains a persistent wiki, rather than using traditional [[RAG]] retrieval.

## Core Principle

> Knowledge is **compiled once** and kept current, not re-derived on every query.

The wiki is a **persistent, compounding artifact**. Cross-references are already there. Contradictions have already been flagged. The synthesis already reflects everything you've read.

## How It Differs from RAG

| Aspect | Traditional RAG | LLM-Wiki Pattern |
|--------|----------------|-----------------|
| Knowledge state | Re-discovered per query | Compiled and maintained |
| Cross-references | Implicit, re-found | Explicit, already linked |
| Contradictions | Undetected | Flagged at ingest time |
| Synthesis | Per-query effort | Incremental, compounding |
| Maintenance | None needed | LLM handles it |

## Architecture

Three layers:
1. **Raw Sources** — Immutable, curated by the human
2. **The Wiki** — LLM-generated, LLM-maintained
3. **The Schema** — Configuration that disciplines the LLM

## Operations

1. **Ingest** — Source → summary → entities → concepts → cross-references
2. **Query** — index → relevant pages → synthesis → optionally file as page
3. **Lint** — contradictions → orphans → stale claims → missing pages

## Division of Labor

- **Human:** Source curation, exploration, asking good questions, judgment
- **LLM:** Summarizing, cross-referencing, filing, bookkeeping, maintenance

## Historical Lineage

- [[Vannevar Bush]]'s [[Memex]] (1945) — personal knowledge store with associative trails
- [[Zettelkasten]] — atomic, interlinked note-taking
- [[Knowledge Graphs]] — structured knowledge representation
- [[RAG]] — retrieval-augmented generation (the approach this improves upon)

## Applications

- Personal research and self-improvement
- Deep research on topics over weeks/months
- Reading companion wikis (like fan wikis but personal)
- Business/team knowledge bases
- Competitive analysis and due diligence

## Key Quote

> "Humans abandon wikis because the maintenance burden grows faster than the value.
> LLMs don't get bored, don't forget to update a cross-reference, and can touch
> 15 files in one pass."

(Source: [[karpathy-llm-wiki]])

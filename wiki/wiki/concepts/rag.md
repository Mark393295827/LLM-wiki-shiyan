---
title: RAG (Retrieval-Augmented Generation)
type: concept
created: 2026-04-08
updated: 2026-04-08
sources: ["karpathy-llm-wiki.md"]
tags: ["llm", "retrieval", "architecture", "ai"]
confidence: high
---

# RAG (Retrieval-Augmented Generation)

A pattern where an LLM retrieves relevant document chunks at query time and generates an answer from them.

## How It Works

1. Documents are chunked and indexed (often with embeddings)
2. At query time, relevant chunks are retrieved
3. LLM generates an answer using the retrieved context

## Limitations (per [[Andrej Karpathy]])

- LLM **rediscovers knowledge from scratch** on every question
- No accumulation — nothing is built up over time
- Subtle questions requiring synthesis across many documents are weak
- Cross-references are implicit, not maintained
- Contradictions between sources go undetected

## Examples

- NotebookLM
- ChatGPT file uploads
- Most enterprise "chat with your docs" systems

## Comparison with [[LLM-Wiki Pattern]]

The LLM-Wiki pattern addresses RAG's limitations by **compiling knowledge once** into a persistent wiki, rather than re-deriving it per query. See [[LLM-Wiki Pattern]] for detailed comparison table.

(Source: [[karpathy-llm-wiki]])

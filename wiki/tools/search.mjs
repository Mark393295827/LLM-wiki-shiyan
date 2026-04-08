/**
 * search.mjs — BM25 search engine for wiki pages
 * Zero dependencies, pure Node.js implementation
 *
 * At small scale (~100 pages), the index.md approach works fine.
 * This BM25 search is the fallback for when the wiki grows larger.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { parseFrontmatter } from './utils.mjs';

// BM25 parameters
const K1 = 1.2;
const B = 0.75;

/**
 * Search wiki pages using BM25 ranking
 * @param {string} wikiDir - Path to wiki directory
 * @param {string} query - Search query
 * @returns {Promise<Array<{path, title, score, snippet}>>}
 */
export async function searchWiki(wikiDir, query) {
  const pages = await loadPages(wikiDir);
  if (pages.length === 0) return [];

  const queryTerms = tokenize(query);
  if (queryTerms.length === 0) return [];

  // Build document frequencies
  const df = {};
  for (const term of new Set(queryTerms)) {
    df[term] = 0;
    for (const page of pages) {
      if (page.terms.has(term)) {
        df[term]++;
      }
    }
  }

  // Calculate average document length
  const avgDl = pages.reduce((s, p) => s + p.termCount, 0) / pages.length;

  // Score each page
  const results = [];
  for (const page of pages) {
    let score = 0;

    for (const term of queryTerms) {
      const tf = page.termFreq[term] || 0;
      if (tf === 0) continue;

      const idf = Math.log(
        (pages.length - (df[term] || 0) + 0.5) /
        ((df[term] || 0) + 0.5) + 1
      );

      const tfNorm = (tf * (K1 + 1)) /
        (tf + K1 * (1 - B + B * (page.termCount / avgDl)));

      score += idf * tfNorm;
    }

    // Boost title matches
    const titleTerms = tokenize(page.title || '');
    const titleOverlap = queryTerms.filter(t => titleTerms.includes(t)).length;
    score += titleOverlap * 2;

    // Boost frontmatter tag matches
    if (page.tags) {
      const tagTerms = page.tags.flatMap(t => tokenize(t));
      const tagOverlap = queryTerms.filter(t => tagTerms.includes(t)).length;
      score += tagOverlap * 1.5;
    }

    if (score > 0) {
      results.push({
        path: page.path,
        title: page.title,
        score,
        snippet: extractSnippet(page.content, queryTerms),
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results;
}

/**
 * Load all wiki pages recursively
 */
async function loadPages(dir) {
  const pages = [];

  async function walk(d) {
    try {
      const entries = await readdir(d, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = join(d, entry.name);
        if (entry.isDirectory()) {
          await walk(fullPath);
        } else if (entry.name.endsWith('.md') && !entry.name.startsWith('.')) {
          const content = await readFile(fullPath, 'utf-8');
          const fm = parseFrontmatter(content);
          const bodyContent = content.replace(/---[\s\S]*?---/, '').trim();
          const terms = tokenize(bodyContent);
          const termFreq = {};
          const termSet = new Set();

          for (const term of terms) {
            termFreq[term] = (termFreq[term] || 0) + 1;
            termSet.add(term);
          }

          pages.push({
            path: fullPath,
            title: fm.title || basename(fullPath, '.md'),
            tags: fm.tags || [],
            content: bodyContent,
            terms: termSet,
            termFreq,
            termCount: terms.length,
          });
        }
      }
    } catch { /* skip inaccessible dirs */ }
  }

  await walk(dir);
  return pages;
}

/**
 * Tokenize text into lowercase terms
 */
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')  // Unicode-aware: keep letters & digits
    .split(/\s+/)
    .filter(t => t.length > 1);
}

/**
 * Extract a snippet containing query terms
 */
function extractSnippet(content, queryTerms) {
  const lines = content.split('\n').filter(l => l.trim());
  const lowerQuery = queryTerms.map(t => t.toLowerCase());

  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lowerQuery.some(t => lower.includes(t))) {
      return line.trim().substring(0, 200);
    }
  }

  // Fallback: first non-heading line
  for (const line of lines) {
    if (!line.startsWith('#') && line.trim().length > 20) {
      return line.trim().substring(0, 200);
    }
  }

  return lines[0]?.trim()?.substring(0, 200) || '';
}

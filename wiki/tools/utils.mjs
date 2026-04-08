/**
 * utils.mjs — Shared utilities for wiki tools
 */

import { join, resolve } from 'node:path';

/**
 * Parse YAML frontmatter from markdown content
 * Lightweight parser — no external dependencies
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const yaml = match[1];
  const result = {};

  for (const line of yaml.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.substring(0, colonIdx).trim();
    let value = line.substring(colonIdx + 1).trim();

    // Parse arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1).split(',').map(v => v.trim().replace(/^["']|["']$/g, ''));
    }
    // Parse booleans
    else if (value === 'true') value = true;
    else if (value === 'false') value = false;
    // Parse numbers
    else if (/^\d+$/.test(value)) value = parseInt(value, 10);
    // Remove quotes
    else value = value.replace(/^["']|["']$/g, '');

    result[key] = value;
  }

  return result;
}

/**
 * Count [[wikilinks]] in content
 */
export function countWikilinks(content) {
  const matches = content.match(/\[\[[^\]]+\]\]/g);
  return matches ? matches.length : 0;
}

/**
 * Extract all [[wikilink]] targets from content
 */
export function extractWikilinks(content) {
  const matches = content.match(/\[\[([^\]]+)\]\]/g) || [];
  return matches.map(m => {
    const inner = m.replace(/\[\[|\]\]/g, '');
    // Handle [[target|display text]] format
    return inner.split('|')[0].trim();
  });
}

/**
 * Generate a slug from a title (for filenames)
 */
export function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Get the wiki root directory (parent of tools/)
 */
export function getWikiRoot(toolsDir) {
  return resolve(toolsDir, '..');
}

/**
 * Format a date as YYYY-MM-DD
 */
export function formatDate(date = new Date()) {
  return date.toISOString().split('T')[0];
}

/**
 * Generate frontmatter string
 */
export function generateFrontmatter(meta) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(meta)) {
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map(v => `"${v}"`).join(', ')}]`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

/**
 * Create a log entry string
 */
export function createLogEntry(operation, title, details = {}) {
  const date = formatDate();
  const lines = [`\n## [${date}] ${operation} | ${title}\n`];

  for (const [key, value] of Object.entries(details)) {
    if (Array.isArray(value)) {
      lines.push(`- ${key}: ${value.join(', ')}`);
    } else {
      lines.push(`- ${key}: ${value}`);
    }
  }

  return lines.join('\n') + '\n';
}

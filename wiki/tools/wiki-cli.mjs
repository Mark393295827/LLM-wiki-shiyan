/**
 * wiki-cli.mjs — LLM-Wiki Command Line Tool
 * Based on Karpathy's llm-wiki pattern
 *
 * Usage:
 *   node wiki/tools/wiki-cli.mjs stats          Show wiki statistics
 *   node wiki/tools/wiki-cli.mjs ingest <file>  Guide source ingestion
 *   node wiki/tools/wiki-cli.mjs query <text>   Search wiki pages
 *   node wiki/tools/wiki-cli.mjs lint           Health-check the wiki
 *   node wiki/tools/wiki-cli.mjs log [n]        Show last N log entries
 */

import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchWiki } from './search.mjs';
import { parseFrontmatter, countWikilinks, getWikiRoot } from './utils.mjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const WIKI_ROOT = getWikiRoot(__dirname);
const WIKI_DIR = join(WIKI_ROOT, 'wiki');
const RAW_DIR = join(WIKI_ROOT, 'raw');

// ─── CLI Entry ───────────────────────────────────────────────
const [,, command, ...args] = process.argv;

const commands = {
  stats: cmdStats,
  ingest: cmdIngest,
  query: cmdQuery,
  lint: cmdLint,
  log: cmdLog,
  help: cmdHelp,
};

const handler = commands[command] || commands.help;
await handler(args);

// ─── Commands ────────────────────────────────────────────────

async function cmdStats() {
  console.log('\n📊 LLM-Wiki Statistics\n');

  const pages = await collectPages(WIKI_DIR);
  const rawFiles = await collectFiles(RAW_DIR);

  const byType = {};
  let totalLinks = 0;
  let totalSources = 0;

  for (const page of pages) {
    const content = await readFile(page.path, 'utf-8');
    const fm = parseFrontmatter(content);
    const type = fm.type || 'unknown';
    byType[type] = (byType[type] || 0) + 1;
    totalLinks += countWikilinks(content);
    if (fm.sources) totalSources += fm.sources.length;
  }

  console.log(`  Wiki pages:      ${pages.length}`);
  Object.entries(byType).forEach(([type, count]) => {
    console.log(`    ${type}: ${count}`);
  });
  console.log(`  Wikilinks:       ${totalLinks}`);
  console.log(`  Source refs:     ${totalSources}`);
  console.log(`  Raw sources:     ${rawFiles.length}`);
  console.log(`  Raw assets:      ${(await collectFiles(join(RAW_DIR, 'assets'))).length}`);

  // Log stats
  const logPath = join(WIKI_DIR, 'log.md');
  try {
    const log = await readFile(logPath, 'utf-8');
    const entries = log.match(/^## \[/gm) || [];
    const ingests = log.match(/^## \[.*\] ingest/gm) || [];
    const queries = log.match(/^## \[.*\] query/gm) || [];
    const lints = log.match(/^## \[.*\] lint/gm) || [];
    console.log(`\n  Log entries:     ${entries.length}`);
    console.log(`    ingests: ${ingests.length}`);
    console.log(`    queries: ${queries.length}`);
    console.log(`    lints:   ${lints.length}`);
  } catch {
    console.log(`\n  Log: not found`);
  }

  console.log(`\n  Wiki root:       ${WIKI_ROOT}`);
  console.log(`  Obsidian vault:  Open wiki/ folder in Obsidian\n`);
}

async function cmdIngest(args) {
  if (args.length === 0) {
    console.log('\n📥 Ingest Mode\n');
    console.log('Usage: node wiki/tools/wiki-cli.mjs ingest <source-file>\n');
    console.log('Steps:');
    console.log('  1. Drop your source file into wiki/raw/');
    console.log('  2. Run this command with the filename');
    console.log('  3. The LLM agent will process it using the schema\n');
    console.log('Or tell your LLM agent directly:');
    console.log('  "Ingest wiki/raw/my-article.md into the wiki"\n');

    // List raw sources
    const files = await collectFiles(RAW_DIR);
    const mdFiles = files.filter(f => extname(f) === '.md');
    if (mdFiles.length > 0) {
      console.log('Available raw sources:');
      for (const f of mdFiles) {
        console.log(`  📄 ${relative(RAW_DIR, f)}`);
      }
    } else {
      console.log('No raw sources found. Drop .md files into wiki/raw/');
    }
    console.log();
    return;
  }

  const source = args[0];
  const sourcePath = join(RAW_DIR, source);
  try {
    await stat(sourcePath);
    console.log(`\n📥 Source found: ${source}`);
    const content = await readFile(sourcePath, 'utf-8');
    const wordCount = content.split(/\s+/).length;
    console.log(`   Words: ${wordCount}`);
    console.log(`   Size:  ${(content.length / 1024).toFixed(1)} KB\n`);
    console.log('Tell your LLM agent:');
    console.log(`  "Ingest wiki/raw/${source} into the wiki"\n`);
    console.log('The agent will follow the schema in CLAUDE.md / AGENTS.md / GEMINI.md');
    console.log('to create summaries, update entities, and maintain cross-references.\n');
  } catch {
    console.error(`\n❌ Source not found: ${sourcePath}`);
    console.error('   Make sure the file is in wiki/raw/\n');
  }
}

async function cmdQuery(args) {
  const query = args.join(' ');
  if (!query) {
    console.log('\n🔍 Query Mode\n');
    console.log('Usage: node wiki/tools/wiki-cli.mjs query "your question"\n');
    console.log('Or tell your LLM agent directly:');
    console.log('  "Search the wiki for: your question"\n');
    return;
  }

  console.log(`\n🔍 Searching wiki for: "${query}"\n`);

  const results = await searchWiki(WIKI_DIR, query);

  if (results.length === 0) {
    console.log('No matching pages found.');
    console.log('Try asking your LLM agent — it can search more creatively.\n');
    return;
  }

  console.log(`Found ${results.length} relevant page(s):\n`);

  for (const result of results.slice(0, 10)) {
    const relPath = relative(WIKI_DIR, result.path);
    console.log(`  📄 ${relPath}`);
    console.log(`     Score: ${result.score.toFixed(2)} | ${result.title || 'Untitled'}`);
    if (result.snippet) {
      console.log(`     ${result.snippet.substring(0, 120)}...`);
    }
    console.log();
  }
}

async function cmdLint() {
  console.log('\n🔧 Wiki Lint — Health Check\n');

  const pages = await collectPages(WIKI_DIR);
  const issues = [];

  // Collect all page names for link checking
  const pageNames = new Set();
  const pageLinkCounts = {};

  for (const page of pages) {
    const name = basename(page.path, '.md');
    pageNames.add(name);
    pageLinkCounts[name] = 0;
  }

  for (const page of pages) {
    const content = await readFile(page.path, 'utf-8');
    const fm = parseFrontmatter(content);
    const relPath = relative(WIKI_DIR, page.path);
    const name = basename(page.path, '.md');

    // Check frontmatter
    if (!fm.title) {
      issues.push({ severity: 'warn', page: relPath, msg: 'Missing title in frontmatter' });
    }
    if (!fm.type) {
      issues.push({ severity: 'warn', page: relPath, msg: 'Missing type in frontmatter' });
    }
    if (!fm.updated) {
      issues.push({ severity: 'info', page: relPath, msg: 'Missing updated date' });
    }

    // Count inbound links
    const links = content.match(/\[\[([^\]]+)\]\]/g) || [];
    for (const link of links) {
      const target = link.replace(/\[\[|\]\]/g, '').split('|')[0].trim();
      if (pageLinkCounts[target] !== undefined) {
        pageLinkCounts[target]++;
      }
    }

    // Check link count
    if (links.length < 2 && !['index', 'log', 'overview'].includes(name)) {
      issues.push({
        severity: 'info',
        page: relPath,
        msg: `Only ${links.length} outbound wikilinks (recommend ≥2)`
      });
    }

    // Check for empty or very short pages
    const bodyContent = content.replace(/---[\s\S]*?---/, '').trim();
    if (bodyContent.length < 50) {
      issues.push({ severity: 'warn', page: relPath, msg: 'Page content is very short (<50 chars)' });
    }
  }

  // Check for orphan pages
  for (const [name, count] of Object.entries(pageLinkCounts)) {
    if (count === 0 && !['index', 'log', 'overview'].includes(name) && name !== '.gitkeep') {
      issues.push({
        severity: 'info',
        page: `${name}.md`,
        msg: 'Orphan page — no inbound wikilinks'
      });
    }
  }

  // Report
  if (issues.length === 0) {
    console.log('✅ No issues found. Wiki is healthy!\n');
  } else {
    const errors = issues.filter(i => i.severity === 'error');
    const warnings = issues.filter(i => i.severity === 'warn');
    const infos = issues.filter(i => i.severity === 'info');

    if (errors.length) {
      console.log(`❌ Errors (${errors.length}):`);
      errors.forEach(i => console.log(`   ${i.page}: ${i.msg}`));
      console.log();
    }
    if (warnings.length) {
      console.log(`⚠️  Warnings (${warnings.length}):`);
      warnings.forEach(i => console.log(`   ${i.page}: ${i.msg}`));
      console.log();
    }
    if (infos.length) {
      console.log(`ℹ️  Info (${infos.length}):`);
      infos.forEach(i => console.log(`   ${i.page}: ${i.msg}`));
      console.log();
    }

    console.log(`Total: ${issues.length} issue(s) found.`);
    console.log('Ask your LLM agent to fix these: "Lint the wiki and fix issues"\n');
  }
}

async function cmdLog(args) {
  const count = parseInt(args[0]) || 10;
  const logPath = join(WIKI_DIR, 'log.md');

  try {
    const content = await readFile(logPath, 'utf-8');
    const entries = content.match(/^## \[.*$/gm) || [];
    const recent = entries.slice(-count);

    console.log(`\n📋 Last ${Math.min(count, recent.length)} log entries:\n`);
    recent.forEach(entry => console.log(`  ${entry}`));
    console.log();
  } catch {
    console.error('\n❌ Log file not found at wiki/wiki/log.md\n');
  }
}

async function cmdHelp() {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║          LLM-Wiki CLI — Knowledge Wiki Tool             ║
║    Based on Karpathy's llm-wiki pattern                 ║
╚══════════════════════════════════════════════════════════╝

Commands:
  stats              Show wiki statistics
  ingest <file>      Guide source ingestion workflow
  query "question"   Search wiki pages (BM25)
  lint               Health-check the wiki
  log [n]            Show last N log entries (default: 10)
  help               Show this help

Quick start:
  1. Drop a .md source into wiki/raw/
  2. Tell your LLM: "Ingest wiki/raw/filename.md into the wiki"
  3. Browse the wiki in Obsidian (open wiki/ as vault)

Compatible with:
  • Claude Code  — reads wiki/CLAUDE.md
  • Codex CLI    — reads wiki/AGENTS.md
  • Gemini CLI   — reads wiki/GEMINI.md
  `);
}

// ─── Helpers ─────────────────────────────────────────────────

async function collectPages(dir) {
  const results = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...await collectPages(fullPath));
      } else if (entry.name.endsWith('.md')) {
        results.push({ path: fullPath, name: entry.name });
      }
    }
  } catch { /* directory may not exist */ }
  return results;
}

async function collectFiles(dir) {
  const results = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory() && entry.name !== 'assets') {
        results.push(...await collectFiles(fullPath));
      } else if (entry.isFile() && !entry.name.startsWith('.')) {
        results.push(fullPath);
      }
    }
  } catch { /* directory may not exist */ }
  return results;
}

// Lesson router / runner for the DSA-TypeScript curriculum.
//
// This file is the single entry point for navigating and executing every
// lesson. It scans the `lessons/` directory at runtime, so any topic or
// lesson added later is picked up automatically — no manual registration.
//
// Usage (via the npm script defined in package.json):
//   npm run route                     # print the full roadmap (all topics + lessons)
//   npm run route -- --roadmap        # same as above, explicit
//   npm run route 13                  # run every lesson in topic 13 (bit manipulation)
//   npm run route 10-graphs           # run every lesson in the graphs topic
//   npm run route graph               # fuzzy topic match -> 10-graphs
//   npm run route 13/02               # run one lesson: topic 13, lesson 02
//   npm run route 13-bit/bit-tricks   # fuzzy lesson match by slug
//   npm run route --list 09           # list lessons in a topic without running them
//
// A lesson is "run" by spawning ts-node on its file so that the lesson's own
// `if (require.main === module)` demo block executes exactly as if you had run
// the file directly.

import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const LESSONS_DIR = __dirname;
const TOPIC_RE = /^\d{2}-/; // topic folders look like "13-bit-manipulation"
const LESSON_RE = /^\d{2}-.*\.ts$/; // lesson files look like "02-bit-tricks.ts"

interface Lesson {
  /** Two-digit prefix, e.g. "02". */
  number: string;
  /** Slug without the number or extension, e.g. "bit-tricks". */
  slug: string;
  /** File name, e.g. "02-bit-tricks.ts". */
  file: string;
  /** Absolute path to the .ts file. */
  fullPath: string;
}

interface Topic {
  /** Two-digit prefix, e.g. "13". */
  number: string;
  /** Full directory name, e.g. "13-bit-manipulation". */
  dir: string;
  /** Human-ish title derived from the slug, e.g. "Bit Manipulation". */
  title: string;
  lessons: Lesson[];
}

/** Turns "bit-manipulation" into "Bit Manipulation". */
function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((word) => (word.length === 0 ? word : word[0].toUpperCase() + word.slice(1)))
    .join(' ');
}

/** Scans lessons/ and returns every topic with its lessons, both sorted by number. */
export function scanTopics(): Topic[] {
  const entries = fs.readdirSync(LESSONS_DIR, { withFileTypes: true });
  const topics: Topic[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || !TOPIC_RE.test(entry.name)) continue;

    const dirPath = path.join(LESSONS_DIR, entry.name);
    const number = entry.name.slice(0, 2);
    const slug = entry.name.slice(3);

    const lessons: Lesson[] = fs
      .readdirSync(dirPath)
      .filter((file) => LESSON_RE.test(file))
      .map((file) => ({
        number: file.slice(0, 2),
        slug: file.slice(3, -3),
        file,
        fullPath: path.join(dirPath, file),
      }))
      .sort((a, b) => a.file.localeCompare(b.file));

    topics.push({ number, dir: entry.name, title: titleCase(slug), lessons });
  }

  return topics.sort((a, b) => a.number.localeCompare(b.number));
}

/** Finds the single topic best matching a query like "13", "graph", or "10-graphs". */
function matchTopic(topics: Topic[], query: string): Topic | Topic[] {
  const q = query.toLowerCase();
  // Exact number or exact directory name wins outright.
  const exact = topics.find((t) => t.number === q || t.dir.toLowerCase() === q);
  if (exact) return exact;
  // Otherwise fuzzy: topics whose number or directory contains the query.
  const fuzzy = topics.filter((t) => t.number.startsWith(q) || t.dir.toLowerCase().includes(q));
  return fuzzy.length === 1 ? fuzzy[0] : fuzzy;
}

/** Finds the single lesson best matching a query like "02" or "bit-tricks". */
function matchLesson(topic: Topic, query: string): Lesson | Lesson[] {
  const q = query.toLowerCase();
  const exact = topic.lessons.find((l) => l.number === q || l.slug.toLowerCase() === q);
  if (exact) return exact;
  const fuzzy = topic.lessons.filter((l) => l.number.startsWith(q) || l.slug.toLowerCase().includes(q));
  return fuzzy.length === 1 ? fuzzy[0] : fuzzy;
}

/** Prints the full curriculum roadmap: every topic and its lessons. */
export function printRoadmap(topics: Topic[]): void {
  const totalLessons = topics.reduce((sum, t) => sum + t.lessons.length, 0);
  console.log('');
  console.log(`  DSA · TypeScript — Roadmap (${topics.length} topics, ${totalLessons} lessons)`);
  console.log('  ' + '─'.repeat(60));
  for (const topic of topics) {
    console.log('');
    console.log(`  ${topic.number} · ${topic.title}  (${topic.lessons.length})`);
    for (const lesson of topic.lessons) {
      console.log(`       ${lesson.number}  ${lesson.slug}`);
    }
  }
  console.log('');
  console.log('  Run a topic:   npm run route ' + (topics[0]?.number ?? '13'));
  console.log('  Run a lesson:  npm run route ' + (topics[0]?.number ?? '13') + '/01');
  console.log('');
}

/** Runs a single lesson file by spawning ts-node on it (so its demo block fires). */
function runLesson(lesson: Lesson): number {
  console.log(`\n▶ ${path.relative(process.cwd(), lesson.fullPath)}`);
  const tsNodeBin = path.join(LESSONS_DIR, '..', 'node_modules', '.bin', 'ts-node');
  const bin = fs.existsSync(tsNodeBin) ? tsNodeBin : 'ts-node';
  const result = spawnSync(bin, [lesson.fullPath], { stdio: 'inherit' });
  return result.status ?? 1;
}

/** Prints a compact "did you mean" list when a query is ambiguous or unmatched. */
function suggest(label: string, options: { number: string; slug?: string; dir?: string }[]): void {
  if (options.length === 0) {
    console.error(`  No ${label} matched.`);
    return;
  }
  console.error(`  Ambiguous ${label} — did you mean one of:`);
  for (const opt of options) {
    console.error(`    ${opt.number}  ${opt.slug ?? opt.dir ?? ''}`);
  }
}

/** Parses argv and dispatches to roadmap / list / run. Returns a process exit code. */
export function main(argv: string[]): number {
  const args = argv.filter((a) => a !== '--roadmap');
  const listOnly = args.includes('--list');
  const positional = args.filter((a) => !a.startsWith('--'));
  const topics = scanTopics();

  // No target -> roadmap.
  if (positional.length === 0) {
    printRoadmap(topics);
    return 0;
  }

  const [topicQuery, lessonQuery] = positional[0].split('/');

  const topicMatch = matchTopic(topics, topicQuery);
  if (Array.isArray(topicMatch)) {
    suggest('topic', topicMatch);
    return 1;
  }

  // "13/02" style -> run/list a single lesson.
  if (lessonQuery) {
    const lessonMatch = matchLesson(topicMatch, lessonQuery);
    if (Array.isArray(lessonMatch)) {
      suggest('lesson', lessonMatch);
      return 1;
    }
    if (listOnly) {
      console.log(`  ${topicMatch.number}/${lessonMatch.number}  ${lessonMatch.slug}`);
      return 0;
    }
    return runLesson(lessonMatch);
  }

  // Topic only -> list or run every lesson in it.
  if (listOnly) {
    console.log(`\n  ${topicMatch.number} · ${topicMatch.title}`);
    for (const lesson of topicMatch.lessons) {
      console.log(`     ${lesson.number}  ${lesson.slug}`);
    }
    console.log('');
    return 0;
  }

  console.log(`\n  Running all ${topicMatch.lessons.length} lessons in ${topicMatch.dir}…`);
  let failures = 0;
  for (const lesson of topicMatch.lessons) {
    const code = runLesson(lesson);
    if (code !== 0) {
      failures++;
      console.error(`  ✗ ${lesson.file} exited with code ${code}`);
    }
  }
  console.log(`\n  Done: ${topicMatch.lessons.length - failures}/${topicMatch.lessons.length} lessons ran cleanly.`);
  return failures === 0 ? 0 : 1;
}

// --- run ---
if (require.main === module) {
  process.exit(main(process.argv.slice(2)));
}

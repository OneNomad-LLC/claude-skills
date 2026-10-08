#!/usr/bin/env node
// Always-on mode hook, shared verbatim by pager and napkin. Usage: mode.js session|prompt|subagent
// SessionStart and SubagentStart inject the plugin's ruleset at the session's level.
// UserPromptSubmit switches the level on /<name> lite|full|ultra|off and /<name> default <level>.

const fs = require('fs');
const os = require('os');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const NAME = JSON.parse(fs.readFileSync(path.join(ROOT, '.claude-plugin', 'plugin.json'), 'utf8')).name;
const LABEL = NAME.toUpperCase();
const LEVELS = ['lite', 'full', 'ultra', 'off'];
const CONFIG_DIR = process.env.CLAUDE_CONFIG_DIR || path.join(os.homedir(), '.claude');
const STATE_DIR = path.join(CONFIG_DIR, '.' + NAME);
const DEFAULT_FILE = path.join(STATE_DIR, 'default');
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function read(file) {
  try { return fs.readFileSync(file, 'utf8').trim(); } catch (e) { return ''; }
}

function write(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, value);
}

function sessionFile(sessionId) {
  return path.join(STATE_DIR, 'sessions', String(sessionId || 'unknown').replace(/[^\w-]/g, ''));
}

function defaultLevel() {
  const level = read(DEFAULT_FILE);
  return LEVELS.includes(level) ? level : 'full';
}

function sessionLevel(sessionId) {
  const level = read(sessionFile(sessionId));
  return LEVELS.includes(level) ? level : defaultLevel();
}

function pruneOldSessions() {
  const dir = path.join(STATE_DIR, 'sessions');
  let names = [];
  try { names = fs.readdirSync(dir); } catch (e) { return; }
  for (const name of names) {
    const file = path.join(dir, name);
    try { if (Date.now() - fs.statSync(file).mtimeMs > WEEK_MS) fs.unlinkSync(file); } catch (e) { /* best effort */ }
  }
}

// Drops the level table rows that don't belong to the active level.
function ruleset(level) {
  const body = read(path.join(ROOT, 'skills', NAME, 'SKILL.md')).replace(/^---[\s\S]*?---\s*/, '');
  const lines = body.split(/\r?\n/).filter((line) => {
    const row = line.match(/^\|\s*\*\*(\w+)\*\*\s*\|/);
    return !row || !LEVELS.includes(row[1]) || row[1] === level;
  });
  return LABEL + ' MODE ACTIVE, level: ' + level + '\n\n' + lines.join('\n');
}

function emit(event, context) {
  process.stdout.write(JSON.stringify({ hookSpecificOutput: { hookEventName: event, additionalContext: context } }));
}

function onSession(input) {
  pruneOldSessions();
  const level = sessionLevel(input.session_id);
  if (level !== 'off') emit('SessionStart', ruleset(level));
}

function onSubagent(input) {
  const level = sessionLevel(input.session_id);
  if (level !== 'off') emit('SubagentStart', ruleset(level));
}

function onPrompt(input) {
  const prompt = String(input.prompt || '').trim().toLowerCase();
  const stop = prompt === 'stop ' + NAME || prompt === 'stop ' + NAME + ' mode';
  const match = prompt.match(new RegExp('^/(?:' + NAME + ':)?' + NAME + '(?:\\s+(\\S+))?(?:\\s+(\\S+))?\\s*$'));
  if (!stop && !match) return;

  const [, arg = '', next = ''] = match || [, 'off'];
  if (arg === 'default' && LEVELS.includes(next)) {
    write(DEFAULT_FILE, next);
    emit('UserPromptSubmit', LABEL + ' DEFAULT SET: new sessions start at ' + next + '.');
    return;
  }
  const current = sessionLevel(input.session_id);
  const level = LEVELS.includes(arg) ? arg : (current === 'off' ? 'full' : current);
  write(sessionFile(input.session_id), level);
  emit('UserPromptSubmit', level === 'off'
    ? LABEL + ' MODE OFF: stop applying the ' + NAME + ' ruleset for the rest of this session.'
    : LABEL + ' MODE CHANGED, level: ' + level + '. Apply the ' + level + ' row of the levels table from now on.');
}

const handlers = { session: onSession, prompt: onPrompt, subagent: onSubagent };
let raw = '';
let done = false;

function finish() {
  if (done) return;
  done = true;
  try {
    const input = raw.trim() ? JSON.parse(raw) : {};
    (handlers[process.argv[2]] || (() => {}))(input);
  } catch (e) {
    // Never block the session over this hook.
  }
  process.exit(0);
}

process.stdin.on('data', (chunk) => { raw += chunk; });
process.stdin.on('end', finish);
process.stdin.on('error', finish);
setTimeout(finish, 1000);

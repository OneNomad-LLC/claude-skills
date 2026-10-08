---
name: trim-debt
description: >
  List every `shortcut:` comment in the repo as a debt ledger, grouped by file,
  with the limit and the upgrade trigger. One-shot report, changes nothing.
  Use for "trim debt", "what did trim defer", "list the shortcuts", /trim-debt.
license: Apache-2.0
---

Trim marks each deliberate shortcut with a comment in the form `shortcut: <the limit>, <when to upgrade>`. This skill gathers them into one ledger so a deferral can't quietly turn permanent.

## Scan

Grep the repo for the marker in comments. Skip `.git`, `node_modules` and build output:

`grep -rnE --exclude-dir=.git --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build '(#|//|/[*]) ?shortcut:' .`

Add other comment prefixes if the stack uses them. If the user names a different marker word (`/trim-debt TODO`), grep for that word instead.

Each hit is one row. Skip hits that aren't a deferral, such as a comment about a keyboard shortcut.

## Output

One row per marker, grouped by file:

`<file>:<line>, <what was simplified>. limit: <the limit>. upgrade: <the trigger>.`

Take the limit and the trigger straight from the comment text. If the user wants owners, add `git blame -L<line>,<line>` for each row.

Tag any marker that names no upgrade trigger as `no-trigger`. Those are the ones that rot.

End with `<N> markers, <M> with no trigger.` If nothing turns up: `No shortcut debt.`

## Boundaries

Reads and reports only. To keep the ledger, the user can ask and you'll write it to a file such as `TRIM-DEBT.md`. One-shot: it doesn't stay active after the report.

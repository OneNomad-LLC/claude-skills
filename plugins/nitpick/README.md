# nitpick

A code reviewer for Claude Code that acts like an opinionated senior developer
who nitpicks everything. Run `/nitpick` and it reviews your changes in a fresh
subagent, then hands back a verdict and a ranked list of findings, each with a
`file:line` and the concrete fix.

What it holds the code to:

- **Readable.** Names that say what things are, no clever one-liners or nested
  ternaries, early returns over nesting, named constants, comments that explain
  why.
- **Organized.** Small single-purpose functions and files, no dead code or debug
  leftovers, real types, errors handled the way the codebase handles them.
- **Not repetitive.** Duplicated logic becomes a function, repeated markup a
  component, and reimplementing a helper the codebase already has is a
  must-fix. It won't force an abstraction onto code that's only alike by
  accident.
- **Mainstream libraries.** It checks every new dependency's release history,
  downloads and types, flags niche or abandoned packages, and names the popular
  alternative.
- **Consistent.** The codebase's own conventions win over the reviewer's taste.

It reviews only. Fixes happen after you say so.

```
/nitpick                 # uncommitted changes plus the branch against its base
/nitpick feature/foo     # a branch
/nitpick main..HEAD      # a ref range
/nitpick 123             # a GitHub PR
/nitpick src/lib/date.ts # whole files
```

The reviewer agent runs on Sonnet. Change `model` in
`agents/nitpick.md` if you want a heavier reviewer.

## Install

```
/plugin marketplace add OneNomad-LLC/claude-skills
/plugin install nitpick@claude-skills
```

# claude-skills

OneNomad's library of Claude Code skills, shipped as plugins from one
marketplace.

## Install

```
/plugin marketplace add OneNomad-LLC/claude-skills
/plugin install <plugin>@claude-skills
```

## Plugins

| Plugin | What it does |
|---|---|
| [craft](plugins/craft) | Premium web and app design. Runs a brief interview and a taste picker built from real example sites, sets an OKLCH token system with designed light and dark themes, builds a prototype for review, then production code in Next.js + Tailwind or Expo. Checks the result with rendered screenshots, contrast and focus lint, and a critic agent. Includes a scroll-told landing page mode. |

## Adding a plugin

1. Create `plugins/<name>/.claude-plugin/plugin.json`, then put skills in
   `plugins/<name>/skills/<skill>/SKILL.md` and agents in `plugins/<name>/agents/`.
2. Add the plugin to `.claude-plugin/marketplace.json` with
   `"source": "./plugins/<name>"`.
3. Copy `LICENSE` into the plugin folder. Installs copy only that folder.
   Third-party material needs its notice in the plugin's `NOTICE`.
4. Bump `version` in both `plugin.json` and the marketplace entry for every
   change you want installs to pick up. Claude Code caches each installed
   version, so a new commit under the same version reaches nobody.

Secrets never go in this repo. Plugins read keys from the environment and
document them in a `.env.example`. A pre-commit hook runs gitleaks, falling
back to a pattern check when gitleaks isn't installed. In a fresh clone, turn
it on with `git config core.hooksPath .githooks`.

## Licence

Apache-2.0, unless a plugin's `NOTICE` says a part of it comes from elsewhere.

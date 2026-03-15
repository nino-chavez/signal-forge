# Project Organization Conventions - Quick Reference

## Directory Naming

| Convention | Example | Notes |
|------------|---------|-------|
| kebab-case | `my-feature/` | Always lowercase |
| Singular nouns | `provider/` not `providers/` | Unless collection-like |
| Domain-based | `voice/`, `content/` | Group by purpose |

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| TypeScript module | kebab-case | `voice-checker.ts` |
| Type definitions | kebab-case | `content-types.ts` |
| Test files | `.test.ts` suffix | `voice-checker.test.ts` |
| Barrel exports | `index.ts` | Entry point for directory |

## Directory Thresholds

```
Files: 0     → Delete directory
Files: 1     → Promote file to parent
Files: 2-7   → Keep as directory
Files: 8+    → Consider subdividing
```

## Standard Layers

```
src/
├── core/          # Types, utilities (no business logic)
├── [domain]/      # Business domains
├── providers/     # External adapters
├── cli/           # User interface
└── tools/         # Shared tooling
```

## Symlink Creation

From: `.claude/skills/foo/references/`
To:   `docs/bar/guide.md`

```bash
# Count directory levels (4 up, then down)
ln -s ../../../../docs/bar/guide.md guide.md
```

## Import Path Updates After Moves

| Scenario | Before | After |
|----------|--------|-------|
| File moved deeper | `../foo.js` | `../../foo.js` |
| File moved shallower | `../../foo.js` | `../foo.js` |
| Sibling directory | `../bar/foo.js` | `../bar/foo.js` |

## Build Verification

```bash
npm run build    # TypeScript must pass
npm run test     # Tests must pass
git status       # No unexpected changes
```

## Common Fixes

| Issue | Command |
|-------|---------|
| Delete empty dir | `rmdir dir/` or `rm -rf dir/` |
| Move with history | `git mv src/ dest/` |
| Create symlink | `ln -s target linkname` |
| Verify symlink | `ls -la linkname` |
| Test symlink | `cat linkname` |

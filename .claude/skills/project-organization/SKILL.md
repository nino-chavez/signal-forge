# Project Organization

Audit and reorganize project structures following conventions for maintainability, discoverability, and single-source-of-truth principles.

## Triggers

Use this skill when:
- Setting up a new project structure
- Auditing an existing project for organizational issues
- Resolving documentation fragmentation
- User asks about file/folder conventions
- Detecting drift between documented and actual structure

## Core Principles

### 1. Single Source of Truth
- No duplicated files across the project
- Symlinks for shared references (e.g., skill references pointing to canonical docs)
- Documentation must match reality

### 2. Directory Depth Thresholds
| File Count | Action |
|------------|--------|
| 1 file | Promote to parent directory |
| 2-7 files | Keep as directory |
| 8+ files | Subdivide by domain |

### 3. Existence Before Reference
- Never document phantom paths in README/CLAUDE.md
- Verify all referenced paths exist before documenting
- If a path doesn't exist, either create it or remove the reference

### 4. Consistent Naming
- Use kebab-case for directories and files
- Avoid redundant prefixes (e.g., `design-system-colors.md` in `design-system/` should be `colors.md`)
- Group by domain, not by type

## Standard TypeScript/Node.js Structure

```
project/
├── src/
│   ├── core/          # Foundational layer (types, utils)
│   │   ├── types/     # Domain-specific types
│   │   └── utils/     # Shared utilities
│   ├── [domain]/      # Domain modules
│   ├── providers/     # External service adapters
│   └── cli/           # Command-line interface
├── docs/
│   ├── [topic]/       # Topic-based organization
│   └── internal/      # Development docs
├── templates/         # Generation templates (at root)
└── .claude/
    └── skills/        # Claude skills (references as symlinks)
```

## Module Patterns

### Provider/Adapter Pattern
```
providers/
├── index.ts           # Factory and registry
├── types.ts           # Provider interfaces
├── openai.ts          # OpenAI adapter
├── anthropic.ts       # Anthropic adapter
└── [provider].ts      # Additional providers
```

### Feature Module Pattern
```
[feature]/
├── index.ts           # Public exports
├── types.ts           # Feature-specific types
├── [feature].ts       # Core implementation
└── [feature]-utils.ts # Feature utilities
```

### Exporter/Handler Pattern
```
exporters/
├── index.ts           # Export registry
├── pptx-exporter.ts   # PowerPoint export
├── docx-exporter.ts   # Word export
└── [format]-exporter.ts
```

## Anti-Patterns to Avoid

| Anti-Pattern | Example | Fix |
|--------------|---------|-----|
| Empty directories | `src/generators/` (empty) | Delete or populate |
| Single-file directories | `src/design-system/` (1 file) | Promote file to parent |
| Duplicated documentation | Same guide in docs/ and skills/ | Use symlinks |
| Phantom references | CLAUDE.md lists `/content/` that doesn't exist | Remove or create |
| Deep nesting | >4 levels | Flatten or reorganize |
| Type monolith | `types.ts` with 400+ lines | Split by domain |
| Mixed concerns | `src/voice/` containing templates | Separate directories |

## Audit Checklist

### Structure Audit
- [ ] No empty directories
- [ ] No single-file directories (unless intentional)
- [ ] All referenced paths exist
- [ ] No duplicated files
- [ ] Symlinks resolve correctly
- [ ] Consistent naming conventions

### Documentation Audit
- [ ] CLAUDE.md project structure matches reality
- [ ] All path references are valid
- [ ] No phantom directories documented
- [ ] Version history updated

### Code Audit
- [ ] Import paths are correct after moves
- [ ] TypeScript builds successfully
- [ ] No circular dependencies
- [ ] Barrel exports (index.ts) updated

## Migration Guidance

### Moving Files
1. Use `git mv` to preserve history
2. Update all imports immediately
3. Run TypeScript compiler to catch errors
4. Verify build before committing

### Creating Symlinks
1. Calculate relative path from symlink location
2. Create symlink: `ln -s relative/path/to/target symlink-name`
3. Verify symlink resolves: `cat symlink-name`
4. Add to git: `git add symlink-name`

### Updating Imports
After moving `src/foo/` to `src/bar/foo/`:
- Imports from siblings: `../foo/` stays same
- Imports from parent: `./foo/` becomes `./bar/foo/`
- Imports from children: `../../foo/` becomes `../../../foo/`

## References

See `/docs/internal/` for development documentation.

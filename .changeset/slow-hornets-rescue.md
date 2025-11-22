---
'@uturi/sonification': major
---

Add Vue and Svelte support with framework-specific hooks

This major release extends @uturi/sonification to support Vue and Svelte frameworks in addition to React. Framework-specific hooks/composables are now available through subpath exports.

**New Features:**

- Vue support: `useSonifier` composable via `@uturi/sonification/vue`
- Svelte support: `useSonifier` function via `@uturi/sonification/svelte`
- Subpath exports for framework-specific implementations (`/react`, `/vue`, `/svelte`, `/core`)

**Changes:**

- Added optional peer dependencies for Vue and Svelte
- Updated package exports to include framework-specific entry points
- Enhanced documentation with framework-specific examples

**Migration:**

- React users: No changes required, existing imports continue to work
- Vue/Svelte users: Import from the framework-specific subpath
- Core users: Can now import from `@uturi/sonification/core` for tree-shaking

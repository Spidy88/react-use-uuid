# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0] - 2026-06-29

### Changed

- **BREAKING:** The string-based version API (`useId(version, ...args)`) is
  replaced by an optional **factory function**, `useId(factory?)`. This lets
  bundlers include only the uuid code you actually import — the default import
  now pulls in UUID v4 and nothing else. `useId()` with no arguments is
  unchanged and still returns a UUID v4.

  ```diff
  - const id5 = useId('v5', 'hello.example.com', uuidv5.DNS);
  + import { v5 } from 'uuid';
  + const id5 = useId(() => v5('hello.example.com', v5.DNS));
  ```

- Rewrote the source in **TypeScript**; the package now ships `.d.ts` type
  definitions.
- Replaced the Babel + Jest toolchain with **tsup** (dual ESM/CJS builds) and
  **Vitest**. The package is now published as both ESM and CommonJS with a
  proper `exports` map and `sideEffects: false` for tree-shaking.

### Security

- `npm audit` goes from dozens of critical/high/moderate advisories to **0
  vulnerabilities**. The findings lived in the old `@babel/*` and `jest`
  dependency trees (including the critical `@babel/traverse` RCE) and in
  `uuid@3`.
- Bumped `uuid` 3.4.0 → 14.0.1 and refreshed all remaining dependencies.

[3.0.0]: https://github.com/Spidy88/react-use-uuid/releases/tag/v3.0.0

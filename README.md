# react-use-uuid

A tiny React Hook that generates a unique id which stays **stable for the entire lifetime of a component**.

- 🪶 **Lightweight** — the default import only pulls in UUID v4, nothing else.
- 🌳 **Tree-shakeable** — ESM + CJS builds, `sideEffects: false`. You bundle only the uuid code you actually use.
- 🔠 **TypeScript** — ships with type definitions.
- ⚛️ **Works with React 16.8+** through 18, and still useful in 19 (see [vs. React 19's `useId`](#vs-reacts-built-in-useid)).

```bash
npm install react-use-uuid
```

## Why

With class components you could generate an id once and stash it on the instance. Hooks have no instance, so you need a hook that creates an id on the first render and returns that same value on every render afterwards.

`useId` does exactly that. The generator runs **once**, on the first render, and the id never changes for the lifetime of the component — handy for DOM ids, `htmlFor`/`aria-*` wiring, or integrating third‑party libraries that take a selector.

## Usage

```jsx
import { useCallback, useEffect } from 'react';
import useId from 'react-use-uuid';

function MyComponent() {
  const id = useId(); // a stable UUID v4

  const onDrop = useCallback((files) => console.log(`Received ${files.length} files`), []);

  useEffect(() => {
    // Third party code with limited integration
    Aspera.Connect.setDragDropTargets(`#${id}`, onDrop);
  }, [id, onDrop]);

  return <div id={id}>Drop your files here</div>;
}
```

A named import is also available (and is the recommended form for CommonJS):

```js
import { useId } from 'react-use-uuid';
// CommonJS:
const { useId } = require('react-use-uuid');
```

## Using a different UUID version (or any id generator)

`useId` accepts an optional **factory function** — anything that returns a string. The default is UUID v4. Because you choose the generator by what you *import* (rather than by passing a version string), your bundler only includes the uuid code you actually reference.

```jsx
import useId from 'react-use-uuid';
import { v5 } from 'uuid';

function MyComponent() {
  // v5 derives a deterministic id from a name + namespace
  const id = useId(() => v5('hello.example.com', v5.DNS));
  return <div id={id} />;
}
```

This works with any uuid version (`v1`, `v3`, `v4`, `v5`, `v6`, `v7`) — or a completely custom generator:

```jsx
const id = useId(() => `widget-${Math.random().toString(36).slice(2)}`);
```

### Custom id hook

If you reuse a particular generator across your app, wrap it in your own hook to keep things DRY:

```js
// useCustomId.js
import { useId } from 'react-use-uuid';
import { v5 } from 'uuid';

export function useCustomId() {
  return useId(() => v5('hello.example.com', v5.DNS));
}
```

## vs. React's built-in `useId`

React 18 introduced — and React 19 keeps — a built-in [`useId`](https://react.dev/reference/react/useId). **They solve different problems**, so pick based on what you need:

| | React's `useId` | `react-use-uuid` |
| --- | --- | --- |
| Output | An opaque, SSR‑safe token like `«r0»` | A real UUID (e.g. `f47ac10b‑58cc‑4372‑a567‑0e02b2c3d479`) |
| Designed for | Hydration‑stable `id`s for accessibility attributes (`htmlFor`, `aria-*`) | A genuine unique identifier you control |
| Safe as a DOM `id` you query / pass to 3rd‑party libs | Not guaranteed — the format is reserved and intentionally opaque | Yes |
| Usable as a React `key` | No (per React docs) | Yes |
| Available | React 18+ | React 16.8+ |

Use React's `useId` for wiring a label to an input. Reach for `react-use-uuid` when you need an actual UUID value — a queryable DOM id, a key for an external library, a draft record id, etc. — or when you simply prefer the UUID format over React's opaque tokens, or you're on React 16.8–17 where the built-in doesn't exist.

## Migrating from v2

v3 is a **breaking change** made to keep the package lightweight. The old `useId(version, ...args)` string API forced every uuid version into your bundle; the new factory API lets bundlers drop everything you don't use.

```diff
  import useId from 'react-use-uuid';
+ import { v5 } from 'uuid';

  const id = useId();                                    // unchanged — still v4
- const id5 = useId('v5', 'hello.example.com', uuidv5.DNS);
+ const id5 = useId(() => v5('hello.example.com', v5.DNS));
```

`useId()` with no arguments is unchanged — it still returns a UUID v4.

## API

```ts
function useId(factory?: () => string): string;
```

- **`factory`** — optional. A function returning the id string. Called exactly once, on first render. Defaults to UUID v4.
- **Returns** — the id, stable across all re-renders of the component.

## License

MIT

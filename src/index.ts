import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

/**
 * A function that produces a string id. `useId` calls it exactly once,
 * on the first render of the component, to lazily create the id.
 */
export type IdFactory = () => string;

/**
 * Generate a unique id that stays stable for the entire lifetime of a
 * component. The id is created once, on the first render, and the same
 * value is returned on every subsequent render.
 *
 * By default a UUID v4 is generated. To use a different generator — for
 * example UUID v5, or anything else that returns a string — pass your own
 * factory. Because the version is chosen by what *you* import rather than
 * by a string argument, bundlers only include the uuid code you actually
 * use (the default import pulls in v4 and nothing else).
 *
 * @example
 * // Default: a UUID v4
 * const id = useId();
 *
 * @example
 * // A UUID v5, deriving from a name + namespace
 * import { v5 } from 'uuid';
 * const id = useId(() => v5('hello.example.com', v5.DNS));
 *
 * @param factory - Optional function that returns the id. Defaults to UUID v4.
 * @returns A stable id for the lifetime of the component.
 */
export function useId(factory: IdFactory = uuidv4): string {
  // useState (not useMemo) because React makes no guarantee that a memo
  // store is durable — useState is the only hook guaranteed to preserve
  // its value across re-renders. The function form runs the factory lazily,
  // so it is only ever called on the first render.
  const [id] = useState(factory);
  return id;
}

export default useId;

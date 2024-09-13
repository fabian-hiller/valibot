import type { ConversionContext } from '../type.ts';

/**
 * Creates a new conversion context.
 *
 * @param initial The initial context to use.
 *
 * @returns A new conversion context.
 */
export function createContext(initial?: ConversionContext): ConversionContext {
  return {
    definitions: initial?.definitions ?? {},
    referenceMap: initial?.referenceMap ?? new Map(),
  };
}

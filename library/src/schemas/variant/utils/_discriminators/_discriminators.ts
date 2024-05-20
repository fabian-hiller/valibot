import type { VariantOptions, VariantOptionsAsync } from '../../types.ts';

/**
 * Returns the expected discriminators of a variant schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param set The expected discriminators.
 *
 * @returns The expected discriminators.
 *
 * @internal
 */
export function _discriminators(
  key: string,
  options: VariantOptions<string> | VariantOptionsAsync<string>,
  set: Set<string> = new Set<string>()
): Set<string> {
  for (const schema of options) {
    if (schema.type === 'variant') {
      _discriminators(key, schema.options, set);
    } else {
      set.add(schema.entries[key].expects);
    }
  }
  return set;
}

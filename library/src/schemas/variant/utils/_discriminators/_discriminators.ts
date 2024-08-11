import type { VariantOptions, VariantOptionsAsync } from '../../types.ts';

/**
 * Returns the expected discriminators of a variant schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param list The expected discriminators.
 *
 * @returns The expected discriminators.
 *
 * @internal
 */
export function _discriminators(
  key: string,
  options: VariantOptions<string> | VariantOptionsAsync<string>,
  list: string[] = []
): string[] {
  for (const schema of options) {
    if (schema.type === 'variant') {
      _discriminators(key, schema.options, list);
    } else {
      list.push(schema.entries[key].expects);
    }
  }
  return list;
}

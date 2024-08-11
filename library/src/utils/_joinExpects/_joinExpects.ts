/**
 * Joins multiple `expects` values with the given separator.
 *
 * @param values The `expects` values.
 * @param separator The separator.
 *
 * @returns The joined `expects` property.
 *
 * @internal
 */
export function _joinExpects(values: string[], separator: '&' | '|'): string {
  // Create list without duplicates
  const list = [...new Set(values)];

  // If list has more than one item, join them
  if (list.length > 1) {
    return `(${list.join(` ${separator} `)})`;
  }

  // Otherwise, return first item or "never"
  return list[0] ?? 'never';
}

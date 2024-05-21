/**
 * Prevents object prototype pollution by disallowing certain keys.
 *
 * @param key The key to check.
 *
 * @returns Whether the key is allowed.
 *
 * @internal
 */
export function _isAllowedObjectKey(key: string): boolean {
  return key !== '__proto__' && key !== 'prototype' && key !== 'constructor';
}

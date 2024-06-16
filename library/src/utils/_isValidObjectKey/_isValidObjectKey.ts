/**
 * Disallows inherited object properties and prevents object prototype
 * pollution by disallowing certain keys.
 *
 * @param object The object to check.
 * @param key The key to check.
 *
 * @returns Whether the key is allowed.
 *
 * @internal
 */
export function _isValidObjectKey(object: object, key: string): boolean {
  return (
    Object.hasOwn(object, key) &&
    key !== '__proto__' &&
    key !== 'prototype' &&
    key !== 'constructor'
  );
}

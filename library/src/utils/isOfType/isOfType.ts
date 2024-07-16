/**
 * A generic type guard to check the type of an object.
 *
 * @param type The type to check for.
 * @param object The object to check.
 *
 * @returns Whether it matches.
 */
export function isOfType<
  const TType extends TObject['type'],
  const TObject extends { type: string },
>(type: TType, object: TObject): object is Extract<TObject, { type: TType }> {
  return object.type === type;
}

/**
 * A generic type guard to check the kind of an object.
 *
 * @param kind The kind to check for.
 * @param object The object to check.
 *
 * @returns Whether it matches.
 */
// @__NO_SIDE_EFFECTS__
export function isOfKind<
  const TKind extends TObject['kind'],
  const TObject extends { kind: string },
>(kind: TKind, object: TObject): object is Extract<TObject, { kind: TKind }> {
  return object.kind === kind;
}

/**
 * A generic [type predicate guard](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) used to filter Schemas, Transformations, and Validations in control flow at runtime, and to narrow unions of such types at authoring time.
 *
 * @param val The Schema, Transformation, or Validation to compare against
 * @param type The required type value we expect `val` to have
 *
 * @returns A boolean predicated on whether `val` has the given `type`
 *
 * When the type of `val` is a union, `hasType` will discriminate based on the proided `type` string. This is better understood with an example:
 *
 * ```ts
 * import * as v from 'valibot';
 *
 * type Schema =
 *  | v.BaseSchema
 *  | v.ObjectSchema<v.ObjectEntries>
 *  | v.ArraySchema<v.BaseSchema>;
 *
 * function schemaToJson<S extends Schema>(schema: S) {
 *  if (hasType(schema, "string")) {
 *    // narrows schema to StringSchema
 *    return { type: 'string' };
 *  }
 *  if (hasType(schema, 'object')) {
 *    // narrows schema to ObjectSchema<ObjectEntries>
 *    return {
 *      type: 'object',
 *      entries: Object.fromEntries(
 *        Object.entries(schema.entries).map(([key, value]) => [
 *          key,
 *          schemaToJson(value),
 *        ])
 *      ),
 *    };
 *  }
 *  if (hasType(schema, 'array')) {
 *    // narrows schema to ArraySchema<BaseSchema>
 *    return {
 *      type: 'array',
 *      item: schemaToJson(schema.item),
 *    };
 *  }
 *  // schema extends BaseSchema, but it is not a StringSchema, ObjectSchema, or ArraySchema
 *  throw new Error('Not implemented');
 * }
 * ```
 */
export const hasType = <
  U extends { type: string },
  const T extends string = string
>(
  val: U,
  type: T
): val is Extract<U, { type: T }> => val?.type === type;

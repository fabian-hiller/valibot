import type { ObjectSchema } from "../../schemas";
import type {BaseSchema, Output} from "../../types.ts";
import {safeParse} from "../safeParse";


/**
 * Creates a default object from a given object schema.
 * The object will contain possible default values that could have been derived from default ({@link optional}) or fallback ({@link fallback}) values.
 *
 * @param schema The affected schema.
 *
 * @returns An object schema.
 */
export function getDefaults<TObjectSchema extends ObjectSchema<any>>(
  schema: TObjectSchema
): Partial<Output<TObjectSchema>> {
  function trySafeParse<TSchema extends BaseSchema>(keySchema: TSchema) {
    const result = safeParse(keySchema, undefined);
    return result.success ? result.output : undefined;
  }

  return Object.entries(schema.object).reduce(
    (prev, [key, keySchema]) => ({
      ...prev,
      [key]: trySafeParse(keySchema as BaseSchema)
    }),
    {}
  );
}
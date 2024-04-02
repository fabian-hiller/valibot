import type { BaseIssue, BaseSchema, Default } from '../../types/index.ts';
import type { DefaultValue } from './types.ts';

/**
 * Schema with maybe default type.
 */
export type SchemaWithMaybeDefault<
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TDefault extends Default<TSchema>,
> = TSchema & {
  /**
   * The optional default value.
   */
  default?: TDefault;
};

/**
 * Returns the default value of the schema.
 *
 * @param schema The schema to get the default value from.
 *
 * @returns The default value.
 */
export function getDefault<
  const TSchema extends SchemaWithMaybeDefault<
    BaseSchema<unknown, unknown, BaseIssue<unknown>>,
    Default<BaseSchema<unknown, unknown, BaseIssue<unknown>>>
  >,
>(schema: TSchema): DefaultValue<TSchema> {
  return typeof schema.default === 'function'
    ? schema.default()
    : schema.default;
}

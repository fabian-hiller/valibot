import type { BaseSchema, Input, Output } from '../../types.ts';

/**
 * Recursive schema type.
 */
export type RecursiveSchema<
  TSchemaGetter extends () => BaseSchema,
  TOutput = Output<ReturnType<TSchemaGetter>>
> = BaseSchema<Input<ReturnType<TSchemaGetter>>, TOutput> & {
  kind: 'recursive';
  /**
   * The schema getter.
   */
  getter: TSchemaGetter;
};

/**
 * Creates a recursive schema.
 *
 * @param getter The schema getter.
 *
 * @returns A recursive schema.
 */
export function recursive<TSchemaGetter extends () => BaseSchema>(
  getter: TSchemaGetter
): RecursiveSchema<TSchemaGetter> {
  return {
    kind: 'recursive',
    async: false,
    getter,
    _parse(input, info) {
      return getter()._parse(input, info);
    },
  };
}

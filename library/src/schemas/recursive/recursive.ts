import type { BaseSchema, Input, Output } from '../../types/index.ts';

/**
 * Recursive schema type.
 */
export type RecursiveSchema<
  TSchemaGetter extends () => BaseSchema,
  TOutput = Output<ReturnType<TSchemaGetter>>
> = BaseSchema<Input<ReturnType<TSchemaGetter>>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'recursive';
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
    type: 'recursive',
    async: false,
    getter,
    _parse(input, info) {
      return this.getter()._parse(input, info);
    },
  };
}

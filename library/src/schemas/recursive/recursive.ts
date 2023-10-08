import type { BaseSchema, Input, Output } from '../../types.ts';

/**
 * Recursive schema type.
 */
export type RecursiveSchema<
  TSchemaGetter extends () => BaseSchema,
  TOutput = Output<ReturnType<TSchemaGetter>>
> = BaseSchema<Input<ReturnType<TSchemaGetter>>, TOutput> & {
  schema: 'recursive';
  getter: TSchemaGetter;
};

/**
 * Creates a recursive schema.
 * @param getter The schema getter.
 * @returns A recursive schema.
 */
export function recursive<TSchemaGetter extends () => BaseSchema>(
  getter: TSchemaGetter
): RecursiveSchema<TSchemaGetter> {
  return {
    /**
     * The schema type.
     */
    schema: 'recursive',

    /**
     * The schema getter.
     */
    getter,

    /**
     * Whether it's async.
     */
    async: false,

    /**
     * Parses unknown input based on its schema.
     * @param input The input to be parsed.
     * @param info The parse info.
     * @returns The parsed output.
     */
    _parse(input, info) {
      return getter()._parse(input, info);
    },
  };
}

import type { BaseSchema, Input, Output, Pipe } from '../../types/index.ts';
import { executePipe } from '../../utils/index.ts';

/**
 * Schema with transform type.
 */
export type SchemaWithTransform<TSchema extends BaseSchema, TOutput> = Omit<
  TSchema,
  '_types'
> & {
  _types?: {
    input: Input<TSchema>;
    output: TOutput;
  };
};

/**
 * Adds a transformation step to a schema, which is executed at the end of
 * parsing and can change the output type.
 *
 * @param schema The schema to be used.
 * @param action The transformation action.
 * @param pipe A validation pipe.
 *
 * @returns A transformed schema.
 */
export function transform<TSchema extends BaseSchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput,
  pipe?: Pipe<TOutput>
): SchemaWithTransform<TSchema, TOutput>;

/**
 * Adds a transformation step to a schema, which is executed at the end of
 * parsing and can change the output type.
 *
 * @param schema The schema to be used.
 * @param action The transformation action.
 * @param validate A validation schema.
 *
 * @returns A transformed schema.
 */
export function transform<TSchema extends BaseSchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput,
  validate?: BaseSchema<TOutput>
): SchemaWithTransform<TSchema, TOutput>;

export function transform<TSchema extends BaseSchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput,
  arg1?: Pipe<TOutput> | BaseSchema<TOutput>
): SchemaWithTransform<TSchema, TOutput> {
  return {
    ...schema,
    _parse(input, info) {
      // Parse input with schema
      const result = schema._parse(input, info);

      // If there are issues, return them
      if (result.issues) {
        return result;
      }

      // Otherwise, transform output
      const output = action(result.output);

      // Validate output with schema if available
      if (arg1 && !Array.isArray(arg1)) {
        return arg1._parse(output, info);
      }

      // Otherwise, return pipe result
      return executePipe(output, arg1, info, typeof output);
    },
  };
}

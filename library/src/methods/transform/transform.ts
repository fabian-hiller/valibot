import type { BaseSchema, Input, Output, Pipe } from '../../types/index.ts';
import { pipeResult } from '../../utils/index.ts';
import type { TransformInfo } from './types.ts';

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
  action: (input: Output<TSchema>, info: TransformInfo) => TOutput,
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
  action: (input: Output<TSchema>, info: TransformInfo) => TOutput,
  validate?: BaseSchema<TOutput>
): SchemaWithTransform<TSchema, TOutput>;

export function transform<TSchema extends BaseSchema, TOutput>(
  schema: TSchema,
  action: (input: Output<TSchema>, info: TransformInfo) => TOutput,
  arg1?: Pipe<TOutput> | BaseSchema<TOutput>
): SchemaWithTransform<TSchema, TOutput> {
  return {
    ...schema,
    _parse(input, config) {
      // Parse input with schema
      const result = schema._parse(input, config);

      // If result is typed, transform output
      if (result.typed) {
        result.output = action(result.output, { issues: result.issues });

        // If there are issues or no validation arg, return result
        if (result.issues || !arg1) {
          return result;
        }

        // Otherwise, if a pipe is provided, return pipe result
        if (Array.isArray(arg1)) {
          return pipeResult(
            { type: typeof result.output, pipe: arg1 },
            result.output,
            config
          );
        }

        // Otherwise, validate output with schema
        return arg1._parse(result.output, config);
      }

      // Otherwise, return untyped result
      return result;
    },
  };
}

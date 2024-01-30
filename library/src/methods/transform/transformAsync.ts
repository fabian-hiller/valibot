import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
  ParseInfo,
  PipeAsync,
  SchemaResult,
} from '../../types/index.ts';
import { pipeResultAsync } from '../../utils/index.ts';
import type { TransformInfo } from './types.ts';

/**
 * Schema with transform async type.
 */
export type SchemaWithTransformAsync<
  TSchema extends BaseSchema | BaseSchemaAsync,
  TOutput
> = Omit<TSchema, 'async' | '_parse' | '_types'> & {
  async: true;
  _parse(input: unknown, info?: ParseInfo): Promise<SchemaResult<TOutput>>;
  _types?: {
    input: Input<TSchema>;
    output: TOutput;
  };
};

/**
 * Adds an async transformation step to a schema, which is executed at the end
 * of parsing and can change the output type.
 *
 * @param schema The schema to be used.
 * @param action The transformation action.
 * @param pipe A validation pipe.
 *
 * @returns A transformed schema.
 */
export function transformAsync<
  TSchema extends BaseSchema | BaseSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (
    input: Output<TSchema>,
    info: TransformInfo
  ) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): SchemaWithTransformAsync<TSchema, TOutput>;

/**
 * Adds an async transformation step to a schema, which is executed at the end
 * of parsing and can change the output type.
 *
 * @param schema The schema to be used.
 * @param action The transformation action.
 * @param validate A validation schema.
 *
 * @returns A transformed schema.
 */
export function transformAsync<
  TSchema extends BaseSchema | BaseSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (
    input: Output<TSchema>,
    info: TransformInfo
  ) => TOutput | Promise<TOutput>,
  validate?: BaseSchema<TOutput> | BaseSchemaAsync<TOutput>
): SchemaWithTransformAsync<TSchema, TOutput>;

export function transformAsync<
  TSchema extends BaseSchema | BaseSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (
    input: Output<TSchema>,
    info: TransformInfo
  ) => TOutput | Promise<TOutput>,
  arg1?: PipeAsync<TOutput> | BaseSchema<TOutput> | BaseSchemaAsync<TOutput>
): SchemaWithTransformAsync<TSchema, TOutput> {
  return {
    ...schema,
    async: true,
    async _parse(input, info) {
      // Parse input with schema
      const result = await schema._parse(input, info);

      // If result is typed, transform output
      if (result.typed) {
        result.output = await action(result.output, { issues: result.issues });

        // If there are issues or no validation arg, return result
        if (result.issues || !arg1) {
          return result;
        }

        // Otherwise, if a pipe is provided, return pipe result
        if (Array.isArray(arg1)) {
          return pipeResultAsync(
            result.output,
            arg1,
            info,
            typeof result.output
          );
        }

        // Otherwise, validate output with schema
        return arg1._parse(result.output, info);
      }

      // Otherwise, return untyped result
      return result;
    },
  };
}

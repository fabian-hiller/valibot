import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
  PipeAsync,
  SchemaConfig,
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
  _parse(input: unknown, config?: SchemaConfig): Promise<SchemaResult<TOutput>>;
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
 * @param validation A validation schema.
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
  validation?: BaseSchema<TOutput> | BaseSchemaAsync<TOutput>
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
    async _parse(input, config) {
      // Parse input with schema
      const result = await schema._parse(input, config);

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

import { type Issue, type Issues, ValiError } from '../../error/index.ts';
import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
  PipeAsync,
} from '../../types.ts';
import {
  executePipeAsync,
  getCurrentPath,
  getErrorAndPipe,
  getPipeInfo,
} from '../../utils/index.ts';

/**
 * Array schema async type.
 */
export type ArraySchemaAsync<
  TArrayItem extends BaseSchema | BaseSchemaAsync,
  TOutput = Output<TArrayItem>[]
> = BaseSchemaAsync<Input<TArrayItem>[], TOutput> & {
  schema: 'array';
  array: { item: TArrayItem };
};

/**
 * Creates an async array schema.
 *
 * @param item The item schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async array schema.
 */
export function arrayAsync<TArrayItem extends BaseSchema | BaseSchemaAsync>(
  item: TArrayItem,
  pipe?: PipeAsync<Output<TArrayItem>[]>
): ArraySchemaAsync<TArrayItem>;

/**
 * Creates an async array schema.
 *
 * @param item The item schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async array schema.
 */
export function arrayAsync<TArrayItem extends BaseSchema | BaseSchemaAsync>(
  item: TArrayItem,
  error?: string,
  pipe?: PipeAsync<Output<TArrayItem>[]>
): ArraySchemaAsync<TArrayItem>;

export function arrayAsync<TArrayItem extends BaseSchema | BaseSchemaAsync>(
  item: TArrayItem,
  arg2?: string | PipeAsync<Output<TArrayItem>[]>,
  arg3?: PipeAsync<Output<TArrayItem>[]>
): ArraySchemaAsync<TArrayItem> {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg2, arg3);

  // Create and return async array schema
  return {
    /**
     * The schema type.
     */
    schema: 'array',

    /**
     * The array item schema.
     */
    array: { item },

    /**
     * Whether it's async.
     */
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async parse(input, info) {
      // Check type of input
      if (!Array.isArray(input)) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'array',
            origin: 'value',
            message: error || 'Invalid type',
            input,
            ...info,
          },
        ]);
      }

      // Create output and issues
      const output: any[] = [];
      const issues: Issue[] = [];

      // Parse schema of each array item
      await Promise.all(
        input.map(async (value, index) => {
          try {
            output[index] = await item.parse(value, {
              ...info,
              path: getCurrentPath(info, {
                schema: 'array',
                input: input,
                key: index,
                value,
              }),
            });

            // Throw or fill issues in case of an error
          } catch (error) {
            if (info?.abortEarly) {
              throw error;
            }
            issues.push(...(error as ValiError).issues);
          }
        })
      );

      // Throw error if there are issues
      if (issues.length) {
        throw new ValiError(issues as Issues);
      }

      // Execute pipe and return output
      return executePipeAsync(
        output as Output<TArrayItem>[],
        pipe,
        getPipeInfo(info, 'array')
      );
    },
  };
}

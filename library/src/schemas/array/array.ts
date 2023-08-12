import { type Issue, type Issues, ValiError } from '../../error/index.ts';
import type { BaseSchema, Input, Output, Pipe } from '../../types.ts';
import {
  executePipe,
  getCurrentPath,
  getErrorAndPipe,
  getPipeInfo,
} from '../../utils/index.ts';

/**
 * Array path item type.
 */
export type ArrayPathItem = {
  schema: 'array';
  input: any[];
  key: number;
  value: any;
};

/**
 * Array schema type.
 */
export type ArraySchema<
  TArrayItem extends BaseSchema,
  TOutput = Output<TArrayItem>[]
> = BaseSchema<Input<TArrayItem>[], TOutput> & {
  schema: 'array';
  array: { item: TArrayItem };
};

/**
 * Creates a array schema.
 *
 * @param item The item schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A array schema.
 */
export function array<TArrayItem extends BaseSchema>(
  item: TArrayItem,
  pipe?: Pipe<Output<TArrayItem>[]>
): ArraySchema<TArrayItem>;

/**
 * Creates a array schema.
 *
 * @param item The item schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A array schema.
 */
export function array<TArrayItem extends BaseSchema>(
  item: TArrayItem,
  error?: string,
  pipe?: Pipe<Output<TArrayItem>[]>
): ArraySchema<TArrayItem>;

export function array<TArrayItem extends BaseSchema>(
  item: TArrayItem,
  arg2?: string | Pipe<Output<TArrayItem>[]>,
  arg3?: Pipe<Output<TArrayItem>[]>
): ArraySchema<TArrayItem> {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg2, arg3);

  // Create and return array schema
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
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    parse(input, info) {
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
      for (const [index, value] of input.entries()) {
        try {
          output.push(
            item.parse(value, {
              ...info,
              path: getCurrentPath(info, {
                schema: 'array',
                input: input,
                key: index,
                value,
              }),
            })
          );

          // Throw or fill issues in case of an error
        } catch (error) {
          if (info?.abortEarly) {
            throw error;
          }
          issues.push(...(error as ValiError).issues);
        }
      }

      // Throw error if there are issues
      if (issues.length) {
        throw new ValiError(issues as Issues);
      }

      // Execute pipe and return output
      return executePipe(
        output as Output<TArrayItem>[],
        pipe,
        getPipeInfo(info, 'array')
      );
    },
  };
}

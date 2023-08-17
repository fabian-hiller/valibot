import type { Issues } from '../../error/index.ts';
import type { BaseSchema, Input, Output, Pipe } from '../../types.ts';
import {
  executePipe,
  getErrorAndPipe,
  getLeafIssue,
  getNestedIssue,
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
    _parse(input, info) {
      // Check type of input
      if (!Array.isArray(input)) {
        return {
          issues: [
            getLeafIssue({
              reason: 'type',
              validation: 'array',
              message: error || 'Invalid type',
              input,
            }),
          ],
        };
      }

      // Create issues and output
      let issues: Issues | undefined;
      const output: any[] = [];

      // Parse schema of each array item
      for (let index = 0; index < input.length; index++) {
        const value = input[index];
        const result = item._parse(value, info);

        // If there are issues, capture them
        if (result.issues) {
          const nestedIssue = getNestedIssue({
            path: `${index}`,
            issues: result.issues,
          });
          if (issues) {
            issues.push(nestedIssue);
          } else {
            issues = [nestedIssue];
          }

          // If necessary, abort early
          if (info?.abortEarly) {
            break;
          }

          // Otherwise, add item to array
        } else {
          output.push(result.output);
        }
      }

      // Return issues or pipe result
      return issues
        ? { issues }
        : executePipe(output as Output<TArrayItem>[], pipe, info, 'array');
    },
  };
}

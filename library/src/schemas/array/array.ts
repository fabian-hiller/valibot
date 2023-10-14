import type {
  BaseSchema,
  ErrorMessage,
  Input,
  Issues,
  Output,
  Pipe,
  PipeMeta,
} from '../../types.ts';
import { getChecks } from '../../utils/getChecks/getChecks.ts';
import {
  executePipe,
  getDefaultArgs,
  getIssues,
  getSchemaIssues,
} from '../../utils/index.ts';
import type { ArrayPathItem } from './types.ts';

/**
 * Array schema type.
 */
export type ArraySchema<
  TArrayItem extends BaseSchema,
  TOutput = Output<TArrayItem>[]
> = BaseSchema<Input<TArrayItem>[], TOutput> & {
  kind: 'array';
  /**
   * The array item schema.
   */
  array: { item: TArrayItem };
  /**
   * Validation checks that will be run against
   * the input value.
   */
  checks: PipeMeta[];
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
  error?: ErrorMessage,
  pipe?: Pipe<Output<TArrayItem>[]>
): ArraySchema<TArrayItem>;

export function array<TArrayItem extends BaseSchema>(
  item: TArrayItem,
  arg2?: ErrorMessage | Pipe<Output<TArrayItem>[]>,
  arg3?: Pipe<Output<TArrayItem>[]>
): ArraySchema<TArrayItem> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg2, arg3);

  // Create and return array schema
  return {
    kind: 'array',
    async: false,
    array: { item },
    checks: getChecks(pipe),
    _parse(input, info) {
      // Check type of input
      if (!Array.isArray(input)) {
        return getSchemaIssues(
          info,
          'type',
          'array',
          error || 'Invalid type',
          input
        );
      }

      // Create issues and output
      let issues: Issues | undefined;
      const output: any[] = [];

      // Parse schema of each array item
      for (let key = 0; key < input.length; key++) {
        const value = input[key];
        const result = item._parse(value, info);

        // If there are issues, capture them
        if (result.issues) {
          // Create array path item
          const pathItem: ArrayPathItem = {
            schema: 'array',
            input,
            key,
            value,
          };

          // Add modified result issues to issues
          for (const issue of result.issues) {
            if (issue.path) {
              issue.path.unshift(pathItem);
            } else {
              issue.path = [pathItem];
            }
            issues?.push(issue);
          }
          if (!issues) {
            issues = result.issues;
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
        ? getIssues(issues)
        : executePipe(output as Output<TArrayItem>[], pipe, info, 'array');
    },
  };
}

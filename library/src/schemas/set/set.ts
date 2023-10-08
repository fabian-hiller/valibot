import type { BaseSchema, ErrorMessage, Issues, Pipe } from '../../types.ts';
import {
  executePipe,
  getDefaultArgs,
  getIssues,
  getSchemaIssues,
} from '../../utils/index.ts';
import type { SetInput, SetOutput, SetPathItem } from './types.ts';

/**
 * Set schema type.
 */
export type SetSchema<
  TSetValue extends BaseSchema,
  TOutput = SetOutput<TSetValue>
> = BaseSchema<SetInput<TSetValue>, TOutput> & {
  schema: 'set';
  set: { value: TSetValue };
};

/**
 * Creates a set schema.
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 * @returns A set schema.
 */
export function set<TSetValue extends BaseSchema>(
  value: TSetValue,
  pipe?: Pipe<SetOutput<TSetValue>>
): SetSchema<TSetValue>;

/**
 * Creates a set schema.
 * @param value The value schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 * @returns A set schema.
 */
export function set<TSetValue extends BaseSchema>(
  value: TSetValue,
  error?: ErrorMessage,
  pipe?: Pipe<SetOutput<TSetValue>>
): SetSchema<TSetValue>;

/**
 * @param value The value schema.
 * @param arg2 A validation and transformation pipe, or an error message.
 * @param arg3 A validation and transformation pipe.
 * @returns A set schema.
 */
export function set<TSetValue extends BaseSchema>(
  value: TSetValue,
  arg2?: Pipe<SetOutput<TSetValue>> | ErrorMessage,
  arg3?: Pipe<SetOutput<TSetValue>>
): SetSchema<TSetValue> {
  // Get error and pipe argument
  const [error, pipe] = getDefaultArgs(arg2, arg3);

  // Create and return set schema
  return {
    /**
     * The schema type.
     */
    schema: 'set',

    /**
     * The set value schema.
     */
    set: { value },

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
      // Check type of input
      if (!(input instanceof Set)) {
        return getSchemaIssues(
          info,
          'type',
          'set',
          error || 'Invalid type',
          input
        );
      }

      // Create key, output and issues
      let key = 0;
      let issues: Issues | undefined;
      const output: SetOutput<TSetValue> = new Set();

      // Parse each value by schema
      for (const inputValue of input) {
        // Get parse result of input value
        const result = value._parse(inputValue, info);

        // If there are issues, capture them
        if (result.issues) {
          // Create set path item
          const pathItem: SetPathItem = {
            schema: 'set',
            input,
            key,
            value: inputValue,
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

          // Otherwise, add item to set
        } else {
          output.add(result.output);
        }

        // Increment key
        key++;
      }

      // Return issues or pipe result
      return issues
        ? getIssues(issues)
        : executePipe(output, pipe, info, 'set');
    },
  };
}

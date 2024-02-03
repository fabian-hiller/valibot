import type {
  BaseSchema,
  ErrorMessage,
  Pipe,
  SchemaIssues,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResult,
  schemaIssue,
  schemaResult,
} from '../../utils/index.ts';
import type { SetInput, SetOutput, SetPathItem } from './types.ts';

/**
 * Set schema type.
 */
export type SetSchema<
  TValue extends BaseSchema,
  TOutput = SetOutput<TValue>
> = BaseSchema<SetInput<TValue>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'set';
  /**
   * The set value schema.
   */
  value: TValue;
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<SetOutput<TValue>> | undefined;
};

/**
 * Creates a set schema.
 *
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A set schema.
 */
export function set<TValue extends BaseSchema>(
  value: TValue,
  pipe?: Pipe<SetOutput<TValue>>
): SetSchema<TValue>;

/**
 * Creates a set schema.
 *
 * @param value The value schema.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A set schema.
 */
export function set<TValue extends BaseSchema>(
  value: TValue,
  message?: ErrorMessage,
  pipe?: Pipe<SetOutput<TValue>>
): SetSchema<TValue>;

export function set<TValue extends BaseSchema>(
  value: TValue,
  arg2?: Pipe<SetOutput<TValue>> | ErrorMessage,
  arg3?: Pipe<SetOutput<TValue>>
): SetSchema<TValue> {
  // Get message and pipe argument
  const [message, pipe] = defaultArgs(arg2, arg3);

  // Create and return set schema
  return {
    type: 'set',
    expects: 'Set',
    async: false,
    value,
    message,
    pipe,
    _parse(input, config) {
      // If root type is valid, check nested types
      if (input instanceof Set) {
        // Create key, typed, output and issues
        let key = 0;
        let typed = true;
        let issues: SchemaIssues | undefined;
        const output: SetOutput<TValue> = new Set();

        // Parse each value by schema
        for (const inputValue of input) {
          // Get schema result of input value
          const result = this.value._parse(inputValue, config);

          // If there are issues, capture them
          if (result.issues) {
            // Create set path item
            const pathItem: SetPathItem = {
              type: 'set',
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
            if (config?.abortEarly) {
              typed = false;
              break;
            }
          }

          // If not typed, set typed to false
          if (!result.typed) {
            typed = false;
          }

          // Set output of entry if necessary
          output.add(result.output);

          // Increment key
          key++;
        }

        // If output is typed, return pipe result
        if (typed) {
          return pipeResult(this, output, config, issues);
        }

        // Otherwise, return untyped schema result
        return schemaResult(false, output, issues as SchemaIssues);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, set, input, config);
    },
  };
}

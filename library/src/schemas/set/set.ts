import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
  Issues,
  Pipe,
} from '../../types/index.ts';
import {
  defaultArgs,
  parseResult,
  pipeResult,
  schemaIssue,
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
  message: ErrorMessage;
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
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A set schema.
 */
export function set<TValue extends BaseSchema>(
  value: TValue,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<SetOutput<TValue>>
): SetSchema<TValue>;

export function set<TValue extends BaseSchema>(
  value: TValue,
  arg2?: Pipe<SetOutput<TValue>> | ErrorMessageOrMetadata,
  arg3?: Pipe<SetOutput<TValue>>
): SetSchema<TValue> {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe, metadata] = defaultArgs(arg2, arg3);

  // Create and return set schema
  return {
    type: 'set',
    async: false,
    value,
    message,
    pipe,
    metadata,
    _parse(input, info) {
      // Check type of input
      if (!(input instanceof Set)) {
        return schemaIssue(info, 'type', 'set', this.message, input);
      }

      // Create key, typed, output and issues
      let key = 0;
      let typed = true;
      let issues: Issues | undefined;
      const output: SetOutput<TValue> = new Set();

      // Parse each value by schema
      for (const inputValue of input) {
        // Get parse result of input value
        const result = this.value._parse(inputValue, info);

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
          if (info?.abortEarly) {
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

      // If output is typed, execute pipe
      if (typed) {
        return pipeResult(output, this.pipe, info, 'set', issues);
      }

      // Otherwise, return untyped parse result
      return parseResult(false, output, issues as Issues);
    },
  };
}

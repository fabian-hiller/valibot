import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Issues,
  PipeAsync,
} from '../../types/index.ts';
import {
  defaultArgs,
  parseResult,
  pipeResultAsync,
  schemaIssue,
} from '../../utils/index.ts';
import type { SetInput, SetOutput, SetPathItem } from './types.ts';

/**
 * Set schema async type.
 */
export type SetSchemaAsync<
  TValue extends BaseSchema | BaseSchemaAsync,
  TOutput = SetOutput<TValue>
> = BaseSchemaAsync<SetInput<TValue>, TOutput> & {
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
  pipe: PipeAsync<SetOutput<TValue>> | undefined;
};

/**
 * Creates an async set schema.
 *
 * @param value The value schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async set schema.
 */
export function setAsync<TValue extends BaseSchema | BaseSchemaAsync>(
  value: TValue,
  pipe?: PipeAsync<SetOutput<TValue>>
): SetSchemaAsync<TValue>;

/**
 * Creates an async set schema.
 *
 * @param value The value schema.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async set schema.
 */
export function setAsync<TValue extends BaseSchema | BaseSchemaAsync>(
  value: TValue,
  message?: ErrorMessage,
  pipe?: PipeAsync<SetOutput<TValue>>
): SetSchemaAsync<TValue>;

export function setAsync<TValue extends BaseSchema | BaseSchemaAsync>(
  value: TValue,
  arg2?: PipeAsync<SetOutput<TValue>> | ErrorMessage,
  arg3?: PipeAsync<SetOutput<TValue>>
): SetSchemaAsync<TValue> {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe] = defaultArgs(arg2, arg3);

  // Create and return async set schema
  return {
    type: 'set',
    async: true,
    value,
    message,
    pipe,
    async _parse(input, info) {
      // Check type of input
      if (!(input instanceof Set)) {
        return schemaIssue(info, 'type', 'set', this.message, input);
      }

      // Create typed, index, output and issues
      let typed = true;
      let issues: Issues | undefined;
      const output: SetOutput<TValue> = new Set();

      // Parse each value by schema
      await Promise.all(
        Array.from(input.values()).map(async (inputValue, key) => {
          // If not aborted early, continue execution
          if (!(info?.abortEarly && issues)) {
            // Get parse result of input value
            const result = await this.value._parse(inputValue, info);

            // If not aborted early, continue execution
            if (!(info?.abortEarly && issues)) {
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
                  throw null;
                }
              }

              // If not typed, set typed to false
              if (!result.typed) {
                typed = false;
              }

              // Set output of entry if necessary
              output.add(result.output);
            }
          }
        })
      ).catch(() => null);

      // If output is typed, execute pipe
      if (typed) {
        return pipeResultAsync(output, this.pipe, info, 'set', issues);
      }

      // Otherwise, return untyped parse result
      return parseResult(false, output, issues as Issues);
    },
  };
}

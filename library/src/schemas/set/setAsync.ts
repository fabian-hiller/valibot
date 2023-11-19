import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Issues,
  PipeAsync,
} from '../../types/index.ts';
import {
  executePipeAsync,
  getDefaultArgs,
  getIssues,
  getSchemaIssues,
} from '../../utils/index.ts';
import type { SetInput, SetOutput, SetPathItem } from './types.ts';

/**
 * Set schema async type.
 */
export interface SetSchemaAsync<
  TValue extends BaseSchema | BaseSchemaAsync,
  TOutput = SetOutput<TValue>
> extends BaseSchemaAsync<SetInput<TValue>, TOutput> {
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
}

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
  const [message = 'Invalid type', pipe] = getDefaultArgs(arg2, arg3);

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
        return getSchemaIssues(info, 'type', 'set', this.message, input);
      }

      // Create index, output and issues
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
                  throw null;
                }

                // Otherwise, add item to set
              } else {
                output.add(result.output);
              }
            }
          }
        })
      ).catch(() => null);

      // Return issues or pipe result
      return issues
        ? getIssues(issues)
        : executePipeAsync(input, this.pipe, info, 'set');
    },
  };
}

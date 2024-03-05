import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  PipeAsync,
  SchemaIssues,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResultAsync,
  schemaIssue,
  schemaResult,
} from '../../utils/index.ts';
import type { SetInput, SetOutput, SetPathItem } from './types.ts';

/**
 * Set schema async type.
 */
export type SetSchemaAsync<
  TValue extends BaseSchema | BaseSchemaAsync,
  TOutput = SetOutput<TValue>,
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
  message: ErrorMessage | undefined;
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
  const [message, pipe] = defaultArgs(arg2, arg3);

  // Create and return async set schema
  return {
    type: 'set',
    expects: 'Set',
    async: true,
    value,
    message,
    pipe,
    async _parse(input, config) {
      // If root type is valid, check nested types
      if (input instanceof Set) {
        // Create typed, index, output and issues
        let typed = true;
        let issues: SchemaIssues | undefined;
        const output: SetOutput<TValue> = new Set();

        // Parse each value by schema
        await Promise.all(
          Array.from(input.values()).map(async (inputValue, key) => {
            // If not aborted early, continue execution
            if (!(config?.abortEarly && issues)) {
              // Get schema result of input value
              const result = await this.value._parse(inputValue, config);

              // If not aborted early, continue execution
              if (!(config?.abortEarly && issues)) {
                // If there are issues, capture them
                if (result.issues) {
                  // Create set path item
                  const pathItem: SetPathItem = {
                    type: 'set',
                    origin: 'value',
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

        // If output is typed, return pipe result
        if (typed) {
          return pipeResultAsync(this, output, config, issues);
        }

        // Otherwise, return untyped schema result
        return schemaResult(false, output, issues as SchemaIssues);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, setAsync, input, config);
    },
  };
}

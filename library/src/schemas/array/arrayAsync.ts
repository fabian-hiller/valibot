import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Input,
  Output,
  PipeAsync,
  SchemaIssues,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResultAsync,
  schemaIssue,
  schemaResult,
} from '../../utils/index.ts';
import type { ArrayPathItem } from './types.ts';

/**
 * Array schema async type.
 */
export type ArraySchemaAsync<
  TItem extends BaseSchema | BaseSchemaAsync,
  TOutput = Output<TItem>[],
> = BaseSchemaAsync<Input<TItem>[], TOutput> & {
  /**
   * The schema type.
   */
  type: 'array';
  /**
   * The array item schema.
   */
  item: TItem;
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<Output<TItem>[]> | undefined;
};

/**
 * Creates an async array schema.
 *
 * @param item The item schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async array schema.
 */
export function arrayAsync<TItem extends BaseSchema | BaseSchemaAsync>(
  item: TItem,
  pipe?: PipeAsync<Output<TItem>[]>
): ArraySchemaAsync<TItem>;

/**
 * Creates an async array schema.
 *
 * @param item The item schema.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async array schema.
 */
export function arrayAsync<TItem extends BaseSchema | BaseSchemaAsync>(
  item: TItem,
  message?: ErrorMessage,
  pipe?: PipeAsync<Output<TItem>[]>
): ArraySchemaAsync<TItem>;

export function arrayAsync<TItem extends BaseSchema | BaseSchemaAsync>(
  item: TItem,
  arg2?: ErrorMessage | PipeAsync<Output<TItem>[]>,
  arg3?: PipeAsync<Output<TItem>[]>
): ArraySchemaAsync<TItem> {
  // Get message and pipe argument
  const [message, pipe] = defaultArgs(arg2, arg3);

  // Create and return async array schema
  return {
    type: 'array',
    expects: 'Array',
    async: true,
    item,
    message,
    pipe,
    async _parse(input, config) {
      // If root type is valid, check nested types
      if (Array.isArray(input)) {
        // Create typed, issues and output
        let typed = true;
        let issues: SchemaIssues | undefined;
        const output: any[] = [];

        // Parse schema of each array item
        await Promise.all(
          input.map(async (value, key) => {
            // If not aborted early, continue execution
            if (!(config?.abortEarly && issues)) {
              // Parse schema of array item
              const result = await this.item._parse(value, config);

              // If not aborted early, continue execution
              if (!(config?.abortEarly && issues)) {
                // If there are issues, capture them
                if (result.issues) {
                  // Create array path item
                  const pathItem: ArrayPathItem = {
                    type: 'array',
                    origin: 'value',
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
                  if (config?.abortEarly) {
                    typed = false;
                    throw null;
                  }
                }

                // If not typed, set typed to false
                if (!result.typed) {
                  typed = false;
                }

                // Set output of item
                output[key] = result.output;
              }
            }
          })
        ).catch(() => null);

        // If output is typed, return pipe result
        if (typed) {
          return pipeResultAsync(
            this,
            output as Output<TItem>[],
            config,
            issues
          );
        }

        // Otherwise, return untyped schema result
        return schemaResult(false, output, issues as SchemaIssues);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, arrayAsync, input, config);
    },
  };
}

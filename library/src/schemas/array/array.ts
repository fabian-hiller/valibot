import type {
  BaseSchema,
  ErrorMessage,
  Input,
  Output,
  Pipe,
  SchemaIssues,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResult,
  schemaIssue,
  schemaResult,
} from '../../utils/index.ts';
import type { ArrayPathItem } from './types.ts';

/**
 * Array schema type.
 */
export type ArraySchema<
  TItem extends BaseSchema,
  TOutput = Output<TItem>[]
> = BaseSchema<Input<TItem>[], TOutput> & {
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
  pipe: Pipe<Output<TItem>[]> | undefined;
};

/**
 * Creates a array schema.
 *
 * @param item The item schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A array schema.
 */
export function array<TItem extends BaseSchema>(
  item: TItem,
  pipe?: Pipe<Output<TItem>[]>
): ArraySchema<TItem>;

/**
 * Creates a array schema.
 *
 * @param item The item schema.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A array schema.
 */
export function array<TItem extends BaseSchema>(
  item: TItem,
  message?: ErrorMessage,
  pipe?: Pipe<Output<TItem>[]>
): ArraySchema<TItem>;

export function array<TItem extends BaseSchema>(
  item: TItem,
  arg2?: ErrorMessage | Pipe<Output<TItem>[]>,
  arg3?: Pipe<Output<TItem>[]>
): ArraySchema<TItem> {
  // Get message and pipe argument
  const [message, pipe] = defaultArgs(arg2, arg3);

  // Create and return array schema
  return {
    type: 'array',
    expects: 'Array',
    async: false,
    item,
    message,
    pipe,
    _parse(input, config) {
      // If root type is valid, check nested types
      if (Array.isArray(input)) {
        // Create typed, issues and output
        let typed = true;
        let issues: SchemaIssues | undefined;
        const output: any[] = [];

        // Parse schema of each array item
        for (let key = 0; key < input.length; key++) {
          const value = input[key];
          const result = this.item._parse(value, config);

          // If there are issues, capture them
          if (result.issues) {
            // Create array path item
            const pathItem: ArrayPathItem = {
              type: 'array',
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
              break;
            }
          }

          // If not typed, set typed to false
          if (!result.typed) {
            typed = false;
          }

          // Set output of item
          output.push(result.output);
        }

        // If output is typed, return pipe result
        if (typed) {
          return pipeResult(this, output as Output<TItem>[], config, issues);
        }

        // Otherwise, return untyped schema result
        return schemaResult(false, output, issues as SchemaIssues);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, array, input, config);
    },
  };
}

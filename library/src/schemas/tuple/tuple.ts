import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
  Pipe,
  SchemaIssues,
} from '../../types/index.ts';
import {
  pipeResult,
  restAndDefaultArgs,
  schemaIssue,
  schemaResult,
} from '../../utils/index.ts';
import type { TupleInput, TupleOutput, TuplePathItem } from './types.ts';

/**
 * Tuple shape type.
 */
export type TupleItems = [BaseSchema, ...BaseSchema[]];

/**
 * Tuple schema type.
 */
export type TupleSchema<
  TItems extends TupleItems,
  TRest extends BaseSchema | undefined = undefined,
  TOutput = TupleOutput<TItems, TRest>,
> = BaseSchema<TupleInput<TItems, TRest>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'tuple';
  /**
   * The tuple items schema.
   */
  items: TItems;
  /**
   * The tuple rest schema.
   */
  rest: TRest;
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<TupleOutput<TItems, TRest>> | undefined;
};

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<TItems extends TupleItems>(
  items: TItems,
  pipe?: Pipe<TupleOutput<TItems, undefined>>
): TupleSchema<TItems>;

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<TItems extends TupleItems>(
  items: TItems,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<TupleOutput<TItems, undefined>>
): TupleSchema<TItems>;

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<
  TItems extends TupleItems,
  TRest extends BaseSchema | undefined,
>(
  items: TItems,
  rest: TRest,
  pipe?: Pipe<TupleOutput<TItems, TRest>>
): TupleSchema<TItems, TRest>;

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<
  TItems extends TupleItems,
  TRest extends BaseSchema | undefined,
>(
  items: TItems,
  rest: TRest,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<TupleOutput<TItems, TRest>>
): TupleSchema<TItems, TRest>;

export function tuple<
  TItems extends TupleItems,
  TRest extends BaseSchema | undefined = undefined,
>(
  items: TItems,
  arg2?: Pipe<TupleOutput<TItems, TRest>> | ErrorMessageOrMetadata | TRest,
  arg3?: Pipe<TupleOutput<TItems, TRest>> | ErrorMessageOrMetadata,
  arg4?: Pipe<TupleOutput<TItems, TRest>>
): TupleSchema<TItems, TRest> {
  // Get rest, message and pipe argument
  const [rest, message, pipe, metadata] = restAndDefaultArgs<
    TRest,
    Pipe<TupleOutput<TItems, TRest>>
  >(arg2, arg3, arg4);

  // Create and return tuple schema
  return {
    type: 'tuple',
    expects: 'Array',
    async: false,
    items,
    rest,
    message,
    pipe,
    metadata,
    _parse(input, config) {
      // If root type is valid, check nested types
      if (Array.isArray(input)) {
        // Create typed, issues and output
        let typed = true;
        let issues: SchemaIssues | undefined;
        const output: any[] = [];

        // Parse schema of each tuple item
        for (let key = 0; key < this.items.length; key++) {
          const value = input[key];
          const result = this.items[key]._parse(value, config);

          // If there are issues, capture them
          if (result.issues) {
            // Create tuple path item
            const pathItem: TuplePathItem = {
              type: 'tuple',
              origin: 'value',
              input: input as [any, ...any[]],
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
          output[key] = result.output;
        }

        // If necessary parse schema of each rest item
        if (this.rest && !(config?.abortEarly && issues)) {
          for (let key = this.items.length; key < input.length; key++) {
            const value = input[key];
            const result = this.rest._parse(value, config);

            // If there are issues, capture them
            if (result.issues) {
              // Create tuple path item
              const pathItem: TuplePathItem = {
                type: 'tuple',
                origin: 'value',
                input: input as [any, ...any[]],
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
            output[key] = result.output;
          }
        }

        // If output is typed, return pipe result
        if (typed) {
          return pipeResult(
            this,
            output as TupleOutput<TItems, TRest>,
            config,
            issues
          );
        }

        // Otherwise, return untyped schema result
        return schemaResult(false, output, issues as SchemaIssues);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, tuple, input, config);
    },
  };
}

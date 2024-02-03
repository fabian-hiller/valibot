import type {
  BaseSchema,
  ErrorMessage,
  ErrorMessageOrMetadata,
  Issues,
  Pipe,
} from '../../types/index.ts';
import {
  parseResult,
  pipeResult,
  restAndDefaultArgs,
  schemaIssue,
} from '../../utils/index.ts';
import type { TupleOutput, TupleInput, TuplePathItem } from './types.ts';

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
  TOutput = TupleOutput<TItems, TRest>
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
  message: ErrorMessage;
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
  TRest extends BaseSchema | undefined
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
  TRest extends BaseSchema | undefined
>(
  items: TItems,
  rest: TRest,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: Pipe<TupleOutput<TItems, TRest>>
): TupleSchema<TItems, TRest>;

export function tuple<
  TItems extends TupleItems,
  TRest extends BaseSchema | undefined = undefined
>(
  items: TItems,
  arg2?: Pipe<TupleOutput<TItems, TRest>> | ErrorMessageOrMetadata | TRest,
  arg3?: Pipe<TupleOutput<TItems, TRest>> | ErrorMessageOrMetadata,
  arg4?: Pipe<TupleOutput<TItems, TRest>>
): TupleSchema<TItems, TRest> {
  // Get rest, message and pipe argument
  const [rest, message = 'Invalid type', pipe, metadata] = restAndDefaultArgs<
    TRest,
    Pipe<TupleOutput<TItems, TRest>>
  >(arg2, arg3, arg4);

  // Create and return tuple schema
  return {
    type: 'tuple',
    async: false,
    items,
    rest,
    message,
    pipe,
    metadata,
    _parse(input, info) {
      // Check type of input
      if (!Array.isArray(input) || this.items.length > input.length) {
        return schemaIssue(info, 'type', 'tuple', this.message, input);
      }

      // Create typed, issues and output
      let typed = true;
      let issues: Issues | undefined;
      const output: any[] = [];

      // Parse schema of each tuple item
      for (let key = 0; key < this.items.length; key++) {
        const value = input[key];
        const result = this.items[key]._parse(value, info);

        // If there are issues, capture them
        if (result.issues) {
          // Create tuple path item
          const pathItem: TuplePathItem = {
            type: 'tuple',
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
          if (info?.abortEarly) {
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
      if (this.rest && !(info?.abortEarly && issues)) {
        for (let key = this.items.length; key < input.length; key++) {
          const value = input[key];
          const result = this.rest._parse(value, info);

          // If there are issues, capture them
          if (result.issues) {
            // Create tuple path item
            const pathItem: TuplePathItem = {
              type: 'tuple',
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
            if (info?.abortEarly) {
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

      // If output is typed, execute pipe
      if (typed) {
        return pipeResult(
          output as TupleOutput<TItems, TRest>,
          this.pipe,
          info,
          'tuple',
          issues
        );
      }

      // Otherwise, return untyped parse result
      return parseResult(false, output, issues as Issues);
    },
  };
}

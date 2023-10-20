import type { BaseSchema, ErrorMessage, Issues, Pipe } from '../../types.ts';
import {
  executePipe,
  getIssues,
  getRestAndDefaultArgs,
  getSchemaIssues,
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
  TTupleItems extends TupleItems,
  TTupleRest extends BaseSchema | undefined = undefined,
  TOutput = TupleOutput<TTupleItems, TTupleRest>
> = BaseSchema<TupleInput<TTupleItems, TTupleRest>, TOutput> & {
  kind: 'tuple';
  /**
   * The tuple items and rest schema.
   */
  tuple: { items: TTupleItems; rest: TTupleRest };
  /**
   * Validation and transformation pipe.
   */
  pipe: Pipe<TupleOutput<TTupleItems, TTupleRest>>;
};

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<TTupleItems extends TupleItems>(
  items: TTupleItems,
  pipe?: Pipe<TupleOutput<TTupleItems, undefined>>
): TupleSchema<TTupleItems>;

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<TTupleItems extends TupleItems>(
  items: TTupleItems,
  error?: ErrorMessage,
  pipe?: Pipe<TupleOutput<TTupleItems, undefined>>
): TupleSchema<TTupleItems>;

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
  TTupleItems extends TupleItems,
  TTupleRest extends BaseSchema | undefined
>(
  items: TTupleItems,
  rest: TTupleRest,
  pipe?: Pipe<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchema<TTupleItems, TTupleRest>;

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param rest The rest schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<
  TTupleItems extends TupleItems,
  TTupleRest extends BaseSchema | undefined
>(
  items: TTupleItems,
  rest: TTupleRest,
  error?: ErrorMessage,
  pipe?: Pipe<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchema<TTupleItems, TTupleRest>;

export function tuple<
  TTupleItems extends TupleItems,
  TTupleRest extends BaseSchema | undefined = undefined
>(
  items: TTupleItems,
  arg2?: Pipe<TupleOutput<TTupleItems, TTupleRest>> | ErrorMessage | TTupleRest,
  arg3?: Pipe<TupleOutput<TTupleItems, TTupleRest>> | ErrorMessage,
  arg4?: Pipe<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchema<TTupleItems, TTupleRest> {
  // Get rest, error and pipe argument
  const [rest, error, pipe = []] = getRestAndDefaultArgs<
    TTupleRest,
    Pipe<TupleOutput<TTupleItems, TTupleRest>>
  >(arg2, arg3, arg4);

  // Create and return tuple schema
  return {
    kind: 'tuple',
    async: false,
    tuple: { items, rest },
    pipe,
    _parse(input, info) {
      // Check type of input
      if (!Array.isArray(input) || items.length > input.length) {
        return getSchemaIssues(
          info,
          'type',
          'tuple',
          error || 'Invalid type',
          input
        );
      }

      // Create issues and output
      let issues: Issues | undefined;
      const output: any[] = [];

      // Parse schema of each tuple item
      for (let key = 0; key < items.length; key++) {
        const value = input[key];
        const result = items[key]._parse(value, info);

        // If there are issues, capture them
        if (result.issues) {
          // Create tuple path item
          const pathItem: TuplePathItem = {
            schema: 'tuple',
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
            break;
          }

          // Otherwise, add item to tuple
        } else {
          output[key] = result.output;
        }
      }

      // If necessary parse schema of each rest item
      if (rest && !(info?.abortEarly && issues)) {
        for (let key = items.length; key < input.length; key++) {
          const value = input[key];
          const result = rest._parse(value, info);

          // If there are issues, capture them
          if (result.issues) {
            // Create tuple path item
            const pathItem: TuplePathItem = {
              schema: 'tuple',
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
              break;
            }

            // Otherwise, add item to tuple
          } else {
            output[key] = result.output;
          }
        }
      }

      // Return issues or pipe result
      return issues
        ? getIssues(issues)
        : executePipe(
            output as TupleOutput<TTupleItems, TTupleRest>,
            pipe,
            info,
            'tuple'
          );
    },
  };
}

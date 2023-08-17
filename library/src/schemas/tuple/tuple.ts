import type { Issues } from '../../error/index.ts';
import type { BaseSchema, Pipe } from '../../types.ts';
import {
  executePipe,
  getErrorAndPipe,
  getLeafIssue,
  getNestedIssue,
} from '../../utils/index.ts';
import type { TupleOutput, TupleInput } from './types.ts';

/**
 * Tuple shape type.
 */
export type TupleShape = [BaseSchema, ...BaseSchema[]];

/**
 * Tuple schema type.
 */
export type TupleSchema<
  TTupleItems extends TupleShape,
  TTupleRest extends BaseSchema | undefined = undefined,
  TOutput = TupleOutput<TTupleItems, TTupleRest>
> = BaseSchema<TupleInput<TTupleItems, TTupleRest>, TOutput> & {
  schema: 'tuple';
  tuple: { items: TTupleItems; rest: TTupleRest };
};

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<
  TTupleItems extends TupleShape,
  TTupleRest extends BaseSchema | undefined = undefined
>(
  items: TTupleItems,
  pipe?: Pipe<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchema<TTupleItems, TTupleRest>;

/**
 * Creates a tuple schema.
 *
 * @param items The items schema.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A tuple schema.
 */
export function tuple<
  TTupleItems extends TupleShape,
  TTupleRest extends BaseSchema | undefined = undefined
>(
  items: TTupleItems,
  error?: string,
  pipe?: Pipe<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchema<TTupleItems, TTupleRest>;

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
  TTupleItems extends TupleShape,
  TTupleRest extends BaseSchema | undefined = undefined
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
  TTupleItems extends TupleShape,
  TTupleRest extends BaseSchema | undefined = undefined
>(
  items: TTupleItems,
  rest: TTupleRest,
  error?: string,
  pipe?: Pipe<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchema<TTupleItems, TTupleRest>;

export function tuple<
  TTupleItems extends TupleShape,
  TTupleRest extends BaseSchema | undefined = undefined
>(
  items: TTupleItems,
  arg2?: Pipe<TupleOutput<TTupleItems, TTupleRest>> | string | TTupleRest,
  arg3?: Pipe<TupleOutput<TTupleItems, TTupleRest>> | string,
  arg4?: Pipe<TupleOutput<TTupleItems, TTupleRest>>
): TupleSchema<TTupleItems, TTupleRest> {
  // Get rest, error and pipe argument
  const { rest, error, pipe } = (
    typeof arg2 === 'object' && !Array.isArray(arg2)
      ? { rest: arg2, ...getErrorAndPipe(arg3, arg4) }
      : getErrorAndPipe(arg2, arg3 as any)
  ) as {
    rest: TTupleRest;
    error: string | undefined;
    pipe: Pipe<TupleOutput<TTupleItems, TTupleRest>>;
  };

  // Create and return tuple schema
  return {
    /**
     * The schema type.
     */
    schema: 'tuple',

    /**
     * The tuple items and rest schema.
     */
    tuple: { items, rest },

    /**
     * Whether it's async.
     */
    async: false,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    _parse(input, info) {
      // Check type of input
      if (
        !Array.isArray(input) ||
        (!rest && items.length !== input.length) ||
        (rest && items.length > input.length)
      ) {
        return {
          issues: [
            getLeafIssue({
              reason: 'type',
              validation: 'tuple',
              message: error || 'Invalid type',
              input,
            }),
          ],
        };
      }

      // Create issues and output
      let issues: Issues | undefined;
      const output: any[] = [];

      // Parse schema of each tuple item
      for (let index = 0; index < items.length; index++) {
        const value = input[index];
        const result = items[index]._parse(value, info);

        // If there are issues, capture them
        if (result.issues) {
          const nestedIssue = getNestedIssue({
            path: `${index}`,
            issues: result.issues,
          });
          if (issues) {
            issues.push(nestedIssue);
          } else {
            issues = [nestedIssue];
          }

          // If necessary, abort early
          if (info?.abortEarly) {
            break;
          }

          // Otherwise, add item to tuple
        } else {
          output[index] = result.output;
        }
      }

      // If necessary parse schema of each rest item
      if (rest) {
        for (let index = items.length; index < input.length; index++) {
          const value = input[index];
          const result = rest._parse(value, info);

          // If there are issues, capture them
          if (result.issues) {
            const nestedIssue = getNestedIssue({
              path: `${index}`,
              issues: result.issues,
            });
            if (issues) {
              issues.push(nestedIssue);
            } else {
              issues = [nestedIssue];
            }

            // If necessary, abort early
            if (info?.abortEarly) {
              break;
            }

            // Otherwise, add item to tuple
          } else {
            output[index] = result.output;
          }
        }
      }

      // Return issues or pipe result
      return issues
        ? { issues }
        : executePipe(
            output as TupleOutput<TTupleItems, TTupleRest>,
            pipe,
            info,
            'tuple'
          );
    },
  };
}

import { type Issue, type Issues, ValiError } from '../../error';
import type { BaseSchema, Pipe } from '../../types';
import { executePipe, getCurrentPath, getErrorAndPipe } from '../../utils';
import type { TupleOutput, TupleInput } from './types';

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
    parse(input, info) {
      // Check type of input
      if (
        !Array.isArray(input) ||
        (!rest && items.length !== input.length) ||
        (rest && items.length > input.length)
      ) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'tuple',
            origin: 'value',
            message: error || 'Invalid type',
            input,
            ...info,
          },
        ]);
      }

      // Create output and issues
      const output: any[] = [];
      const issues: Issue[] = [];

      // Parse schema of each tuple item
      items.forEach((schema, index) => {
        try {
          const value = input[index];
          output[index] = schema.parse(value, {
            ...info,
            path: getCurrentPath(info, {
              schema: 'tuple',
              input: input as [any, ...any[]],
              key: index,
              value,
            }),
          });

          // Fill issues in case of an error
        } catch (error) {
          issues.push(...(error as ValiError).issues);
        }
      });

      // If necessary parse schema of each rest item
      if (rest) {
        input.slice(items.length).forEach((value, index) => {
          try {
            const tupleIndex = items.length + index;
            output[tupleIndex] = rest.parse(value, {
              ...info,
              path: getCurrentPath(info, {
                schema: 'tuple',
                input: input as [any, ...any[]],
                key: tupleIndex,
                value,
              }),
            });

            // Fill issues in case of an error
          } catch (error) {
            issues.push(...(error as ValiError).issues);
          }
        });
      }

      // Throw error if there are issues
      if (issues.length) {
        throw new ValiError(issues as Issues);
      }

      // Execute pipe and return output
      return executePipe(output as TupleOutput<TTupleItems, TTupleRest>, pipe, {
        ...info,
        reason: 'tuple',
      });
    },
  };
}

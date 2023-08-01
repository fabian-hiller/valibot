import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { BaseSchema, Pipe } from '../../types.ts';
import { executePipe, getErrorAndPipe } from '../../utils/index.ts';

/**
 * Class enum type.
 */
export type Class = abstract new (...args: any) => any;

/**
 * Instance schema type.
 */
export type InstanceSchema<
  TClass extends Class,
  TOutput = InstanceType<TClass>
> = BaseSchema<InstanceType<TClass>, TOutput> & {
  schema: 'instance';
  class: TClass;
};

/**
 * Creates an instance schema.
 *
 * @param of The class of the instance.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An instance schema.
 */
export function instance<TClass extends Class>(
  of: TClass,
  pipe?: Pipe<InstanceType<TClass>>
): InstanceSchema<TClass>;

/**
 * Creates an instance schema.
 *
 * @param of The class of the instance.
 * @param error The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An instance schema.
 */
export function instance<TClass extends Class>(
  of: TClass,
  error?: string,
  pipe?: Pipe<InstanceType<TClass>>
): InstanceSchema<TClass>;

export function instance<TClass extends Class>(
  of: TClass,
  arg2?: Pipe<InstanceType<TClass>> | string,
  arg3?: Pipe<InstanceType<TClass>>
): InstanceSchema<TClass> {
  // Get error and pipe argument
  const { error, pipe } = getErrorAndPipe(arg2, arg3);

  // Create and return string schema
  return {
    /**
     * The schema type.
     */
    schema: 'instance',

    /**
     * The class of the instance.
     */
    class: of,

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
      if (!(input instanceof of)) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'instance',
            origin: 'value',
            message: error || i18next.t("schemas.instance"),
            input,
            ...info,
          },
        ]);
      }

      // Execute pipe and return output
      return executePipe(input, pipe, {
        ...info,
        reason: 'instance',
      });
    },
  };
}

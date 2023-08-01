import { i18next } from '../../i18n.ts';
import { ValiError } from '../../error/index.ts';
import type { BaseSchema, Input, Output } from '../../types.ts';

/**
 * Non optional type.
 */
export type NonOptional<T> = T extends undefined ? never : T;

/**
 * Non optional schema type.
 */
export type NonOptionalSchema<
  TWrappedSchema extends BaseSchema,
  TOutput = NonOptional<Output<TWrappedSchema>>
> = BaseSchema<NonOptional<Input<TWrappedSchema>>, TOutput> & {
  schema: 'non_optional';
  wrapped: TWrappedSchema;
};

/**
 * Creates a non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns A non optional schema.
 */
export function nonOptional<TWrappedSchema extends BaseSchema>(
  wrapped: TWrappedSchema,
  error?: string
): NonOptionalSchema<TWrappedSchema> {
  return {
    /**
     * The schema type.
     */
    schema: 'non_optional',

    /**
     * The wrapped schema.
     */
    wrapped,

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
      // Allow `undefined` values not to pass
      if (input === undefined) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'non_optional',
            origin: 'value',
            message: error || i18next.t("schemas.nonOptional"),
            input,
            ...info,
          },
        ]);
      }

      // Parse wrapped schema and return output
      return wrapped.parse(input, info);
    },
  };
}

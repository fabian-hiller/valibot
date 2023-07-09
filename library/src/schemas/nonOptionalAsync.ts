import { ValiError } from '../error';
import type { BaseSchema, BaseSchemaAsync, Input, Output } from '../types';
import type { NonOptional } from './nonOptional';

/**
 * Non optional schema async type.
 */
export type NonOptionalSchemaAsync<
  TWrappedSchema extends BaseSchema | BaseSchemaAsync,
  TOutput = NonOptional<Output<TWrappedSchema>>
> = BaseSchemaAsync<NonOptional<Input<TWrappedSchema>>, TOutput> & {
  schema: 'non_optional';
  wrapped: TWrappedSchema;
};

/**
 * Creates an async non optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param error The error message.
 *
 * @returns An async non optional schema.
 */
export function nonOptionalAsync<
  TWrappedSchema extends BaseSchema | BaseSchemaAsync
>(
  wrapped: TWrappedSchema,
  error?: string
): NonOptionalSchemaAsync<TWrappedSchema> {
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
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async parse(input, info) {
      // Allow `undefined` values not to pass
      if (input === undefined) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'non_optional',
            origin: 'value',
            message: error || 'Invalid type',
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

import type { BaseSchema } from '../../types';
import type { ObjectSchema, ObjectShape } from '../object';
import type { Passthrough, PassthroughInput, PassthroughOutput } from './types';

/**
 * Passthrough schema type.
 */
export type PassthroughSchema<
  TWrappedSchema extends ObjectSchema<ObjectShape>,
  TOutput = PassthroughOutput<TWrappedSchema['object']>
> = BaseSchema<PassthroughInput<TWrappedSchema['object']>, Passthrough<TOutput>> & {
  schema: 'passthrough';
  wrapped: TWrappedSchema;
};

/**
 * Creates a passthrough schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns A optional schema.
 */
export function passthrough<TWrappedSchema extends ObjectSchema<ObjectShape>>(
  wrapped: TWrappedSchema
): PassthroughSchema<TWrappedSchema> {
  return {
    /**
     * The schema type.
     */
    schema: 'passthrough',

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
      // Parse wrapped schema and return output + keep original extra props
      return {
        ...(input as any),
        ...wrapped.parse(input, info)
      }; 
    },
  };
}

import type { BaseSchemaAsync } from '../../types';
import type {
  ObjectSchema,
  ObjectSchemaAsync,
  ObjectShape,
  ObjectShapesAsync,
} from '../object';
import type { Passthrough, PassthroughInput, PassthroughOutput } from './types';

/**
 * Passthrough schema async type.
 */
export type PassthroughSchemaAsync<
  TWrappedSchema extends
    | ObjectSchema<ObjectShape>
    | ObjectSchemaAsync<ObjectShapesAsync>,
  TOutput = PassthroughOutput<TWrappedSchema['object']>
> = BaseSchemaAsync<
  PassthroughInput<TWrappedSchema['object']>,
  Passthrough<TOutput>
> & {
  schema: 'passthrough';
  wrapped: TWrappedSchema;
};

/**
 * Creates an async passthrough schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns An async passthrough schema.
 */
export function passthroughAsync<
  TWrappedSchema extends
    | ObjectSchema<ObjectShape>
    | ObjectSchemaAsync<ObjectShapesAsync>
>(wrapped: TWrappedSchema): PassthroughSchemaAsync<TWrappedSchema> {
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
      // Parse wrapped schema and return output + keep original extra props
      let output = await wrapped.parse(input, info);
      return { ...(input as any), ...output };
    },
  };
}

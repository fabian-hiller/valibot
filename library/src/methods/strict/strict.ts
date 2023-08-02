import { ValiError } from '../../error/index.ts';
import type { ObjectSchema } from '../../schemas/object/index.ts';

/**
 * Creates a strict object schema that throws an error if an input contains
 * unknown keys.
 *
 * @param schema A object schema.
 * @param error The error message.
 *
 * @returns A strict object schema.
 */
export function strict<TSchema extends ObjectSchema<any>>(
  schema: TSchema,
  error?: string
): TSchema {
  return {
    ...schema,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    parse(input, info) {
      // Get output of object schema
      const output = schema.parse(input);

      // Check length of input and output keys
      if (Object.keys(input as object).length !== Object.keys(output).length) {
        throw new ValiError([
          {
            reason: 'object',
            validation: 'strict',
            origin: 'value',
            message: error || 'Invalid keys',
            input,
            ...info,
          },
        ]);
      }

      // Return output of object schema
      return output;
    },
  };
}

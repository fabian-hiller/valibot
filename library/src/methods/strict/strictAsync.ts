import { ValiError } from '../../error/index.ts';
import type { ObjectSchemaAsync } from '../../schemas/object/index.ts';
import type { Output } from '../../types.ts';
import { getIssue } from '../../utils/index.ts';

/**
 * Creates a strict async object schema that throws an error if an input
 * contains unknown keys.
 *
 * @param schema A object schema.
 * @param error The error message.
 *
 * @returns A strict object schema.
 */
export function strictAsync<TSchema extends ObjectSchemaAsync<any>>(
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
    async parse(input, info) {
      // Get output of object schema
      const output: Output<TSchema> = await schema.parse(input);

      // Check length of input and output keys
      if (Object.keys(input as object).length !== Object.keys(output).length) {
        throw new ValiError([
          getIssue(info, {
            reason: 'object',
            validation: 'strict',
            message: error || 'Invalid keys',
            input,
          }),
        ]);
      }

      // Return output of object schema
      return output;
    },
  };
}

import type { ObjectSchema } from '../../schemas/object/index.ts';
import { getIssue } from '../../utils/index.ts';

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
    _parse(input, info) {
      const result = schema._parse(input, info);
      return !result.issues &&
        // Check length of input and output keys
        Object.keys(input as object).length !==
          Object.keys(result.output).length
        ? {
            issues: [
              getIssue(info, {
                reason: 'object',
                validation: 'strict',
                message: error || 'Invalid keys',
                input,
              }),
            ],
          }
        : result;
    },
  };
}

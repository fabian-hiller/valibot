import { type Issue, type Issues, ValiError } from '../../error/index.ts';
import type { BaseSchema, Input, Output } from '../../types.ts';

/**
 * Union options type.
 */
export type UnionOptions = [
  BaseSchema<any>,
  BaseSchema<any>,
  ...BaseSchema<any>[]
];

/**
 * Union schema type.
 */
export type UnionSchema<
  TUnionOptions extends UnionOptions,
  TOutput = Output<TUnionOptions[number]>
> = BaseSchema<Input<TUnionOptions[number]>, TOutput> & {
  schema: 'union';
  union: TUnionOptions;
};

/**
 * Creates a union schema.
 *
 * @param union The union schema.
 * @param error The error message.
 *
 * @returns A union schema.
 */
export function union<TUnionOptions extends UnionOptions>(
  union: TUnionOptions,
  error?: string
): UnionSchema<TUnionOptions> {
  return {
    /**
     * The schema type.
     */
    schema: 'union',

    /**
     * The union schema.
     */
    union,

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
      // Create output and issues
      let output: [Output<TUnionOptions[number]>] | undefined;
      const issues: Issue[] = [];

      // Parse schema of each option
      for (const schema of union) {
        try {
          // Note: Output is nested in array, so that also a falsy value
          // further down can be recognized as valid value
          output = [schema.parse(input, info)];
          break;

          // Fill issues in case of an error
        } catch (error) {
          issues.push(...(error as ValiError).issues);
        }
      }

      // Throw error if every schema failed
      if (!output) {
        throw new ValiError([
          {
            reason: 'type',
            validation: 'union',
            origin: 'value',
            message: error || 'Invalid type',
            input,
            issues: issues as Issues,
            ...info,
          },
        ]);
      }

      // Otherwise return parsed output
      return output[0];
    },
  };
}

import { getIssues } from '../../utils/index.ts';

import type {
  BaseSchema,
  BaseSchemaAsync,
  FString,
  Input,
  Issues,
  Output,
} from '../../types.ts';
/**
 * Union options async type.
 */
export type UnionOptionsAsync = [
  BaseSchema | BaseSchemaAsync,
  BaseSchema | BaseSchemaAsync,
  ...(BaseSchema[] | BaseSchemaAsync[])
];

/**
 * Union schema async type.
 */
export type UnionSchemaAsync<
  TUnionOptions extends UnionOptionsAsync,
  TOutput = Output<TUnionOptions[number]>
> = BaseSchemaAsync<Input<TUnionOptions[number]>, TOutput> & {
  schema: 'union';
  union: TUnionOptions;
};

/**
 * Creates an async union schema.
 *
 * @param union The union schema.
 * @param error The error message.
 *
 * @returns An async union schema.
 */
export function unionAsync<TUnionOptions extends UnionOptionsAsync>(
  union: TUnionOptions,
  error?: FString
): UnionSchemaAsync<TUnionOptions> {
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
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async _parse(input, info) {
      // Create issues and output
      let issues: Issues | undefined;
      let output: [Output<TUnionOptions[number]>] | undefined;

      // Parse schema of each option
      for (const schema of union) {
        const result = await schema._parse(input, info);

        // If there are issues, capture them
        if (result.issues) {
          if (issues) {
            for (const issue of result.issues) {
              issues.push(issue);
            }
          } else {
            issues = result.issues;
          }

          // Otherwise, set output and break loop
        } else {
          // Note: Output is nested in array, so that also a falsy value
          // further down can be recognized as valid value
          output = [result.output];
          break;
        }
      }

      // Return input as output or issues
      return output
        ? { output: output[0] }
        : getIssues(
            info,
            'type',
            'union',
            error || 'Invalid type',
            input,
            issues
          );
    },
  };
}

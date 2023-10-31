import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Input,
  Issues,
  Output,
} from '../../types.ts';
import { getSchemaIssues, getOutput } from '../../utils/index.ts';

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
  TOptions extends UnionOptionsAsync,
  TOutput = Output<TOptions[number]>
> = BaseSchemaAsync<Input<TOptions[number]>, TOutput> & {
  type: 'union';
  options: TOptions;
};

/**
 * Creates an async union schema.
 *
 * @param union The union options.
 * @param error The error message.
 *
 * @returns An async union schema.
 */
export function unionAsync<TOptions extends UnionOptionsAsync>(
  options: TOptions,
  error?: ErrorMessage
): UnionSchemaAsync<TOptions> {
  return {
    /**
     * The schema type.
     */
    type: 'union',

    /**
     * The union options.
     */
    options,

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
      let output: [Output<TOptions[number]>] | undefined;

      // Parse schema of each option
      for (const schema of options) {
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

      // Return output or issues
      return output
        ? getOutput(output[0])
        : getSchemaIssues(
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

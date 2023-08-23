import type { BaseSchema, Input, Issues, Output } from '../../types.ts';
import { getIssues } from '../../utils/index.ts';

/**
 * Intersection options type.
 */
export type IntersectionOptions = [
  BaseSchema<any>,
  BaseSchema<any>,
  ...BaseSchema<any>[]
];

type IntersectionOutput<TIntersectionOptions extends IntersectionOptions> =
  TIntersectionOptions extends [BaseSchema<any, infer TOutput>, ...infer TRest]
    ? TRest extends IntersectionOptions
      ? TOutput & IntersectionOutput<TRest>
      : TRest extends [BaseSchema<any, infer TOutput2>]
      ? TOutput & TOutput2
      : never
    : never;

/**
 * Intersection schema type.
 */
export type IntersectionSchema<
  TIntersectionOptions extends IntersectionOptions,
  TOutput = Output<BaseSchema<IntersectionOutput<TIntersectionOptions>>>
> = BaseSchema<
  Input<BaseSchema<IntersectionOutput<TIntersectionOptions>>>,
  TOutput
> & {
  schema: 'intersection';
  intersection: TIntersectionOptions;
};

/**
 * Creates an intersection schema.
 *
 * @param intersection The intersection schema.
 * @param error The error message.
 *
 * @returns An intersection schema.
 */
export function intersection<TIntersectionOptions extends IntersectionOptions>(
  intersection: TIntersectionOptions,
  error?: string
): IntersectionSchema<TIntersectionOptions> {
  return {
    /**
     * The schema type.
     */
    schema: 'intersection',

    /**
     * The intersection schema.
     */
    intersection,

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
    _parse(input, info) {
      // Create issues and output
      let issues: Issues | undefined;
      let output: [Output<IntersectionOptions[number]>] | undefined;

      // Parse schema of each option
      for (const schema of intersection) {
        const result = schema._parse(input, info);

        // If there are issues, set output and break loop
        if (result.issues) {
          issues = result.issues;
          break;
        } else {
          if (output) {
            output.push(result.output);
          } else {
            output = [result.output];
          }
        }
      }

      // Return input as output or issues
      return !issues && output
        ? {
            output: output.reduce((acc, value) => {
              if (typeof value === 'object') {
                return { ...acc, ...value };
              }
              return value;
            }) as IntersectionOutput<TIntersectionOptions>,
          }
        : getIssues(
            info,
            'type',
            'intersection',
            error || 'Invalid type',
            input,
            issues
          );
    },
  };
}

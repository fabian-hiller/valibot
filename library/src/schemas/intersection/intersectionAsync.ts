import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Issues,
  Output,
} from '../../types.ts';
import { getIssues } from '../../utils/index.ts';

/**
 * Intersection options async type.
 */
export type IntersectionOptionsAsync = [
  BaseSchema | BaseSchemaAsync,
  BaseSchema | BaseSchemaAsync,
  ...(BaseSchema[] | BaseSchemaAsync[])
];

type AsyncIntersectionOutput<
  TIntersectionOptions extends IntersectionOptionsAsync
> = TIntersectionOptions extends [
  BaseSchema<any, infer TOutput>,
  ...infer TRest
]
  ? TRest extends IntersectionOptionsAsync
    ? TOutput & AsyncIntersectionOutput<TRest>
    : TRest extends [BaseSchema<any, infer TOutput2>]
    ? TOutput & TOutput2
    : TRest extends [BaseSchemaAsync<any, infer TOutput2>]
    ? TOutput & TOutput2
    : never
  : TIntersectionOptions extends [
      BaseSchemaAsync<any, infer TOutput>,
      ...infer TRest
    ]
  ? TRest extends IntersectionOptionsAsync
    ? TOutput & AsyncIntersectionOutput<TRest>
    : TRest extends [BaseSchema<any, infer TOutput2>]
    ? TOutput & TOutput2
    : TRest extends [BaseSchemaAsync<any, infer TOutput2>]
    ? TOutput & TOutput2
    : never
  : never;

/**
 * Intersection schema async type.
 */
export type IntersectionSchemaAsync<
  TIntersectionOptions extends IntersectionOptionsAsync,
  TOutput = Output<
    BaseSchemaAsync<AsyncIntersectionOutput<TIntersectionOptions>>
  >
> = BaseSchemaAsync<
  Input<BaseSchemaAsync<AsyncIntersectionOutput<TIntersectionOptions>>>,
  TOutput
> & {
  schema: 'intersection';
  intersection: TIntersectionOptions;
};

/**
 * Creates an async intersection schema.
 *
 * @param intersection The intersection schema.
 * @param error The error message.
 *
 * @returns An async intersection schema.
 */
export function intersectionAsync<
  TIntersectionOptions extends IntersectionOptionsAsync
>(
  intersection: TIntersectionOptions,
  error?: string
): IntersectionSchemaAsync<TIntersectionOptions> {
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
      let output: [Output<TIntersectionOptions[number]>] | undefined;

      // Parse schema of each option
      for (const schema of intersection) {
        const result = await schema._parse(input, info);

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
            }) as AsyncIntersectionOutput<TIntersectionOptions>,
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

import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Input,
  Issues,
  Output,
} from '../../types.ts';
import { getSchemaIssues, getOutput, getIssues } from '../../utils/index.ts';
import type { ObjectSchema, ObjectSchemaAsync } from '../object/index.ts';

/**
 * Discriminated union option async type.
 */
export type DiscriminatedUnionOptionAsync<TKey extends string> =
  | ObjectSchema<Record<TKey, BaseSchema>, any>
  | ObjectSchemaAsync<Record<TKey, BaseSchema | BaseSchemaAsync>, any>
  | ((BaseSchema | BaseSchemaAsync) & {
      schema: 'discriminated_union';
      discriminatedUnion: DiscriminatedUnionOptionsAsync<TKey>;
    });

/**
 * Discriminated union options async type.
 */
export type DiscriminatedUnionOptionsAsync<TKey extends string> = [
  DiscriminatedUnionOptionAsync<TKey>,
  DiscriminatedUnionOptionAsync<TKey>,
  ...DiscriminatedUnionOptionAsync<TKey>[]
];

/**
 * Discriminated union schema async type.
 */
export type DiscriminatedUnionSchemaAsync<
  TKey extends string,
  TOptions extends DiscriminatedUnionOptionsAsync<TKey>,
  TOutput = Output<TOptions[number]>
> = BaseSchemaAsync<Input<TOptions[number]>, TOutput> & {
  schema: 'discriminated_union';
  discriminatedUnion: TOptions;
};

/**
 * Creates an async discriminated union schema.
 *
 * @param key The discriminator key.
 * @param options The union options.
 * @param error The error message.
 *
 * @returns An async discriminated union schema.
 */
export function discriminatedUnionAsync<
  TKey extends string,
  TOptions extends DiscriminatedUnionOptionsAsync<TKey>
>(
  key: TKey,
  options: TOptions,
  error?: ErrorMessage
): DiscriminatedUnionSchemaAsync<TKey, TOptions> {
  return {
    /**
     * The schema type.
     */
    schema: 'discriminated_union',

    /**
     * The discriminated union schema.
     */
    discriminatedUnion: options,

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
      // Check type of input
      if (!input || typeof input !== 'object' || !(key in input)) {
        return getSchemaIssues(
          info,
          'type',
          'discriminated_union',
          error || 'Invalid type',
          input
        );
      }

      // Create issues and output
      let issues: Issues | undefined;
      let output: [Record<string, any>] | undefined;

      // Create function to parse options recursively
      const parseOptions = async (
        options: DiscriminatedUnionOptionsAsync<TKey>
      ) => {
        for (const schema of options) {
          // If it is an object schema, parse discriminator key
          if (schema.schema === 'object') {
            const result = await schema.object.entries[key]._parse(
              (input as Record<TKey, unknown>)[key],
              info
            );

            // If right union option was found, parse it
            if (!result.issues) {
              const result = await schema._parse(input, info);

              // If there are issues, capture them
              if (result.issues) {
                issues = result.issues;

                // Otherwise, set output
              } else {
                // Note: Output is nested in array, so that also a falsy value
                // further down can be recognized as valid value
                output = [result.output];
              }

              // Break loop to end execution
              break;
            }

            // Otherwise, if it is a discriminated union parse its options
            // recursively
          } else if (schema.schema === 'discriminated_union') {
            await parseOptions(schema.discriminatedUnion);

            // If union option was found, break loop to end execution
            if (issues || output) {
              break;
            }
          }
        }
      };

      // Parse options recursively
      await parseOptions(options);

      // Return output or issues
      return output
        ? getOutput(output[0])
        : issues
        ? getIssues(issues)
        : getSchemaIssues(
            info,
            'type',
            'discriminated_union',
            error || 'Invalid type',
            input
          );
    },
  };
}

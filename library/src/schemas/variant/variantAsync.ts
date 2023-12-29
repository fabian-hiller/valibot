import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Input,
  Issues,
  Output,
  PipeAsync,
} from '../../types/index.ts';
import {
  defaultArgs,
  parseResult,
  pipeResultAsync,
  schemaIssue,
} from '../../utils/index.ts';
import type { ObjectSchema, ObjectSchemaAsync } from '../object/index.ts';

/**
 * Variant option async type.
 */
export type VariantOptionAsync<TKey extends string> =
  | ObjectSchema<Record<TKey, BaseSchema>, any>
  | ObjectSchemaAsync<Record<TKey, BaseSchema | BaseSchemaAsync>, any>
  | ((BaseSchema | BaseSchemaAsync) & {
      type: 'variant';
      options: VariantOptionsAsync<TKey>;
    });

/**
 * Variant options async type.
 */
export type VariantOptionsAsync<TKey extends string> = [
  VariantOptionAsync<TKey>,
  VariantOptionAsync<TKey>,
  ...VariantOptionAsync<TKey>[]
];

/**
 * Variant schema async type.
 */
export type VariantSchemaAsync<
  TKey extends string,
  TOptions extends VariantOptionsAsync<TKey>,
  TOutput = Output<TOptions[number]>
> = BaseSchemaAsync<Input<TOptions[number]>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'variant';
  /**
   * The discriminator key.
   */
  key: TKey;
  /**
   * The variant options.
   */
  options: TOptions;
  /**
   * The error message.
   */
  message: ErrorMessage;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<Input<TOptions[number]>> | undefined;
};

/**
 * Creates an async variant (aka discriminated union) schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async variant schema.
 */
export function variantAsync<
  TKey extends string,
  TOptions extends VariantOptionsAsync<TKey>
>(
  key: TKey,
  options: TOptions,
  pipe?: PipeAsync<Input<TOptions[number]>>
): VariantSchemaAsync<TKey, TOptions>;

/**
 * Creates an async variant (aka discriminated union) schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async variant schema.
 */
export function variantAsync<
  TKey extends string,
  TOptions extends VariantOptionsAsync<TKey>
>(
  key: TKey,
  options: TOptions,
  message?: ErrorMessage,
  pipe?: PipeAsync<Input<TOptions[number]>>
): VariantSchemaAsync<TKey, TOptions>;

export function variantAsync<
  TKey extends string,
  TOptions extends VariantOptionsAsync<TKey>
>(
  key: TKey,
  options: TOptions,
  arg3?: PipeAsync<Input<TOptions[number]>> | ErrorMessage,
  arg4?: PipeAsync<Input<TOptions[number]>>
): VariantSchemaAsync<TKey, TOptions> {
  // Get message and pipe argument
  const [message = 'Invalid type', pipe] = defaultArgs(arg3, arg4);

  // Create and return variant schema
  return {
    type: 'variant',
    async: true,
    key,
    options,
    message,
    pipe,
    async _parse(input, info) {
      // Check type of input
      if (!input || typeof input !== 'object') {
        return schemaIssue(info, 'type', 'variant', this.message, input);
      }

      // Continue if discriminator key is included
      if (this.key in input) {
        // Create issues and output
        let issues: Issues | undefined;
        let output: [Record<string, any>] | undefined;

        // Create function to parse options recursively
        const parseOptions = async (options: VariantOptionsAsync<TKey>) => {
          for (const schema of options) {
            // If it is an object schema, parse discriminator key
            if (schema.type === 'object') {
              const keyResult = await schema.entries[this.key]._parse(
                (input as Record<TKey, unknown>)[this.key],
                info
              );

              // If right variant option was found, parse it
              if (!keyResult.issues) {
                const dataResult = await schema._parse(input, info);

                // If there are issues, capture them
                if (dataResult.issues) {
                  issues = dataResult.issues;

                  // Otherwise, set output
                } else {
                  // Note: Output is nested in array, so that also a falsy value
                  // further down can be recognized as valid value
                  output = [dataResult.output!];

                  // Break loop to end execution
                  break;
                }
              }

              // Otherwise, if it is a variant parse its options
              // recursively
            } else if (schema.type === 'variant') {
              await parseOptions(schema.options);

              // If variant option was found, break loop to end execution
              if (output) {
                break;
              }
            }
          }
        };

        // Parse options recursively
        await parseOptions(this.options);

        // If there is an output, execute pipe
        if (output) {
          return pipeResultAsync(output[0], this.pipe, info, 'variant');
        }

        // If there are issues, return untyped parse result
        if (issues) {
          return parseResult(false, output, issues);
        }
      }

      // If discriminator key is invalid, return issue
      return schemaIssue(info, 'type', 'variant', this.message, input, [
        {
          type: 'object',
          input: input as Record<string, unknown>,
          key: this.key,
          value: undefined,
        },
      ]);
    },
  };
}

/**
 * See {@link variantAsync}
 *
 * @deprecated Use `variantAsync` instead.
 */
export const discriminatedUnionAsync = variantAsync;

import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Input,
  Issues,
  Output,
} from '../../types/index.ts';
import { getSchemaIssues, getOutput, getIssues } from '../../utils/index.ts';
import type {
  ObjectPathItem,
  ObjectSchema,
  ObjectSchemaAsync,
} from '../object/index.ts';

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
};

/**
 * Creates an async variant (aka discriminated union) schema.
 *
 * @param key The discriminator key.
 * @param options The variant options.
 * @param message The error message.
 *
 * @returns An async variant schema.
 */
export function variantAsync<
  TKey extends string,
  TOptions extends VariantOptionsAsync<TKey>
>(
  key: TKey,
  options: TOptions,
  message: ErrorMessage = 'Invalid type'
): VariantSchemaAsync<TKey, TOptions> {
  return {
    type: 'variant',
    async: true,
    key,
    options,
    message,
    async _parse(input, info) {
      // Check type of input
      if (!input || typeof input !== 'object') {
        return getSchemaIssues(info, 'type', 'variant', this.message, input);
      }

      // Create issues and output
      let issues: Issues | undefined;
      let output: [Record<string, any>] | undefined;

      // Create function to parse options recursively
      const parseOptions = async (options: VariantOptionsAsync<TKey>) => {
        for (const schema of options) {
          // If it is an object schema, parse discriminator key
          if (schema.type === 'object') {
            const variantKeySchema = schema.entries[this.key];
            const result = await variantKeySchema._parse(
              (input as Record<TKey, unknown>)[this.key],
              info
            );

            // If right variant option was found, parse it
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

            // Otherwise, if it is a variant parse its options
            // recursively
          } else if (schema.type === 'variant') {
            await parseOptions(schema.options);

            // If variant option was found, break loop to end execution
            if (issues || output) {
              break;
            }
          }
        }
      };

      // Parse options recursively
      await parseOptions(this.options);

      // Return output
      if (output) {
        return getOutput(output[0]);
      }

      // Return variant issues
      if (issues) {
        return getIssues(issues);
      }

      // Return new issue for non matching variant key
      const inputRecord = input as Record<string, unknown>;
      const pathItem: ObjectPathItem = {
        type: 'object',
        input: inputRecord,
        key: this.key,
        value: inputRecord[this.key],
      };
      const nonMatchingKeyIssues = getSchemaIssues(
        info,
        'invalid_variant_key',
        'variant',
        'Invalid variant key',
        inputRecord[this.key],
        undefined,
        this.options
      );
      nonMatchingKeyIssues.issues[0].path = [pathItem];
      return nonMatchingKeyIssues;
    },
  };
}

/**
 * See {@link variantAsync}
 *
 * @deprecated Use `variantAsync` instead.
 */
export const discriminatedUnionAsync = variantAsync;

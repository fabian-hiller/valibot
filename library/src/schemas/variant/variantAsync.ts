import type {
  BaseSchema,
  BaseSchemaAsync,
  ErrorMessage,
  Input,
  Output,
  PipeAsync,
  SchemaResult,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResultAsync,
  schemaIssue,
} from '../../utils/index.ts';
import type { ObjectSchema, ObjectSchemaAsync } from '../object/index.ts';

/**
 * Variant option schema type.
 */
interface VariantOptionSchema<TKey extends string> extends BaseSchema {
  type: 'variant';
  options: VariantOptionsAsync<TKey>;
}

/**
 * Variant option schema async type.
 */
interface VariantOptionSchemaAsync<TKey extends string>
  extends BaseSchemaAsync {
  type: 'variant';
  options: VariantOptionsAsync<TKey>;
}

/**
 * Variant option async type.
 */
export type VariantOptionAsync<TKey extends string> =
  | ObjectSchema<Record<TKey, BaseSchema>, any>
  | ObjectSchemaAsync<Record<TKey, BaseSchema | BaseSchemaAsync>, any>
  | VariantOptionSchema<TKey>
  | VariantOptionSchemaAsync<TKey>;

/**
 * Variant options async type.
 */
export type VariantOptionsAsync<TKey extends string> = [
  VariantOptionAsync<TKey>,
  VariantOptionAsync<TKey>,
  ...VariantOptionAsync<TKey>[],
];

/**
 * Variant schema async type.
 */
export interface VariantSchemaAsync<
  TKey extends string,
  TOptions extends VariantOptionsAsync<TKey>,
  TOutput = Output<TOptions[number]>,
> extends BaseSchemaAsync<Input<TOptions[number]>, TOutput> {
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
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<Input<TOptions[number]>> | undefined;
}

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
  TOptions extends VariantOptionsAsync<TKey>,
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
  TOptions extends VariantOptionsAsync<TKey>,
>(
  key: TKey,
  options: TOptions,
  message?: ErrorMessage,
  pipe?: PipeAsync<Input<TOptions[number]>>
): VariantSchemaAsync<TKey, TOptions>;

export function variantAsync<
  TKey extends string,
  TOptions extends VariantOptionsAsync<TKey>,
>(
  key: TKey,
  options: TOptions,
  arg3?: PipeAsync<Input<TOptions[number]>> | ErrorMessage,
  arg4?: PipeAsync<Input<TOptions[number]>>
): VariantSchemaAsync<TKey, TOptions> {
  // Get message and pipe argument
  const [message, pipe] = defaultArgs(arg3, arg4);

  // Create cached expected key
  let cachedExpectedKey: string | undefined;

  // Create and return variant schema
  return {
    type: 'variant',
    expects: 'Object',
    async: true,
    key,
    options,
    message,
    pipe,
    async _parse(input, config) {
      // If root type is valid, check nested types
      if (input && typeof input === 'object') {
        // If key is in input or expected key is not cached, continue
        if (this.key in input || !cachedExpectedKey) {
          // Create expected key and variant result
          let expectedKey: string[] | undefined;
          let variantResult: SchemaResult<Output<TOptions[number]>> | undefined;

          // Create function to parse options recursively
          const parseOptions = async (options: VariantOptionsAsync<TKey>) => {
            for (const schema of options) {
              // If it is an object schema, parse discriminator key
              if (schema.type === 'object') {
                const keySchema = schema.entries[this.key];
                const keyResult = await keySchema._parse(
                  (input as Record<TKey, unknown>)[this.key],
                  config
                );

                // If expected key is not cached create it
                if (!cachedExpectedKey) {
                  expectedKey
                    ? expectedKey.push(keySchema.expects)
                    : (expectedKey = [keySchema.expects]);
                }

                // If right variant option was found, parse it
                if (!keyResult.issues) {
                  const dataResult = await schema._parse(input, config);

                  // If there are not issues, store result and break loop
                  if (!dataResult.issues) {
                    variantResult = dataResult;
                    break;
                  }

                  // Otherwise, replace variant result only if necessary
                  if (
                    !variantResult ||
                    (!variantResult.typed && dataResult.typed)
                  ) {
                    variantResult = dataResult;
                  }
                }

                // Otherwise, if it is a variant parse its options
                // recursively
              } else if (schema.type === 'variant') {
                await parseOptions(schema.options);

                // If variant option was found, break loop to end execution
                if (variantResult && !variantResult.issues) {
                  break;
                }
              }
            }
          };

          // Parse options recursively
          await parseOptions(this.options);

          // Cache expected key lazy
          cachedExpectedKey =
            cachedExpectedKey || [...new Set(expectedKey)].join(' | ');

          // If a variant result is available, process it
          if (variantResult) {
            // If result is typed, return pipe result
            if (variantResult.typed) {
              return pipeResultAsync(
                this,
                variantResult.output,
                config,
                variantResult.issues
              );
            }

            // Otherwise, return variant result
            return variantResult;
          }
        }

        // Otherwise, if discriminator key is invalid, return schema issue
        const value = (input as Record<string, unknown>)[this.key];
        return schemaIssue(this, variantAsync, value, config, {
          expected: cachedExpectedKey,
          path: [
            {
              type: 'object',
              origin: 'value',
              input: input as Record<string, unknown>,
              key: this.key,
              value,
            },
          ],
        });
      }

      // Otherwise, return default schema issue
      return schemaIssue(this, variantAsync, input, config);
    },
  };
}

/**
 * See {@link variantAsync}
 *
 * @deprecated Use `variantAsync` instead.
 */
export const discriminatedUnionAsync = variantAsync;

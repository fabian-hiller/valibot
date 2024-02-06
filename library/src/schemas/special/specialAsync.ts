import type {
  BaseSchemaAsync,
  ErrorMessage,
  ErrorMessageOrMetadata,
  PipeAsync,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResultAsync,
  schemaIssue,
} from '../../utils/index.ts';

/**
 * Special schema async type.
 */
export type SpecialSchemaAsync<TInput, TOutput = TInput> = BaseSchemaAsync<
  TInput,
  TOutput
> & {
  /**
   * The schema type.
   */
  type: 'special';
  /**
   * The type check function.
   */
  check: (input: unknown) => boolean | Promise<boolean>;
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<TInput> | undefined;
};

/**
 * Creates an async special schema.
 *
 * @param check The type check function.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async special schema.
 */
export function specialAsync<TInput>(
  check: (input: unknown) => boolean | Promise<boolean>,
  pipe?: PipeAsync<TInput>
): SpecialSchemaAsync<TInput>;

/**
 * Creates a special schema.
 *
 * @param check The type check function.
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A special schema.
 */
export function specialAsync<TInput>(
  check: (input: unknown) => boolean | Promise<boolean>,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: PipeAsync<TInput>
): SpecialSchemaAsync<TInput>;

export function specialAsync<TInput>(
  check: (input: unknown) => boolean | Promise<boolean>,
  arg2?: PipeAsync<TInput> | ErrorMessageOrMetadata,
  arg3?: PipeAsync<TInput>
): SpecialSchemaAsync<TInput> {
  // Get message and pipe argument
  const [message, pipe, metadata] = defaultArgs(arg2, arg3);

  // Create and return string schema
  return {
    type: 'special',
    expects: 'unknown',
    async: true,
    check,
    message,
    pipe,
    metadata,
    async _parse(input, config) {
      // If check is fulfilled, return pipe output
      if (await this.check(input)) {
        return pipeResultAsync(this, input as TInput, config);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, specialAsync, input, config);
    },
  };
}

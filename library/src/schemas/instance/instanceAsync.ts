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
import type { Class } from './types.ts';

/**
 * Instance schema type.
 */
export type InstanceSchemaAsync<
  TClass extends Class,
  TOutput = InstanceType<TClass>
> = BaseSchemaAsync<InstanceType<TClass>, TOutput> & {
  /**
   * The schema type.
   */
  type: 'instance';
  /**
   * The class of the instance.
   */
  class: TClass;
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<InstanceType<TClass>> | undefined;
};

/**
 * Creates an async instance schema.
 *
 * @param class_ The class of the instance.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async instance schema.
 */
export function instanceAsync<TClass extends Class>(
  class_: TClass,
  pipe?: PipeAsync<InstanceType<TClass>>
): InstanceSchemaAsync<TClass>;

/**
 * Creates an async instance schema.
 *
 * @param class_ The class of the instance.
 * @param messageOrMetadata The error message or schema metadata.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An async instance schema.
 */
export function instanceAsync<TClass extends Class>(
  class_: TClass,
  messageOrMetadata?: ErrorMessageOrMetadata,
  pipe?: PipeAsync<InstanceType<TClass>>
): InstanceSchemaAsync<TClass>;

export function instanceAsync<TClass extends Class>(
  class_: TClass,
  arg2?: PipeAsync<InstanceType<TClass>> | ErrorMessageOrMetadata,
  arg3?: PipeAsync<InstanceType<TClass>>
): InstanceSchemaAsync<TClass> {
  // Get message and pipe argument
  const [message, pipe, metadata] = defaultArgs(arg2, arg3);

  // Create and return string schema
  return {
    type: 'instance',
    expects: class_.name,
    async: true,
    class: class_,
    message,
    metadata,
    pipe,
    async _parse(input, config) {
      // If type is valid, return pipe result
      if (input instanceof this.class) {
        return pipeResultAsync(this, input, config);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, instanceAsync, input, config);
    },
  };
}

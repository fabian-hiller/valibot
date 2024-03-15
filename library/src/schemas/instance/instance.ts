import type { BaseSchema, ErrorMessage, Pipe } from '../../types/index.ts';
import { defaultArgs, pipeResult, schemaIssue } from '../../utils/index.ts';
import type { Class } from './types.ts';

/**
 * Instance schema type.
 */
export interface InstanceSchema<
  TClass extends Class,
  TOutput = InstanceType<TClass>,
> extends BaseSchema<InstanceType<TClass>, TOutput> {
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
  pipe: Pipe<InstanceType<TClass>> | undefined;
}

/**
 * Creates an instance schema.
 *
 * @param class_ The class of the instance.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An instance schema.
 */
export function instance<TClass extends Class>(
  class_: TClass,
  pipe?: Pipe<InstanceType<TClass>>
): InstanceSchema<TClass>;

/**
 * Creates an instance schema.
 *
 * @param class_ The class of the instance.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns An instance schema.
 */
export function instance<TClass extends Class>(
  class_: TClass,
  message?: ErrorMessage,
  pipe?: Pipe<InstanceType<TClass>>
): InstanceSchema<TClass>;

export function instance<TClass extends Class>(
  class_: TClass,
  arg2?: Pipe<InstanceType<TClass>> | ErrorMessage,
  arg3?: Pipe<InstanceType<TClass>>
): InstanceSchema<TClass> {
  // Get message and pipe argument
  const [message, pipe] = defaultArgs(arg2, arg3);

  // Create and return string schema
  return {
    type: 'instance',
    expects: class_.name,
    async: false,
    class: class_,
    message,
    pipe,
    _parse(input, config) {
      // If type is valid, return pipe result
      if (input instanceof this.class) {
        return pipeResult(this, input, config);
      }

      // Otherwise, return schema issue
      return schemaIssue(this, instance, input, config);
    },
  };
}

import type { BaseSchema, ErrorMessage, Pipe } from '../../types/index.ts';
import {
  executePipe,
  getDefaultArgs,
  getSchemaIssues,
} from '../../utils/index.ts';

/**
 * Class enum type.
 */
export type Class = abstract new (...args: any) => any;

/**
 * Instance schema type.
 */
export interface InstanceSchema<
  TClass extends Class,
  TOutput = InstanceType<TClass>
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
  message: ErrorMessage;
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
  const [message = 'Invalid type', pipe] = getDefaultArgs(arg2, arg3);

  // Create and return string schema
  return {
    type: 'instance',
    async: false,
    class: class_,
    message,
    pipe,
    _parse(input, info) {
      // Check type of input
      if (!(input instanceof this.class)) {
        return getSchemaIssues(info, 'type', 'instance', this.message, input);
      }

      // Execute pipe and return result
      return executePipe(input, this.pipe, info, 'instance');
    },
  };
}

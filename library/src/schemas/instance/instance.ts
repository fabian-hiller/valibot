import type { BaseIssue, BaseSchema, ErrorMessage } from '../../types/index.ts';
import { _schemaDataset } from '../../utils/index.ts';

/**
 * Class type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Class = new (...args: any) => any;

/**
 * Instance issue type.
 */
export interface InstanceIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'instance';
  /**
   * The expected input.
   */
  readonly expected: string;
}

/**
 * Instance schema type.
 */
export interface InstanceSchema<
  TClass extends Class,
  TMessage extends ErrorMessage<InstanceIssue> | undefined,
> extends BaseSchema<
    InstanceType<TClass>,
    InstanceType<TClass>,
    InstanceIssue
  > {
  /**
   * The schema type.
   */
  readonly type: 'instance';
  /**
   * The class of the instance.
   */
  readonly class: TClass;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates an instance schema.
 *
 * @param class_ The class of the instance.
 *
 * @returns An instance schema.
 */
export function instance<TClass extends Class>(
  class_: TClass
): InstanceSchema<TClass, undefined>;

/**
 * Creates an instance schema.
 *
 * @param class_ The class of the instance.
 * @param message The error message.
 *
 * @returns An instance schema.
 */
export function instance<
  TClass extends Class,
  const TMessage extends ErrorMessage<InstanceIssue> | undefined,
>(class_: TClass, message: TMessage): InstanceSchema<TClass, TMessage>;

export function instance(
  class_: Class,
  message?: ErrorMessage<InstanceIssue>
): InstanceSchema<Class, ErrorMessage<InstanceIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'instance',
    expects: class_.name,
    async: false,
    class: class_,
    message,
    _run(dataset, config) {
      return _schemaDataset(
        this,
        instance,
        dataset.value instanceof this.class,
        dataset,
        config
      );
    },
  };
}

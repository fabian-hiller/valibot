import type {
  BaseIssue,
  BaseSchema,
  ErrorMessage,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue, _getStandardProps } from '../../utils/index.ts';

/**
 * Promise issue type.
 */
export interface PromiseIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'promise';
  /**
   * The expected property.
   */
  readonly expected: 'Promise';
}

/**
 * Promise schema type.
 */
export interface PromiseSchema<
  TMessage extends ErrorMessage<PromiseIssue> | undefined,
> extends BaseSchema<Promise<unknown>, Promise<unknown>, PromiseIssue> {
  /**
   * The schema type.
   */
  readonly type: 'promise';
  /**
   * The schema reference.
   */
  readonly reference: typeof promise;
  /**
   * The expected property.
   */
  readonly expects: 'Promise';
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a promise schema.
 *
 * @returns A promise schema.
 */
export function promise(): PromiseSchema<undefined>;

/**
 * Creates a promise schema.
 *
 * @param message The error message.
 *
 * @returns A promise schema.
 */
export function promise<
  const TMessage extends ErrorMessage<PromiseIssue> | undefined,
>(message: TMessage): PromiseSchema<TMessage>;

export function promise(
  message?: ErrorMessage<PromiseIssue>
): PromiseSchema<ErrorMessage<PromiseIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'promise',
    reference: promise,
    expects: 'Promise',
    async: false,
    message,
    get '~standard'() {
      return _getStandardProps(this);
    },
    '~run'(dataset, config) {
      if (dataset.value instanceof Promise) {
        // @ts-expect-error
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }
      // @ts-expect-error
      return dataset as OutputDataset<Promise<unknown>, PromiseIssue>;
    },
  };
}

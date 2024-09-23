import { getGlobalConfig } from '../../storages/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  ErrorMessage,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Boolean issue type.
 */
export interface BooleanIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'boolean';
  /**
   * The expected property.
   */
  readonly expected: 'boolean';
}

/**
 * Boolean schema type.
 */
export interface BooleanSchema<
  TMessage extends ErrorMessage<BooleanIssue> | undefined,
> extends BaseSchema<boolean, boolean, BooleanIssue> {
  /**
   * The schema type.
   */
  readonly type: 'boolean';
  /**
   * The schema reference.
   */
  readonly reference: typeof boolean;
  /**
   * The expected property.
   */
  readonly expects: 'boolean';
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a boolean schema.
 *
 * @returns A boolean schema.
 */
export function boolean(): BooleanSchema<undefined>;

/**
 * Creates a boolean schema.
 *
 * @param message The error message.
 *
 * @returns A boolean schema.
 */
export function boolean<
  const TMessage extends ErrorMessage<BooleanIssue> | undefined,
>(message: TMessage): BooleanSchema<TMessage>;

export function boolean(
  message?: ErrorMessage<BooleanIssue>
): BooleanSchema<ErrorMessage<BooleanIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'boolean',
    reference: boolean,
    expects: 'boolean',
    async: false,
    message,
    '~standard': 1,
    '~vendor': 'valibot',
    '~validate'(dataset, config = getGlobalConfig()) {
      if (typeof dataset.value === 'boolean') {
        // @ts-expect-error
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }
      return dataset as OutputDataset<boolean, BooleanIssue>;
    },
  };
}

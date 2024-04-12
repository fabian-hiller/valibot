import type {
  BaseIssue,
  BaseSchema,
  ErrorMessage,
  MaybeReadonly,
} from '../../types/index.ts';
import { _schemaDataset, _stringify } from '../../utils/index.ts';

/**
 * Picklist options type.
 */
export type PicklistOptions = MaybeReadonly<(string | number | bigint)[]>;

/**
 * Picklist issue type.
 */
export interface PicklistIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'picklist';
  /**
   * The expected input.
   */
  readonly expected: string;
}

/**
 * Picklist schema type.
 */
export interface PicklistSchema<
  TOptions extends PicklistOptions,
  TMessage extends ErrorMessage<PicklistIssue> | undefined,
> extends BaseSchema<TOptions[number], TOptions[number], PicklistIssue> {
  /**
   * The schema type.
   */
  readonly type: 'picklist';
  /**
   * The picklist options.
   */
  readonly options: TOptions;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a picklist schema.
 *
 * @param options The picklist value.
 *
 * @returns A picklist schema.
 */
export function picklist<const TOptions extends PicklistOptions>(
  options: TOptions
): PicklistSchema<TOptions, undefined>;

/**
 * Creates a picklist schema.
 *
 * @param options The picklist value.
 * @param message The error message.
 *
 * @returns A picklist schema.
 */
export function picklist<
  const TOptions extends PicklistOptions,
  const TMessage extends ErrorMessage<PicklistIssue> | undefined,
>(options: TOptions, message: TMessage): PicklistSchema<TOptions, TMessage>;

export function picklist(
  options: PicklistOptions,
  message?: ErrorMessage<PicklistIssue>
): PicklistSchema<PicklistOptions, ErrorMessage<PicklistIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'picklist',
    expects: options.map(_stringify).join(' | '),
    async: false,
    options,
    message,
    _run(dataset, config) {
      return _schemaDataset(
        this,
        picklist,
        // @ts-expect-error
        this.options.includes(dataset.value),
        dataset,
        config
      );
    },
  };
}

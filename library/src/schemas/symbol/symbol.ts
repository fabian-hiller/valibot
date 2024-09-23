import { getGlobalConfig } from '../../storages/index.ts';
import type {
  BaseIssue,
  BaseSchema,
  ErrorMessage,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Symbol issue type.
 */
export interface SymbolIssue extends BaseIssue<unknown> {
  /**
   * The issue kind.
   */
  readonly kind: 'schema';
  /**
   * The issue type.
   */
  readonly type: 'symbol';
  /**
   * The expected property.
   */
  readonly expected: 'symbol';
}

/**
 * Symbol schema type.
 */
export interface SymbolSchema<
  TMessage extends ErrorMessage<SymbolIssue> | undefined,
> extends BaseSchema<symbol, symbol, SymbolIssue> {
  /**
   * The schema type.
   */
  readonly type: 'symbol';
  /**
   * The schema reference.
   */
  readonly reference: typeof symbol;
  /**
   * The expected property.
   */
  readonly expects: 'symbol';
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a symbol schema.
 *
 * @returns A symbol schema.
 */
export function symbol(): SymbolSchema<undefined>;

/**
 * Creates a symbol schema.
 *
 * @param message The error message.
 *
 * @returns A symbol schema.
 */
export function symbol<
  const TMessage extends ErrorMessage<SymbolIssue> | undefined,
>(message: TMessage): SymbolSchema<TMessage>;

export function symbol(
  message?: ErrorMessage<SymbolIssue>
): SymbolSchema<ErrorMessage<SymbolIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'symbol',
    reference: symbol,
    expects: 'symbol',
    async: false,
    message,
    '~standard': 1,
    '~vendor': 'valibot',
    '~validate'(dataset, config = getGlobalConfig()) {
      if (typeof dataset.value === 'symbol') {
        // @ts-expect-error
        dataset.typed = true;
      } else {
        _addIssue(this, 'type', dataset, config);
      }
      return dataset as OutputDataset<symbol, SymbolIssue>;
    },
  };
}

import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
  OutputDataset,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Finite issue type.
 */
export interface FiniteIssue<TInput extends number> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'finite';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `${number}`;
  /**
   * The validation function.
   */
  readonly requirement: (input: number) => boolean;
}

/**
 * Finite action type.
 */
export interface FiniteAction<
  TInput extends number,
  TMessage extends ErrorMessage<FiniteIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, FiniteIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'finite';
  /**
   * The action reference.
   */
  readonly reference: typeof finite;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The validation function.
   */
  readonly requirement: (input: number) => boolean;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a [finite](https://en.wikipedia.org/wiki/Finite) validation action.
 *
 * @returns A finite action.
 */
export function finite<TInput extends number>(): FiniteAction<
  TInput,
  undefined
>;

/**
 * Creates a [finite](https://en.wikipedia.org/wiki/Finite) validation action.
 *
 * @param message The error message.
 *
 * @returns A finite action.
 */
export function finite<
  TInput extends number,
  const TMessage extends ErrorMessage<FiniteIssue<TInput>> | undefined,
>(message: TMessage): FiniteAction<TInput, TMessage>;

export function finite(
  message?: ErrorMessage<FiniteIssue<number>>
): FiniteAction<number, ErrorMessage<FiniteIssue<number>> | undefined> {
  return {
    kind: 'validation',
    type: 'finite',
    reference: finite,
    async: false,
    expects: null,
    requirement: Number.isFinite,
    message,
    '~validate'(dataset, config) {
      if (dataset.typed && !this.requirement(dataset.value)) {
        _addIssue(this, 'finite', dataset, config);
      }
      return dataset as OutputDataset<number, FiniteIssue<number>>;
    },
  };
}

import { HEXADECIMAL_REGEX } from '../../regex.ts';
import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _validationDataset } from '../../utils/index.ts';

/**
 * Hexadecimal issue type.
 */
export interface HexadecimalIssue<TInput extends string>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'hexadecimal';
  /**
   * The expected input.
   */
  readonly expected: null;
  /**
   * The received input.
   */
  readonly received: `"${string}"`;
  /**
   * The hexadecimal regex.
   */
  readonly requirement: RegExp;
}

/**
 * Hexadecimal action type.
 */
export interface HexadecimalAction<
  TInput extends string,
  TMessage extends ErrorMessage<HexadecimalIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, HexadecimalIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'hexadecimal';
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The hexadecimal regex.
   */
  readonly requirement: RegExp;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) validation action.
 *
 * @returns A hexadecimal action.
 */
export function hexadecimal<TInput extends string>(): HexadecimalAction<
  TInput,
  undefined
>;

/**
 * Creates a [hexadecimal](https://en.wikipedia.org/wiki/Hexadecimal) validation action.
 *
 * @param message The error message.
 *
 * @returns A hexadecimal action.
 */
export function hexadecimal<
  TInput extends string,
  const TMessage extends ErrorMessage<HexadecimalIssue<TInput>> | undefined,
>(message: TMessage): HexadecimalAction<TInput, TMessage>;

export function hexadecimal(
  message?: ErrorMessage<HexadecimalIssue<string>>
): HexadecimalAction<
  string,
  ErrorMessage<HexadecimalIssue<string>> | undefined
> {
  return {
    kind: 'validation',
    type: 'hexadecimal',
    async: false,
    expects: null,
    requirement: HEXADECIMAL_REGEX,
    message,
    _run(dataset, config) {
      return _validationDataset(
        this,
        hexadecimal,
        'hexadecimal',
        dataset.typed && !this.requirement.test(dataset.value),
        dataset,
        config
      );
    },
  };
}

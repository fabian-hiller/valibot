import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Type to determine postal code format by country.
 * Country code is based on [ISO 3166-1 alpha-2](https://ja.wikipedia.org/wiki/ISO_3166-1).
 *
 */
const COUNTRY_CODE = {
  JP: 'JP',
  US: 'US',
} as const;

export type CountryCode = keyof typeof COUNTRY_CODE;

/**
 * get postal code pattern by country code
 *
 * @param countryCode Country code which based on [ISO 3166-1 alpha-2](https://ja.wikipedia.org/wiki/ISO_3166-1)
 *
 * @returns postal code pattern
 */
const getPostalCodePattern = (countryCode: CountryCode): RegExp => {
  switch (countryCode) {
    case COUNTRY_CODE.JP:
      return /^\d{3}-?\d{4}$/u;
    case COUNTRY_CODE.US:
      return /^\d{5}(?:-\d{4})?$/u;
    default:
      throw new Error(`Unsupported country code: ${countryCode}`);
  }
};

/**
 * Postal Code issue interface.
 */
export interface PostalCodeIssue<TInput extends string, CountryCode>
  extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'postal_code';
  /**
   * The expected property.
   */
  readonly expected: null;
  /**
   * The received property.
   */
  readonly received: `"${string}"`;
  /**
   * The validation function.
   */
  readonly requirement: (input: string, countryCode: CountryCode) => boolean;
}

/**
 * Postal Code action interface.
 */
export interface PostalCodeAction<
  TInput extends string,
  CountryCode,
  TMessage extends
    | ErrorMessage<PostalCodeIssue<TInput, CountryCode>>
    | undefined,
> extends BaseValidation<TInput, TInput, PostalCodeIssue<TInput, CountryCode>> {
  /**
   * The action type.
   */
  readonly type: 'postal_code';
  /**
   * The action reference.
   */
  readonly reference: typeof postalCode;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The validation function.
   */
  readonly requirement: (input: string, countryCode: CountryCode) => boolean;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a postal code validation action.
 *
 * @param countryCode Country code which based on [ISO 3166-1 alpha-2](https://ja.wikipedia.org/wiki/ISO_3166-1)
 *
 * @returns A postal code action.
 */
export function postalCode<TInput extends string, CountryCode>(
  countryCode: CountryCode
): PostalCodeAction<TInput, CountryCode, undefined>;

/**
 * Creates a postal code validation action.
 *
 * @param countryCode Country code which based on [ISO 3166-1 alpha-2](https://ja.wikipedia.org/wiki/ISO_3166-1)
 * @param message The error message.
 *
 * @returns A postal code action.
 */
export function postalCode<
  TInput extends string,
  CountryCode,
  TMessage extends
    | ErrorMessage<PostalCodeIssue<TInput, CountryCode>>
    | undefined,
>(
  countryCode: CountryCode,
  message: TMessage
): PostalCodeAction<TInput, CountryCode, TMessage>;

// @__NO_SIDE_EFFECTS__
export function postalCode(
  countryCode: CountryCode,
  message?: ErrorMessage<PostalCodeIssue<string, CountryCode>>
): PostalCodeAction<
  string,
  CountryCode,
  ErrorMessage<PostalCodeIssue<string, CountryCode>> | undefined
> {
  return {
    kind: 'validation',
    type: 'postal_code',
    reference: postalCode,
    async: false,
    expects: null,
    requirement(input, countryCode) {
      const pattern = getPostalCodePattern(countryCode);
      return pattern.test(input);
    },
    message,
    '~run'(dataset, config) {
      if (dataset.typed && !this.requirement(dataset.value, countryCode)) {
        _addIssue(this, 'postal code', dataset, config);
      }
      return dataset;
    },
  };
}

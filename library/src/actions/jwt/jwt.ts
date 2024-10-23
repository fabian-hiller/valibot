import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';

/**
 * Possible jwt regex.
 */
const POSSIBLE_JWT_REGEX = /^(?:[\w-]+\.){2}[\w-]*$/u;

/**
 * The type of the [algorithm](https://datatracker.ietf.org/doc/html/rfc7518#section-3.1) used to sign the jwt.
 */
type Algorithm =
  | 'HS256'
  | 'HS384'
  | 'HS512'
  | 'RS256'
  | 'RS384'
  | 'RS512'
  | 'ES256'
  | 'ES384'
  | 'ES512'
  | 'PS256'
  | 'PS384'
  | 'PS512'
  | 'none';

/**
 * Converts base64Url encoded string to base64.
 *
 * @param base64UrlEncoded The base64Url encoded string.
 *
 * @returns The base64 encoded string.
 */
function base64UrlToBase64(base64UrlEncoded: string): string {
  // https://stackoverflow.com/questions/55389211/string-based-data-encoding-base64-vs-base64url
  const res: Array<string> = [];
  for (const ch of base64UrlEncoded) {
    res.push(ch === '-' ? '+' : ch === '_' ? '/' : ch);
  }
  while (res.length % 4 !== 0) {
    res.push('=');
  }
  return res.join('');
}

/**
 * Jwt issue type.
 */
export interface JwtIssue<TInput extends string> extends BaseIssue<TInput> {
  /**
   * The issue kind.
   */
  readonly kind: 'validation';
  /**
   * The issue type.
   */
  readonly type: 'jwt';
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
  readonly requirement: (input: string) => boolean;
}

/**
 * Jwt action type.
 */
export interface JwtAction<
  TInput extends string,
  TAlgorithm extends Algorithm,
  TMessage extends ErrorMessage<JwtIssue<TInput>> | undefined,
> extends BaseValidation<TInput, TInput, JwtIssue<TInput>> {
  /**
   * The action type.
   */
  readonly type: 'jwt';
  /**
   * The action reference.
   */
  readonly reference: typeof jwt;
  /**
   * The expected property.
   */
  readonly expects: null;
  /**
   * The algorithm used to sign the jwt.
   */
  readonly algorithm: TAlgorithm;
  /**
   * The error message.
   */
  readonly message: TMessage;
  /**
   * The validation function.
   */
  readonly requirement: (input: string) => boolean;
}

/**
 * Creates a [jwt](https://en.wikipedia.org/wiki/JSON_Web_Token) validation action.
 *
 * @param algorithm The algorithm used to sign the jwt.
 *
 * @returns A jwt action.
 */
export function jwt<TInput extends string, TAlgorithm extends Algorithm>(
  algorithm: TAlgorithm
): JwtAction<TInput, TAlgorithm, undefined>;

/**
 * Creates a [jwt](https://en.wikipedia.org/wiki/JSON_Web_Token) validation action.
 *
 * @param algorithm The algorithm used to sign the jwt.
 * @param message The error message.
 *
 * @returns A jwt action.
 */
export function jwt<
  TInput extends string,
  TAlgorithm extends Algorithm,
  const TMessage extends ErrorMessage<JwtIssue<TInput>> | undefined,
>(
  algorithm: TAlgorithm,
  message: TMessage
): JwtAction<TInput, TAlgorithm, TMessage>;

export function jwt(
  algorithm: Algorithm,
  message?: ErrorMessage<JwtIssue<string>>
): JwtAction<string, Algorithm, ErrorMessage<JwtIssue<string>> | undefined> {
  return {
    kind: 'validation',
    type: 'jwt',
    reference: jwt,
    async: false,
    expects: null,
    message,
    algorithm,
    requirement(input) {
      if (!POSSIBLE_JWT_REGEX.test(input)) {
        return false;
      }
      const [headerInput, , signatureInput] = input.split('.');
      try {
        // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/65494
        const header: unknown = JSON.parse(
          atob(base64UrlToBase64(headerInput))
        );
        return (
          // `header` is an object
          header !== null &&
          typeof header === 'object' &&
          // has a `typ` property associated to `'JWT'`
          'typ' in header &&
          header.typ === 'JWT' &&
          // the passed algorithm matches the value of the `alg` property
          'alg' in header &&
          header.alg === this.algorithm &&
          (header.alg === 'none'
            ? signatureInput.length === 0
            : signatureInput.length > 0)
        );
      } catch {
        return false;
      }
    },
    '~validate'(dataset, config) {
      if (dataset.typed && !this.requirement(dataset.value)) {
        _addIssue(this, 'jwt', dataset, config);
      }
      return dataset;
    },
  };
}

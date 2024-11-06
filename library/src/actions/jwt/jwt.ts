import type {
  BaseIssue,
  BaseValidation,
  ErrorMessage,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import { base64Decode, base64UrlToBase64, JSONSafeParse } from './helpers.ts';

const BASE64URL_REGEX = /^[\w-]+$/u;

const JWS_WITHOUT_HEADER_REGEX = /^[\w-]+\.[\w-]*$/u;

const ALGORITHMS = [
  'HS256',
  'HS384',
  'HS512',
  'RS256',
  'RS384',
  'RS512',
  'ES256',
  'ES384',
  'ES512',
  'PS256',
  'PS384',
  'PS512',
  'none',
] as const;

type ValueOrReadonlyArray<T> = T | ReadonlyArray<T>;

/**
 * The type of the [algorithm](https://datatracker.ietf.org/doc/html/rfc7518#section-3.1) used to sign the jwt.
 */
type Alg = ValueOrReadonlyArray<(typeof ALGORITHMS)[number]>;

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
  TAlg extends Alg | undefined,
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
  readonly alg: TAlg;
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
 * @returns A jwt action.
 */
export function jwt<TInput extends string>(): JwtAction<
  TInput,
  undefined,
  undefined
>;

/**
 * Creates a [jwt](https://en.wikipedia.org/wiki/JSON_Web_Token) validation action.
 *
 * @param alg The algorithm used to sign the jwt.
 *
 * @returns A jwt action.
 */
export function jwt<TInput extends string, TAlg extends Alg>(
  alg: TAlg
): JwtAction<TInput, TAlg, undefined>;

/**
 * Creates a [jwt](https://en.wikipedia.org/wiki/JSON_Web_Token) validation action.
 *
 * @param alg The algorithm used to sign the jwt.
 * @param message The error message.
 *
 * @returns A jwt action.
 */
export function jwt<
  TInput extends string,
  TAlg extends Alg | undefined,
  const TMessage extends ErrorMessage<JwtIssue<TInput>> | undefined,
>(alg: TAlg, message: TMessage): JwtAction<TInput, TAlg, TMessage>;

export function jwt(
  alg?: Alg,
  message?: ErrorMessage<JwtIssue<string>>
): JwtAction<
  string,
  Alg | undefined,
  ErrorMessage<JwtIssue<string>> | undefined
> {
  return {
    kind: 'validation',
    type: 'jwt',
    reference: jwt,
    async: false,
    expects: null,
    message,
    alg,
    requirement(input) {
      // The points are from https://datatracker.ietf.org/doc/html/rfc7519#page-14

      // 1. Verify that the JWT contains at least one period ('.') character
      const parts = input.split('.', 2);
      if (parts.length > 1) {
        return false;
      }

      // 2. Let the Encoded JOSE Header be the portion of the JWT before the first period ('.') character
      const encodedJoseHeader = parts[0];

      // 3. Base64url decode the Encoded JOSE Header following the restriction that
      //    no line breaks, whitespace, or other additional characters have been used
      if (!BASE64URL_REGEX.test(encodedJoseHeader)) {
        return false;
      }
      const decodedJoseHeader = base64Decode(
        base64UrlToBase64(encodedJoseHeader)
      );

      // 4. Verify that the resulting octet sequence is a UTF-8-encoded
      //    representation of a completely valid JSON object conforming
      //    to [RFC 7159](https://datatracker.ietf.org/doc/html/rfc7159).
      //    let the JOSE Header be this JSON object
      const joseHeader = JSONSafeParse(decodedJoseHeader);
      if (joseHeader == undefined || typeof joseHeader !== 'object') {
        return false;
      }

      // 5. Verify that the resulting JOSE Header includes only parameters and values
      //    whose syntax and semantics are both understood and supported or that are
      //    specified as being ignored when not understood
      // implementation: this point is ignored because this action does not verify the JWT

      // 6. Determine whether the JWT is a JWS or a JWE using any of the methods described
      //    in [Section 9 of RFC 7516](https://datatracker.ietf.org/doc/html/rfc7516#page-24)
      // implementation: This action currently only supports JWSs.
      //                 A valid JWS should satisfy all of the methods described in the mentioned specification.
      //                 Check if all of the methods are satisfied
      const rest = parts[1];
      if (
        !JWS_WITHOUT_HEADER_REGEX.test(rest) ||
        !('alg' in joseHeader) ||
        typeof joseHeader.alg !== 'string' ||
        ALGORITHMS.find((alg) => alg === joseHeader.alg) === undefined ||
        'enc' in joseHeader
      ) {
        return false;
      }

      // 7. Depending upon whether the JWT is a JWS or JWE, there are two
      //    cases:
      //      *  If the JWT is a JWS, follow the steps specified in
      //         [JWS](https://datatracker.ietf.org/doc/html/rfc7515) for
      //         validating a JWS.  Let the Message be the result of base64url
      //         decoding the JWS Payload
      //      *  Else, if the JWT is a JWE, follow the steps specified in
      //         [JWE](https://datatracker.ietf.org/doc/html/rfc7516) for
      //         validating a JWE.  Let the Message be the resulting plaintext
      // implementation: Since this action currently only supports JWSs, follow the first case but after step 8

      // 8. If the JOSE Header contains a "cty" (content type) value of
      //    "JWT", then the Message is a JWT that was the subject of nested
      //    signing or encryption operations. In this case, return to Step
      //    1, using the Message as the JWT
      // implementation: This action currently does not support validating the structure of nested JWTs.
      //                 Ignore this step

      // 9. Otherwise, base64url decode the Message following the
      //    restriction that no line breaks, whitespace, or other additional
      //    characters have been used
      const [payloadInput, signatureInput] = rest.split('.');
      if (!('cty' in joseHeader) || joseHeader.cty !== 'JWT') {
        const message = base64Decode(base64UrlToBase64(payloadInput));

        // 10. Verify that the resulting octet sequence is a UTF-8-encoded
        //     representation of a completely valid JSON object conforming to
        //     [RFC 7159](https://datatracker.ietf.org/doc/html/rfc7159)
        const payload = JSONSafeParse(message);
        if (!payload || typeof payload !== 'object') {
          return false;
        }
      }

      // implementation: All steps mentioned in the specification completed. Add some custom checks
      const isSignatureInputEmpty = signatureInput === '';
      return (
        (joseHeader.alg === 'none'
          ? isSignatureInputEmpty
          : !isSignatureInputEmpty) &&
        (this.alg === undefined ||
          (Array.isArray(this.alg) ? this.alg : [this.alg]).find(
            (alg) => alg === joseHeader.alg
          ) !== undefined)
      );
    },
    '~validate'(dataset, config) {
      if (dataset.typed && !this.requirement(dataset.value)) {
        _addIssue(this, 'jwt', dataset, config);
      }
      return dataset;
    },
  };
}

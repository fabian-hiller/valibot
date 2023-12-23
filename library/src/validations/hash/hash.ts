import type {
  BaseValidation,
  ErrorMessage,
  HashType,
} from '../../types/index.ts';
import { actionIssue, actionOutput } from '../../utils/index.ts';
import { isHash } from '../../utils/isHash/index.ts';

/**
 * Hash validation type.
 */
export type HashValidation<TInput extends string> = BaseValidation<TInput> & {
  /**
   * The validation type.
   */
  type: 'hash';
  /**
   * Map with hash type and validation regular expression.
   */
  requirement: typeof isHash;
};

/**
 * Creates a validation function that validates whether a string is one of hash types.
 *
 * @param hashType hashType
 * @param message The error message.
 *
 * @returns A validation function.
 */
export function hash<TInput extends string, THashTypes extends HashType[]>(
  hashType: THashTypes,
  message: ErrorMessage = 'Invalid hash format.'
): HashValidation<TInput> {
  return {
    type: 'hash',
    async: false,
    message,
    requirement: isHash,
    _parse(input: TInput) {
      return !this.requirement(input, hashType)
        ? actionIssue(this.type, this.message, input, this.requirement)
        : actionOutput(input);
    },
  };
}

import type { BaseValidation } from '../../types';

/**
 * Returns the boolean value depends on parsed validation
 *
 * @param validate validation object
 * @param value value to validate
 *
 * @returns boolean
 */
export function parse<TValidate extends BaseValidation<TInput>, TInput>(
  validate: TValidate,
  value: TInput
): boolean {
  const parsed = validate._parse(value);
  return !parsed.issues;
}

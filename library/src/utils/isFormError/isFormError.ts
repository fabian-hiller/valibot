import type {
  BaseIssue,
  BaseSchema,
  BaseSchemaAsync,
} from '../../types/index.ts';
import { FormError } from '../index.ts';

/**
 * A type guard to check if an error is a FormError.
 *
 * @param error The error to check.
 *
 * @returns Whether its a FormError.
 */
export function isFormError<
  TSchema extends
    | BaseSchema<unknown, unknown, BaseIssue<unknown>>
    | BaseSchemaAsync<unknown, unknown, BaseIssue<unknown>>,
>(error: unknown): error is FormError<TSchema> {
  return error instanceof FormError;
}

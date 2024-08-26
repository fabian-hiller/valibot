import type { JSONSchema7 } from 'json-schema';
import type { GenericValidation } from 'valibot';
import type { ConversionOptions } from '../types.ts';
import { email, type SupportedEmailValidation } from './email/index.ts';
import type { ValidationConverter, ValidationConverters } from './types.ts';

/** Union type of all supported validations */
export type SupportedValidation = SupportedEmailValidation;

/** Map validation types to converters */
export const VALIDATION_CONVERTERS: ValidationConverters<SupportedValidation> =
  { email };

const getValidationConverter = (
  validation: GenericValidation
): ValidationConverter<GenericValidation> | undefined => {
  return VALIDATION_CONVERTERS[(validation as SupportedValidation).type] as
    | ValidationConverter<GenericValidation>
    | undefined;
};

/**
 * Convert any supported validation into JSON schema
 *
 * @param validation validation to convert
 * @param options    conversion options
 *
 * @returns converted JSON schema
 */
export function convertValidation(
  validation: GenericValidation,
  options?: ConversionOptions
): JSONSchema7 {
  const converter = getValidationConverter(validation);
  if (!converter) {
    if (options?.force) return {};
    throw new Error(`Unsupported validation type '${validation.type}'`);
  }

  return converter(validation);
}

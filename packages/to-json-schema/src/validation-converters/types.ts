import type { JSONSchema7 } from 'json-schema';
import type { GenericValidation } from 'valibot';

/** Function taking a validation action and converting it to JSON schema */
export type ValidationConverter<TValidation extends GenericValidation> = (
  validation: TValidation
) => JSONSchema7;

/** Record of action validation type to converter */
export type ValidationConverters<TValidation extends GenericValidation> = {
  [type in TValidation['type']]: ValidationConverter<
    Extract<TValidation, { type: type }>
  >;
};

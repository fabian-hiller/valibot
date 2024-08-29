import type { JSONSchema7 } from 'json-schema';
import type * as v from 'valibot';
import type { JsonSchemaConfig } from './type.ts';

/**
 * Action type.
 */
type Action =
  | v.DescriptionAction<unknown, string>
  | v.EmailAction<string, v.ErrorMessage<v.EmailIssue<string>> | undefined>
  | v.IntegerAction<number, v.ErrorMessage<v.IntegerIssue<number>> | undefined>;

/**
 * Converts any supported Valibot schema to the JSON schema format.
 *
 * @param json The JSON schema object.
 * @param action The Valibot action object.
 * @param config The JSON schema configuration.
 *
 * @returns The converted JSON schema.
 */
export function convertAction(
  json: JSONSchema7,
  action: Action,
  config: JsonSchemaConfig | undefined
): JSONSchema7 {
  switch (action.type) {
    case 'description': {
      json.description = action.description;
      break;
    }

    case 'email': {
      json.format = 'email';
      break;
    }

    case 'integer': {
      json.type = 'integer';
      break;
    }

    default: {
      if (!config?.force) {
        throw new Error(
          // @ts-expect-error
          `The "${schema.type}" action cannot be converted to JSON schema.`
        );
      }
    }
  }
  return json;
}

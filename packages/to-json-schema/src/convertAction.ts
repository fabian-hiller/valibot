import type { JSONSchema7 } from 'json-schema';
import type * as v from 'valibot';
import type { ConversionConfig } from './type.ts';

/**
 * Action type.
 */
type Action =
  | v.DescriptionAction<unknown, string>
  | v.EmailAction<string, v.ErrorMessage<v.EmailIssue<string>> | undefined>
  | v.IsoDateAction<string, v.ErrorMessage<v.IsoDateIssue<string>> | undefined>
  | v.IsoTimestampAction<
      string,
      v.ErrorMessage<v.IsoTimestampIssue<string>> | undefined
    >
  | v.Ipv4Action<string, v.ErrorMessage<v.Ipv4Issue<string>> | undefined>
  | v.Ipv6Action<string, v.ErrorMessage<v.Ipv6Issue<string>> | undefined>
  | v.UuidAction<string, v.ErrorMessage<v.UuidIssue<string>> | undefined>
  | v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined>
  | v.IntegerAction<number, v.ErrorMessage<v.IntegerIssue<number>> | undefined>
  | v.LengthAction<
      v.LengthInput,
      number,
      v.ErrorMessage<v.LengthIssue<v.LengthInput, number>> | undefined
    >
  | v.MinLengthAction<
      v.LengthInput,
      number,
      v.ErrorMessage<v.MinLengthIssue<v.LengthInput, number>> | undefined
    >
  | v.MaxLengthAction<
      v.LengthInput,
      number,
      v.ErrorMessage<v.MaxLengthIssue<v.LengthInput, number>> | undefined
    >
  | v.ValueAction<
      v.ValueInput,
      v.ValueInput,
      v.ErrorMessage<v.ValueIssue<v.ValueInput, v.ValueInput>> | undefined
    >
  | v.MinValueAction<
      v.ValueInput,
      v.ValueInput,
      v.ErrorMessage<v.MinValueIssue<v.ValueInput, v.ValueInput>> | undefined
    >
  | v.MaxValueAction<
      v.ValueInput,
      v.ValueInput,
      v.ErrorMessage<v.MaxValueIssue<v.ValueInput, v.ValueInput>> | undefined
    >
  | v.MultipleOfAction<
      number,
      number,
      v.ErrorMessage<v.MultipleOfIssue<number, number>> | undefined
    >;

/**
 * Returns an error for an invalid action type.
 *
 * @param jsonSchema The JSON Schema object.
 * @param valibotAction The Valibot action object.
 *
 * @returns An error object.
 */
function getInvalidTypeError(
  jsonSchema: JSONSchema7,
  valibotAction: Action
): Error {
  return new Error(
    `The "${valibotAction.type}" action is not supported on type "${jsonSchema.type}".`
  );
}

/**
 * Converts any supported Valibot schema to the JSON Schema format.
 *
 * @param jsonSchema The JSON Schema object.
 * @param valibotAction The Valibot action object.
 * @param config The conversion configuration.
 *
 * @returns The converted JSON Schema.
 */
export function convertAction(
  jsonSchema: JSONSchema7,
  valibotAction: Action,
  config: ConversionConfig | undefined
): JSONSchema7 {
  switch (valibotAction.type) {
    case 'description': {
      jsonSchema.description = valibotAction.description;
      break;
    }

    case 'email': {
      jsonSchema.format = 'email';
      break;
    }

    case 'iso_date': {
      jsonSchema.format = 'date';
      break;
    }

    case 'iso_timestamp': {
      jsonSchema.format = 'date-time';
      break;
    }

    case 'ipv4': {
      jsonSchema.format = 'ipv4';
      break;
    }

    case 'ipv6': {
      jsonSchema.format = 'ipv6';
      break;
    }

    case 'uuid': {
      jsonSchema.format = 'uuid';
      break;
    }

    case 'regex': {
      if (!config?.force && valibotAction.requirement.flags) {
        throw new Error('RegExp flags are not supported by JSON Schema.');
      }
      jsonSchema.pattern = valibotAction.requirement.source;
      break;
    }

    case 'integer': {
      jsonSchema.type = 'integer';
      break;
    }

    case 'length':
    case 'min_length':
    case 'max_length': {
      if (jsonSchema.type === 'string') {
        if (valibotAction.type !== 'max_length') {
          jsonSchema.minLength = valibotAction.requirement;
        }
        if (valibotAction.type !== 'min_length') {
          jsonSchema.maxLength = valibotAction.requirement;
        }
      } else if (jsonSchema.type === 'array') {
        if (valibotAction.type !== 'max_length') {
          jsonSchema.minItems = valibotAction.requirement;
        }
        if (valibotAction.type !== 'min_length') {
          jsonSchema.maxItems = valibotAction.requirement;
        }
      } else if (!config?.force) {
        throw getInvalidTypeError(jsonSchema, valibotAction);
      }
      break;
    }

    case 'value': {
      // Hint: It is not necessary to validate the type of the JSON schema or
      // Valibot action requirement, as this action can only follow a valid
      // schema in the pipeline anyway.
      // @ts-expect-error
      jsonSchema.const = valibotAction.requirement;
      break;
    }

    case 'max_value': {
      if (jsonSchema.type === 'number') {
        jsonSchema.maximum = valibotAction.requirement as number;
      } else if (!config?.force) {
        throw getInvalidTypeError(jsonSchema, valibotAction);
      }
      break;
    }

    case 'min_value': {
      if (jsonSchema.type === 'number') {
        jsonSchema.minimum = valibotAction.requirement as number;
      } else if (!config?.force) {
        throw getInvalidTypeError(jsonSchema, valibotAction);
      }
      break;
    }

    case 'multiple_of': {
      jsonSchema.multipleOf = valibotAction.requirement;
      break;
    }

    default: {
      if (!config?.force) {
        throw new Error(
          // @ts-expect-error
          `The "${schema.type}" action cannot be converted to JSON Schema.`
        );
      }
    }
  }
  return jsonSchema;
}
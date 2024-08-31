import type { JSONSchema7, JSONSchema7Type } from 'json-schema';
import type * as v from 'valibot';
import type { JsonSchemaConfig } from './type.ts';
import { assertJSON } from './utils/assertJSON.ts';

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

function getUnsupportedActionError(json: JSONSchema7, action: Action) {
  return new Error(
    `The "${action.type}" action is not supported on type "${json.type}".`
  );
}

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

    case 'iso_date': {
      json.format = 'date';
      break;
    }

    case 'iso_timestamp': {
      json.format = 'date-time';
      break;
    }

    case 'ipv4': {
      json.format = 'ipv4';
      break;
    }

    case 'ipv6': {
      json.format = 'ipv6';
      break;
    }

    case 'uuid': {
      json.format = 'uuid';
      break;
    }

    case 'regex': {
      if (action.requirement.flags && !config?.force) {
        throw new Error('RegExp flags are not supported.');
      }
      json.pattern = action.requirement.source;
      break;
    }

    case 'integer': {
      json.type = 'integer';
      break;
    }

    case 'length':
    case 'min_length':
    case 'max_length': {
      if (json.type === 'string') {
        if (action.type !== 'max_length') {
          json.minLength = action.requirement;
        }
        if (action.type !== 'min_length') {
          json.maxLength = action.requirement;
        }
      } else if (json.type === 'array') {
        if (action.type !== 'max_length') {
          json.minItems = action.requirement;
        }
        if (action.type !== 'min_length') {
          json.maxItems = action.requirement;
        }
      } else if (!config?.force) {
        throw getUnsupportedActionError(json, action);
      }
      break;
    }

    case 'value': {
      if (
        (json.type === 'string' ||
          json.type === 'number' ||
          json.type === 'boolean') &&
        assertJSON(
          action.requirement,
          config?.force,
          `Value provided is not JSON compatible.`
        )
      ) {
        json.const = action.requirement as JSONSchema7Type;
      } else if (!config?.force) {
        throw getUnsupportedActionError(json, action);
      }
      break;
    }

    case 'max_value': {
      if (
        json.type === 'number' &&
        assertJSON(
          action.requirement,
          config?.force,
          `Max value provided is not JSON compatible.`
        )
      ) {
        json.maximum = action.requirement as number;
      } else if (!config?.force) {
        throw getUnsupportedActionError(json, action);
      }
      break;
    }

    case 'min_value': {
      if (
        json.type === 'number' &&
        assertJSON(
          action.requirement,
          config?.force,
          `Min value provided is not JSON compatible.`
        )
      ) {
        json.minimum = action.requirement as number;
      } else if (!config?.force) {
        throw getUnsupportedActionError(json, action);
      }
      break;
    }

    case 'multiple_of': {
      if (
        assertJSON(
          action.requirement,
          config?.force,
          `Multiple of value provided is not JSON compatible.`
        )
      ) {
        json.multipleOf = action.requirement;
      }
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

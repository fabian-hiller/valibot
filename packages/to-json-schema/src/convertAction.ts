import type { JSONSchema7 } from 'json-schema';
import type * as v from 'valibot';
import type { ConversionConfig } from './type.ts';
import { handleError } from './utils/index.ts';

// TODO: Add support for more actions (for example all regex-based actions)

/**
 * Action type.
 */
type Action =
  | v.Base64Action<string, v.ErrorMessage<v.Base64Issue<string>> | undefined>
  | v.DescriptionAction<unknown, string>
  | v.EmailAction<string, v.ErrorMessage<v.EmailIssue<string>> | undefined>
  | v.IntegerAction<number, v.ErrorMessage<v.IntegerIssue<number>> | undefined>
  | v.Ipv4Action<string, v.ErrorMessage<v.Ipv4Issue<string>> | undefined>
  | v.Ipv6Action<string, v.ErrorMessage<v.Ipv6Issue<string>> | undefined>
  | v.IsoDateAction<string, v.ErrorMessage<v.IsoDateIssue<string>> | undefined>
  | v.IsoDateTimeAction<
      string,
      v.ErrorMessage<v.IsoDateTimeIssue<string>> | undefined
    >
  | v.IsoTimeAction<string, v.ErrorMessage<v.IsoTimeIssue<string>> | undefined>
  | v.IsoTimestampAction<
      string,
      v.ErrorMessage<v.IsoTimestampIssue<string>> | undefined
    >
  | v.LengthAction<
      v.LengthInput,
      number,
      v.ErrorMessage<v.LengthIssue<v.LengthInput, number>> | undefined
    >
  | v.NonEmptyAction<
      v.LengthInput,
      v.ErrorMessage<v.NonEmptyIssue<v.LengthInput>> | undefined
    >
  | v.MaxLengthAction<
      v.LengthInput,
      number,
      v.ErrorMessage<v.MaxLengthIssue<v.LengthInput, number>> | undefined
    >
  | v.MaxValueAction<
      v.ValueInput,
      v.ValueInput,
      v.ErrorMessage<v.MaxValueIssue<v.ValueInput, v.ValueInput>> | undefined
    >
  | v.MinLengthAction<
      v.LengthInput,
      number,
      v.ErrorMessage<v.MinLengthIssue<v.LengthInput, number>> | undefined
    >
  | v.MinValueAction<
      v.ValueInput,
      v.ValueInput,
      v.ErrorMessage<v.MinValueIssue<v.ValueInput, v.ValueInput>> | undefined
    >
  | v.MultipleOfAction<
      number,
      number,
      v.ErrorMessage<v.MultipleOfIssue<number, number>> | undefined
    >
  | v.RegexAction<string, v.ErrorMessage<v.RegexIssue<string>> | undefined>
  | v.TitleAction<unknown, string>
  | v.UrlAction<string, v.ErrorMessage<v.UrlIssue<string>> | undefined>
  | v.UuidAction<string, v.ErrorMessage<v.UuidIssue<string>> | undefined>
  | v.ValueAction<
      v.ValueInput,
      v.ValueInput,
      v.ErrorMessage<v.ValueIssue<v.ValueInput, v.ValueInput>> | undefined
    >;

/**
 * Converts any supported Valibot action to the JSON Schema format.
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
    case 'base64': {
      jsonSchema.contentEncoding = 'base64';
      break;
    }

    case 'description': {
      jsonSchema.description = valibotAction.description;
      break;
    }

    case 'email': {
      jsonSchema.format = 'email';
      break;
    }

    case 'integer': {
      jsonSchema.type = 'integer';
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

    case 'iso_date': {
      jsonSchema.format = 'date';
      break;
    }

    case 'iso_date_time':
    case 'iso_timestamp': {
      jsonSchema.format = 'date-time';
      break;
    }

    case 'iso_time': {
      jsonSchema.format = 'time';
      break;
    }

    case 'length': {
      if (jsonSchema.type === 'array') {
        jsonSchema.minItems = valibotAction.requirement;
        jsonSchema.maxItems = valibotAction.requirement;
      } else {
        if (jsonSchema.type !== 'string') {
          handleError(
            `The "${valibotAction.type}" action is not supported on type "${jsonSchema.type}".`,
            config
          );
        }
        jsonSchema.minLength = valibotAction.requirement;
        jsonSchema.maxLength = valibotAction.requirement;
      }
      break;
    }

    case 'max_length': {
      if (jsonSchema.type === 'array') {
        jsonSchema.maxItems = valibotAction.requirement;
      } else {
        if (jsonSchema.type !== 'string') {
          handleError(
            `The "${valibotAction.type}" action is not supported on type "${jsonSchema.type}".`,
            config
          );
        }
        jsonSchema.maxLength = valibotAction.requirement;
      }
      break;
    }

    case 'max_value': {
      if (jsonSchema.type !== 'number') {
        handleError(
          `The "max_value" action is not supported on type "${jsonSchema.type}".`,
          config
        );
      }
      // @ts-expect-error
      jsonSchema.maximum = valibotAction.requirement;
      break;
    }

    case 'min_length': {
      if (jsonSchema.type === 'array') {
        jsonSchema.minItems = valibotAction.requirement;
      } else {
        if (jsonSchema.type !== 'string') {
          handleError(
            `The "${valibotAction.type}" action is not supported on type "${jsonSchema.type}".`,
            config
          );
        }
        jsonSchema.minLength = valibotAction.requirement;
      }
      break;
    }

    case 'min_value': {
      if (jsonSchema.type !== 'number') {
        handleError(
          `The "min_value" action is not supported on type "${jsonSchema.type}".`,
          config
        );
      }
      // @ts-expect-error
      jsonSchema.minimum = valibotAction.requirement;
      break;
    }

    case 'multiple_of': {
      jsonSchema.multipleOf = valibotAction.requirement;
      break;
    }

    case 'non_empty': {
      if (jsonSchema.type === 'array') {
        jsonSchema.minItems = 1;
      } else {
        if (jsonSchema.type !== 'string') {
          handleError(
            `The "${valibotAction.type}" action is not supported on type "${jsonSchema.type}".`,
            config
          );
        }
        jsonSchema.minLength = 1;
      }
      break;
    }

    case 'regex': {
      if (valibotAction.requirement.flags) {
        handleError('RegExp flags are not supported by JSON Schema.', config);
      }
      jsonSchema.pattern = valibotAction.requirement.source;
      break;
    }

    case 'title': {
      jsonSchema.title = valibotAction.title;
      break;
    }

    case 'url': {
      jsonSchema.format = 'uri';
      break;
    }

    case 'uuid': {
      jsonSchema.format = 'uuid';
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

    default: {
      handleError(
        // @ts-expect-error
        `The "${valibotAction.type}" action cannot be converted to JSON Schema.`,
        config
      );
    }
  }
  return jsonSchema;
}

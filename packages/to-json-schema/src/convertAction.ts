import type { JSONSchema7 } from 'json-schema';
import type * as v from 'valibot';
import type { ConversionConfig } from './type.ts';
import { throwOrWarn } from './utils/index.ts';

// TODO: Add support for more actions (for example all regex-based actions)

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
    >
  | v.TitleAction<unknown, string>
  | v.UniqueItemsAction<
      v.ArrayInput,
      v.ErrorMessage<v.UniqueItemsIssue<v.ArrayInput>> | undefined
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

    case 'length':
    case 'min_length':
    case 'max_length': {
      if (jsonSchema.type === 'array') {
        if (valibotAction.type !== 'max_length') {
          jsonSchema.minItems = valibotAction.requirement;
        }
        if (valibotAction.type !== 'min_length') {
          jsonSchema.maxItems = valibotAction.requirement;
        }
      } else {
        if (jsonSchema.type !== 'string') {
          throwOrWarn(
            `The "${valibotAction.type}" action is not supported on type "${jsonSchema.type}".`,
            config
          );
        }
        if (valibotAction.type !== 'max_length') {
          jsonSchema.minLength = valibotAction.requirement;
        }
        if (valibotAction.type !== 'min_length') {
          jsonSchema.maxLength = valibotAction.requirement;
        }
      }
      break;
    }

    case 'max_value': {
      if (jsonSchema.type !== 'number') {
        throwOrWarn(
          `The "max_value" action is not supported on type "${jsonSchema.type}".`,
          config
        );
      }
      // @ts-expect-error
      jsonSchema.maximum = valibotAction.requirement;
      break;
    }

    case 'min_value': {
      if (jsonSchema.type !== 'number') {
        throwOrWarn(
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

    case 'regex': {
      if (valibotAction.requirement.flags) {
        throwOrWarn('RegExp flags are not supported by JSON Schema.', config);
      }
      jsonSchema.pattern = valibotAction.requirement.source;
      break;
    }

    case 'title': {
      jsonSchema.title = valibotAction.title;
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

    case 'unique_items': {
      if (jsonSchema.type !== 'array') {
        throwOrWarn(
          `The "${valibotAction.type}" action is not supported on type "${jsonSchema.type}".`,
          config
        );
      }
      jsonSchema.uniqueItems = true;

      break;
    }

    default: {
      throwOrWarn(
        // @ts-expect-error
        `The "${valibotAction.type}" action cannot be converted to JSON Schema.`,
        config
      );
    }
  }
  return jsonSchema;
}

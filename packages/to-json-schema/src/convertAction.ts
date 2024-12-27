import type { JSONSchema7 } from 'json-schema';
import type * as v from 'valibot';
import { BIC_REGEX, CUID2_REGEX, DECIMAL_REGEX, DIGITS_REGEX } from 'valibot';
import type { ConversionConfig } from './type.ts';
import { handleError } from './utils/index.ts';

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
  | v.BicAction<never, v.ErrorMessage<v.BicIssue<string>> | undefined>
  | v.Cuid2Action<never, v.ErrorMessage<v.Cuid2Issue<string>> | undefined>
  | v.DecimalAction<never, v.ErrorMessage<v.DecimalIssue<string>> | undefined>
  | v.DigitsAction<never, v.ErrorMessage<v.DigitsIssue<string>> | undefined>
  | v.EmptyAction<
      v.LengthInput,
      v.ErrorMessage<v.EmptyIssue<v.LengthInput>> | undefined
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
          handleError(
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
        handleError(
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

    case 'bic':
    case 'cuid2':
    case 'decimal':
    case 'digits': {
      jsonSchema.pattern = valibotAction.requirement.source;
      break;
    }

    case 'empty': {
      if (jsonSchema.type === 'string') {
        jsonSchema.maxLength = 0;
      } else if (jsonSchema.type === 'array') {
        jsonSchema.maxItems = 0;
      } else {
        handleError(
          `The "empty" action is not supported on type "${jsonSchema.type}".`,
          config
        );
      }
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

import type {
  BaseIssue,
  BaseSchema,
  Dataset,
  ErrorMessage,
  InferIssue,
  MapPathItem,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { InferMapInput, InferMapOutput, MapIssue } from './types.ts';

/**
 * Map schema type.
 */
export interface MapSchema<
  TKey extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  TMessage extends ErrorMessage<MapIssue> | undefined,
> extends BaseSchema<
    InferMapInput<TKey, TValue>,
    InferMapOutput<TKey, TValue>,
    MapIssue | InferIssue<TKey> | InferIssue<TValue>
  > {
  /**
   * The schema type.
   */
  readonly type: 'map';
  /**
   * The schema reference.
   */
  readonly reference: typeof map;
  /**
   * The expected property.
   */
  readonly expects: 'Map';
  /**
   * The map key schema.
   */
  readonly key: TKey;
  /**
   * The map value schema.
   */
  readonly value: TValue;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Creates a map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 *
 * @returns A map schema.
 */
export function map<
  const TKey extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  const TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(key: TKey, value: TValue): MapSchema<TKey, TValue, undefined>;

/**
 * Creates a map schema.
 *
 * @param key The key schema.
 * @param value The value schema.
 * @param message The error message.
 *
 * @returns A map schema.
 */
export function map<
  const TKey extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  const TValue extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  const TMessage extends ErrorMessage<MapIssue> | undefined,
>(
  key: TKey,
  value: TValue,
  message: TMessage
): MapSchema<TKey, TValue, TMessage>;

export function map(
  key: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  value: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  message?: ErrorMessage<MapIssue>
): MapSchema<
  BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  ErrorMessage<MapIssue> | undefined
> {
  return {
    kind: 'schema',
    type: 'map',
    reference: map,
    expects: 'Map',
    async: false,
    key,
    value,
    message,
    _run(dataset, config) {
      // Get input value from dataset
      const input = dataset.value;

      // If root type is valid, check nested types
      if (input instanceof Map) {
        // Set typed to `true` and value to empty map
        dataset.typed = true;
        dataset.value = new Map();

        // Parse schema of each map entry
        for (const [inputKey, inputValue] of input) {
          // Get dataset of key schema
          const keyDataset = this.key._run(
            { typed: false, value: inputKey },
            config
          );

          // If there are issues, capture them
          if (keyDataset.issues) {
            // Create map path item
            const pathItem: MapPathItem = {
              type: 'map',
              origin: 'key',
              input,
              key: inputKey,
              value: inputValue,
            };

            // Add modified item dataset issues to issues
            for (const issue of keyDataset.issues) {
              if (issue.path) {
                issue.path.unshift(pathItem);
              } else {
                // @ts-expect-error
                issue.path = [pathItem];
              }
              // @ts-expect-error
              dataset.issues?.push(issue);
            }
            if (!dataset.issues) {
              // @ts-expect-error
              dataset.issues = keyDataset.issues;
            }

            // If necessary, abort early
            if (config.abortEarly) {
              dataset.typed = false;
              break;
            }
          }

          // Get dataset of value schema
          const valueDataset = this.value._run(
            { typed: false, value: inputValue },
            config
          );

          // If there are issues, capture them
          if (valueDataset.issues) {
            // Create map path item
            const pathItem: MapPathItem = {
              type: 'map',
              origin: 'value',
              input,
              key: inputKey,
              value: inputValue,
            };

            // Add modified item dataset issues to issues
            for (const issue of valueDataset.issues) {
              if (issue.path) {
                issue.path.unshift(pathItem);
              } else {
                // @ts-expect-error
                issue.path = [pathItem];
              }
              // @ts-expect-error
              dataset.issues?.push(issue);
            }
            if (!dataset.issues) {
              // @ts-expect-error
              dataset.issues = valueDataset.issues;
            }

            // If necessary, abort early
            if (config.abortEarly) {
              dataset.typed = false;
              break;
            }
          }

          // If not typed, map typed to `false`
          if (!keyDataset.typed || !valueDataset.typed) {
            dataset.typed = false;
          }

          // Add value to dataset
          // @ts-expect-error
          dataset.value.set(keyDataset.value, valueDataset.value);
        }

        // Otherwise, add map issue
      } else {
        _addIssue(this, 'type', dataset, config);
      }

      // Return output dataset
      return dataset as Dataset<
        Map<unknown, unknown>,
        MapIssue | BaseIssue<unknown>
      >;
    },
  };
}

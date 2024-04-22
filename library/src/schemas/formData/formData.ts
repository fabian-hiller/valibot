import type {
  BaseIssue,
  BaseSchema,
  Config,
  Dataset,
  ErrorMessage,
  InferIssue,
  InferObjectInput,
  InferObjectIssue,
  InferObjectOutput,
  InferOutput,
  IssuePathItem,
  ObjectEntries,
} from '../../types/index.ts';
import { _addIssue } from '../../utils/index.ts';
import type { ArrayIssue, ArraySchema } from '../array/index.ts';
import { array } from '../array/index.ts';
import type { ObjectIssue, ObjectSchema } from '../object/index.ts';
import { object } from '../object/index.ts';
import type { FormDataIssue, FormDataPathItem } from './types.ts';

// Create object entries cache
const cache: Map<
  ObjectEntries,
  [string, BaseSchema<unknown, unknown, BaseIssue<unknown>>][]
> = new Map();

/**
 * FormData schema type.
 */
export interface FormDataSchema<
  TEntries extends ObjectEntries,
  TMessage extends ErrorMessage<FormDataIssue> | undefined,
> extends BaseSchema<
    InferObjectInput<TEntries, undefined>,
    InferObjectOutput<TEntries, undefined>,
    FormDataIssue | InferObjectIssue<TEntries, undefined>
  > {
  /**
   * The schema type.
   */
  readonly type: 'formData';
  /**
   * The expected property.
   */
  readonly expects: 'FormData';
  /**
   * The object entries.
   */
  readonly entries: TEntries | BaseSchema<unknown, unknown, BaseIssue<unknown>>;
  /**
   * The error message.
   */
  readonly message: TMessage;
}

/**
 * Adds modified dataset issues to issues.
 *
 * @param toDataset The dataset to add issues to.
 * @param fromDataset The dataset to copy issues from.
 * @param pathItem The path item.
 * @param config The configuration.
 *
 * @returns Whether to abort early.
 *
 * @internal
 */
function _addIssuePathItem<TIssue extends BaseIssue<unknown>>(
  toDataset: Dataset<unknown, TIssue>,
  fromDataset: Dataset<unknown, TIssue>,
  pathItem: IssuePathItem,
  config: Config<TIssue>
) {
  // Add modified item dataset issues to issues
  for (const issue of fromDataset.issues!) {
    if (issue.path) {
      issue.path.unshift(pathItem);
    } else {
      // @ts-expect-error
      issue.path = [pathItem];
    }
    toDataset.issues?.push(issue);
  }

  // Add issues to dataset if necessary
  if (!toDataset.issues) {
    toDataset.issues = fromDataset.issues;
  }

  // If necessary, abort early
  if (config.abortEarly) {
    toDataset.typed = false;
    return true;
  }

  return false;
}

/**
 * Parses FormData entry value based on schema.
 *
 * @param schema The schema.
 * @param value The FormData entry value.
 *
 * @returns The parsed value.
 *
 * @internal
 */
function _formDataEntry(
  schema: BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  value: FormDataEntryValue | null
) {
  // Value is undefined when FormData entry is not present
  if (value === null) return undefined;

  // Value is null when FormData entry is an empty string
  if (value === '') return null;

  // Parse value based on schema type
  switch (schema.type) {
    case 'boolean': {
      // Parse boolean value
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    }
    case 'date': {
      // Parse date value
      const number = Number(value);
      if (!isNaN(number)) return new Date(number);
      const date = new Date(String(value));
      return isNaN(date.getTime()) ? value : date;
    }
    case 'number': {
      // Parse number value
      const number = Number(value);
      return isNaN(number) ? value : number;
    }
    default: {
      // Return value as is
      return value;
    }
  }
}

/**
 * Parses FormData entries based on schema.
 *
 * @param context A schema context.
 * @param dataset The input dataset.
 * @param config The configuration.
 * @param data The FormData object.
 * @param entry The FromData entry key.
 *
 * @returns The output dataset.
 *
 * @internal
 */
function _formDataset<
  const TContext extends BaseSchema<unknown, unknown, BaseIssue<unknown>>,
>(
  context: TContext & {
    wrapped?: BaseSchema<unknown, unknown, BaseIssue<unknown>>;
  },
  dataset: Dataset<unknown, never>,
  config: Config<InferIssue<TContext>>,
  data: FormData,
  entry: string
): Dataset<InferOutput<TContext>, InferIssue<TContext>> {
  // Unwrap array and object schemas
  let schema = context;
  while (schema.wrapped) {
    schema = schema.wrapped as TContext;
    if (schema.type === 'array' || schema.type === 'object') {
      context = schema;
    }
  }

  // Parse schema based on type
  switch (context.type) {
    case 'array': {
      // Get array and item schemas
      const arraySchema = context as unknown as ArraySchema<
        BaseSchema<unknown, unknown, BaseIssue<unknown>>,
        ErrorMessage<ArrayIssue> | undefined
      >;
      const schema = arraySchema.item as TContext;

      // Get input value from dataset
      const input = dataset.value;

      // Set typed to true and value to empty array
      dataset.typed = true;
      dataset.value = [];

      // Get array items from FormData if present
      const items = data.getAll(entry);
      if (items.length > 0) {
        // Parse schema of each array item
        for (let key = 0; key < items.length; key++) {
          const value = _formDataEntry(schema, items[key]);
          const entryDataset = schema._run({ typed: false, value }, config);

          // Add item to dataset
          // @ts-expect-error
          dataset.value.push(entryDataset.value);

          // If there are issues, capture them
          if (entryDataset.issues) {
            // Create array path item
            const pathItem: FormDataPathItem = {
              type: 'formData',
              origin: 'value',
              input,
              key: entry,
              value: entryDataset.value,
            };

            // Add modified entry dataset issues to issues and abort early if necessary
            if (_addIssuePathItem(dataset, entryDataset, pathItem, config)) {
              return dataset;
            }
          }

          // If not typed, set typed to false
          if (!entryDataset.typed) {
            dataset.typed = false;
          }
        }

        // Otherwise, extract nested FormData entries
      } else {
        for (let key = 0; ; key++) {
          const entryKey = `${entry}.${key}`;
          const entryDataset = _formDataset(
            schema,
            { typed: false, value: input },
            config,
            data,
            entryKey
          );

          // Add item to dataset
          if (entryDataset.value === undefined) {
            break;
          } else {
            // Add item to dataset
            // @ts-expect-error
            dataset.value.push(entryDataset.value);
          }

          // If there are issues, capture them
          if (entryDataset.issues) {
            // Create array path item
            const pathItem: FormDataPathItem = {
              type: 'formData',
              origin: 'value',
              input,
              key: entryKey,
              value: entryDataset.value,
            };

            // Add modified entry dataset issues to issues and abort early if necessary
            if (_addIssuePathItem(dataset, entryDataset, pathItem, config)) {
              break;
            }
          }

          // If not typed, set typed to false
          if (!entryDataset.typed) {
            dataset.typed = false;
          }
        }
      }

      // Add rest issues if necessary
      if (!(dataset.value as unknown[])?.length) {
        dataset.value = undefined;
        _addIssue<typeof arraySchema>(
          arraySchema,
          array,
          'type',
          dataset,
          config
        );
      }

      // Return output dataset
      return dataset;
    }
    case 'object': {
      // Get object schema
      const objectSchema = context as unknown as ObjectSchema<
        ObjectEntries,
        ErrorMessage<ObjectIssue> | undefined
      >;

      // Get input value from dataset
      const input = dataset.value;

      // Set typed to true and value to blank object
      dataset.typed = true;
      dataset.value = {};

      // Cache object entries lazy
      const entries =
        cache.get(objectSchema.entries) ??
        cache
          .set(objectSchema.entries, Object.entries(objectSchema.entries))
          .get(objectSchema.entries)!;

      // Parse schema of each entry
      let total = 0;
      for (const [key, schema] of entries) {
        const entryKey = entry ? `${entry}.${key}` : key;
        const entryDataset = _formDataset(
          schema as TContext,
          { typed: false, value: input },
          config,
          data,
          entryKey
        );

        // Add entry to dataset if necessary
        if (entryDataset.value !== undefined) {
          // @ts-expect-error
          dataset.value[key] = entryDataset.value;
          total++;
        }

        // If there are issues, capture them
        if (entryDataset.issues) {
          // Create formData path item
          const pathItem: FormDataPathItem = {
            type: 'formData',
            origin: 'value',
            input,
            key: entryKey,
            value: entryDataset.value,
          };

          // Add modified entry dataset issues to issues and abort early if necessary
          if (_addIssuePathItem(dataset, entryDataset, pathItem, config)) {
            break;
          }
        }

        // If not typed, set typed to false
        if (!entryDataset.typed) {
          dataset.typed = false;
        }
      }

      // Add rest issues if necessary
      if (!total && entry) {
        dataset.value = undefined;
        _addIssue<typeof objectSchema>(
          objectSchema,
          object,
          'type',
          dataset,
          config
        );
      }

      // Return output dataset
      return dataset;
    }
    default: {
      // Get entry value from FormData
      const value = _formDataEntry(context, data.get(entry));

      // Parse schema
      return context._run({ typed: false, value }, config);
    }
  }
}

/**
 * Creates a fromData schema.
 *
 * @param entries The object entries.
 *
 * @returns A formData schema.
 */
export function formData<const TEntries extends ObjectEntries>(
  entries: TEntries | BaseSchema<unknown, unknown, BaseIssue<unknown>>
): FormDataSchema<TEntries, undefined>;

/**
 * Creates a formData schema.
 *
 * @param entries The object entries.
 * @param message The error message.
 *
 * @returns A formData schema.
 */
export function formData<
  const TEntries extends ObjectEntries,
  const TMessage extends ErrorMessage<FormDataIssue> | undefined,
>(
  entries: TEntries | BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  message: TMessage
): FormDataSchema<TEntries, TMessage>;

export function formData(
  entries: ObjectEntries | BaseSchema<unknown, unknown, BaseIssue<unknown>>,
  message?: ErrorMessage<FormDataIssue>
): FormDataSchema<ObjectEntries, ErrorMessage<FormDataIssue> | undefined> {
  return {
    kind: 'schema',
    type: 'formData',
    expects: 'FormData',
    async: false,
    entries,
    message,
    _run(dataset, config) {
      // If root type is valid, check nested types
      if (dataset.value instanceof FormData) {
        // Set typed to true
        dataset.typed = true;

        // Create output dataset
        const context =
          this.entries.kind === 'schema'
            ? (this.entries as BaseSchema<unknown, unknown, BaseIssue<unknown>>)
            : object(this.entries as ObjectEntries);
        _formDataset(context, dataset, config, dataset.value, '');

        // Otherwise, add formData issue
      } else {
        _addIssue(this, formData, 'type', dataset, config);
      }

      // Return output dataset
      return dataset as Dataset<
        InferOutput<
          ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
        >,
        | FormDataIssue
        | InferIssue<BaseSchema<unknown, unknown, BaseIssue<unknown>>>
      >;
    },
  };
}

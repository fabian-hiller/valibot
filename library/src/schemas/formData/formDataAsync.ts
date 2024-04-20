import type {
  BaseSchemaAsync,
  ErrorMessage,
  PipeAsync,
  SchemaConfig,
  SchemaIssues,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResultAsync,
  schemaIssue,
  schemaResult,
} from '../../utils/index.ts';
import type { ArraySchemaAsync } from '../array/arrayAsync.ts';
import type {
  ObjectEntriesAsync,
  ObjectSchemaAsync,
} from '../object/objectAsync.ts';
import { objectAsync } from '../object/objectAsync.ts';
import type { ObjectOutput } from '../object/types.ts';
import type { FormDataPathItem } from './types.ts';

/**
 * FormDataAsync schema type.
 */
export interface FormDataAsyncSchema<
  TEntries extends ObjectEntriesAsync,
  TOutput = ObjectOutput<TEntries, undefined>,
> extends BaseSchemaAsync<FormData, TOutput> {
  /**
   * The schema type.
   */
  type: 'formData';
  /**
   * The object entries.
   */
  entries: TEntries | ObjectSchemaAsync<TEntries, undefined>;
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: PipeAsync<TOutput> | undefined;
}

function decodeEntry(
  schema: BaseSchemaAsync,
  value: FormDataEntryValue | null
) {
  if (value === null) return undefined;
  if (value === '') return null;
  switch (schema.type) {
    case 'boolean': {
      if (value === 'true') return true;
      if (value === 'false') return false;
      return value;
    }
    case 'date': {
      const number = Number(value);
      if (!Number.isNaN(number)) return new Date(number);
      const date = new Date(String(value));
      return Number.isNaN(date.getTime()) ? value : date;
    }
    case 'number': {
      const number = Number(value);
      return Number.isNaN(number) ? value : number;
    }
    default: {
      return value;
    }
  }
}

async function decode(
  schema: BaseSchemaAsync,
  input: FormData,
  key: string,
  config?: SchemaConfig
) {
  let typed = true;
  let issues: SchemaIssues | undefined;
  let output: any;
  switch (schema.type) {
    case 'array': {
      let arrayOutput: any[] = [];
      const arraySchema = schema as ArraySchemaAsync<BaseSchemaAsync>;
      const itemSchema = arraySchema.item;
      const items = input.getAll(key);
      if (items.length > 0) {
        arrayOutput = Array(items.length);
        await Promise.all(
          items.map(async (item, index) => {
            const value = decodeEntry(itemSchema, item);
            const result = await itemSchema._parse(value, config);
            if (issues && config?.abortEarly) throw null;
            if (result.issues) {
              if (!issues) issues = result.issues;
              if (config?.abortEarly) {
                typed = false;
                throw null;
              }
            }
            if (!result.typed) typed = false;
            if (result.output !== undefined) arrayOutput[index] = result.output;
          })
        ).catch(() => null);
      } else {
        let index = 0;
        let result;
        do {
          const arrayKey = `${key}.${index}`;
          result = await decode(itemSchema, input, arrayKey, config);
          if (result.issues) {
            if (!issues) issues = result.issues;
            if (config?.abortEarly) {
              typed = false;
              break;
            }
          }
          if (!result.typed) typed = false;
          if (result.output !== undefined) {
            arrayOutput.push(result.output);
          }
          index++;
        } while (result.output !== undefined && !result.issues);
      }
      if (arrayOutput.length === 0) {
        issues = schemaIssue(arraySchema, formDataAsync, arrayOutput, config, {
          issues,
        }).issues;
      } else {
        output = arrayOutput;
      }
      break;
    }
    case 'object': {
      let objectOutput: Record<string, any> | undefined;
      const objectSchema = schema as ObjectSchemaAsync<
        Record<string, BaseSchemaAsync>,
        undefined
      >;
      await Promise.all(
        Object.entries(objectSchema.entries).map(
          async ([objectKey, entrySchema]) => {
            const decodeKey = key ? `${key}.${objectKey}` : objectKey;
            const result = await decode(entrySchema, input, decodeKey, config);
            if (issues && config?.abortEarly) throw null;
            if (result.output !== undefined) {
              objectOutput ??= {};
              objectOutput[objectKey] = result.output;
            }
            if (result.issues) {
              const pathItem: FormDataPathItem = {
                type: 'formData',
                origin: 'value',
                input,
                key: decodeKey,
                value: result.output ?? input.get(decodeKey),
              };
              for (const issue of result.issues) {
                if (issue.path) issue.path.unshift(pathItem);
                else issue.path = [pathItem];
                issues?.push(issue);
              }
              if (!issues) issues = result.issues;
              if (config?.abortEarly) {
                typed = false;
                throw null;
              }
            }
            if (!result.typed) typed = false;
          }
        )
      ).catch(() => null);
      if (!objectOutput) {
        if (key) {
          issues = schemaIssue(
            objectSchema,
            formDataAsync,
            objectOutput,
            config,
            {
              issues,
            }
          ).issues;
        } else {
          objectOutput = {};
        }
      }
      output = objectOutput;
      break;
    }
    default: {
      const value = decodeEntry(schema, input.get(key));
      const result = await schema._parse(value, config);
      if (result.issues) issues = result.issues;
      if (!result.typed) typed = false;
      output = result.output;
    }
  }
  return { typed, output, issues };
}

/**
 * Creates a formDataAsync schema.
 *
 * @param entries The object entries.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A formDataAsync schema.
 */
export function formDataAsync<TEntries extends ObjectEntriesAsync>(
  entries: TEntries | ObjectSchemaAsync<TEntries, undefined>,
  pipe?: PipeAsync<ObjectOutput<TEntries, undefined>>
): FormDataAsyncSchema<TEntries>;

/**
 * Creates a formDataAsync schema.
 *
 * @param entries The object entries.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A formDataAsync schema.
 */
export function formDataAsync<TEntries extends ObjectEntriesAsync>(
  entries: TEntries | ObjectSchemaAsync<TEntries, undefined>,
  message?: ErrorMessage,
  pipe?: PipeAsync<ObjectOutput<TEntries, undefined>>
): FormDataAsyncSchema<TEntries>;

export function formDataAsync<TEntries extends ObjectEntriesAsync>(
  entries: TEntries | ObjectSchemaAsync<TEntries, undefined>,
  arg2?: ErrorMessage | PipeAsync<ObjectOutput<TEntries, undefined>>,
  arg3?: PipeAsync<ObjectOutput<TEntries, undefined>>
): FormDataAsyncSchema<TEntries> {
  // Get message and pipe argument
  const [message, pipe] = defaultArgs(arg2, arg3);

  // Create and return array schema
  return {
    type: 'formData',
    expects: 'FormData',
    async: true,
    entries,
    message,
    pipe,
    async _parse(input, config) {
      // If root type is valid, check nested types
      if (input instanceof FormData) {
        // Parse nested schema, decode and validate FormData against it
        const schema =
          entries.type === 'object'
            ? (entries as ObjectSchemaAsync<TEntries, undefined>)
            : objectAsync(entries as TEntries);
        const result = await decode(schema, input, '', config);

        // If output is typed, return pipe result
        if (result.typed) {
          return pipeResultAsync(
            this,
            result.output as ObjectOutput<TEntries, undefined>,
            config,
            result.issues
          );
        }

        // Otherwise, return untyped schema result
        return schemaResult(
          false,
          result.output,
          result.issues as SchemaIssues
        );
      }

      // Otherwise, return schema issue
      return schemaIssue(this, formDataAsync, input, config);
    },
  };
}

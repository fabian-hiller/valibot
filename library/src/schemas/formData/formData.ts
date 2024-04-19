import type {
  BaseSchema,
  ErrorMessage,
  Pipe,
  SchemaConfig,
  SchemaIssues,
} from '../../types/index.ts';
import {
  defaultArgs,
  pipeResult,
  schemaIssue,
  schemaResult,
} from '../../utils/index.ts';
import type { ArraySchema } from '../array/array.ts';
import {
  object,
  type ObjectEntries,
  type ObjectSchema,
} from '../object/object.ts';
import type { ObjectOutput } from '../object/types.ts';
import type { FormDataPathItem } from './types.ts';

/**
 * FormData schema type.
 */
export interface FormDataSchema<
  TEntries extends ObjectEntries,
  TOutput = ObjectOutput<TEntries, undefined>,
> extends BaseSchema<FormData, TOutput> {
  /**
   * The schema type.
   */
  type: 'formData';
  /**
   * The object entries.
   */
  entries: TEntries | ObjectSchema<TEntries, undefined>;
  /**
   * The error message.
   */
  message: ErrorMessage | undefined;
  /**
   * The validation and transformation pipeline.
   */
  pipe: Pipe<TOutput> | undefined;
}

function decodeEntry(schema: BaseSchema, value: FormDataEntryValue | null) {
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

function decode(
  schema: BaseSchema,
  input: FormData,
  key: string,
  config?: SchemaConfig
) {
  let typed = true;
  let issues: SchemaIssues | undefined;
  let output: any;
  switch (schema.type) {
    case 'array': {
      let arrayOutput: any[] | undefined;
      const itemSchema = (schema as ArraySchema<BaseSchema>).item;
      if (input.get(key) !== null) {
        arrayOutput = [];
        for (const item of input.getAll(key)) {
          const value = decodeEntry(itemSchema, item);
          const result = itemSchema._parse(value, config);
          if (result.issues) {
            if (!issues) issues = result.issues;
            if (config?.abortEarly) {
              typed = false;
              break;
            }
          }
          if (!result.typed) typed = false;
          if (result.output !== undefined) arrayOutput.push(result.output);
        }
      } else {
        let index = 0;
        let result;
        do {
          const arrayKey = `${key}.${index}`;
          result = decode(itemSchema, input, arrayKey, config);
          if (result.issues) {
            const pathItem: FormDataPathItem = {
              type: 'formData',
              origin: 'value',
              input,
              key: arrayKey,
              value: result.output ?? input.get(arrayKey),
            };
            for (const issue of result.issues) {
              if (issue.path) issue.path.unshift(pathItem);
              else issue.path = [pathItem];
              issues?.push(issue);
            }
            if (!issues) issues = result.issues;
            if (config?.abortEarly) {
              typed = false;
              break;
            }
          }
          if (!result.typed) typed = false;
          if (result.output !== undefined) {
            arrayOutput ??= [];
            arrayOutput.push(result.output);
          }
          index++;
        } while (result.output !== undefined);
      }
      output = arrayOutput;
      break;
    }
    case 'object': {
      let objectOutput: Record<string, any> | undefined;
      const objectSchema = schema as ObjectSchema<
        Record<string, BaseSchema>,
        undefined
      >;
      for (const [objectKey, entrySchema] of Object.entries(
        objectSchema.entries
      )) {
        const decodeKey = key ? `${key}.${objectKey}` : objectKey;
        const result = decode(entrySchema, input, decodeKey, config);
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
            break;
          }
        }
        if (!result.typed) typed = false;
      }
      output = objectOutput;
      break;
    }
    default: {
      const value = decodeEntry(schema, input.get(key));
      const result = schema._parse(value, config);
      if (result.issues) issues = result.issues;
      if (!result.typed) typed = false;
      output = result.output;
    }
  }
  return { typed, output, issues };
}

/**
 * Creates a formData schema.
 *
 * @param entries The object entries.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A formData schema.
 */
export function formData<TEntries extends ObjectEntries>(
  entries: TEntries | ObjectSchema<TEntries, undefined>,
  pipe?: Pipe<ObjectOutput<TEntries, undefined>>
): FormDataSchema<TEntries>;

/**
 * Creates a formData schema.
 *
 * @param entries The object entries.
 * @param message The error message.
 * @param pipe A validation and transformation pipe.
 *
 * @returns A formData schema.
 */
export function formData<TEntries extends ObjectEntries>(
  entries: TEntries | ObjectSchema<TEntries, undefined>,
  message?: ErrorMessage,
  pipe?: Pipe<ObjectOutput<TEntries, undefined>>
): FormDataSchema<TEntries>;

export function formData<TEntries extends ObjectEntries>(
  entries: TEntries | ObjectSchema<TEntries, undefined>,
  arg2?: ErrorMessage | Pipe<ObjectOutput<TEntries, undefined>>,
  arg3?: Pipe<ObjectOutput<TEntries, undefined>>
): FormDataSchema<TEntries> {
  // Get message and pipe argument
  const [message, pipe] = defaultArgs(arg2, arg3);

  // Create and return array schema
  return {
    type: 'formData',
    expects: 'FormData',
    async: false,
    entries,
    message,
    pipe,
    _parse(input, config) {
      // If root type is valid, check nested types
      if (input instanceof FormData) {
        // Parse nested schema, decode and validate FormData against it
        const schema =
          entries.type === 'object'
            ? (entries as ObjectSchema<TEntries, undefined>)
            : object(entries as TEntries);
        const result = decode(schema, input, '', config);

        // If output is typed, return pipe result
        if (result.typed) {
          return pipeResult(
            this,
            (result.output || {}) as ObjectOutput<TEntries, undefined>,
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
      return schemaIssue(this, formData, input, config);
    },
  };
}

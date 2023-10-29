import type { ObjectSchema, ObjectSchemaAsync } from '../../schemas/index.ts';

/**
 * Merges schema objects types.
 */
export type MergeSchemaObjects<
  TObjectSchemas extends (
    | ObjectSchema<any, any>
    | ObjectSchemaAsync<any, any>
  )[]
> = TObjectSchemas extends [infer TFirstObjectSchema]
  ? TFirstObjectSchema extends
      | ObjectSchema<any, any>
      | ObjectSchemaAsync<any, any>
    ? TFirstObjectSchema['object']['entries']
    : never
  : TObjectSchemas extends [
      infer TFirstObjectSchema,
      ...infer TRestObjectSchemas
    ]
  ? TFirstObjectSchema extends
      | ObjectSchema<any, any>
      | ObjectSchemaAsync<any, any>
    ? TRestObjectSchemas extends (
        | ObjectSchema<any, any>
        | ObjectSchemaAsync<any, any>
      )[]
      ? {
          [TKey in Exclude<
            keyof TFirstObjectSchema['object']['entries'],
            keyof MergeSchemaObjects<TRestObjectSchemas>
          >]: TFirstObjectSchema['object']['entries'][TKey];
        } & MergeSchemaObjects<TRestObjectSchemas>
      : never
    : never
  : never;

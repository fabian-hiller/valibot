import type { ObjectSchema, ObjectSchemaAsync } from '../../schemas/index.ts';

/**
 * Merges schema objects types.
 */
export type MergeSchemaObjects<
  TObjectSchemas extends (ObjectSchema<any> | ObjectSchemaAsync<any>)[]
> = TObjectSchemas extends [infer TFirstObjectSchema]
  ? TFirstObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>
    ? TFirstObjectSchema['object']
    : never
  : TObjectSchemas extends [
      infer TFirstObjectSchema,
      ...infer TRestObjectSchemas
    ]
  ? TFirstObjectSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>
    ? TRestObjectSchemas extends (ObjectSchema<any> | ObjectSchemaAsync<any>)[]
      ? {
          [TKey in Exclude<
            keyof TFirstObjectSchema['object'],
            keyof MergeSchemaObjects<TRestObjectSchemas>
          >]: TFirstObjectSchema['object'][TKey];
        } & MergeSchemaObjects<TRestObjectSchemas>
      : never
    : never
  : never;

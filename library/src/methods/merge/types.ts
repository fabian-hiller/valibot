import type { ObjectSchema, ObjectSchemaAsync } from '../../schemas/index.ts';

/**
 * Merges objects types.
 */
export type MergeObjects<
  TSchemas extends (ObjectSchema<any, any> | ObjectSchemaAsync<any, any>)[],
> = TSchemas extends [infer TFirstSchema]
  ? TFirstSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>
    ? TFirstSchema['entries']
    : never
  : TSchemas extends [infer TFirstSchema, ...infer TRestSchemas]
    ? TFirstSchema extends ObjectSchema<any, any> | ObjectSchemaAsync<any, any>
      ? TRestSchemas extends (
          | ObjectSchema<any, any>
          | ObjectSchemaAsync<any, any>
        )[]
        ? {
            [TKey in Exclude<
              keyof TFirstSchema['entries'],
              keyof MergeObjects<TRestSchemas>
            >]: TFirstSchema['entries'][TKey];
          } & MergeObjects<TRestSchemas>
        : never
      : never
    : never;

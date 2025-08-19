import {
  type LooseObjectIssue,
  type LooseObjectSchema,
  nullish,
  number,
  object,
  type ObjectIssue,
  type ObjectSchema,
  type ObjectWithRestIssue,
  type ObjectWithRestSchema,
  optional,
  type StrictObjectIssue,
  type StrictObjectSchema,
  string,
} from '../../schemas/index.ts';
import {
  type ApplyHKT,
  type BaseHKT,
  type BaseIssue,
  type BaseSchema,
  type ErrorMessage,
  type HKTImplementation,
  isHkt,
  type ObjectEntries,
  type PartialApplyHKT,
  type Prettify,
  type SchemaWithoutPipe,
} from '../../types/index.ts';

/**
 * Schema type.
 */
type Schema = SchemaWithoutPipe<
  | LooseObjectSchema<ObjectEntries, ErrorMessage<LooseObjectIssue> | undefined>
  | ObjectSchema<ObjectEntries, ErrorMessage<ObjectIssue> | undefined>
  | ObjectWithRestSchema<
      ObjectEntries,
      BaseSchema<unknown, unknown, BaseIssue<unknown>>,
      ErrorMessage<ObjectWithRestIssue> | undefined
    >
  | StrictObjectSchema<
      ObjectEntries,
      ErrorMessage<StrictObjectIssue> | undefined
    >
>;

export interface SchemaMapperHKT extends BaseHKT {
  argConstraint: [wrapped: BaseSchema<unknown, unknown, BaseIssue<unknown>>];
  result: BaseSchema<unknown, unknown, BaseIssue<unknown>>;

  wrapped: this['args'][0];
}

export interface IdentitySchemaMapperHKT extends SchemaMapperHKT {
  result: this['wrapped'];
}

type InferMapperIssue<
  TMapper extends SchemaMapperHKT,
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> = BaseSchema<
    0,
    0,
    BaseIssue<0>
  >,
> =
  PartialApplyHKT<TMapper, [TSchema]> extends {
    issue: infer Issue extends BaseIssue<unknown>;
  }
    ? Issue
    : never;

export type EntryMapOverrides<TEntries extends ObjectEntries> = {
  [TKey in keyof TEntries]?: (
    schema: TEntries[TKey]
  ) => SchemaMapperHKT['result'];
};

export type MappedEntries<
  TEntries extends ObjectEntries,
  TDefaultMapper extends SchemaMapperHKT = IdentitySchemaMapperHKT,
  TOverrides extends EntryMapOverrides<TEntries> = Record<never, never>,
> = Prettify<{
  [TKey in keyof TEntries]: TOverrides[TKey] extends HKTImplementation<SchemaMapperHKT>
    ? ApplyHKT<Extract<ReturnType<TOverrides[TKey]>, BaseHKT>, [TEntries[TKey]]>
    : TOverrides[TKey] extends ((
          schema: TEntries[TKey]
        ) => infer Result extends SchemaMapperHKT['result'])
      ? Result
      : ApplyHKT<TDefaultMapper, [TEntries[TKey]]>;
}>;

declare function mapEntries<
  TSchema extends Schema,
  TMapper extends SchemaMapperHKT,
>(
  schema: TSchema,
  mapper: HKTImplementation<TMapper>
): MappedEntries<TSchema['entries'], TMapper>;
declare function mapEntries<
  TSchema extends Schema,
  TOverrides extends EntryMapOverrides<TSchema['entries']>,
>(
  schema: TSchema,
  map: TOverrides
): MappedEntries<TSchema['entries'], IdentitySchemaMapperHKT, TOverrides>;
declare function mapEntries<
  TSchema extends Schema,
  TDefaultMapper extends SchemaMapperHKT,
  TOverrides extends EntryMapOverrides<TSchema['entries']>,
>(
  schema: TSchema,
  mapper: HKTImplementation<TDefaultMapper>,
  overrides: TOverrides
): MappedEntries<TSchema['entries'], TDefaultMapper, TOverrides>;

const schema = object({ name: string(), age: number(), email: string() });

const test = mapEntries(
  schema,
  Object.assign(optional, { [isHkt]: true as const }),
  {
    name: (schema) => nullish(schema, 'foo'),
  }
);

/*
// make all optional
v.mapEntries(Schema, v.optional)
// manually specify each
v.mapEntries(Schema, {
  name: v.nullable,
  age: v.optional,
  email: (schema) => v.nullish(schema, 'default_value'),
})
// which would also allow the below (if we modified v.entriesFromList a little)
v.mapEntries(Schema, v.entriesFromList(["name", "age"], v.optional))
// maybe even allow
v.mapEntries(Schema, v.optional, { name: v.nullable }) // blanket with overrides
// maybe? seems like footgun
v.mapEntries(Schema, (schema) => v.optional(schema, 'default_value'))
*/

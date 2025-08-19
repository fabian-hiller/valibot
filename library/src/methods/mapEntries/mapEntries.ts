import type {
  LooseObjectIssue,
  LooseObjectSchema,
  ObjectIssue,
  ObjectSchema,
  ObjectWithRestIssue,
  ObjectWithRestSchema,
  StrictObjectIssue,
  StrictObjectSchema,
} from '../../schemas/index.ts';
import type {
  BaseHKT,
  BaseIssue,
  BaseSchema,
  ErrorMessage,
  ObjectEntries,
  PartialApplyHKT,
  SchemaWithoutPipe,
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

type InferModifierIssue<
  TModifier extends SchemaMapperHKT,
  TSchema extends BaseSchema<unknown, unknown, BaseIssue<unknown>> = BaseSchema<
    0,
    0,
    BaseIssue<0>
  >,
> =
  PartialApplyHKT<TModifier, [TSchema]> extends {
    issue: infer Issue extends BaseIssue<unknown>;
  }
    ? Issue
    : never;

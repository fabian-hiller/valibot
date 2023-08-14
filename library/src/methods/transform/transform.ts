import type {
  AnySchema,
  ArraySchema,
  BigintSchema,
  BlobSchema,
  BooleanSchema,
  DateSchema,
  EnumSchema,
  InstanceSchema,
  LiteralSchema,
  MapSchema,
  NanSchema,
  NativeEnumSchema,
  NeverSchema,
  NonNullableSchema,
  NonNullishSchema,
  NonOptionalSchema,
  NullSchema,
  NullableSchema,
  NullishSchema,
  NumberSchema,
  ObjectSchema,
  OptionalSchema,
  RecordSchema,
  RecursiveSchema,
  SetSchema,
  SpecialSchema,
  StringSchema,
  SymbolSchema,
  TupleSchema,
  UndefinedSchema,
  UnionSchema,
  UnknownSchema,
  VoidSchema,
} from '../../schemas/index.ts';
import type { BaseSchema, Input, Output } from '../../types.ts';

export function transform<TSchema extends AnySchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): AnySchema<TOutput>;

export function transform<TSchema extends ArraySchema<any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): ArraySchema<TSchema['array']['item'], TOutput>;

export function transform<TSchema extends BigintSchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): BigintSchema<TOutput>;

export function transform<TSchema extends BooleanSchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): BooleanSchema<TOutput>;

export function transform<TSchema extends BlobSchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): BlobSchema<TOutput>;

export function transform<TSchema extends DateSchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): DateSchema<TOutput>;

export function transform<TSchema extends EnumSchema<any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): EnumSchema<TSchema['enum'], TOutput>;

export function transform<TSchema extends InstanceSchema<any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): InstanceSchema<TSchema['class'], TOutput>;

export function transform<TSchema extends LiteralSchema<any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): LiteralSchema<TSchema['literal'], TOutput>;

export function transform<TSchema extends MapSchema<any, any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): MapSchema<TSchema['map']['key'], TSchema['map']['value'], TOutput>;

export function transform<TSchema extends NanSchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): NanSchema<TOutput>;

export function transform<TSchema extends NativeEnumSchema<any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): NativeEnumSchema<TSchema['nativeEnum'], TOutput>;

export function transform<TSchema extends NeverSchema>(
  schema: TSchema,
  action: (value: Output<TSchema>) => never
): NeverSchema;

export function transform<TSchema extends NonNullableSchema<any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): NonNullableSchema<TSchema['wrapped'], TOutput>;

export function transform<TSchema extends NonNullishSchema<any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): NonNullishSchema<TSchema['wrapped'], TOutput>;

export function transform<TSchema extends NonOptionalSchema<any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): NonOptionalSchema<TSchema['wrapped'], TOutput>;

export function transform<TSchema extends NullSchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): NullSchema<TOutput>;

export function transform<TSchema extends NullableSchema<any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): NullableSchema<TSchema['wrapped'], TOutput>;

export function transform<TSchema extends NullishSchema<any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): NullishSchema<TSchema['wrapped'], TOutput>;

export function transform<TSchema extends NumberSchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): NumberSchema<TOutput>;

export function transform<TSchema extends ObjectSchema<any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): ObjectSchema<TSchema['object'], TOutput>;

export function transform<TSchema extends OptionalSchema<any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): OptionalSchema<TSchema['wrapped'], TOutput>;

export function transform<TSchema extends RecordSchema<any, any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): RecordSchema<TSchema['record']['key'], TSchema['record']['value'], TOutput>;

export function transform<TSchema extends RecursiveSchema<any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): RecursiveSchema<TSchema['getter'], TOutput>;

export function transform<TSchema extends SetSchema<any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): SetSchema<TSchema['set']['value'], TOutput>;

export function transform<TSchema extends SpecialSchema<any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): SpecialSchema<Input<TSchema>, TOutput>;

export function transform<TSchema extends StringSchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): StringSchema<TOutput>;

export function transform<TSchema extends SymbolSchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): SymbolSchema<TOutput>;

export function transform<TSchema extends TupleSchema<any, any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): TupleSchema<TSchema['tuple']['items'], TSchema['tuple']['rest'], TOutput>;

export function transform<TSchema extends UndefinedSchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): UndefinedSchema<TOutput>;

export function transform<TSchema extends UnionSchema<any>, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): UnionSchema<TSchema['union'], TOutput>;

export function transform<TSchema extends UnknownSchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): UnknownSchema<TOutput>;

export function transform<TSchema extends VoidSchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): VoidSchema<TOutput>;

/**
 * Adds a transformation step to a schema, which is executed at the end of
 * parsing and can change the output type.
 *
 * @param schema The schema to be used.
 * @param action The transformation action.
 *
 * @returns A transformed schema.
 */
export function transform<TSchema extends BaseSchema, TOutput>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput
): BaseSchema<Input<TSchema>, TOutput> {
  return {
    ...schema,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    _parse(input, info) {
      const result = schema._parse(input, info);
      return result.issues ? result : { output: action(result.output) };
    },
  };
}

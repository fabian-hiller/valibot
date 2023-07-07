import type {
  AnySchema,
  AnySchemaAsync,
  ArraySchema,
  ArraySchemaAsync,
  BigintSchema,
  BigintSchemaAsync,
  BooleanSchema,
  BooleanSchemaAsync,
  DateSchema,
  DateSchemaAsync,
  EnumSchema,
  EnumSchemaAsync,
  LiteralSchema,
  LiteralSchemaAsync,
  MapSchema,
  MapSchemaAsync,
  NanSchema,
  NanSchemaAsync,
  NativeEnumSchema,
  NativeEnumSchemaAsync,
  NeverSchema,
  NeverSchemaAsync,
  NonNullableSchema,
  NonNullableSchemaAsync,
  NonNullishSchema,
  NonNullishSchemaAsync,
  NonOptionalSchema,
  NonOptionalSchemaAsync,
  NullSchema,
  NullSchemaAsync,
  NullableSchema,
  NullableSchemaAsync,
  NullishSchema,
  NullishSchemaAsync,
  NumberSchema,
  NumberSchemaAsync,
  ObjectSchema,
  ObjectSchemaAsync,
  OptionalSchema,
  OptionalSchemaAsync,
  RecordSchema,
  RecordSchemaAsync,
  RecursiveSchema,
  RecursiveSchemaAsync,
  SetSchema,
  SetSchemaAsync,
  StringSchema,
  StringSchemaAsync,
  SymbolSchema,
  SymbolSchemaAsync,
  TupleSchema,
  TupleSchemaAsync,
  UndefinedSchema,
  UndefinedSchemaAsync,
  UnionSchema,
  UnionSchemaAsync,
  UnknownSchema,
  UnknownSchemaAsync,
  VoidSchema,
  VoidSchemaAsync,
} from '../schemas';
import type { BaseSchema, BaseSchemaAsync, Input, Output } from '../types';

export function transformAsync<
  TSchema extends AnySchema | AnySchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): AnySchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends ArraySchema<any> | ArraySchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): ArraySchemaAsync<TSchema['array']['item'], TOutput>;

export function transformAsync<
  TSchema extends BigintSchema | BigintSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): BigintSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends BooleanSchema | BooleanSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): BooleanSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends DateSchema | DateSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): DateSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends EnumSchema<any> | EnumSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): EnumSchemaAsync<TSchema['enum'], TOutput>;

export function transformAsync<
  TSchema extends LiteralSchema<any> | LiteralSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): LiteralSchemaAsync<TSchema['literal'], TOutput>;

export function transformAsync<
  TSchema extends MapSchema<any, any> | MapSchemaAsync<any, any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): MapSchemaAsync<TSchema['map']['key'], TSchema['map']['value'], TOutput>;

export function transformAsync<
  TSchema extends NanSchema | NanSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): NanSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends NativeEnumSchema<any> | NativeEnumSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): NativeEnumSchemaAsync<TSchema['nativeEnum'], TOutput>;

export function transformAsync<TSchema extends NeverSchema | NeverSchemaAsync>(
  schema: TSchema,
  action: (value: Output<TSchema>) => never
): NeverSchemaAsync;

export function transformAsync<
  TSchema extends NonNullableSchema<any> | NonNullableSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): NonNullableSchemaAsync<TSchema['wrapped'], TOutput>;

export function transformAsync<
  TSchema extends NonNullishSchema<any> | NonNullishSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): NonNullishSchemaAsync<TSchema['wrapped'], TOutput>;

export function transformAsync<
  TSchema extends NonOptionalSchema<any> | NonOptionalSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): NonOptionalSchemaAsync<TSchema['wrapped'], TOutput>;

export function transformAsync<
  TSchema extends NullSchema | NullSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): NullSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends NullableSchema<any> | NullableSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): NullableSchemaAsync<TSchema['wrapped'], TOutput>;

export function transformAsync<
  TSchema extends NullishSchema<any> | NullishSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): NullishSchemaAsync<TSchema['wrapped'], TOutput>;

export function transformAsync<
  TSchema extends NumberSchema | NumberSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): NumberSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): ObjectSchemaAsync<TSchema['object'], TOutput>;

export function transformAsync<
  TSchema extends OptionalSchema<any> | OptionalSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): OptionalSchemaAsync<TSchema['wrapped'], TOutput>;

export function transformAsync<
  TSchema extends RecordSchema<any, any> | RecordSchemaAsync<any, any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): RecordSchemaAsync<
  TSchema['record']['key'],
  TSchema['record']['value'],
  TOutput
>;

export function transformAsync<
  TSchema extends RecursiveSchema<any> | RecursiveSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): RecursiveSchemaAsync<TSchema['getter'], TOutput>;

export function transformAsync<
  TSchema extends SetSchema<any> | SetSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): SetSchemaAsync<TSchema['set']['value'], TOutput>;

export function transformAsync<
  TSchema extends StringSchema | StringSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): StringSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends SymbolSchema | SymbolSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): SymbolSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends TupleSchema<any, any> | TupleSchemaAsync<any, any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): TupleSchemaAsync<
  TSchema['tuple']['items'],
  TSchema['tuple']['rest'],
  TOutput
>;

export function transformAsync<
  TSchema extends UndefinedSchema | UndefinedSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): UndefinedSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends UnionSchema<any> | UnionSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): UnionSchemaAsync<TSchema['union'], TOutput>;

export function transformAsync<
  TSchema extends UnknownSchema | UnknownSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): UnknownSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends VoidSchema | VoidSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): VoidSchemaAsync<TOutput>;

/**
 * Adds an async transformation step to a schema, which is executed at the end
 * of parsing and can change the output type.
 *
 * @param schema The scheme to be used.
 * @param action The transformation action.
 *
 * @returns A transformed schema.
 */
export function transformAsync<
  TSchema extends BaseSchema | BaseSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>
): BaseSchemaAsync<Input<TSchema>, TOutput> {
  return {
    ...schema,

    /**
     * Whether it's async.
     */
    async: true,

    /**
     * Parses unknown input based on its schema.
     *
     * @param input The input to be parsed.
     * @param info The parse info.
     *
     * @returns The parsed output.
     */
    async parse(input, info) {
      return action(await schema.parse(input, info));
    },
  };
}

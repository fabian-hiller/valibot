import type {
  AnySchema,
  AnySchemaAsync,
  ArraySchema,
  ArraySchemaAsync,
  BigintSchema,
  BigintSchemaAsync,
  BlobSchema,
  BlobSchemaAsync,
  BooleanSchema,
  BooleanSchemaAsync,
  DateSchema,
  DateSchemaAsync,
  EnumSchema,
  EnumSchemaAsync,
  InstanceSchema,
  InstanceSchemaAsync,
  IntersectionSchema,
  IntersectionSchemaAsync,
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
  SpecialSchema,
  SpecialSchemaAsync,
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
} from '../../schemas/index.ts';
import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
  PipeAsync,
} from '../../types.ts';
import { executePipeAsync } from '../../utils/index.ts';

export function transformAsync<
  TSchema extends AnySchema | AnySchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): AnySchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends ArraySchema<any> | ArraySchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): ArraySchemaAsync<TSchema['array']['item'], TOutput>;

export function transformAsync<
  TSchema extends BigintSchema | BigintSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): BigintSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends BooleanSchema | BooleanSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): BooleanSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends BlobSchema | BlobSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): BlobSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends DateSchema | DateSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): DateSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends EnumSchema<any> | EnumSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): EnumSchemaAsync<TSchema['enum'], TOutput>;

export function transformAsync<
  TSchema extends InstanceSchema<any> | InstanceSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): InstanceSchemaAsync<TSchema['class'], TOutput>;

export function transformAsync<
  TSchema extends IntersectionSchema<any> | IntersectionSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): IntersectionSchemaAsync<TSchema['intersection'], TOutput>;

export function transformAsync<
  TSchema extends LiteralSchema<any> | LiteralSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): LiteralSchemaAsync<TSchema['literal'], TOutput>;

export function transformAsync<
  TSchema extends MapSchema<any, any> | MapSchemaAsync<any, any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): MapSchemaAsync<TSchema['map']['key'], TSchema['map']['value'], TOutput>;

export function transformAsync<
  TSchema extends NanSchema | NanSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): NanSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends NativeEnumSchema<any> | NativeEnumSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
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
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): NonNullableSchemaAsync<TSchema['wrapped'], TOutput>;

export function transformAsync<
  TSchema extends NonNullishSchema<any> | NonNullishSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): NonNullishSchemaAsync<TSchema['wrapped'], TOutput>;

export function transformAsync<
  TSchema extends NonOptionalSchema<any> | NonOptionalSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): NonOptionalSchemaAsync<TSchema['wrapped'], TOutput>;

export function transformAsync<
  TSchema extends NullSchema | NullSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): NullSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends NullableSchema<any, any> | NullableSchemaAsync<any, any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): NullableSchemaAsync<TSchema['wrapped'], TSchema['default'], TOutput>;

export function transformAsync<
  TSchema extends NullishSchema<any, any> | NullishSchemaAsync<any, any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): NullishSchemaAsync<TSchema['wrapped'], TSchema['default'], TOutput>;

export function transformAsync<
  TSchema extends NumberSchema | NumberSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): NumberSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends ObjectSchema<any> | ObjectSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): ObjectSchemaAsync<TSchema['object'], TOutput>;

export function transformAsync<
  TSchema extends OptionalSchema<any, any> | OptionalSchemaAsync<any, any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): OptionalSchemaAsync<TSchema['wrapped'], TSchema['default'], TOutput>;

export function transformAsync<
  TSchema extends RecordSchema<any, any> | RecordSchemaAsync<any, any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
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
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): RecursiveSchemaAsync<TSchema['getter'], TOutput>;

export function transformAsync<
  TSchema extends SetSchema<any> | SetSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): SetSchemaAsync<TSchema['set']['value'], TOutput>;

export function transformAsync<
  TSchema extends SpecialSchema<any> | SpecialSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): SpecialSchemaAsync<Input<TSchema>, TOutput>;

export function transformAsync<
  TSchema extends StringSchema | StringSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): StringSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends SymbolSchema | SymbolSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): SymbolSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends TupleSchema<any, any> | TupleSchemaAsync<any, any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
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
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): UndefinedSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends UnionSchema<any> | UnionSchemaAsync<any>,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): UnionSchemaAsync<TSchema['union'], TOutput>;

export function transformAsync<
  TSchema extends UnknownSchema | UnknownSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): UnknownSchemaAsync<TOutput>;

export function transformAsync<
  TSchema extends VoidSchema | VoidSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
): VoidSchemaAsync<TOutput>;

/**
 * Adds an async transformation step to a schema, which is executed at the end
 * of parsing and can change the output type.
 *
 * @param schema The schema to be used.
 * @param action The transformation action.
 * @param pipe A validation pipe.
 *
 * @returns A transformed schema.
 */
export function transformAsync<
  TSchema extends BaseSchema | BaseSchemaAsync,
  TOutput
>(
  schema: TSchema,
  action: (value: Output<TSchema>) => TOutput | Promise<TOutput>,
  pipe?: PipeAsync<TOutput>
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
    async _parse(input, info) {
      // Parse input with schema
      const result = await schema._parse(input, info);

      // If there are issues, return them
      if (result.issues) {
        return result;
      }

      // Otherwise, transform output
      const output = await action(result.output);

      // And return pipe result
      return executePipeAsync(output, pipe, info, typeof output);
    },
  };
}

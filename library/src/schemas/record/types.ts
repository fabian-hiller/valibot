import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
  ResolveObject,
} from '../../types.ts';
import type { EnumSchema, EnumSchemaAsync } from '../enumType/index.ts';
import type {
  NativeEnumSchema,
  NativeEnumSchemaAsync,
} from '../nativeEnum/index.ts';
import type { RecordKey } from './record.ts';
import type { RecordKeyAsync } from './recordAsync.ts';

/**
 * Record path item type.
 */
export type RecordPathItem = {
  schema: 'record';
  input: Record<string | number | symbol, any>;
  key: string | number | symbol;
  value: any;
};

/**
 * Any enum schema type.
 */
type AnyEnumSchema =
  | EnumSchema<any>
  | EnumSchemaAsync<any>
  | NativeEnumSchema<any>
  | NativeEnumSchemaAsync<any>;

/**
 * Record input inference type.
 */
export type RecordInput<
  TRecordKey extends RecordKey | RecordKeyAsync,
  TRecordValue extends BaseSchema | BaseSchemaAsync
> = ResolveObject<
  TRecordKey extends AnyEnumSchema
    ? Partial<Record<Input<TRecordKey>, Input<TRecordValue>>>
    : Record<Input<TRecordKey>, Input<TRecordValue>>
>;

/**
 * Record output inference type.
 */
export type RecordOutput<
  TRecordKey extends RecordKey | RecordKeyAsync,
  TRecordValue extends BaseSchema | BaseSchemaAsync
> = ResolveObject<
  TRecordKey extends AnyEnumSchema
    ? Partial<Record<Output<TRecordKey>, Output<TRecordValue>>>
    : Record<Output<TRecordKey>, Output<TRecordValue>>
>;

import type { Issue } from './error/index.ts';
import type {
  ArrayPathItem,
  MapPathItem,
  ObjectPathItem,
  RecordPathItem,
  SetPathItem,
  TuplePathItem,
} from './schemas/index.ts';

/**
 * Parse info type.
 */
export type ParseInfo = Partial<
  Pick<Issue, 'origin' | 'path' | 'abortEarly' | 'abortPipeEarly'>
>;

/**
 * Validate info type.
 */
export type ValidateInfo = ParseInfo & Pick<Issue, 'reason'>;

/**
 * Path item type.
 */
export type PathItem =
  | ObjectPathItem
  | RecordPathItem
  | TuplePathItem
  | MapPathItem
  | SetPathItem
  | ArrayPathItem;

/**
 * Base schema type.
 */
export type BaseSchema<TInput = any, TOutput = TInput> = {
  async: false;
  parse(input: unknown, info?: ParseInfo): TOutput;
  types?: { input: TInput; output: TOutput };
};

/**
 * Base schema async type.
 */
export type BaseSchemaAsync<TInput = any, TOutput = TInput> = {
  async: true;
  parse(input: unknown, info?: ParseInfo): Promise<TOutput>;
  types?: { input: TInput; output: TOutput };
};

/**
 * Input inference type.
 */
export type Input<TSchema extends BaseSchema | BaseSchemaAsync> = NonNullable<
  TSchema['types']
>['input'];

/**
 * Output inference type.
 */
export type Output<TSchema extends BaseSchema | BaseSchemaAsync> = NonNullable<
  TSchema['types']
>['output'];

/**
 * Validation and transformation pipe type.
 */
export type Pipe<TValue> = ((value: TValue, info: ValidateInfo) => TValue)[];

/**
 * Async validation and transformation pipe type.
 */
export type PipeAsync<TValue> = ((
  value: TValue,
  info: ValidateInfo
) => TValue | Promise<TValue>)[];

/**
 * Resolve type.
 *
 * Hint: This type has no effect and is only used so that TypeScript displays
 * the final type in the preview instead of the utility types used.
 */
type Resolve<T> = T;

/**
 * Resolve object type.
 *
 * Hint: This type has no effect and is only used so that TypeScript displays
 * the final type in the preview instead of the utility types used.
 */
export type ResolveObject<T> = Resolve<{ [k in keyof T]: T[k] }>;

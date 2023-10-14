import type {
  ArrayPathItem,
  MapPathItem,
  ObjectPathItem,
  RecordPathItem,
  SetPathItem,
  TuplePathItem,
} from './schemas/index.ts';

/**
 * Issue reason type.
 */
export type IssueReason =
  | 'any'
  | 'array'
  | 'bigint'
  | 'blob'
  | 'boolean'
  | 'date'
  | 'function'
  | 'instance'
  | 'map'
  | 'number'
  | 'object'
  | 'record'
  | 'set'
  | 'special'
  | 'string'
  | 'symbol'
  | 'tuple'
  | 'undefined'
  | 'unknown'
  | 'type';

/**
 * Issue origin type.
 */
export type IssueOrigin = 'key' | 'value';

/**
 * Issue type.
 */
export type Issue = {
  reason: IssueReason;
  validation: string;
  origin: IssueOrigin;
  message: string;
  input: any;
  path?: PathItem[];
  issues?: Issues;
  abortEarly?: boolean;
  abortPipeEarly?: boolean;
  skipPipe?: boolean;
};

/**
 * Issues type.
 */
export type Issues = [Issue, ...Issue[]];

/**
 * Parse info type.
 */
export type ParseInfo = Partial<
  Pick<Issue, 'origin' | 'abortEarly' | 'abortPipeEarly' | 'skipPipe'>
>;

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
 * Parse result type.
 */
export type _ParseResult<TOutput> =
  | { output: TOutput; issues?: undefined }
  | { output?: undefined; issues: Issues };

/**
 * Base schema type.
 */
export type BaseSchema<TInput = any, TOutput = TInput> = {
  /**
   * The schema type.
   */
  kind: string;
  /**
   * Whether it's async.
   */
  async: false;
  /**
   * Parses unknown input based on its schema.
   *
   * @param input The input to be parsed.
   * @param info The parse info.
   *
   * @returns The parsed output.
   */
  _parse(input: unknown, info?: ParseInfo): _ParseResult<TOutput>;
  _types?: { input: TInput; output: TOutput };
};

/**
 * Base schema async type.
 */
export type BaseSchemaAsync<TInput = any, TOutput = TInput> = {
  /**
   * The schema type.
   */
  kind: string;
  /**
   * Whether it's async.
   */
  async: true;
  /**
   * Parses unknown input based on its schema.
   *
   * @param input The input to be parsed.
   * @param info The parse info.
   *
   * @returns The parsed output.
   */
  _parse(input: unknown, info?: ParseInfo): Promise<_ParseResult<TOutput>>;
  _types?: { input: TInput; output: TOutput };
};

/**
 * Input inference type.
 */
export type Input<TSchema extends BaseSchema | BaseSchemaAsync> = NonNullable<
  TSchema['_types']
>['input'];

/**
 * Output inference type.
 */
export type Output<TSchema extends BaseSchema | BaseSchemaAsync> = NonNullable<
  TSchema['_types']
>['output'];

/**
 * Error message type.
 */
export type ErrorMessage = string | (() => string);

/**
 * Pipe info type.
 */
export type PipeInfo = ParseInfo & Pick<Issue, 'reason'>;

/**
 * Pipe result type.
 */
export type PipeResult<TOutput> =
  | {
      output: TOutput;
      issues?: undefined;
    }
  | {
      output?: undefined;
      issues: Pick<Issue, 'validation' | 'message' | 'input' | 'path'>[];
    };

export type PipeMeta<
  TKind extends string = string,
  TMessage extends ErrorMessage = ErrorMessage,
  TRequirement = unknown
> = Readonly<{
  kind: TKind;
  message: TMessage;
  requirement?: TRequirement;
}>;

export type Validation<
  TValue,
  TKind extends string = string,
  TMessage extends ErrorMessage = ErrorMessage,
  TRequirement = unknown
> = TRequirement extends unknown
  ? {
      kind: TKind;
      message: TMessage;
      _parse(value: TValue): PipeResult<TValue>;
    }
  : {
      kind: TKind;
      message: TMessage;
      requirement: TRequirement;
      _parse(value: TValue): PipeResult<TValue>;
    };

export type ValidationAsync<
  TValue,
  TKind extends string = string,
  TMessage extends ErrorMessage = ErrorMessage,
  TRequirement = unknown
> = TRequirement extends unknown
  ? {
      kind: TKind;
      message: TMessage;
      _parse(value: TValue): PipeResult<TValue> | Promise<PipeResult<TValue>>;
    }
  : {
      kind: TKind;
      message: TMessage;
      requirement: TRequirement;
      _parse(value: TValue): PipeResult<TValue> | Promise<PipeResult<TValue>>;
    };

export type Transform<TValue> = {
  kind: string;
  _parse(value: TValue): PipeResult<TValue>;
};

export type TransformAsync<TValue> = {
  kind: string;
  _parse(value: TValue): Promise<PipeResult<TValue>> | PipeResult<TValue>;
};

/**
 * Validation and transformation pipe type.
 */
export type Pipe<TValue> = [...(Validation<TValue> | Transform<TValue>)[]];

/**
 * Async validation and transformation pipe type.
 */
export type PipeAsync<TValue> = [
  ...(ValidationAsync<TValue> | TransformAsync<TValue>)[]
];

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

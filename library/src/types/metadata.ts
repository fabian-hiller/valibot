import type { FunctionReference } from './other';

/**
 * Base metadata type.
 */
export interface BaseMetadata<TInput> {
  /**
   * The object kind.
   */
  readonly kind: 'metadata';

  /**
   * The metadata type.
   */
  readonly type: string;

  /**
   * The metadata reference.
   */
  readonly reference: FunctionReference<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any[],
    BaseMetadata<unknown>
  >;

  readonly extraProperties: NonNullable<unknown>;

  /**
   * Input, output and issue type.
   *
   * @internal
   */
  readonly _types?: {
    readonly input: TInput;
    readonly output: TInput;
    readonly issue: never;
  };
}

/**
 * Intersect extra properties from metadata
 */
export type ExtraProperties<T> = T extends {
  extraProperties: infer TExtraProperties;
}
  ? TExtraProperties
  : T extends [infer TFirst, ...infer TRest]
    ? TFirst extends {
        extraProperties: infer TExtraProperties;
      }
      ? ExtraProperties<TRest> & TExtraProperties
      : ExtraProperties<TRest>
    : NonNullable<unknown>;

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
  readonly reference: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => BaseMetadata<unknown>;
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
 * Generic metadata type.
 */
export interface GenericMetadata<TInput = unknown>
  extends BaseMetadata<TInput> {}

import { getDefaultAsync } from '../../methods/index.ts';
import type {
  BaseSchema,
  BaseSchemaAsync,
  Input,
  Output,
} from '../../types/index.ts';
import { schemaResult } from '../../utils/index.ts';

/**
 * Nullable schema async type.
 */
export type NullableSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | Promise<Input<TWrapped> | undefined> | undefined)
    | undefined = undefined,
  TOutput = TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | Promise<Input<TWrapped>>)
    ? Output<TWrapped>
    : Output<TWrapped> | null,
> = BaseSchemaAsync<Input<TWrapped> | null, TOutput> & {
  /**
   * The schema type.
   */
  type: 'nullable';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * Returns the default value.
   */
  default: TDefault;
};

/**
 * Creates an async nullable schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns An async nullable schema.
 */
export function nullableAsync<TWrapped extends BaseSchema | BaseSchemaAsync>(
  wrapped: TWrapped
): NullableSchemaAsync<TWrapped>;

/**
 * Creates an async nullable schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An async nullable schema.
 */
export function nullableAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | Promise<Input<TWrapped> | undefined> | undefined)
    | undefined,
>(
  wrapped: TWrapped,
  default_: TDefault
): NullableSchemaAsync<TWrapped, TDefault>;

export function nullableAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | Promise<Input<TWrapped> | undefined> | undefined)
    | undefined = undefined,
>(
  wrapped: TWrapped,
  default_?: TDefault
): NullableSchemaAsync<TWrapped, TDefault> {
  return {
    type: 'nullable',
    expects: `${wrapped.expects} | null`,
    async: true,
    wrapped,
    default: default_ as TDefault,
    get metadata() {
      return this.wrapped.metadata;
    },
    async _parse(input, config) {
      // Allow `null` to pass or override it with default value
      if (input === null) {
        const override = await getDefaultAsync(this);
        if (override === undefined) {
          return schemaResult(true, input);
        }
        input = override;
      }

      // Otherwise, return result of wrapped schema
      return this.wrapped._parse(input, config);
    },
  };
}

import { getDefaultAsync } from '../../methods/index.ts';
import type {
  BaseSchema,
  BaseSchemaAsync,
  DefaultAsync,
  Input,
  Output,
} from '../../types/index.ts';
import { schemaResult } from '../../utils/index.ts';

/**
 * Optional schema async type.
 */
export interface OptionalSchemaAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends DefaultAsync<TWrapped> = undefined,
  TOutput = TDefault extends
    | Input<TWrapped>
    | (() => Input<TWrapped> | Promise<Input<TWrapped>>)
    ? Output<TWrapped>
    : Output<TWrapped> | undefined,
> extends BaseSchemaAsync<Input<TWrapped> | undefined, TOutput> {
  /**
   * The schema type.
   */
  type: 'optional';
  /**
   * The wrapped schema.
   */
  wrapped: TWrapped;
  /**
   * Returns the default value.
   */
  default: TDefault;
}

/**
 * Creates an async optional schema.
 *
 * @param wrapped The wrapped schema.
 *
 * @returns An async optional schema.
 */
export function optionalAsync<TWrapped extends BaseSchema | BaseSchemaAsync>(
  wrapped: TWrapped
): OptionalSchemaAsync<TWrapped>;

/**
 * Creates an async optional schema.
 *
 * @param wrapped The wrapped schema.
 * @param default_ The default value.
 *
 * @returns An async optional schema.
 */
export function optionalAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends DefaultAsync<TWrapped>,
>(
  wrapped: TWrapped,
  default_: TDefault
): OptionalSchemaAsync<TWrapped, TDefault>;

export function optionalAsync<
  TWrapped extends BaseSchema | BaseSchemaAsync,
  TDefault extends DefaultAsync<TWrapped> = undefined,
>(
  wrapped: TWrapped,
  default_?: TDefault
): OptionalSchemaAsync<TWrapped, TDefault> {
  return {
    type: 'optional',
    expects: `${wrapped.expects} | undefined`,
    async: true,
    wrapped,
    default: default_ as TDefault,
    async _parse(input, config) {
      // If input is `undefined`, return typed schema result or override it
      // with default value
      if (input === undefined) {
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

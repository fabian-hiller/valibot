import type { PipeItem } from '../types';

type Validator<Args extends unknown[], T> = (...args: Args) => PipeItem<T>;
type RegistryItem = (...args: unknown[]) => unknown;

const registry: Record<string, Record<string, RegistryItem>> = {};

export function register<Args extends unknown[], T>(
  type: string,
  validator: Validator<Args, T>
) {
  const name = validator.name;
  if (!name) {
    throw new Error('Cannot register anonymous function');
  }
  if (!registry[type]) {
    registry[type] = {};
  }

  const mixin = function (...args: any[]) {
    // @ts-expect-error 'this' is the owner of the mixin, it's unknown at this point for typescript
    if (this._pipe === undefined) {
      // @ts-expect-error
      this._pipe = [];
    }
    // @ts-expect-error
    this._pipe.push(validator(...args));
    // @ts-expect-error
    return this;
  };

  registry[type][name] = mixin;
}

export function mixinsOf(type: string) {
  return registry[type];
}

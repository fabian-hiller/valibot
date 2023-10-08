import { endsWith } from './endsWith.ts';
import { register } from '../../registry/registry.ts';

declare global {
  export interface StringRegistry {
    endsWith: typeof endsWith;
  }
}

register('string', endsWith);

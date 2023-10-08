import { emoji } from './emoji.ts';
import { register } from '../../registry/registry.ts';

declare global {
  export interface StringRegistry {
    emoji: typeof emoji;
  }
}

register('string', emoji);

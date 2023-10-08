import { email } from './email.ts';
import { register } from '../../registry/registry.ts';

declare global {
  export interface StringRegistry {
    email: typeof email;
  }
}

register('string', email);

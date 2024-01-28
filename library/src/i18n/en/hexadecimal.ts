import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'hexadecimal',
  (issue) => `Invalid hexadecimal: Received ${issue.received}`,
  'en'
);

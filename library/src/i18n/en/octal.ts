import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'octal',
  (issue) => `Invalid octal: Received ${issue.received}`,
  'en'
);

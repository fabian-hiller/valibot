import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'custom',
  (issue) => `Invalid input: Received ${issue.received}`,
  'en'
);

import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'integer',
  (issue) => `Invalid integer: Received ${issue.received}`,
  'en'
);

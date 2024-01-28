import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'safe_integer',
  (issue) => `Invalid safe integer: Received ${issue.received}`,
  'en'
);

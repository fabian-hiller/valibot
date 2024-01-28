import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'hash',
  (issue) => `Invalid hash: Received ${issue.received}`,
  'en'
);

import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'ulid',
  (issue) => `Invalid ULID: Received ${issue.received}`,
  'en'
);

import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'uuid',
  (issue) => `Invalid UUID: Received ${issue.received}`,
  'en'
);

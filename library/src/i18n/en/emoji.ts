import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'emoji',
  (issue) => `Invalid emoji: Received ${issue.received}`,
  'en'
);

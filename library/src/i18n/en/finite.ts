import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'finite',
  (issue) => `Invalid finite: Received ${issue.received}`,
  'en'
);

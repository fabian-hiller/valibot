import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'ip',
  (issue) => `Invalid IP: Received ${issue.received}`,
  'en'
);

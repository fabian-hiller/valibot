import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'ipv4',
  (issue) => `Invalid IPv4: Received ${issue.received}`,
  'en'
);

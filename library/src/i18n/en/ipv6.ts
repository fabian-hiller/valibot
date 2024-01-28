import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'ipv6',
  (issue) => `Invalid IPv6: Received ${issue.received}`,
  'en'
);

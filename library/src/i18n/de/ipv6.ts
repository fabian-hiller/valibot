import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'ipv6',
  (issue) => `Ungültige IPv6: ${issue.received} erhalten`,
  'de'
);

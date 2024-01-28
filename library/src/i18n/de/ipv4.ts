import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'ipv4',
  (issue) => `Ungültige IPv4: ${issue.received} erhalten`,
  'de'
);

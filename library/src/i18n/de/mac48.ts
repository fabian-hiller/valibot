import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'mac48',
  (issue) => `Ungültige 48 bit MAC: ${issue.received} erhalten`,
  'de'
);

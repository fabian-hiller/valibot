import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'mac64',
  (issue) => `Ungültige 64 bit MAC: ${issue.received} erhalten`,
  'de'
);

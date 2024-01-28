import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'imei',
  (issue) => `Ungültige IMEI: ${issue.received} erhalten`,
  'de'
);

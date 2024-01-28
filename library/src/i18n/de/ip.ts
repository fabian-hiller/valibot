import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'ip',
  (issue) => `Ungültige IP: ${issue.received} erhalten`,
  'de'
);

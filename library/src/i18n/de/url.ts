import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'url',
  (issue) => `Ungültige URL: ${issue.received} erhalten`,
  'de'
);

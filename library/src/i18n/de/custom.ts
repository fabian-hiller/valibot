import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'custom',
  (issue) => `Ungültige Eingabe: ${issue.received} erhalten`,
  'de'
);

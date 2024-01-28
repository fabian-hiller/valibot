import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'integer',
  (issue) => `Ungültige Ganzzahl: ${issue.received} erhalten`,
  'de'
);

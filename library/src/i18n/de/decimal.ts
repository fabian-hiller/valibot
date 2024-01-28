import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'decimal',
  (issue) => `Ungültige Dezimale: ${issue.received} erhalten`,
  'de'
);

import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'iso_week',
  (issue) => `Ungültige Woche: ${issue.received} erhalten`,
  'de'
);

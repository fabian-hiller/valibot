import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'iso_date',
  (issue) => `Ungültiges Datum: ${issue.received} erhalten`,
  'de'
);

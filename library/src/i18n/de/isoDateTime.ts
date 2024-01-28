import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'iso_date_time',
  (issue) => `Ungültige Datums-Zeit: ${issue.received} erhalten`,
  'de'
);

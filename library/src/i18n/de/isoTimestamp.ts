import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'iso_timestamp',
  (issue) => `Ungültiger Zeitstempel: ${issue.received} erhalten`,
  'de'
);

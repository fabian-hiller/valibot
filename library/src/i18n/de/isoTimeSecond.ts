import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'iso_time_second',
  (issue) => `Ungültige Zeitsekunde: ${issue.received} erhalten`,
  'de'
);

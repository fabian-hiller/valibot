import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'iso_time',
  (issue) => `Ungültige Zeit: ${issue.received} erhalten`,
  'de'
);

import { bytes, setSpecificMessage } from '../../index.ts';

setSpecificMessage(
  bytes,
  (issue) =>
    `Ungültige Bytes: ${issue.expected} erwartet aber ${issue.received} erhalten`,
  'de'
);

import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'iso_timestamp',
  (issue) => `Invalid timestamp: Received ${issue.received}`,
  'en'
);

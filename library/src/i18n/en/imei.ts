import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'imei',
  (issue) => `Invalid IMEI: Received ${issue.received}`,
  'en'
);

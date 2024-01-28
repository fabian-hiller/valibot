import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'iso_time',
  (issue) => `Invalid time: Received ${issue.received}`,
  'en'
);

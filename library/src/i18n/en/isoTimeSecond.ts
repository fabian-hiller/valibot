import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'iso_time_second',
  (issue) => `Invalid time second: Received ${issue.received}`,
  'en'
);

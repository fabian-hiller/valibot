import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'iso_date_time',
  (issue) => `Invalid date-time: Received ${issue.received}`,
  'en'
);

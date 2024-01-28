import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'iso_date',
  (issue) => `Invalid date: Received ${issue.received}`,
  'en'
);

import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'iso_week',
  (issue) => `Invalid week: Received ${issue.received}`,
  'en'
);

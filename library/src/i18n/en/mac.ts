import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'mac',
  (issue) => `Invalid MAC: Received ${issue.received}`,
  'en'
);

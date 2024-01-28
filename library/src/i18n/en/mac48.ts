import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'mac48',
  (issue) => `Invalid 48 bit MAC: Received ${issue.received}`,
  'en'
);

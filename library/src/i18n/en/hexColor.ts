import { setLocalMessage } from '../../index.ts';

setLocalMessage(
  'hex_color',
  (issue) => `Invalid hex color: Received ${issue.received}`,
  'en'
);

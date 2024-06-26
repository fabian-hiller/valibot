import { component$ } from '@builder.io/qwik';
import { DiscordIcon } from '~/icons';
import { SystemIcon } from './SystemIcon';

/**
 * Discord icon pointing to our community server.
 */
export const DiscordIconLink = component$(() => (
  <SystemIcon
    label="Join our Discord server"
    type="link"
    href="https://discord.gg/Bf9Pav5T"
    target="_blank"
  >
    <DiscordIcon class="h-full" />
  </SystemIcon>
));

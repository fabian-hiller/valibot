import { GitHubIcon } from '~/icons';
import { SystemIcon } from './SystemIcon';
import { component$ } from '@builder.io/qwik';

/**
 * GitHub icon pointing to our repository.
 */
export const GitHubIconLink = component$(() => (
  <SystemIcon
    label="Open GitHub repository"
    type="link"
    href={import.meta.env.PUBLIC_GITHUB_URL}
    target="_blank"
  >
    <GitHubIcon class="h-full" />
  </SystemIcon>
));

import { component$, type Signal } from '@builder.io/qwik';
import { SearchIcon } from '~/icons';
import { SystemIcon } from './SystemIcon';

type SearchToggleProps = {
  open: Signal<boolean>;
};

/**
 * Icon button to open the search interface of the website.
 */
export const SearchToggle = component$<SearchToggleProps>(({ open }) => (
  <SystemIcon
    label="Open search"
    type="button"
    onClick$={() => (open.value = true)}
  >
    <SearchIcon class="h-full" />
  </SystemIcon>
));

import { component$, Slot } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { DocsLayout } from '~/components';
import { addArticleMetadata } from '~/utils';

export const head: DocumentHead = addArticleMetadata;

export default component$(() => (
  <DocsLayout>
    <Slot />
  </DocsLayout>
));

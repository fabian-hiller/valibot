import { component$ } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { ActionButton, ButtonGroup } from '~/components';

export const head: DocumentHead = {
  title: 'Page not found',
  meta: [
    {
      name: 'description',
      content:
        "Sorry, the page you are looking for could not be found. You can write us a message if you can't find what you are looking for or return to the home page.",
    },
  ],
};

export default component$(() => (
  <main class="flex w-full max-w-screen-lg flex-1 flex-col self-center py-12 md:py-20 lg:py-32">
    <article>
      <h1>Page not found</h1>
      <p>
        Sorry, the page you are looking for could not be found. You can create
        an issue if you can't find what you are looking for or return to the
        home page.
      </p>

      <ButtonGroup class="px-8 lg:px-10">
        <ActionButton
          variant="primary"
          label="Create issue"
          type="link"
          href="https://github.com/fabian-hiller/valibot/issues/new"
          target="_blank"
        />
        <ActionButton
          variant="secondary"
          label="Home page"
          type="link"
          href="/"
        />
      </ButtonGroup>
    </article>
  </main>
));

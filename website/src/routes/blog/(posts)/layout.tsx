import { component$, Slot } from '@builder.io/qwik';
import { useDocumentHead } from '@builder.io/qwik-city';
import { PostCover, PostMeta } from '~/components';

export default component$(() => {
  const head = useDocumentHead();
  return (
    <main class="flex flex-1 justify-center py-12 md:py-20 lg:py-32">
      <article class="flex w-full max-w-screen-xl flex-col space-y-12 md:space-y-20 lg:space-y-24">
        <div class="mx-8 flex max-w-screen-md flex-col space-y-5 md:items-center md:space-y-7 md:self-center lg:mx-10 lg:space-y-9">
          <h1 class="text-2xl font-medium leading-normal text-slate-900 md:text-center md:text-3xl md:leading-normal lg:text-4xl lg:leading-normal dark:text-slate-200">
            {head.title}
          </h1>
          <PostMeta
            variant="post"
            authors={head.frontmatter.authors}
            published={head.frontmatter.published}
          />
        </div>
        <PostCover variant="post" label={head.frontmatter.cover} />
        <div class="mdx flex w-full max-w-screen-lg flex-col lg:self-center">
          <Slot />
        </div>
      </article>
    </main>
  );
});

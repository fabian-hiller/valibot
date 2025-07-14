import { component$, Slot } from '@builder.io/qwik';
import { useDocumentHead, useLocation } from '@builder.io/qwik-city';
import { Credits, IconButton, PostCover, PostMeta } from '~/components';
import { PenIcon } from '~/icons';

export default component$(() => {
  // Use document head and location
  const head = useDocumentHead();
  const location = useLocation();

  return (
    <main class="flex flex-1 flex-col items-center py-12 md:py-20 lg:py-32">
      {/* Article */}
      <article class="max-w-(--breakpoint-xl) flex w-full flex-col space-y-12 md:space-y-20 lg:space-y-24">
        <div class="max-w-(--breakpoint-md) mx-8 flex flex-col space-y-5 md:items-center md:space-y-7 md:self-center lg:mx-10 lg:space-y-9">
          {/* Title */}
          <h1 class="text-2xl font-medium leading-normal text-slate-900 md:text-center md:text-3xl md:leading-normal lg:text-4xl lg:leading-normal dark:text-slate-200">
            {head.title}
          </h1>

          {/* Meta */}
          <PostMeta
            variant="post"
            authors={head.frontmatter.authors}
            published={head.frontmatter.published}
          />
        </div>

        {/* Cover */}
        <PostCover variant="post" label={head.frontmatter.cover} />

        {/* Content */}
        <div class="mdx max-w-(--breakpoint-lg) flex w-full flex-col lg:self-center">
          <Slot />

          {/* Edit page buttton */}
          <IconButton
            class="mx-8 lg:mx-10"
            variant="secondary"
            type="link"
            href={`https://github.com/fabian-hiller/valibot/blob/main/website/src/routes/blog/(posts)${location.url.pathname.slice(5)}index.mdx`}
            target="_blank"
            label="Edit page"
          >
            <PenIcon class="h-[18px]" />
          </IconButton>
        </div>
      </article>

      {/* Credits */}
      <div class="max-w-(--breakpoint-lg) w-full">
        <Credits />
      </div>
    </main>
  );
});

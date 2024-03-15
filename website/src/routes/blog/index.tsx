import { component$ } from '@builder.io/qwik';
import {
  type DocumentHead,
  type DocumentHeadValue,
  Link,
  routeLoader$,
} from '@builder.io/qwik-city';
import { PostCover, PostMeta } from '~/components';

export const head: DocumentHead = {
  title: 'Blog',
  meta: [
    {
      name: 'description',
      content:
        "Official announcements, project updates and insightful content directly from the Valibot core team. We're excited to share our journey with you! Let's validate together!",
    },
  ],
};

type PostData = {
  cover: string;
  title: string;
  published: string;
  authors: string[];
};

/**
 * Loads the required data for each blog post.
 */
export const usePosts = routeLoader$(() => {
  const modules = import.meta.glob<DocumentHeadValue<PostData>>('./**/*.mdx');
  return Promise.all(
    Object.entries(modules).map(async ([path, readFile]) => {
      const { frontmatter } = await readFile();
      return {
        cover: frontmatter!.cover,
        title: frontmatter!.title,
        published: frontmatter!.published,
        authors: frontmatter!.authors,
        href: `./${path.split('/').slice(2, 3)[0]}/`,
      };
    })
  );
});

export default component$(() => {
  const posts = usePosts();
  return (
    <main class="flex w-full max-w-screen-lg flex-1 flex-col self-center py-12 md:py-20 lg:py-32">
      <div class="mdx">
        <h1>Blog</h1>
        <p>
          Official announcements, project updates and insightful content
          directly from the Valibot core team. We're excited to share our
          journey with you! Let's validate together!
        </p>
        <h2>Latest posts</h2>
      </div>
      <ol class="mx-3 mt-6 flex flex-wrap lg:mx-2 lg:mt-10">
        {posts.value.map((post) => (
          <li class="w-full px-5 py-6 md:w-1/2 lg:p-8" key={post.href}>
            <Link class="group space-y-8" href={post.href}>
              <PostCover variant="blog" label={post.cover} />
              <div class="space-y-5">
                <h3 class="text-lg font-medium leading-normal text-slate-900 md:text-xl lg:text-2xl dark:text-slate-200">
                  {post.title}
                </h3>
                <PostMeta
                  variant="blog"
                  authors={post.authors}
                  published={post.published}
                />
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
});

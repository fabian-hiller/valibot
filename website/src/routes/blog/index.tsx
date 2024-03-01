import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import clsx from 'clsx';

export default component$(() => (
  <main class="flex w-full max-w-screen-lg flex-1 flex-col self-center py-12 md:py-20 lg:py-32">
    <div class="mdx">
      <h1>Blog</h1>
      <p>
        Official announcements, project updates and insightful content directly
        from the Valibot core team. We're excited to share our journey with you!
        Let's validate together!
      </p>
      <h2>Latest posts</h2>
    </div>
    <ol class="mx-3 mt-6 flex flex-wrap lg:mx-2 lg:mt-10">
      {[
        {
          cover: 'API Design',
          title: "Should we change Valibot's API?",
          published: '2024-02-29',
          authors: ['fabian-hiller', 'Demivan', 'xcfox'],
          href: './should-we-change-valibots-api/',
        },
      ].map((post) => (
        <li class="w-full px-5 py-6 md:w-1/2 lg:p-8" key={post.href}>
          <Link class="group" href={post.href}>
            <div class="relative flex aspect-video items-center justify-center overflow-hidden rounded-xl border-2 border-slate-200 duration-100 group-hover:-translate-y-1 lg:rounded-2xl dark:border-slate-800">
              <div class="absolute -right-20 -top-36 h-[400px] w-[250px] bg-[radial-gradient(theme(colors.yellow.500/.06),transparent_70%)] dark:bg-[radial-gradient(theme(colors.yellow.300/.04),transparent_70%)]" />
              <div class="absolute -bottom-36 -left-20 h-[400px] w-[250px] bg-[radial-gradient(theme(colors.sky.600/.08),transparent_70%)] dark:bg-[radial-gradient(theme(colors.sky.400/.06),transparent_70%)]" />
              <div class="font-lexend-exa text-center text-2xl font-medium text-slate-700 lg:text-3xl dark:text-slate-300">
                {post.cover}
              </div>
            </div>
            <h3 class="mt-8 text-xl leading-normal text-slate-900 lg:text-2xl dark:text-slate-200">
              {post.title}
            </h3>
            <div class="mt-5 flex items-center space-x-4">
              <div class="-m-0.5 flex">
                {post.authors.map((author, index) => (
                  <img
                    class={clsx(
                      'box-content w-6 rounded-full border-[3px] border-white lg:w-7 dark:border-gray-900',
                      index > 0 && '-ml-3'
                    )}
                    style={{ zIndex: post.authors.length - index }}
                    key={author}
                    width="56"
                    height="56"
                    src={`https://github.com/${author}.png?size=56`}
                    alt={`GitHub profile picture of ${author}`}
                  />
                ))}
              </div>
              <time class="text-sm lg:text-base" dateTime={post.published}>
                {new Date(post.published).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  </main>
));

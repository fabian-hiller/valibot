import { component$ } from '@builder.io/qwik';
import { useDocumentHead } from '@builder.io/qwik-city';

export default component$(() => {
  const { frontmatter } = useDocumentHead();
  const contributors = frontmatter.contributors || [];

  if (!contributors.length) {
    return null;
  }

  return (
    <>
      <h3 class="text-xl text-slate-900 dark:text-slate-200">Contributors</h3>
      <p class="my-4">
        Thanks to all the contributors who have helped make this documentation
        better!
      </p>
      <ul class="my-2 flex list-none flex-row gap-2">
        {contributors.map((contributor: string) => (
          <li key={`contributor-${contributor}`}>
            <a
              href={`https://github.com/${contributor}`}
              target="_blank"
              rel="noreferrer"
            >
              <img
                loading="lazy"
                src={`https://github.com/${contributor}.png?size=80`}
                width="12"
                height="12"
                alt={contributor}
                class="w-12 rounded-full"
              />
            </a>
          </li>
        ))}
      </ul>
    </>
  );
});

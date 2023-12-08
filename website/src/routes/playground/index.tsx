import { $, component$, useSignal } from '@builder.io/qwik';
import { type DocumentHead } from '@builder.io/qwik-city';
import { ActionButton, ButtonGroup } from '~/components';
import ts from 'typescript';
import { OutputEditer, SourceEditor } from '~/integrations/react';

export const head: DocumentHead = {
  title: 'Playground',
  meta: [
    {
      name: 'description',
      content: 'WIP',
    },
  ],
};

const OPTIONS: ts.CompilerOptions = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.CommonJS,
  // lib: ["DOM", "ES2015"],
  esModuleInterop: true,
  downlevelIteration: true,
  forceConsistentCasingInFileNames: true,
  strict: true,
  skipLibCheck: true,
};

export default component$(() => {
  const source = useSignal<string>('');
  const output = useSignal<string>('');

  const handleChangeSource = $((code: string | undefined) => {
    // TODO: Add convert logic
    source.value = code ?? '';
  });

  const handleChangeOutput = $((code: string | undefined) => {
    // TODO: Add convert logic
    output.value = code ?? '';
  });

  return (
    <main class="flex w-full max-w-screen-lg flex-1 flex-col self-center py-12 md:py-20 lg:py-32">
      {/* TODO: Adjust CSS  */}
      <div class="flex flex-row gap-4">
        <div class="h-screen-3/4 w-1/2">
          <SourceEditor
            options={OPTIONS}
            script={source.value}
            setScript={handleChangeSource}
            client:load
          />
        </div>
        <div class="h-screen-3/4 w-1/2">
          <OutputEditer
            options={OPTIONS}
            script={output.value}
            setScript={handleChangeOutput}
            client:load
          />
        </div>
      </div>
      <ButtonGroup class="mt-10 px-8 md:mt-12 lg:mt-14 lg:px-10">
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
    </main>
  );
});

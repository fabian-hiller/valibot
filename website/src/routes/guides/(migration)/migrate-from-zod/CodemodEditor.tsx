import {
  $,
  component$,
  type NoSerialize,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import * as monaco from 'monaco-editor';
import { CodeEditor, IconButton } from '~/components';
import { useResetSignal } from '~/hooks';
import { CheckIcon, CopyIcon, PlayIcon } from '~/icons';
import { trackEvent } from '~/utils';
import editorCode from './editorCode.ts?raw';
import zod3Types from './zod/v3/index.d.ts?raw';
import zod3PackageJson from './zod/v3/package.json?raw';
import zod4Types from './zod/v4/index.d.ts?raw';
import zod4PackageJson from './zod/v4/package.json?raw';

/**
 * Code editor that converts Zod schemas to Valibot using our codemod.
 */
export const CodemodEditor = component$(() => {
  // Use model and copied signals
  const model = useSignal<NoSerialize<monaco.editor.ITextModel>>();
  const copied = useResetSignal(false);

  // Initialize Monaco editor with Zod types
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => initializeMonaco());

  /**
   * Copies the current code of the editor.
   */
  const copyCode = $(() => {
    // Copy code to clipboard
    copied.value = true;
    navigator.clipboard.writeText(model.value!.getValue());

    // Track playground event
    trackEvent('copy_zod_codemod_result');
  });

  /**
   * Executes the codemod to converts the current code.
   */
  const executeCodemod = $(() => {
    // TODO: Execute codemod with current code
    const result = model.value!.getValue() + '\n// Test\n';

    // Replace current code with result of codemod
    model.value!.pushEditOperations(
      null,
      [
        {
          range: model.value!.getFullModelRange(),
          text: result,
        },
      ],
      () => null
    );

    // Track playground event
    trackEvent('execute_zod_codemod');
  });

  return (
    <div class="relative flex aspect-video">
      <CodeEditor
        class="border-y-2 border-slate-200 lg:rounded-3xl lg:border-[3px] dark:border-slate-800"
        value={{ value: editorCode }}
        model={model}
      />
      <div class="absolute right-10 top-10 z-10 flex space-x-6">
        <IconButton
          type="button"
          variant="secondary"
          label="Copy code"
          hideLabel
          onClick$={copyCode}
        >
          {copied.value ? (
            <CheckIcon class="h-[18px]" />
          ) : (
            <CopyIcon class="h-[18px]" />
          )}
        </IconButton>
        <IconButton
          type="button"
          variant="secondary"
          label="Execute codemod"
          hideLabel
          onClick$={executeCodemod}
        >
          <PlayIcon class="h-[16px]" />
        </IconButton>
      </div>
    </div>
  );
});

/**
 * Sets up the Monaco editor environment.
 */
async function setupMonaco() {
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    zod3PackageJson,
    'file:///node_modules/zod/package.json'
  );
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    zod3Types,
    'file:///node_modules/zod/dist/index.d.ts'
  );
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    zod4PackageJson,
    'file:///node_modules/zod/v4/package.json'
  );
  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    zod4Types,
    'file:///node_modules/zod/v4/dist/index.d.ts'
  );
}

// Create initialization promise
let promise: Promise<void> | undefined;

/**
 * Initializes Monaco editor environment.
 */
async function initializeMonaco() {
  if (!promise) {
    promise = setupMonaco();
  }
  await promise;
}

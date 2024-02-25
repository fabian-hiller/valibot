import {
  $,
  component$,
  type NoSerialize,
  type Signal,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import clsx from 'clsx';
import type * as monaco from 'monaco-editor';
import { transform } from 'sucrase';
import {
  CodeEditor,
  IconButton,
  SideBar,
  useSideBarToggle,
} from '~/components';
import { useResetSignal } from '~/hooks';
import { BinIcon, CheckIcon, CopyIcon, PlayIcon } from '~/icons';
import valibotCode from '../../../../library/dist/index.js?url';

export const head: DocumentHead = {
  title: 'Playground',
  meta: [
    {
      name: 'description',
      content:
        "Write, run, and test your Valibot schemas instantly. Unleash your creativity with Valibot's online code editor.",
    },
  ],
};

type LogLevel = 'log' | 'info' | 'debug' | 'warn' | 'error';

type MessageEventData = {
  type: 'logs';
  level: LogLevel;
  args: unknown[];
};

export default component$(() => {
  // Use side bar toggle
  const toggle = useSideBarToggle();

  // Use model, code and logs signals
  const model = useSignal<NoSerialize<monaco.editor.ITextModel>>();
  const code = useSignal<string>('');
  const logs = useSignal<[LogLevel, string][]>([]);

  // Capture logs from the iFrame
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    window.addEventListener(
      'message',
      (event: MessageEvent<MessageEventData>) => {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (event.data.type === 'logs') {
          // Log it to console
          console[event.data.level](...event.data.args);

          // Add log to current logs
          logs.value = [
            ...logs.value,
            [
              event.data.level,
              event.data.args
                .map((arg) => JSON.stringify(arg, null, 2))
                .join(', '),
            ],
          ];
        }
      }
    );
  });

  return (
    <main class="flex w-full flex-1 flex-col lg:flex-row lg:space-x-10 lg:px-10 lg:py-20 2xl:max-w-[1700px] 2xl:space-x-14 2xl:self-center">
      <div class="flex flex-1 lg:relative">
        <CodeEditor
          value={`
import * as v from 'valibot';

const Schema = v.object({
  email: v.string([v.minLength(1), v.email()]),
  password: v.string([v.minLength(1), v.minLength(8)]),
});

const result = v.safeParse(Schema, {
  email: 'jane@example.com',
  password: '12345678',
});

console.log(result);
          `.trim()}
          model={model}
        />
        <EditorButtons
          class="!hidden lg:!absolute lg:right-10 lg:top-10 lg:!flex"
          model={model}
          code={code}
        />
      </div>

      <SideBar class="lg:w-80 xl:w-96 2xl:w-[448px]" toggle={toggle}>
        <EditorButtons
          q:slot="buttons"
          class="mr-4 lg:hidden"
          toggle={toggle}
          model={model}
          code={code}
        />
        <IconButton
          class="!absolute right-8 top-8 z-10 lg:right-10 lg:top-10"
          type="button"
          variant="secondary"
          label="Clear"
          hideLabel
          onClick$={() => (logs.value = [])}
        >
          <BinIcon class="h-[18px]" />
        </IconButton>
        <ol class="flex h-full flex-col items-start overflow-auto overscroll-contain px-8 py-9 lg:absolute lg:w-full lg:rounded-3xl lg:border-[3px] lg:border-slate-200 lg:p-10 lg:dark:border-slate-800">
          {logs.value.map(([level, message], index) => (
            <li key={index}>
              <pre class="lg:text-lg">
                <span
                  class={clsx('uppercase', {
                    'text-sky-600 dark:text-sky-400':
                      level === 'log' || level === 'info' || level === 'debug',
                    'text-yellow-600 dark:text-amber-200': level === 'warn',
                    'text-red-600 dark:text-red-400': level === 'error',
                  })}
                >
                  {level}
                </span>
                : {message}
              </pre>
            </li>
          ))}
        </ol>
      </SideBar>

      {code.value && (
        <iframe
          hidden
          sandbox="allow-scripts allow-same-origin"
          srcdoc={`
<html>
  <body>
    <script type="importmap">
      { "imports": { "valibot": "${valibotCode}" } }
    </script>
    <script type="module">
      console.log = (...args) => window.parent.postMessage({ type: "logs", level: "log", args });
      console.info = (...args) => window.parent.postMessage({ type: "logs", level: "info", args });
      console.debug = (...args) => window.parent.postMessage({ type: "logs", level: "debug", args });
      console.warn = (...args) => window.parent.postMessage({ type: "logs", level: "warn", args });
      console.error = (...args) => window.parent.postMessage({ type: "logs", level: "error", args });
      ${code.value}
    </script>
  </body>
</html
          `}
        />
      )}
    </main>
  );
});

type EditorButtonsProps = {
  class: string;
  toggle?: ReturnType<typeof useSideBarToggle>;
  model: Signal<NoSerialize<monaco.editor.ITextModel>>;
  code: Signal<string>;
};

const EditorButtons = component$<EditorButtonsProps>(
  ({ toggle, code, model, ...props }) => {
    // Use reset signal
    const cklicked = useResetSignal(false);

    /**
     * Copies the current code of the editor.
     */
    const copyCode = $(() => {
      cklicked.value = true;
      navigator.clipboard.writeText(model.value!.getValue());
    });

    /**
     * Executes the current code of the editor.
     */
    const executeCode = $(() => {
      if (!toggle?.value || toggle.value.state === 'closed') {
        toggle?.submit({ state: 'opened' });
      }
      code.value = `// ${Date.now()}\n${
        transform(model.value!.getValue(), {
          transforms: ['typescript'],
        }).code
      }`;
    });

    return (
      <div class={clsx('flex space-x-6', props.class)}>
        <IconButton
          type="button"
          variant="secondary"
          label="Run"
          hideLabel
          onClick$={copyCode}
        >
          {cklicked.value ? (
            <CheckIcon class="h-[18px]" />
          ) : (
            <CopyIcon class="h-[18px]" />
          )}
        </IconButton>
        <IconButton
          type="button"
          variant="secondary"
          label="Run"
          hideLabel
          onClick$={executeCode}
        >
          <PlayIcon class="h-[16px]" />
        </IconButton>
      </div>
    );
  }
);

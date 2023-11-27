/** @jsxImportSource react */

import type { Monaco } from '@monaco-editor/react';
import Editor from '@monaco-editor/react';
import type ts from 'typescript';
import { qwikify$ } from '@builder.io/qwik-react';

const INTERVAL = 500;

const RawSourceEditor = (props: {
  options: ts.CompilerOptions;
  // imports: [string, string][];
  script: string;
  setScript: (code: string | undefined) => void;
}) => {
  const time = { value: Date.now() };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
      props.options as any
    );

    // TODO: Add imports
    // for (const [file, content] of props.imports)
    //   monaco.languages.typescript.typescriptDefaults.addExtraLib(
    //     content,
    //     file
    //   );

    // SET NEW MODEL
    const model = monaco.editor.createModel(
      props.script,
      'typescript',
      monaco.Uri.parse('file:///source.ts')
    );
    editor.setModel(model);
  };

  const handleChange = (str: string) => {
    time.value = Date.now();
    setTimeout(() => {
      if (Date.now() - time.value < INTERVAL) return;
      props.setScript(str);
    }, INTERVAL);
  };

  return (
    <Editor
      height="100%"
      theme="vs-dark"
      options={{
        minimap: {
          enabled: false,
        },
        padding: {
          top: 15,
          bottom: 15,
        },
      }}
      onMount={handleEditorDidMount}
      onChange={(val: string | undefined) => {
        if (val === undefined) return;
        handleChange(val);
      }}
      defaultValue={props.script}
    />
  );
};

export const SourceEditor = qwikify$(RawSourceEditor);

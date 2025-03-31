import type { Transform } from 'jscodeshift';

const transform: Transform = (fileInfo, api) => {
  const j = api.jscodeshift;

  const root = j(fileInfo.source);

  root
    .find(j.VariableDeclaration)
    .filter((path) => path.node.kind === 'var')
    .forEach((path) => {
      path.node.kind = 'let';
    });

  return root.toSource();
};

export default transform;

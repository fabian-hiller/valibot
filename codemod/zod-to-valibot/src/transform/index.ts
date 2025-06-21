import type { Transform } from 'jscodeshift';
import { transformImports } from './imports';
import { transformSchemasAndLinks } from './schemas-and-links';

const transform: Transform = (fileInfo, api) => {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);

  // ------------ Imports ------------
  const transformImportsResult = transformImports(root);
  if (transformImportsResult.conclusion !== 'successful') {
    return transformImportsResult.conclusion === 'skip'
      ? undefined
      : root.toSource();
  }
  const valibotIdentifier = transformImportsResult.valibotIdentifier;

  // ------------ Schemas and links ------------
  transformSchemasAndLinks(root, valibotIdentifier);

  return root.toSource();
};

export default transform;

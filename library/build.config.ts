import { type BuildEntry, defineBuildConfig } from 'unbuild';

import packageJSON from './package.json';

const entries: BuildEntry[] = [];
const exportsList = packageJSON['exports'];
const match = '.';
Object.keys(exportsList).forEach((key) => {
  if (key.slice(0, match.length) !== match) {
    return;
  }

  const importValue = exportsList[key]['import']['default'];
  if (key === '.') {
    entries.push({
      input: 'src/index',
      name: 'index',
    });
    return;
  }
  key = key.slice(match.length + 1);
  if (importValue === './dist/' + key + '.mjs') {
    entries.push({
      input: 'src/' + key + '/index',
      name: key,
    });
  }
});

export default defineBuildConfig({
  outDir: './dist',
  entries,
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
    dts: {
      respectExternal: true,
    },
  },
  failOnWarn: false,
  externals: ['vitest'],
});

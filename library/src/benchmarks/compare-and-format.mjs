/**
 *
 * @param {BenchmarkSuiteResult} before
 * @param {BenchmarkSuiteResult} after
 * @param {object} config
 * @param {string} config.beforeSha
 * @param {string} config.afterSha
 * @param {string} config.beforeBenchStepLink
 * @param {string} config.afterBenchStepLink
 * @param {string} config.repoLink
 */
export function generateMessage(before, after, config) {
  const table = compare(before, after);
  const stringTable = generateMarkdownTable(table, [
    ['desc', 'description', 'left'],
    ['name', 'name', 'center'],
    ['beforeHz', 'before, hz', 'right'],
    ['beforeRme', 'rme', 'left'],
    ['afterHz', 'after, hz', 'right'],
    ['afterRme', 'rme', 'left'],
    ['diff', 'diff', 'center'],
  ]);

  const beforeRefLink = `${config.repoLink}/commit/${config.beforeSha}`;
  const afterRefLink = `${config.repoLink}/commit/${config.afterSha}`;

  return `Measured performance chages between [${config.beforeSha}](${beforeRefLink}) and [${config.afterSha}](${afterRefLink}).
<details>
<summary>Show table</summary>

${stringTable}

> [!NOTE]
> **hz** – the number of operations per second (higher – better)
> **rme** – relative margin of error

</details>

Full log and details of [before](${config.beforeBenchStepLink}) and [after](${config.afterBenchStepLink}) benchmark lunch.`;
}

const hzFormatter = Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
});

const rmeFormatter = Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  style: 'percent',
});

const diffFormatter = Intl.NumberFormat('en-US', {
  maximumFractionDigits: 2,
  style: 'percent',
});

/**
 *
 * @param {BenchmarkSuiteResult} before
 * @param {BenchmarkSuiteResult} after
 */
export const compare = (before, after) => {
  const beforeResults = before.testResults;
  const afterResults = after.testResults;

  const table = [];

  for (const [description, cases] of Object.entries(afterResults)) {
    cases.sort((a, b) => a.rank - b.rank);
    for (const [index, afterCase] of cases.entries()) {
      const beforeCase = beforeResults[description].find(
        (bench) => bench.name === afterCase.name
      );
      const row = {
        desc: index === 0 ? description : '',
        name: afterCase.name,
        afterHz: hzFormatter.format(afterCase.hz),
        afterRme: '±' + rmeFormatter.format(afterCase.rme / 100),
      };
      if (beforeCase) {
        row.beforeHz = hzFormatter.format(beforeCase.hz);
        row.beforeRme = '±' + rmeFormatter.format(beforeCase.rme / 100);

        const diffValue = (afterCase.hz - beforeCase.hz) / beforeCase.hz;
        row.diff = diffFormatter.format(diffValue);
        if (diffValue < 0) {
          row.diff = `**${row.diff}**`;
        }
      }
      table.push(row);
    }
    // empty row as a separator in table
    table.push({});
  }
  // remove last empty row
  table.pop();
  return table;
};

/**
 *
 * @param {object[]} objects
 * @param {Array[string, string, "left" | "right" | "center"]} fields
 * @returns
 */
export function generateMarkdownTable(objects, columns) {
  const alignMap = {
    left: ':---',
    right: '---:',
    center: ':---:',
  };
  const headers = columns.map(([, header]) => `${header} |`);
  const aligns = columns.map(([, , align]) => `${alignMap[align]} |`);
  let table = `| ${headers.join(' ')}\n| ${aligns.join(' ')}\n`;
  objects.forEach((obj) => {
    let row = columns.map(([field]) => obj[field]);
    table += `| ${row.map((value) => `${value ?? ''} |`).join(' ')}\n`;
  });
  return table;
}

/**
 * @typedef {Object} BenchmarkResult
 * @property {string} name
 * @property {number} rank
 * @property {number} rme
 * @property {number} totalTime
 * @property {number} min
 * @property {number} max
 * @property {number} hz
 * @property {number} period
 * @property {number} mean
 * @property {number} variance
 * @property {number} sd
 * @property {number} sem
 * @property {number} df
 * @property {number} critical
 * @property {number} moe
 * @property {number} p75
 * @property {number} p99
 * @property {number} p995
 * @property {number} p999
 */

/**
 * An object representing the results of a test suite.
 *
 * @typedef {Object} BenchmarkSuiteResult
 * @property {number} numTotalTestSuites
 * @property {number} numTotalTests
 * @property {Object.<string, Array<BenchmarkResult>>} testResults
 */

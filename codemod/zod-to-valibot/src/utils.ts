import jscodeshift, { type Transform } from 'jscodeshift';
import fs from 'node:fs';
import path from 'node:path';
import { expect, test } from 'vitest';

const ALLOWED_EXTENSIONS = ['.ts', '.tsx'];

export function defineTests(transform: Transform) {
  const testFixturesPath = path.join(process.cwd(), '__testfixtures__');
  const testNames = fs.readdirSync(testFixturesPath);
  if (testNames.length === 0) {
    console.log('No tests found');
    return;
  }
  for (const testName of testNames) {
    const testPath = path.join(testFixturesPath, testName);
    const testFiles = fs.readdirSync(testPath);
    if (testFiles.length === 0) {
      console.log(`No test files found for "${testName}" test`);
      continue;
    }
    let inputFile = '';
    let outputFile = '';
    for (const testFile of testFiles) {
      if (testFile.startsWith('input') && inputFile === '') {
        inputFile = testFile;
      }
      if (testFile.startsWith('output') && outputFile === '') {
        outputFile = testFile;
      }
      if (inputFile !== '' && outputFile !== '') {
        break;
      }
    }
    if (inputFile === '' || outputFile === '') {
      console.log(`Invalid test file structure for "${testName}" test`);
      continue;
    }
    const inputFileExt = path.extname(inputFile);
    if (!ALLOWED_EXTENSIONS.includes(inputFileExt)) {
      console.log(`Invalid input file extension for "${testName}" test`);
      continue;
    }
    const j = jscodeshift.withParser(inputFileExt.slice(1));
    const source = fs.readFileSync(path.join(testPath, inputFile), 'utf8');
    const expectedOutput = fs.readFileSync(
      path.join(testPath, outputFile),
      'utf8'
    );
    test(testName, async () => {
      const output = await transform(
        { path: inputFile, source },
        { j, jscodeshift: j, stats: () => {}, report: () => {} },
        {}
      );
      expect(output?.trim()).toBe(expectedOutput.trim());
    });
  }
}

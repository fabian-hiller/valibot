/**
 * Merges two outputs into one single output.
 *
 * @param output1 First output.
 * @param output2 Second output.
 *
 * @returns The merged output.
 */
export function mergeOutputs(
  output1: any,
  output2: any
):
  | { output: any; invalid?: undefined }
  | { output?: undefined; invalid: true } {
  // Continue if data type of outputs match
  if (typeof output1 === typeof output2) {
    // Return first output if both are equal
    if (
      output1 === output2 ||
      (output1 instanceof Date &&
        output2 instanceof Date &&
        +output1 === +output2)
    ) {
      return { output: output1 };
    }

    // Return deeply merged array
    if (Array.isArray(output1) && Array.isArray(output2)) {
      // Continue if arrays have same length
      if (output1.length === output2.length) {
        // Create empty array
        const array: any[] = [];

        // Merge each array item
        for (let index = 0; index < output1.length; index++) {
          const result = mergeOutputs(output1[index], output2[index]);

          // If result is invalid, return it
          if (result.invalid) {
            return result;
          }

          // Otherwise, add merged items to array
          array.push(result.output);
        }

        // Return deeply merged array
        return { output: array };
      }

      // Return that arrays can't be merged
      return { invalid: true };
    }

    // Return deeply merged object
    if (
      output1 &&
      output2 &&
      output1.constructor === Object &&
      output2.constructor === Object
    ) {
      // Shallow merge both objects
      const object = { ...output1, ...output2 };

      // Deeply merge object items
      for (const key in output1) {
        if (key in output2) {
          const result = mergeOutputs(output1[key], output2[key]);

          // If result is invalid, return it
          if (result.invalid) {
            return result;
          }

          // Otherwise, set merged output
          object[key] = result.output;
        }
      }

      // Return deeply merged object
      return { output: object };
    }
  }

  // Return that outputs can't be merged
  return { invalid: true };
}

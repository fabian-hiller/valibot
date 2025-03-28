const findAndHandleCircularReferences = (
  dependenciesMap: Record<string, string[]>
): {
  selfReferencing: string[];
  circularReferences: Record<string, string[]>;
} => {
  const selfReferencing: string[] = [];
  const circularReferencesSet: Record<string, Set<string>> = {};

  for (const [schemaName, dependencies] of Object.entries(dependenciesMap)) {
    if (dependencies.includes(schemaName)) selfReferencing.push(schemaName);
    for (const dependency of dependencies) {
      if (
        dependenciesMap[dependency].includes(schemaName) &&
        dependency !== schemaName
      ) {
        circularReferencesSet[schemaName] ??= new Set();
        circularReferencesSet[schemaName].add(dependency);
      }
    }
  }

  const circularReferences = Object.fromEntries(
    Object.entries(circularReferencesSet).map(([k, v]) => [k, [...v]])
  );

  return { selfReferencing, circularReferences };
};

export { findAndHandleCircularReferences };

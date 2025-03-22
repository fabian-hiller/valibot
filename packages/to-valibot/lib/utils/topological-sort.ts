const topologicalSort = <T>(
  objects: Record<string, T>,
  dependsOn: Record<string, string[]>
) => {
  const visited = new Set();
  const entries: [string, T][] = [];

  const visit = (name: string) => {
    if (visited.has(name)) return;
    visited.add(name);

    const dependencies = dependsOn[name] ?? [];
    for (const dependency of dependencies) {
      visit(dependency);
    }

    entries.push([name, objects[name]]);
  };

  Object.keys(objects).forEach((name) => visit(name));

  return entries;
};

export { topologicalSort };

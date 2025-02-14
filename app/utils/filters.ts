/* eslint-disable no-param-reassign */
// Helper functions for trees/filtering
export const pathsToTreeNodes = (pathStrings: string[], pathDelimiter: string) => {
  const tree: { [key: string]: any } = {};
  function addNode(pathStr: string) {
    // add the pathDelimiter (e.g. '/', '-') to the beginning if it doesn't exist.
    const extendedPathStr = pathStr[0] !== pathDelimiter ? pathDelimiter + pathStr : pathStr;
    const splitPath = extendedPathStr.split(pathDelimiter);
    let ptr = tree;
    splitPath.forEach((path, i) => {
      const node = {
        label: path,
        id: splitPath.slice(0, i + 1).join(pathDelimiter),
      };

      ptr[path] = ptr[path] || node;
      ptr[path].children = ptr[path].children || {};
      ptr = ptr[path].children;
    });
  }

  function objectToArr(node: any) {
    if (node.children) {
      const children = Object.values(node.children);
      if (children.length > 0) {
        node.children = children;
        node.children.forEach(objectToArr);
      } else {
        node.children = null;
      }
    }
  }

  pathStrings.map(addNode);
  const allNodess = Object.values(tree);
  objectToArr(allNodess.length > 0 ? allNodess[0] : []);
  const allNodes = Object.values(tree);

  return allNodes.length === 0 ? [{ children: [] }] : allNodes;
};

export const defaultMatcher = (filterText: any, node: any) => node.name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;

export const findNode = (node: any, filter: any, matcher: any) =>
  matcher(filter, node) || // i match
  (node.children && // or i have decendents and one of them match
    node.children.length &&
    !!node.children.find((child: any) => findNode(child, filter, matcher)));

export const filterTree = (node: any, filter: any, matcher = defaultMatcher) => {
  // If im an exact match then all my children get to stay
  if (matcher(filter, node) || !node.children) {
    return node;
  }
  // If not then only keep the ones that match or have matching descendants
  const filtered = node.children.filter((child: any) => findNode(child, filter, matcher)).map((child: any) => filterTree(child, filter, matcher));
  return Object.assign({}, node, { children: filtered });
};

export const expandFilteredNodes = (n: any, f: any, m = defaultMatcher) => {
  const keys: string[] = [];
  const helper = (node: any, filter: any, matcher: any) => {
    let { children } = node;
    if (!children || children.length === 0) {
      return Object.assign({}, node, { toggled: false });
    }
    const childrenWithMatches = node.children.filter((child: any) => findNode(child, filter, matcher));
    const shouldExpand = childrenWithMatches.length > 0;
    // If im going to expand, go through all the matches and see if their children need to expand
    if (shouldExpand) {
      children = childrenWithMatches.map((child: any) => helper(child, filter, matcher));
      keys.push(node.key);
    }
    return Object.assign({}, node, {
      children,
      toggled: shouldExpand,
    });
  };

  const newNode = helper(n, f, m);

  return { node: newNode, keys };
};

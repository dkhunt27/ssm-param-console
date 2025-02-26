/* eslint-disable no-param-reassign */

import { TreeViewBaseItem } from '@mui/x-tree-view/models';

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
        node.children = undefined;
      }
    }
  }

  pathStrings.map(addNode);
  const allNodess = Object.values(tree);
  objectToArr(allNodess.length > 0 ? allNodess[0] : []);
  const allNodes = Object.values(tree);

  return allNodes.length === 0 ? [{ children: [] }] : allNodes;
};

const parsePathForSeparators = (params: { path: string; currIndex: number }): boolean => {
  const { path, currIndex } = params;

  if (currIndex === 0 && path[currIndex] !== '/') {
    throw new Error(`Invalid path; must start with "/": ${path}`);
  }

  if (currIndex == path.length && path[currIndex] === '/') {
    throw new Error(`Invalid path; cannot end with "/": ${path}`);
  }

  if (currIndex >= path.length) {
    throw new Error('Invalid index; must be less than path length');
  }

  const pos = path[currIndex];
  if (pos === '/') {
    return true;
  } else {
    return false;
  }
};

const parsePathPrefixBySeparators = (params: { path: string; separatorIndex: number; separator: string }): string => {
  const { path, separatorIndex, separator } = params;

  if (separatorIndex === 0) {
    throw new Error('Invalid separatorIndex; must be greater than 0');
  }

  if (separatorIndex >= path.length) {
    throw new Error('Invalid separatorIndex; must be less than path length');
  }

  if (path[separatorIndex] !== separator) {
    throw new Error(`Invalid index; must be "${separator}": ${path}:${separatorIndex}`);
  }

  if (separatorIndex == path.length - 1) {
    return path;
  }

  const index = path.indexOf(separator, separatorIndex);
  const result = path.slice(0, index);
  return result;
};

const buildHierarchy = (params: { path: string; separator: string }): string[] => {
  const { path, separator } = params;

  const hierarchy = [];

  // loop through each string looking for separators
  for (let i = 0; i < path.length; i++) {
    if (parsePathForSeparators({ path, currIndex: i })) {
      if (i === 0) {
        // first character should be separator, so skip
      } else {
        // if separator found, parse the prefix
        const prefix = parsePathPrefixBySeparators({ path, separatorIndex: i, separator });

        hierarchy.push(prefix);
      }
    }
  }
  return hierarchy;
};

const parseLabel = (params: { path: string; separator: string }): string => {
  const { path, separator } = params;

  const lastIndex = path.lastIndexOf(separator);

  if (lastIndex === -1) {
    throw new Error(`Invalid path; does not contain "${separator}": ${path}`);
  }
  return path.substring(lastIndex + 1);
};

export const processPathsToTree = (params: { paths: string[]; separator: string }): TreeViewBaseItem[] => {
  const { paths, separator } = params;

  const tree: TreeViewBaseItem[] = [];

  paths.forEach((item) => {
    const hierarchy = buildHierarchy({ path: item, separator });

    if (hierarchy.length === 0) {
      throw new Error(`Invalid path; could not parse hierarchy: ${item}`);
    }

    // where to search
    let parent = tree;
    let index = 0;
    let last: TreeViewBaseItem | undefined;

    while (index < hierarchy.length) {
      const hierarchyItem = hierarchy[index];

      // find if parent exists
      let found = parent.find((x) => x.id === hierarchyItem);

      if (!found) {
        // if no root parent, create it
        found = {
          id: hierarchyItem,
          label: parseLabel({ path: hierarchyItem, separator }),
          children: [],
        } as TreeViewBaseItem;

        parent.push(found);
      }

      // move to next hierarchy level
      last = found;
      parent = last.children as TreeViewBaseItem[];
      index++;
    }

    if (!last) {
      throw new Error('Invalid state; last should not be undefined');
    }

    last.children?.push({
      id: item,
      label: parseLabel({ path: item, separator }),
    });
  });

  return tree;
};

export const filterTree = (tree: TreeViewBaseItem[], filter: string): TreeViewBaseItem[] => {
  return tree.reduce((results, node) => {
    let filteredNode = null;

    if (node.label.toLowerCase().includes(filter.toLowerCase())) {
      filteredNode = { ...node };
    }

    if (node.children && node.children.length > 0) {
      const filteredChildren = filterTree(node.children, filter);
      if (filteredChildren.length > 0) {
        filteredNode = filteredNode ? filteredNode : { ...node };
        filteredNode.children = filteredChildren;
      }
    }

    if (filteredNode) {
      results.push(filteredNode);
    }

    return results;
  }, [] as TreeViewBaseItem[]);
};

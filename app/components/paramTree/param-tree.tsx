import { pathDelimiterAtom } from '@/app/store';
import { filterTree, processPathsToTree } from '@/app/utils/filters';
import { Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { ReactElement, useEffect, useState } from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';

type PropsType = {
  paramNames: string[];
  filterText: string;
  handleSearchTreeItemSelect: (event: React.SyntheticEvent, itemId: string, isSelected: boolean) => void;
};

export const ParamTree = (props: PropsType): ReactElement => {
  const { filterText, paramNames, handleSearchTreeItemSelect } = props;

  const pathDelimiter = useAtomValue(pathDelimiterAtom);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [unfilteredTree, setUnfilteredTree] = useState<TreeViewBaseItem[]>([]);
  const [filteredTree, setFilteredTree] = useState<TreeViewBaseItem[]>([]);

  useEffect(() => {
    if (paramNames && pathDelimiter) {
      const searchTreeNodes = processPathsToTree({ paths: paramNames, separator: pathDelimiter });

      setFilteredTree(searchTreeNodes);
      setUnfilteredTree(searchTreeNodes);
    }
  }, [filterText, paramNames, pathDelimiter]);

  useEffect(() => {
    if (filterText && unfilteredTree) {
      let filtered = filterTree(unfilteredTree, filterText);
      setFilteredTree(filtered);
    } else {
      setFilteredTree(unfilteredTree);
    }
  }, [filterText, unfilteredTree]);

  useEffect(() => {
    function recursiveKeys(node: TreeViewBaseItem): string[] {
      if (node.children === undefined) {
        return [node.id];
      } else {
        return [node.id, ...node.children?.flatMap(recursiveKeys)];
      }
    }

    const allKeys = filteredTree.flatMap(recursiveKeys);
    setExpanded(allKeys);
  }, [filteredTree]);

  return (
    <Stack>
      {!filteredTree && <div>Loading...</div>}
      {filteredTree && (
        <RichTreeView expandedItems={expanded} items={filteredTree} slots={{ item: TreeItem2 }} onItemSelectionToggle={handleSearchTreeItemSelect} />
      )}
    </Stack>
  );
};

import { pathDelimiterAtom } from '@/app/store';
import { expandFilteredNodes, filterTree, pathsToTreeNodes } from '@/app/utils/filters';
import { Button, Stack, TextField } from '@mui/material';
import { useAtomValue } from 'jotai';
import { settings } from 'nprogress';
import { ReactElement, useEffect, useState } from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

type PropsType = {
  data: any[];
  onSearchTreeSelect: (keys: string[]) => void;
};

const SearchTree = (props: PropsType): ReactElement => {
  const pathDelimiter = useAtomValue(pathDelimiterAtom);
  const { data, onSearchTreeSelect } = props;
  const [searchText, setSearchText] = useState('');
  const [treeRootNode, setTreeRootNode] = useState();
  const [filteredTreeRootNode, setFilteredTreeRootNode] = useState<TreeViewBaseItem[]>();
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);

  useEffect(() => {
    if (data && pathDelimiter) {
      const searchTreeNodes = pathsToTreeNodes(
        data.map((p) => p.Name),
        pathDelimiter
      )[0];

      setFilteredTreeRootNode(searchTreeNodes);
      setTreeRootNode(searchTreeNodes);
    }
  }, [data, pathDelimiter]);

  const onFilterChange = (e: any): void => {
    const filter = e.target && e.target.value.trim();
    if (filter) {
      let filtered = filterTree(treeRootNode, filter);
      filtered = expandFilteredNodes(filtered, filter);

      setFilteredTreeRootNode(filtered.node);
      setExpandedKeys(filtered.keys);
      setSearchText(filter);
    } else {
      setFilteredTreeRootNode(treeRootNode);
      setExpandedKeys([]);
      setSearchText('');
      return;
    }
  };

  return (
    <Stack>
      <h1>Param Tree</h1>
      <TextField
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
        value={searchText}
        onChange={onFilterChange}
        placeholder={`Search Tree (${data.length} parameters)`}
      />
      {/* <RichTreeView items={filteredTreeRootNode} /> */}
      <pre>{JSON.stringify(filteredTreeRootNode, null, 2)}</pre>
    </Stack>
  );
};

export default SearchTree;

import { pathDelimiterAtom } from '@/app/store';
import { filterTree, processPathsToTree } from '@/app/utils/filters';
import { Stack, TextField } from '@mui/material';
import { useAtomValue } from 'jotai';
import { ReactElement, useEffect, useState } from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';

type PropsType = {
  paramNames: string[];
  handleSearchTreeItemSelect: (event: React.SyntheticEvent, itemId: string, isSelected: boolean) => void;
};

const SearchTree = (props: PropsType): ReactElement => {
  const pathDelimiter = useAtomValue(pathDelimiterAtom);
  const { paramNames, handleSearchTreeItemSelect } = props;
  const [searchText, setSearchText] = useState('');
  const [unfilteredTree, setUnfilteredTree] = useState<TreeViewBaseItem[]>([]);
  const [filteredTree, setFilteredTree] = useState<TreeViewBaseItem[]>([]);

  useEffect(() => {
    if (paramNames && pathDelimiter) {
      const searchTreeNodes = processPathsToTree({ paths: paramNames, separator: pathDelimiter });

      setFilteredTree(searchTreeNodes);
      setUnfilteredTree(searchTreeNodes);
    }
  }, [paramNames, pathDelimiter]);

  const onFilterChange = (e: any): void => {
    const filter = e.target && e.target.value.trim();

    if (filter) {
      let filtered = filterTree(unfilteredTree, filter);

      setFilteredTree(filtered);
      setSearchText(filter);
    } else {
      // reset filter/search
      setFilteredTree(unfilteredTree);
      setSearchText('');
      return;
    }
  };

  return (
    <Stack>
      <h1>Param Tree</h1>
      <TextField id="outlined-basic" label="Search Parameters" variant="outlined" value={searchText} onChange={onFilterChange} />
      {!filteredTree && <div>Loading...</div>}
      {filteredTree && <RichTreeView items={filteredTree} slots={{ item: TreeItem2 }} onItemSelectionToggle={handleSearchTreeItemSelect} />}
    </Stack>
  );
};

export default SearchTree;

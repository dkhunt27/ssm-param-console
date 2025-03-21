import { pathDelimiterAtom } from '@/app/store';
import { filterTree, processPathsToTree } from '@/app/utils/filters';
import { Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { ReactElement, useEffect, useState } from 'react';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem, TreeViewItemId } from '@mui/x-tree-view/models';
import { styled, alpha } from '@mui/material/styles';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  color: theme.palette.grey[200],
  [`& .${treeItemClasses.content}`]: {
    borderRadius: theme.spacing(0.5),
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
    [`& .${treeItemClasses.label}`]: {
      fontSize: '0.8rem',
      fontWeight: 500,
    },
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    borderRadius: '50%',
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(0, 1.2),
    ...theme.applyStyles('light', {
      backgroundColor: alpha(theme.palette.primary.main, 0.25),
    }),
    ...theme.applyStyles('dark', {
      color: theme.palette.primary.contrastText,
    }),
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
  ...theme.applyStyles('light', {
    color: theme.palette.grey[800],
  }),
}));

type PropsType = {
  startingPath: string;
  paramNames: string[];
  filterText: string;
  handleSearchTreeItemSelect: (event: React.SyntheticEvent, itemId: string, isSelected: boolean) => void;
};

export const ParamTree = (props: PropsType): ReactElement => {
  const { startingPath, filterText, paramNames, handleSearchTreeItemSelect } = props;

  const pathDelimiter = useAtomValue(pathDelimiterAtom);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [unfilteredTree, setUnfilteredTree] = useState<TreeViewBaseItem[]>([]);
  const [filteredTree, setFilteredTree] = useState<TreeViewBaseItem[]>([]);

  useEffect(() => {
    if (paramNames && pathDelimiter) {
      const searchTreeNodes = processPathsToTree({ paths: paramNames, separator: pathDelimiter });

      setUnfilteredTree(searchTreeNodes);
    }
  }, [paramNames, pathDelimiter]);

  useEffect(() => {
    if (filterText && unfilteredTree) {
      let filtered = filterTree(unfilteredTree, filterText);
      setFilteredTree(filtered);
    } else {
      setFilteredTree(unfilteredTree);
    }
  }, [filterText, unfilteredTree]);

  // useEffect(() => {
  //   function recursiveKeys(node: TreeViewBaseItem): string[] {
  //     if (node.children === undefined) {
  //       return [node.id];
  //     } else {
  //       return [node.id, ...node.children?.flatMap(recursiveKeys)];
  //     }
  //   }

  //   const allKeys = filteredTree.flatMap(recursiveKeys);
  //   setExpanded(allKeys);
  // }, [filteredTree]);

  useEffect(() => {
    const parentIds = findParentIds(startingPath);
    setExpanded([...parentIds, startingPath]);
  }, [unfilteredTree]);

  const getAllItemsWithChildrenItemIds = () => {
    const itemIds: TreeViewItemId[] = [];
    const registerItemId = (item: TreeViewBaseItem) => {
      if (item.children?.length) {
        itemIds.push(item.id);
        item.children.forEach(registerItemId);
      }
    };

    unfilteredTree.forEach(registerItemId);

    return itemIds;
  };

  // const handleExpandedItemsChange = (event: React.SyntheticEvent, itemIds: string[]) => {
  //   console.log('expanded:', expanded);
  //   // console.log('itemIds:', itemIds);
  //   // setExpanded(itemIds);
  // };

  // const handleExpandClick = () => {
  //   setExpanded((oldExpanded) => (oldExpanded.length === 0 ? getAllItemsWithChildrenItemIds() : []));
  // };

  const findParentIds = (itemId: string): string[] => {
    const parts = itemId.split('/');
    const parentIds = [];
    for (let i = 1; i < parts.length; i++) {
      const part = parts.slice(0, i).join('/');
      if (part !== '') {
        parentIds.push(part);
      }
    }
    return parentIds;
  };

  const handleItemExpansionToggle = (event: React.SyntheticEvent, itemId: string, isExpanded: boolean) => {
    console.log('expanded:', expanded);
    console.log('itemId:', itemId);
    console.log('isExpanded:', isExpanded);
    // we only want to expand one item at a time, so need to clear out the expanded array
    // and only list this item and its parents
    const parentIds = findParentIds(itemId);
    console.log('parentIds:', parentIds);
    const newExpanded = [...parentIds, itemId];
    console.log('newExpanded:', newExpanded);
    setExpanded(newExpanded);
  };

  return (
    <Stack>
      {!unfilteredTree && <div>Loading...</div>}
      {unfilteredTree && (
        <RichTreeView
          expandedItems={expanded}
          // onExpandedItemsChange={handleExpandedItemsChange}
          items={unfilteredTree}
          slots={{ item: CustomTreeItem }}
          onItemSelectionToggle={handleSearchTreeItemSelect}
          onItemExpansionToggle={handleItemExpansionToggle}
        />
      )}
    </Stack>
  );
};

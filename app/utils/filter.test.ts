import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { filterTree, processPathsToTree } from './filters';

describe('filters', () => {
  let pathStrings: string[];
  let treeData: TreeViewBaseItem[];
  beforeEach(() => {
    pathStrings = [
      '/projA/subProjB/qa/apiUrl',
      '/projA/automation/sandbox/auth0ClientId',
      '/projA/automation/sandbox/auth0ClientSecret',
      '/projA/automation/nonProd/config',
    ];
    treeData = [
      // {
      //   children: [
      {
        children: [
          {
            children: [
              {
                children: [{ id: '/projA/subProjB/qa/apiUrl', label: 'apiUrl' }],
                id: '/projA/subProjB/qa',
                label: 'qa',
              },
            ],
            id: '/projA/subProjB',
            label: 'subProjB',
          },
          {
            children: [
              {
                children: [
                  { id: '/projA/automation/sandbox/auth0ClientId', label: 'auth0ClientId' },
                  { id: '/projA/automation/sandbox/auth0ClientSecret', label: 'auth0ClientSecret' },
                ],
                id: '/projA/automation/sandbox',
                label: 'sandbox',
              },
              {
                children: [{ id: '/projA/automation/nonProd/config', label: 'config' }],
                id: '/projA/automation/nonProd',
                label: 'nonProd',
              },
            ],
            id: '/projA/automation',
            label: 'automation',
          },
        ],
        id: '/projA',
        label: 'projA',
      },
      //   ],
      //   id: '',
      //   label: '',
      // },
    ];
  });
  describe('processPathsToTree', () => {
    it('should build tree', () => {
      const actual = processPathsToTree({ paths: pathStrings, separator: '/' });
      expect(actual).toStrictEqual(treeData);
    });
  });

  describe('filterTree', () => {
    it('should filter as expected', () => {
      const actual = filterTree(treeData, 'projb');
      expect(actual).toStrictEqual([
        // {
        // children: [
        {
          children: [
            {
              children: [{ children: [{ id: '/projA/subProjB/qa/apiUrl', label: 'apiUrl' }], id: '/projA/subProjB/qa', label: 'qa' }],
              id: '/projA/subProjB',
              label: 'subProjB',
            },
          ],
          id: '/projA',
          label: 'projA',
        },
        // ],
        //   id: '',
        //   label: '',
        // },
      ]);
    });
    it('should return partial tree if filter matches at last child', () => {
      const actual = filterTree(treeData, 'auth0ClientId');
      expect(actual).toStrictEqual([
        // {
        //   children: [
        {
          children: [
            {
              children: [
                {
                  children: [{ id: '/projA/automation/sandbox/auth0ClientId', label: 'auth0ClientId' }],
                  id: '/projA/automation/sandbox',
                  label: 'sandbox',
                },
              ],
              id: '/projA/automation',
              label: 'automation',
            },
          ],
          id: '/projA',
          label: 'projA',
        },
        //   ],
        //   id: '',
        //   label: '',
        // },
      ]);
    });
  });
});

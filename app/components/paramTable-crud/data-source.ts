import { paramsMock } from '@/app/data';
import { ParamType } from '@/app/types';
import { DataModel, DataSource, DataSourceCache, List } from '@toolpad/core/Crud';

let parameters = paramsMock;

export const paramsDataSource: DataSource<ParamType> = {
  fields: [
    { field: 'id', headerName: 'ARN' },
    { field: 'name', headerName: 'Name' },
    { field: 'description', headerName: 'Description' },
    { field: 'type', headerName: 'Type' },
    { field: 'value', headerName: 'Value' },
  ],
  getMany: ({ paginationModel, filterModel, sortModel }) => {
    return new Promise<{ items: ParamType[]; itemCount: number }>((resolve) => {
      setTimeout(() => {
        let processed = [...parameters];

        // Apply filters (demo only)
        if (filterModel?.items?.length) {
          filterModel.items.forEach(({ field, value, operator }) => {
            if (!field || value == null) {
              return;
            }

            processed = processed.filter((param) => {
              const paramValue = param[field as never];

              switch (operator) {
                case 'contains':
                  return String(paramValue).toLowerCase().includes(String(value).toLowerCase());
                case 'equals':
                  return paramValue === value;
                case 'startsWith':
                  return String(paramValue).toLowerCase().startsWith(String(value).toLowerCase());
                case 'endsWith':
                  return String(paramValue).toLowerCase().endsWith(String(value).toLowerCase());
                case '>':
                  return (paramValue as number) > value;
                case '<':
                  return (paramValue as number) < value;
                default:
                  return true;
              }
            });
          });
        }

        // Apply sorting
        if (sortModel?.length) {
          processed.sort((a, b) => {
            for (const { field, sort } of sortModel) {
              if ((a[field as never] as number) < (b[field as never] as number)) {
                return sort === 'asc' ? -1 : 1;
              }
              if ((a[field as never] as number) > (b[field as never] as number)) {
                return sort === 'asc' ? 1 : -1;
              }
            }
            return 0;
          });
        }

        // Apply pagination
        const start = paginationModel.page * paginationModel.pageSize;
        const end = start + paginationModel.pageSize;
        const paginated = processed.slice(start, end);

        resolve({
          items: paginated,
          itemCount: processed.length,
        });
      }, 750);
    });
  },
  getOne: async (id): Promise<ParamType> => {
    return new Promise<ParamType>((resolve, reject) => {
      setTimeout(() => {
        const found = parameters.find((param) => param.id === id);
        if (!found) {
          reject(new Error('Not found'));
        }
        resolve(found as ParamType);
      }, 750);
    });
  },
  createOne: async (data): Promise<ParamType> => {
    const newParam = { id: 'someArn', ...data } as ParamType;

    return new Promise<ParamType>((resolve) => {
      setTimeout(() => {
        parameters = [...parameters, newParam];

        resolve(newParam);
      }, 750);
    });
  },
  updateOne: (id, data): Promise<ParamType> => {
    let updated: ParamType;

    return new Promise<ParamType>((resolve, reject) => {
      setTimeout(() => {
        parameters = parameters.map((param) => {
          if (param.id === id) {
            updated = { ...param, ...data };
            return updated;
          }
          return param;
        });

        if (!updated) {
          reject(new Error('Not updated; not found'));
        }

        resolve(updated);
      }, 750);
    });
  },
  deleteOne: async (id): Promise<void> => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        parameters = parameters.filter((param) => param.id !== id);
        resolve();
      }, 750);
    });
  },
  validate: (formValues) => {
    let issues: { message: string; path: [keyof ParamType] }[] = [];

    if (!formValues.name) {
      issues = [...issues, { message: 'Name is required', path: ['name'] }];
    }
    if (!formValues.type) {
      issues = [...issues, { message: 'Type is required', path: ['type'] }];
    }
    if (!formValues.value) {
      issues = [...issues, { message: 'Value is required', path: ['value'] }];
    }

    return { issues };
  },
};

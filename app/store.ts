import { atomWithStorage } from 'jotai/utils';

// SETTINGS ATOMS
export const pathDelimiterAtom = atomWithStorage<string>('pathDelimiter', '/');
export const showDescriptionAtom = atomWithStorage<boolean>('showDescription', true);
export const showLastModifiedDateAtom = atomWithStorage<boolean>('showLastModifiedDate', true);
export const showTypeAtom = atomWithStorage<boolean>('showType', true);

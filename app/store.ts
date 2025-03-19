import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// SETTINGS ATOMS
export const awsRegionAtom = atomWithStorage<string>('awsRegion', 'us-west-2');
export const startingPathAtom = atomWithStorage<string>('startingPath', 'notSet');
export const pathDelimiterAtom = atomWithStorage<string>('pathDelimiter', '/');
export const showDescriptionAtom = atomWithStorage<boolean>('showDescription', true);
export const showLastModifiedDateAtom = atomWithStorage<boolean>('showLastModifiedDate', true);
export const showTypeAtom = atomWithStorage<boolean>('showType', true);

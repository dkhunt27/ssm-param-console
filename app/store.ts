import { atomWithStorage } from 'jotai/utils';

// SETTINGS ATOMS
export const pathDelimiterAtom = atomWithStorage<string>('pathDelimiter', '/');

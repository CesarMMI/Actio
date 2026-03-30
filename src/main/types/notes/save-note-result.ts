import type { Note } from './note';
import type { Reference } from '../references/reference';

export type SaveNoteResult = {
  note: Note;
  references: Reference[];
};

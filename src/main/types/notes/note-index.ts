import type { Note } from './note';

export type NoteIndex = Omit<Note, 'body'>;

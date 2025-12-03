import { User } from "./user";

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export type SortColumn = keyof User | null;

export interface SortState {
  column: SortColumn;
  direction: SortDirection | null;
}

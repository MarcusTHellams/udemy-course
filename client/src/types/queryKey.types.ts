import { OrderByType } from "orderBy.type";
import { FilterType } from "filter.type";

export type QueryKeysType = {
  all: readonly [string];
  lists: () => readonly [string, string];
  list: (
    filters: FilterType
  ) => readonly [string, string, number, number, OrderByType[], string];
  details: () => readonly [string, string];
  detail: (id: string | number) => readonly [string, string, string | number];
};

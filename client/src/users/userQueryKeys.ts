import { FilterType } from "types/filter.type";

export const userQueryKeys = {
  all: ["users"] as const,
  lists: () => [...userQueryKeys.all, "list"] as const,
  list: (filters: FilterType) =>
    [...userQueryKeys.lists(), ...filters] as const,
  details: () => [...userQueryKeys.all, "detail"] as const,
  detail: (id: string | number) => [...userQueryKeys.details(), id] as const,
};

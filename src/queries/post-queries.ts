import { queryOptions } from "@tanstack/react-query";
import { postsApi } from "../api/posts-api";

export const postQueries = {
  all: () => ["posts"],

  lists: () => [...postQueries.all(), "list"],

  list: (filters: string) =>
    queryOptions({
      queryKey: [...postQueries.lists(), filters],

      queryFn: () => postsApi.getAll(filters),
    }),

  details: () => [...postQueries.all(), "detail"],

  detail: (id: number) =>
    queryOptions({
      queryKey: [...postQueries.details(), id],

      queryFn: () => postsApi.getById(id),
    }),
};

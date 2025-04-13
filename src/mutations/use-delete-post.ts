import { useMutation } from "@tanstack/react-query";
import { postsApi } from "../api/posts-api";

export const deletePostMutationKey = ["delete-post"];
export const deletePostMutationDefaults = {
  mutationKey: deletePostMutationKey,
  mutationFn: postsApi.delete,
  retry: 2,
};

export const useDeltePost = () => {
  return useMutation({
    ...deletePostMutationDefaults,
  });
};

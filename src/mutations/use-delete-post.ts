import { useQueryClient, useMutation } from "@tanstack/react-query";
import { postsApi, Post } from "../api/posts-api";
import { postQueries } from "../queries/post-queries";
import { ContextMetadata } from "../utils/mutations";

export const deletePostMutationKey = ["delete-post"];
export const deletePostMutationDefaults = {
  mutationKey: deletePostMutationKey,
  mutationFn: postsApi.delete,
  retry: 2,
};

export const useDeltePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...deletePostMutationDefaults,
    onMutate: async (variables) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: postQueries.all() });

      // Get previous posts
      const previousPosts = queryClient.getQueryData<Post[]>(
        postQueries.list("").queryKey
      );
      // Optimistically update to the new value
      queryClient.setQueryData<Post[]>(postQueries.list("").queryKey, [
        ...(previousPosts || []).filter((post) => post.id !== variables),
      ]);

      const metadata: ContextMetadata = {
        title: `Post ${variables} delete`,
        postId: variables,
      };
      // Return a context object with the snapshotted value
      return {
        previousPosts,
        metadata,
      };
    },
    onError: (_err, _variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousPosts) {
        queryClient.setQueryData<Post[]>(
          postQueries.list("").queryKey,
          context.previousPosts
        );
      }
    },
  });
};

import { useMutationState, useQuery } from "@tanstack/react-query";
import React from "react";
import { postQueries } from "../queries/post-queries";
import { Badge, Card, Group, Stack, Text } from "@mantine/core";
import PostCard from "./post-card";
import { useDeltePost } from "../mutations/use-delete-post";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PostsProps {}

const Posts: React.FC<PostsProps> = () => {
  const posts = useQuery(postQueries.list(""));
  const deletePost = useDeltePost();

  const pendingMutations = useMutationState({
    filters: {
      status: "pending",
      mutationKey: [],
    },
    select(mutation) {
      return {
        mutationId: mutation.mutationId,
        state: mutation.state,
      };
    },
  });

  const handleDelete = (id: number) => {
    deletePost.mutate(id);
  };

  return (
    <Stack p="md">
      {pendingMutations.map((mutation) => (
        <Card withBorder>
          <Text fw="bold">Mutation: {mutation.mutationId}</Text>
          <Group>
            <Badge color="orange">Status: {mutation.state.status}</Badge>
            <Badge color="violet">
              isPaused: {mutation.state.isPaused ? "true" : "false"}
            </Badge>
          </Group>
        </Card>
      ))}
      {posts.data?.map((post) => (
        <PostCard key={post.id} onDelete={handleDelete} {...post} />
      ))}
    </Stack>
  );
};

export default Posts;

import { Button, Card, Group, Text } from "@mantine/core";
import React from "react";

interface PostCardProps {
  id: number;
  title: string;
  body: string;
  onDelete?: (id: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  title,
  body,
  id,

  onDelete,
}) => {
  return (
    <Card withBorder>
      <Text fw={500}>{title}</Text>

      <Text size="sm" c="dimmed">
        {body}
      </Text>
      <Group>
        <Button
          mt="md"
          variant="outline"
          color="red"
          onClick={() => {
            if (onDelete) {
              onDelete(id);
            }
          }}
        >
          Delete
        </Button>
      </Group>
    </Card>
  );
};

export default PostCard;

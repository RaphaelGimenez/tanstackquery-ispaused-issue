export type ContextMetadata = {
  title: string;
  postId?: number;
};
export type TypedContext =
  | {
      metadata: ContextMetadata;
    }
  | undefined;

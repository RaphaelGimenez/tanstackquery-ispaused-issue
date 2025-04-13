export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
  createdAt: string;
}

export interface CreatePostDto extends Omit<Post, "id" | "createdAt"> {
  id?: number;
}

export const postsApi = {
  getAll: async () => {
    return new Promise<Post[]>((resolve) => {
      setTimeout(() => {
        const fakePosts: Post[] = [
          {
            id: 1,
            title: "Fake Post 1",
            body: "This is a fake post.",
            userId: 1,
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            title: "Fake Post 2",
            body: "This is another fake post.",
            userId: 2,
            createdAt: new Date().toISOString(),
          },
        ];
        resolve(fakePosts);
      }, 1000); // Simulate network delay
    });
  },
  delete: (id: number) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        console.log(`Fake delete post with id: ${id}`);
        reject();
      }, 1500); // Simulate network delay
    });
  },
};

import { apiClient } from "./client";

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
  getAll: async (filters: string) => {
    const posts = await apiClient
      .get("posts", {
        searchParams: {
          _sort: "createdAt",
          _order: "desc",
          filters,
        },
      })
      .json<Post[]>();

    return posts;
  },
  getById: (id: number) => {
    return apiClient.get(`posts/${id}`).json<Post>();
  },
  create: (data: CreatePostDto) => {
    return apiClient
      .post("posts", {
        json: {
          ...data,
          createdAt: new Date().toISOString(),
        },
      })
      .json();
  },
  update: (data: Post) => {
    return apiClient.put(`posts/${data.id}`, { json: data }).json();
  },
  delete: (id: number) => {
    return apiClient.delete(`posts/${id}`).json();
  },
};

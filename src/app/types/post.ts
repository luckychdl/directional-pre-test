export type PostRequestData = {
  limit: number;
  prevCursor?: string;
  nextCursor?: string;
  sort?: "createdAt" | "title" | null;
  order?: "asc" | "desc" | null;
  category?: "NOTICE" | "QNA" | "FREE" | null;
  from?: string;
  to?: string;
  search?: string;
};

export type PostsList = {
  items: PostItems[];
  prevCursor: string;
  nextCursor: string;
};
export type PostItems = {
  id: number;
  userId: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
};

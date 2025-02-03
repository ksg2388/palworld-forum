export type TComment = {
  id: number;
  author: string;
  content: string;
  child_comments?: TComment[];
};

export type TPost = {
  id: number;
  dtype: "announcement" | "data" | "free" | "guide" | "promotion";
  author: string;
  nickname: string;
  member_role: "ADMIN" | "PARTNER" | "NORMAL" | "LEGENDARY" | "HEROIC" | "RARE" | "EXTRA_ORDINARY";
  title: string;
  content: string;
  attachments: string[];
  hits: number;
  count_of_comments: number;
  comments: TComment[];
  created_at: string;
  modified_at: string;
};

export type TPostResponse = {
  http_status: string;
  message: string;
  data: TPost[];
};

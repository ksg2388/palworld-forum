export type TCommunity = {
  id: number;
  dtype: string;
  author: string;
  nickname: string;
  member_role:
    | "ADMIN"
    | "PARTNER"
    | "NORMAL"
    | "LEGENDARY"
    | "HEROIC"
    | "RARE"
    | "EXTRA_ORDINARY";
  title: string;
  content: string;
  attachments: string[];
  hits: number;
  count_of_comments: number;
  comments: TComment[];
  created_at: string;
  modified_at: string;
  notice?: boolean;
};

export type TComment = {
  id: number;
  author: string;
  content: string;
  nickname: string;
  modified_at: string;
  member_role:
    | "ADMIN"
    | "PARTNER"
    | "NORMAL"
    | "LEGENDARY"
    | "HEROIC"
    | "RARE"
    | "EXTRA_ORDINARY";
  child_comments: TComment[];
};

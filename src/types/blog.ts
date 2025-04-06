export type TCreateBlogPayload = {
  title: string;
  content: string;
};

export type TUpdateBlogPayload = {
  title?: string;
  content?: string;
};

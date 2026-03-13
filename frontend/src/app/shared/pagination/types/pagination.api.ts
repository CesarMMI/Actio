export type PaginationRequest<T extends string = string> = {
  page?: number;
  limit?: number;
  sortBy?: T;
  order?: 'asc' | 'desc';
};

export type PaginationResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type TitleEntityRequest = PaginationRequest<'createdAt' | 'updatedAt' | 'title'>;

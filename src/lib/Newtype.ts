type Nominal<T> = {
  readonly symbol: T;
};

export type Tagged<Tag extends string, A> = A & Nominal<Tag>;

export type Constructor<T = any> = {
  readonly prototype: T;
  new (...args: any[]): T;
};

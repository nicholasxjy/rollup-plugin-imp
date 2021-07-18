export interface LibItem {
  libName: string;
  libDirectory: string;
  style: (name: string) => string;
}

export interface Options {
  libList: LibItem[];
  include: any[];
  exclude: any[];
}

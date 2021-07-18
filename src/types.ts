import { FilterPattern } from "@rollup/pluginutils";
export interface LibItem {
  libName: string;
  libDirectory: string;
  style: (name: string) => string;
}

export interface Options {
  libList: LibItem[];
  include?: FilterPattern;
  exclude: FilterPattern;
}

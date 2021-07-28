import { FilterPattern } from "@rollup/pluginutils";
export interface LibItem {
  libName: string;
  libDirectory: string;
  camel2DashComponentName: boolean
  style: boolean | (name: string) => string;
}

export interface Options {
  libList: LibItem[];
  include?: FilterPattern;
  exclude: FilterPattern;
}

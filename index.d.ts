import { FilterPattern } from "@rollup/pluginutils";
import { Plugin } from "rollup";
import { Options } from "./src/types";

declare function createPlugin(options: Options): Plugin;

export default createPlugin;

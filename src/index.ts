import pluginutils from "@rollup/pluginutils";
import MagicString from "magic-string";
import path from "path";
import { find, isFunction } from "lodash";
import { paramCase } from "param-case";
import { parse } from "@babel/parser";
import { Options } from "./types";

const resolveExtensions = [".js", ".jsx", ".ts", ".tsx"];
const babelParserPlugins = [
  "estree",
  "jsx",
  "typescript",
  "asyncGenerators",
  "bigInt",
  "classPrivateMethods",
  "classPrivateProperties",
  "classProperties",
  "decorators-legacy",
  "doExpressions",
  "dynamicImport",
  "exportDefaultFrom",
  "exportExtensions",
  "exportNamespaceFrom",
  "functionBind",
  "functionSent",
  "importMeta",
  "nullishCoalescingOperator",
  "numericSeparator",
  "objectRestSpread",
  "optionalCatchBinding",
  "optionalChaining",
  ["pipelineOperator", { proposal: "minimal" }],
  "throwExpressions",
];

function pluginImp(options: Options = {}) {
  if (!options || !options.libList || !options.libList.length) {
    throw new Error("imp options libList should be an array");
  }
  const filter = pluginutils.createFilter(options.include, options.exclude);
  return {
    name: "rollup-plugin-imp",
    transform(code, id) {
      const ms = new MagicString(code);
      if (!filter(id)) return null;
      // should process [.ts .tsx .js .jsx]
      const extname = path.extname(id);
      if (!resolveExtensions.includes(extname)) return null;
      const ast = parse(code, {
        sourceType: "module",
        plugins: babelParserPlugins,
      });
      if (!ast || !ast.program) return null;
      if (Array.isArray(ast.program.body)) {
        ast.program.body.forEach((node) => {
          // console.log('node: ', node)
          const nodeSourceName =
            node && node.source && node.source.value ? node.source.value : "";
          const lib = find(
            options.libList,
            (v) => v.libName === nodeSourceName
          );
          if (node.type === "ImportDeclaration" && lib) {
            const impList = [];
            if (node.specifiers && node.specifiers.length) {
              node.specifiers.forEach((specifier) => {
                const importedName =
                  specifier && specifier.imported && specifier.imported.name
                    ? specifier.imported.name
                    : "";
                const localName =
                  specifier && specifier.local && specifier.local.name
                    ? specifier.local.name
                    : "";
                if (!importedName) return null;
                // localname for as (import a as aa from '')
                const exportName = lib.camel2DashComponentName
                  ? paramCase(importedName)
                  : importedName;
                impList.push(
                  `import ${localName} from '${lib.libName}/${lib.libDirectory}/${exportName}'`
                );
                if (lib.style && isFunction(lib.style)) {
                  const stylePath = lib.style(exportName);
                  if (stylePath) {
                    // push style
                    impList.push(`import '${stylePath}'`);
                  }
                }
              });
            }
            if (impList.length) {
              ms.overwrite(node.start, node.end, impList.join("\n"));
            }
          }
        });
      }
      const sourcemap =
        this && this.getCombinedSourceMap ? this.getCombinedSourceMap() : null;
      return {
        code: ms.toString(),
        map: sourcemap,
      };
    },
  };
}

export default pluginImp;

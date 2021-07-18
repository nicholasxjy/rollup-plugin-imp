import pluginutils from "@rollup/pluginutils";
import MagicString from "magic-string";
import { find } from "lodash";
import { parse } from "@babel/parser";
import { Options } from "./types";

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

function pluginImp(options: Options) {
  if (!options || !options.libList || !options.libList.length) {
    throw new Error("imp options libList should be an array");
  }
  const filter = pluginutils.createFilter(options.include, options.exclude);
  return {
    name: "rollup-plugin-imp",
    transform(code, id) {
      const ms = new MagicString(code);
      if (!filter(id)) return null;
      const ast = parse(code, {
        sourceType: "module",
        plugins: babelParserPlugins,
      });
      if (!ast || !ast.program) return null;
      if (Array.isArray(ast.program.body)) {
        ast.program.body.forEach((node) => {
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
                impList.push(
                  `import ${localName} from '${lib.libName}/${
                    lib.libDirectory
                  }/${importedName.toLowerCase()}'`
                );
                // push style
                impList.push(
                  `import '${lib.style(importedName.toLowerCase())}'`
                );
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

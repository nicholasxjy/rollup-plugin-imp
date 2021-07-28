# rollup-plugin-imp

A rollup plugin for library component modular import

### install

```
npm i -D rollup-plugin-imp

yarn add -D rollup-plugin-imp
```

### how to use

```js
// in your rollup config
// demo below
const config = {
  plugins: [
    nodeResolve(),
    commonjs(),
    postcss({
      minimize: false,
      autoModules: true,
    }),
    image(),
    imp({
      libList: [
        {
          libName: "akagami-ui",
          libDirectory: "lib",
          camel2DashComponentName: true, // required => TableColumn - table-column
          style(name) {
            return `akagami-ui/lib/${name}/style/index.css`;
          },
        },
        {
          libName: "akagami-commmon",
          libDirectory: "es",
          camel2DashComponentName: true, // required => Modal - modal
          style(name) {
            return `akagami-commmon/es/${name}/style/index.less`;
          },
        },
        {
          libName: "akagami-legacy",
          libDirectory: "es",
          camel2DashComponentName: true,
          // no need to import style
          // just dont set style
        },
      ],
    }),
  ],
};
```

### how it works

```js
import { Button, Icon } from "ui";

// it will transform below
import Button from "ui/lib/button";
import "ui/lib/button/style/index.css";
import Icon from "ui/lib/icon";
import "ui/lib/icon/style/index.css";
```

### emm

It seems work fine as a vite plugin too

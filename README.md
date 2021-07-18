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
          style(name) {
            return `akagami-ui/lib/${name}/style/index.css`;
          },
        },
        {
          libName: "akagami-commmon",
          libDirectory: "es",
          style(name) {
            return `akagami-commmon/es/${name}/style/index.less`;
          },
        },
      ],
    }),
  ],
};
```

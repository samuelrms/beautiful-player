const typescript = require("rollup-plugin-typescript2");
const postcss = require("rollup-plugin-postcss");
const terser = require("@rollup/plugin-terser");

module.exports = {
  input: "src/index.ts",
  output: [
    { file: "dist/beautiful-player.esm.js", format: "esm", sourcemap: true },
    {
      file: "dist/beautiful-player.umd.js",
      format: "umd",
      name: "BeautifulPlayer",
      sourcemap: true,
    },
  ],
  plugins: [
    typescript({ tsconfig: "./tsconfig.json", clean: true }),
    postcss({ extract: false }),
    terser(),
  ],
};

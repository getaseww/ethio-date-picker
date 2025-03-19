import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "index.tsx", 
    output: [
      { file: "dist/index.js", format: "es", sourcemap: true }, 
      { file: "dist/index.cjs.js", format: "cjs", sourcemap: true } 
    ],
    plugins: [resolve(), commonjs(), typescript()],
    external: ["react"]
  },
  {
    input: "dist/types/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()]
  }
];

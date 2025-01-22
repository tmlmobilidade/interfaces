import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const originalPackageJson = JSON.parse(readFileSync(resolve(__dirname, "../package.json"), "utf-8"));

const newPackageJson = {
  ...originalPackageJson,
  name: "@tmlmobilidade/core-types",
  exports: {
    ".": {
      import: "./dist/index.mjs",
      types: "./dist/index.d.ts",
      require: "./dist/index.js"
    }
  }
};

writeFileSync(resolve(__dirname, "../package.json"), JSON.stringify(newPackageJson, null, 2));

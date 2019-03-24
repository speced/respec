import * as path from "path";
import { readFileSync } from "fs";

/**
 * @param {string} fileName
 */
export function loadAssetOnNode(fileName) {
  return readFileSync(
    path.resolve(__dirname, "../../assets", fileName),
    "utf-8"
  );
}

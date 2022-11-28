import { Content } from "mdast";
import { PixivNode } from "pixiv-novel-parser";

export function transpile<T extends PixivNode>(nodes: T[]): Content[] {
  return [];
}

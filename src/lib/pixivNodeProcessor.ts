import {
  Chapter,
  JumpPage,
  JumpUrl,
  NewPage,
  Node as PixivBaseNode,
  PixivImage,
  PixivNode,
  Ruby,
  Text
} from "pixiv-novel-parser";

interface Break extends PixivBaseNode {
  type: "break";
}

interface HardBreak extends PixivBaseNode {
  type: "hardbreak";
}

export type PixivFlowContent = Chapter | NewPage | PixivPhrasingContent[];
export type PixivPhrasingContent =
  | PixivImage
  | JumpPage
  | JumpUrl
  | PixivStaticPhrasingContent;
export type PixivStaticPhrasingContent = Text | Ruby | Break;

export function buildPixivNodeTree<T extends PixivNode>(
  nodes: T[]
): PixivFlowContent[] {
  const result: PixivFlowContent[] = [];
  const inlineNode: {
    _data: PixivPhrasingContent[];
    apply: () => void;
    push: (node: PixivPhrasingContent) => void;
    length: () => number;
  } = {
    _data: [],
    apply() {
      if (this._data.length >= 1) {
        result.push(this._data);
      }
      this._data = [];
    },
    push(node) {
      this._data.push(node);
    },
    length() {
      return this._data.length;
    }
  };
  [...nodes].map(convertLineBreaks).forEach((node) => {
    if (
      !Array.isArray(node) &&
      node.type === "tag" &&
      (node.name === "chapter" || node.name === "newpage")
    ) {
      inlineNode.apply();
      result.push(node);
    } else if (Array.isArray(node)) {
      node.forEach((iNode) => {
        if (iNode.type === "hardbreak") {
          inlineNode.apply();
        } else if (!(iNode.type === "break" && inlineNode.length() === 0)) {
          inlineNode.push(iNode);
        }
      });
    } else {
      inlineNode.push(node);
    }
  });
  inlineNode.apply();
  return result;
}

function convertLineBreaks<T extends PixivNode>(
  node: T
): T | (Text | Break | HardBreak)[] {
  if (node.type !== "text") {
    return node;
  }
  return node.val
    .replaceAll(/^\n+|\n+$/gu, "")
    .replaceAll("\n\n", "\0HardBreak\0")
    .replaceAll("\n", "\0Break\0")
    .split("\0")
    .filter((text) => text.length > 0)
    .map((text) => {
      switch (text) {
        case "HardBreak": {
          return { type: "hardbreak" };
        }
        case "Break": {
          return { type: "break" };
        }
        default: {
          return { type: "text", val: text };
        }
      }
    });
}

import {
  BlockContent,
  Heading,
  Link,
  Paragraph,
  PhrasingContent,
  Ruby,
  StaticPhrasingContent,
  Text
} from "mdast";
import {
  Chapter as PixivChapter,
  JumpPage as PixivJumpPage,
  JumpUrl as PixivJumpUrl,
  NewPage as PixivNewPage,
  PixivImage,
  PixivNode,
  Ruby as PixivRuby,
  Text as PixivText
} from "pixiv-novel-parser";

type PixivFlowContent = PixivChapter | PixivNewPage | PixivPhrasingContent[];
type PixivPhrasingContent =
  | PixivImage
  | PixivJumpPage
  | PixivJumpUrl
  | PixivStaticPhrasingContent;
type PixivStaticPhrasingContent = PixivText | PixivRuby;

export function transpile<T extends PixivNode>(nodes: T[]): BlockContent[] {
  return buildPixivNodeTree([...nodes]).map(convertFlowContent);
}

function buildPixivNodeTree<T extends PixivNode>(
  nodes: T[]
): PixivFlowContent[] {
  const result: PixivFlowContent[] = [];
  let innerNodes: PixivPhrasingContent[] = [];
  for (const node of nodes) {
    if (
      node.type === "tag" &&
      (node.name === "chapter" || node.name === "newpage")
    ) {
      if (innerNodes.length >= 1) {
        result.push(innerNodes);
      }
      innerNodes = [];
      result.push(node);
    } else {
      innerNodes.push(node);
    }
  }
  if (innerNodes.length >= 1) {
    result.push(innerNodes);
  }
  return result;
}

function convertFlowContent<T extends PixivFlowContent>(node: T): BlockContent {
  if (Array.isArray(node)) {
    return convertParagraph(node);
  } else if (node.name === "chapter") {
    return convertChapter(node);
  } else {
    return convertNewpage(node);
  }
}

function convertPhrasingContent<T extends PixivPhrasingContent>(
  node: T
): PhrasingContent {
  if (node.type === "tag" && node.name === "pixivimage") {
    return convertPixivImage(node);
  } else if (node.type === "tag" && node.name === "jump") {
    return convertJumpPage(node);
  } else if (node.type === "tag" && node.name === "jumpuri") {
    return convertJumpUrl(node);
  } else {
    return convertStaticPhrasingContent(node);
  }
}

function convertStaticPhrasingContent<T extends PixivStaticPhrasingContent>(
  node: T
): StaticPhrasingContent {
  switch (node.type) {
    case "text": {
      return convertText(node);
    }
    case "tag": {
      switch (node.name) {
        case "rb": {
          return convertRuby(node);
        }
      }
    }
  }
}

function convertParagraph<T extends PixivPhrasingContent>(
  nodes: T[]
): Paragraph {
  return {
    type: "paragraph",
    children: [...nodes].map(convertPhrasingContent)
  };
}

function convertChapter(node: PixivChapter): Heading {
  return {
    type: "heading",
    depth: 2,
    children: node.title.map(convertPhrasingContent)
  };
}

function convertNewpage(node: PixivNewPage): Heading {
  return { type: "heading", depth: 2, children: [] };
}

function convertText(node: PixivText): Text {
  return { type: "text", value: node.val };
}
function convertRuby(node: PixivRuby): Ruby {
  return { type: "ruby", value: node.rubyBase, ruby: node.rubyText };
}

function convertPixivImage(node: PixivImage): Link {
  const artworkUrl = new URL(
    [node.illustID, node.pageNumber]
      .filter((item): item is NonNullable<typeof item> => item != null)
      .join("#"),
    "https://www.pixiv.net/artworks/"
  );
  return {
    type: "link",
    url: artworkUrl.href,
    children: [{ type: "text", value: node.illustID }]
  };
}

function convertJumpPage(node: PixivJumpPage): Link {
  return {
    type: "link",
    url: `#${node.pageNumber}`,
    children: [{ type: "text", value: `${node.pageNumber}` }]
  };
}

function convertJumpUrl(node: PixivJumpUrl): Link {
  return {
    type: "link",
    url: node.uri,
    children: node.title.map(convertStaticPhrasingContent)
  };
}

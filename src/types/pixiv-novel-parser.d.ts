// Type definition for npm module "pixiv-novel-parser".

enum NodeTypes {
  Text = "text",
  Tag = "tag"
}

enum TagNames {
  NewPage = "newpage",
  Ruby = "rb",
  Chapter = "chapter",
  PixivImage = "pixivimage",
  JumpPage = "jump",
  JumpUrl = "jumpurl"
}

declare module "pixiv-novel-parser" {
  export class Parser<T extends Node> {
    tree: T[];
    static parse<T extends Node>(novel: string): T[];
    parse(novel: string): Parser;
  }

  export interface Node {
    type: NodeTypes;
  }

  export interface Text extends Node {
    type: NodeTypes.Text;
    val: string;
  }

  export interface Tag extends Node {
    type: NodeTypes.Tag;
    name: TagNames;
  }

  export interface NewPage extends Tag {
    name: TagNames.NewPage;
  }

  export interface Ruby extends Tag {
    name: TagNames.Ruby;
    rubyBase: string;
    rubyText: string;
  }

  export interface Chapter extends Tag {
    name: TagNames.Chapter;
    title: string;
  }

  export interface PixivImage extends Tag {
    name: TagNames.PixivImage;
    illustID: string;
    pageNumber: string | null;
  }

  export interface JumpPage extends Tag {
    name: TagNames.JumpPage;
    pageNumber: number;
  }

  export interface JumpUrl extends Tag {
    name: TagNames.JumpUrl;
    title: string;
    url: string;
  }
}
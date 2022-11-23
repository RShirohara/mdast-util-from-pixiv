// mdast type definitions.

import { Literal } from "mdast";

declare module "mdast" {
  export interface Ruby extends Literal {
    type: "ruby";
    ruby: string;
  }

  export interface StaticPhrasingContentMap {
    ruby: Ruby;
  }
}

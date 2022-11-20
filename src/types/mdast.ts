/**
 * mdast type definitions.
 */

import { Literal, StaticPhrasingContent as SpcOnMdast } from "mdast";

enum NodeTypes {
  Ruby = "ruby"
}

export interface Ruby extends Literal {
  type: NodeTypes.Ruby;
  ruby: string;
}

export type StaticPhrasingContent = SpcOnMdast | Ruby;

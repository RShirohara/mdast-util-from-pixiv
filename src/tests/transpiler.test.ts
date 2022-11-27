import { Content } from "mdast";
import { PixivNode } from "pixiv-novel-parser";

import { transpile } from "../transpiler";

describe("FlowContent", () => {
  describe("Paragraph", () => {
    test("Text (text)を格納できる", () => {});
    test("Ruby (ruby)を格納できる", () => {});
    test("Link (pixivimage, jump, jumpurl) を格納できる", () => {});
    test("1個の改行は Break に変換される", () => {});
    test("2個以上の改行は新たな Paragraph に分割される", () => {});
    test("前後の改行を取り除く", () => {});
  });

  describe("chapter (Heading)", () => {
    test("Text (text)を格納できる", () => {});
    test("Ruby (ruby)を格納できる", () => {});
    test("前後の改行を取り除く", () => {});
  });

  describe("newpage (Heading)", () => {
    test("ちゃんとページを分割できる", () => {});
    test("ページ番号が連続で採番される", () => {});
    test("前後の改行を取り除く", () => {});
  });
});

describe("PhrasingContent", () => {
  describe("text (Text)", () => {
    test("ただのテキストはちゃんとただのテキストになる", () => {});
    test("改行は含まれない", () => {});
  });

  describe("ruby (Ruby)", () => {
    test("ルビをちゃんと認識できる", () => {});
  });

  describe("pixivimage (Link)", () => {
    test("画像形式のpixivimageをちゃんと変換できる", () => {});
    test("漫画形式のpixivimageをちゃんと変換できる", () => {});
  });

  describe("jump (Link)", () => {
    test("ページジャンプをちゃんとlinkにできる", () => {});
  });

  describe("jumpurl (Link)", () => {
    test("正常なURLをちゃんと Link にできる", () => {});
    test("Ruby (ruby) を格納できる", () => {});
  });
});

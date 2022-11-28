import { Content } from "mdast";
import { PixivNode } from "pixiv-novel-parser";

import { transpile } from "../transpiler";

describe("FlowContent", () => {
  describe("Paragraph", () => {
    test("Text (text)を格納できる", () => {
      const pixivAst: PixivNode[] = [{ type: "text", val: "ただのテキスト" }];
      const expectedAst: Content[] = [
        {
          type: "paragraph",
          children: [{ type: "text", value: "ただのテキスト" }]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });

    test("Ruby (ruby)を格納できる", () => {
      const pixivAst: PixivNode[] = [
        { type: "tag", name: "rb", rubyBase: "換言", rubyText: "かんげん" },
        { type: "text", val: "すれば" },
        { type: "tag", name: "rb", rubyBase: "畢竟", rubyText: "ひっきょう" },
        { type: "text", val: "ももんが" }
      ];
      const expectedAst: Content[] = [
        {
          type: "paragraph",
          children: [
            { type: "ruby", value: "換言", ruby: "かんげん" },
            { type: "text", value: "すれば" },
            { type: "ruby", value: "畢竟", ruby: "ひっきょう" },
            { type: "text", value: "ももんが" }
          ]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });

    test("Link (pixivimage, jump, jumpurl) を格納できる", () => {
      const pixivAst: PixivNode[] = [
        { type: "tag", name: "pixivimage", illustID: "000001", pageNumber: 2 },
        { type: "tag", name: "jump", pageNumber: 1 },
        {
          type: "tag",
          name: "jumpuri",
          title: [
            {
              type: "text",
              val: "[pixiv]"
            }
          ],
          uri: "http://www.pixiv.net/"
        }
      ];
      const expectedAst: Content[] = [
        {
          type: "paragraph",
          children: [
            {
              type: "link",
              url: "https://www.pixiv.net/artworks/000001",
              children: [{ type: "text", value: "000001" }]
            },
            {
              type: "link",
              url: "#1",
              children: [{ type: "text", value: "1" }]
            },
            {
              type: "link",
              url: "https://www.pixiv.net/",
              children: [{ type: "text", value: "[pixiv]" }]
            }
          ]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });

    test("1個の改行は Break に変換される", () => {
      const pixivAst: PixivNode[] = [
        { type: "text", val: "ひとつめのテキスト\nふたつめのテキスト" }
      ];
      const expectedAst: Content[] = [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "ひとつめのテキスト" },
            { type: "break" },
            { type: "text", value: "ふたつめのテキスト" }
          ]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });

    test("2個以上の改行は新たな Paragraph に分割される", () => {
      const pixivAst: PixivNode[] = [
        {
          type: "text",
          val: "一つ目の段落\n二行目の行\n三行目の行\n\n二つ目の段落\n二行目の行"
        }
      ];
      const expectedAst: Content[] = [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "一つ目の段落" },
            { type: "break" },
            { type: "text", value: "二行目の行" },
            { type: "break" },
            { type: "text", value: "三行目の行" }
          ]
        },
        {
          type: "paragraph",
          children: [
            { type: "text", value: "二つ目の段落" },
            { type: "break" },
            { type: "text", value: "二行目の行" }
          ]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });

    test("前後の改行を取り除く", () => {
      const pixivAst: PixivNode[] = [
        {
          type: "text",
          val: "\n一つ目の段落\n二行目の行\n三行目の行\n\n二つ目の段落\n二行目の行\n\n\n三つ目の段落\n二つ目の行\n\n"
        }
      ];
      const expectedAst: Content[] = [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "一つ目の段落" },
            { type: "break" },
            { type: "text", value: "二行目の行" },
            { type: "break" },
            { type: "text", value: "三行目の行" }
          ]
        },
        {
          type: "paragraph",
          children: [
            { type: "text", value: "二つ目の段落" },
            { type: "break" },
            { type: "text", value: "二行目の行" }
          ]
        },
        {
          type: "paragraph",
          children: [
            { type: "text", value: "三つ目の段落" },
            { type: "break" },
            { type: "text", value: "二行目の行" }
          ]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });
  });

  describe("chapter (Heading)", () => {
    test("Text (text)を格納できる", () => {
      const pixivAst: PixivNode[] = [
        {
          type: "tag",
          name: "chapter",
          title: [
            {
              type: "text",
              val: "見出し"
            }
          ]
        }
      ];
      const expectedAst: Content[] = [
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "見出し" }]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });

    test("Ruby (ruby)を格納できる", () => {
      const pixivAst: PixivNode[] = [
        {
          type: "tag",
          name: "chapter",
          title: [
            {
              type: "text",
              val: "ルビが"
            },
            {
              type: "tag",
              name: "rb",
              rubyBase: "使用",
              rubyText: "しよう"
            },
            {
              type: "text",
              val: "できる"
            },
            {
              type: "tag",
              name: "rb",
              rubyBase: "見出",
              rubyText: "みだ"
            },
            {
              type: "text",
              val: "し"
            }
          ]
        }
      ];
      const expectedAst: Content[] = [
        {
          type: "heading",
          depth: 2,
          children: [
            { type: "text", value: "ルビが" },
            { type: "ruby", value: "使用", ruby: "しよう" },
            { type: "text", value: "できる" },
            { type: "ruby", value: "見出", ruby: "みだ" },
            { type: "text", value: "し" }
          ]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });

    test("前後の改行を取り除く", () => {
      const pixivAst: PixivNode[] = [
        { type: "text", val: "初投稿です。/n" },
        {
          type: "tag",
          name: "chapter",
          title: [
            {
              type: "text",
              val: "まえがき"
            }
          ]
        },
        { type: "text", val: "/n/n読まないでください。" }
      ];
      const expectedAst: Content[] = [
        {
          type: "paragraph",
          children: [{ type: "text", value: "初投稿です。" }]
        },
        {
          type: "heading",
          depth: 2,
          children: [{ type: "text", value: "まえがき" }]
        },
        {
          type: "paragraph",
          children: [{ type: "text", value: "読まないでください。" }]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });
  });

  describe("newpage (Heading)", () => {
    test("ちゃんとページを分割できる", () => {
      const pixivAst: PixivNode[] = [
        { type: "text", val: "1ページ目" },
        { type: "tag", name: "newpage" },
        { type: "text", val: "2ページ目" }
      ];
      const expectedAst: Content[] = [
        { type: "paragraph", children: [{ type: "text", value: "1ページ目" }] },
        { type: "heading", depth: 2, children: [{ type: "text", value: "1" }] },
        { type: "paragraph", children: [{ type: "text", value: "2ページ目" }] }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });

    test("ページ番号が連続で採番される", () => {
      const pixivAst: PixivNode[] = [
        { type: "text", val: "1ページ目" },
        { type: "tag", name: "newpage" },
        { type: "text", val: "2ページ目" },
        { type: "tag", name: "newpage" },
        { type: "text", val: "3ページ目" }
      ];
      const expectedAst: Content[] = [
        { type: "paragraph", children: [{ type: "text", value: "1ページ目" }] },
        { type: "heading", depth: 2, children: [{ type: "text", value: "1" }] },
        { type: "paragraph", children: [{ type: "text", value: "2ページ目" }] },
        { type: "heading", depth: 2, children: [{ type: "text", value: "2" }] },
        { type: "paragraph", children: [{ type: "text", value: "3ページ目" }] }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });

    test("前後の改行を取り除く", () => {
      const pixivAst: PixivNode[] = [
        {
          type: "text",
          val: "注意\nこの小説にはグロテスクな表現が含まれています。\n"
        },
        { type: "tag", name: "newpage" },
        { type: "text", val: "\n\n嘘です。" }
      ];
      const expectedAst: Content[] = [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "注意" },
            { type: "break" },
            {
              type: "text",
              value: "この小説にはグロテスクな表現が含まれています。"
            }
          ]
        },
        { type: "heading", depth: 2, children: [{ type: "text", value: "1" }] },
        { type: "paragraph", children: [{ type: "text", value: "嘘です。" }] }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });
  });
});

describe("PhrasingContent", () => {
  describe("text (Text)", () => {
    test("ただのテキストはちゃんとただのテキストになる", () => {
      const pixivAst: PixivNode[] = [{ type: "text", val: "ただのテキスト" }];
      const expectedAst: Content[] = [
        {
          type: "paragraph",
          children: [{ type: "text", value: "ただのテキスト" }]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });

    test("改行は含まれない", () => {
      const pixivAst: PixivNode[] = [
        { type: "text", val: "ひとつめのテキスト/nふたつめのテキスト" }
      ];
      const expectedAst: Content[] = [
        {
          type: "paragraph",
          children: [
            { type: "text", value: "ひとつめのテキスト" },
            { type: "break" },
            { type: "text", value: "ふたつめのテキスト" }
          ]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });
  });

  describe("ruby (Ruby)", () => {
    test("ルビをちゃんと認識できる", () => {
      const pixivAst: PixivNode[] = [
        { type: "tag", name: "rb", rubyBase: "換言", rubyText: "かんげん" },
        { type: "text", val: "すれば" },
        { type: "tag", name: "rb", rubyBase: "畢竟", rubyText: "ひっきょう" },
        { type: "text", val: "ももんが" }
      ];
      const expectedAst: Content[] = [
        {
          type: "paragraph",
          children: [
            { type: "ruby", value: "換言", ruby: "かんげん" },
            { type: "text", value: "すれば" },
            { type: "ruby", value: "畢竟", ruby: "ひっきょう" },
            { type: "text", value: "ももんが" }
          ]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });
  });

  describe("pixivimage (Link)", () => {
    test("画像形式のpixivimageをちゃんと変換できる", () => {
      const pixivAst: PixivNode[] = [
        {
          type: "tag",
          name: "pixivimage",
          illustID: "000001",
          pageNumber: null
        }
      ];
      const expectedAst: Content[] = [
        {
          type: "paragraph",
          children: [
            {
              type: "link",
              url: "https://www.pixiv.net/artworks/000001",
              children: [{ type: "text", value: "000001" }]
            }
          ]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });

    test("漫画形式のpixivimageをちゃんと変換できる", () => {
      const pixivAst: PixivNode[] = [
        { type: "tag", name: "pixivimage", illustID: "000001", pageNumber: 2 }
      ];
      const expectedAst: Content[] = [
        {
          type: "paragraph",
          children: [
            {
              type: "link",
              url: "https://www.pixiv.net/artworks/000001#2",
              children: [{ type: "text", value: "000001" }]
            }
          ]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });
  });

  describe("jump (Link)", () => {
    test("ページジャンプをちゃんとlinkにできる", () => {
      const pixivAst: PixivNode[] = [
        { type: "tag", name: "jump", pageNumber: 1 }
      ];
      const expectedAst: Content[] = [
        {
          type: "paragraph",
          children: [
            {
              type: "link",
              url: "#1",
              children: [{ type: "text", value: "1" }]
            }
          ]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });
  });

  describe("jumpurl (Link)", () => {
    test("正常なURLをちゃんと Link にできる", () => {
      const pixivAst: PixivNode[] = [
        {
          type: "tag",
          name: "jumpuri",
          title: [
            {
              type: "text",
              val: "[pixiv]"
            }
          ],
          uri: "http://www.pixiv.net/"
        }
      ];
      const expectedAst: Content[] = [
        {
          type: "paragraph",
          children: [
            {
              type: "link",
              url: "https://www.pixiv.net/",
              children: [{ type: "text", value: "[pixiv]" }]
            }
          ]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });

    test("Ruby (ruby) を格納できる", () => {
      const pixivAst: PixivNode[] = [
        {
          type: "tag",
          name: "jumpuri",
          title: [
            {
              type: "text",
              val: "とある"
            },
            {
              type: "tag",
              name: "rb",
              rubyBase: "魔術",
              rubyText: "まじゅつ"
            },
            {
              type: "text",
              val: "の"
            },
            {
              type: "tag",
              name: "rb",
              rubyBase: "禁書目録",
              rubyText: "インデックス"
            },
            {
              type: "text",
              val: ""
            }
          ],
          uri: "http://www.project-index.net/"
        }
      ];
      const expectedAst: Content[] = [
        {
          type: "paragraph",
          children: [
            {
              type: "link",
              url: "http://www.project-index.net/",
              children: [
                { type: "text", value: "とある" },
                { type: "ruby", value: "魔術", ruby: "まじゅつ" },
                { type: "text", value: "の" },
                { type: "ruby", value: "禁書目録", ruby: "インデックス" }
              ]
            }
          ]
        }
      ];
      expect(transpile(pixivAst)).toEqual(expectedAst);
    });
  });
});

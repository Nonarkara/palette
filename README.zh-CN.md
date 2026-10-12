[English](README.md) · 简体中文 · [ไทย](README.th.md)

# Palette

和田三造的 348 组配色，一次只让一组占满屏幕。工具留在边上。

![展厅实际渲染的 002 号色板。左侧是 Yellow Orange，右侧是 Dark Tyrian Blue，右边一条黑轨。读数是 warm–cool tension，electric，measured contrast，建议的房间是 night instrument。最大色域上的黑字对比度为 9.8:1，正文 AA 通过。](assets/readme/plate-002.png)

002 号，Yellow Orange 与 Dark Tyrian Blue，取自本仓库在本地的一次渲染。色块上的十六进制值是有出处的屏幕换算，不是印刷油墨的测量。

公开地址是 <https://colors.nonarkara.org/>。GitHub Pages 的镜像在 <https://nonarkara.github.io/palette/>。

## 进门

带着一个词来，带着一种心情来，或者什么都不带。

门口问的是感觉：一种颜色、一处地方、一种材料，或一种用途。`calm ocean`、`red and black`、`minimalist website`、`สีแดงสีดำ`、`红色黑色`、一个十六进制值、一个色板编号，都是普通的检索。门上已经放了六种心情：quiet、warm、punk、night、airy、earthy。**NO IDEA — SURPRISE ME** 会随机打开一间，`↻` 也是。

检索在这台设备上完成，不调用模型。色板编号，写不写 “plate” 都行，会回到那一块。十六进制值会找到用到它的色板。词表里有英文、泰文和中文的颜色词；其中一些繁体字形被收作别名。房间里的中文正文是简体。英文单词至少四个字母时，只有在恰好对上一个别名的情况下，才容许错一个字母。泰文和中文按写下的样子匹配，两个颜色名连在一起写也可以。每个有意义的词都对上时，这些色板排在前面。只对上一部分时，结果会标明它们是相关的。一个对不上的词，可以什么都不返回。

关系定了，就按 **COPY THIS FOR YOUR AGENT**。它复制一份简报：命名过的 CSS 变量、角色、不相等的面积、对比度说明、来源边界、MIT 一行，以及稳定地址 `https://colors.nonarkara.org/#plate-NNN`。`⧉` 复制的是同一份。贴进任何编程代理即可。

`{}` 把同一块色板打开成 JSON（`palette-exhibition/1`）：色名、RGB、十六进制、这间展厅使用的面积、计算出来的读数、一段给代理的提示，以及网址。剪贴板被拦住时，JSON 仍可选中复制。

`↓` 在设备上生成 PNG，不上传。手机 1440 × 3120，平板 2048 × 2732，电脑 3840 × 2160。色名、色值、编号和出处可以留着，也可以关掉。竖图把色域叠起来，横图让它们并排。房间处在灰度时，文件仍用原来的换算值。手机下载之后仍可能裁切画面。

`1:1` 在屏幕下半打开对比表，色域还留在上面。它用文字报告 WCAG 2.2 的比值：每个色域上的黑字和白字（正文 4.5:1，大字 3:1），以及两块色域相接的地方（正文 4.5:1，非文本边界 3:1）。显示时向下取到一位小数。通过与否用未取整的比值，不会为了通过而四舍五入。同一张表可以用 Machado、Oliveira 与 Fernandes 2009 年论文里的严重程度 1.0 矩阵，在线性 sRGB 中预览红色盲、绿色盲和蓝色盲，也可以看灰度。色名和十六进制值停在原来的换算上。预览不是临床检查。导出的是原值，不是预览：CSS 自定义属性、Tailwind v4 的 `@theme` 和 v3 的 `theme.extend.colors`、设计令牌 JSON（`$type`、`$value`），或这块色板的链接。

`Aa` 在当前标签打开[阅读室](reading.html)，谈构图、字体，以及究竟读过哪些书。长文是 [DESIGN-FIELD-GUIDE.md](DESIGN-FIELD-GUIDE.md) 和 [TYPOGRAPHY-FIELD-GUIDE.md](TYPOGRAPHY-FIELD-GUIDE.md)，这两份是英文。

用法写了三种语言：

- [PALETTE-FIELD-GUIDE.md](PALETTE-FIELD-GUIDE.md)
- [PALETTE-FIELD-GUIDE.zh-CN.md](PALETTE-FIELD-GUIDE.zh-CN.md)
- [PALETTE-FIELD-GUIDE.th.md](PALETTE-FIELD-GUIDE.th.md)

审句的方法：[EDITORIAL.md](EDITORIAL.md)
（[简体中文](EDITORIAL.zh-CN.md)，[ไทย](EDITORIAL.th.md)）。
先审一句，再改写。整屏的配色保持原样。

## 工具轨

轨是唯一的界面零件。宽度到 760px 为止，它改到屏幕底部，并且可以横着滑。每个控制都是按钮或链接，至少 44 × 44 CSS 像素，并且有辅助技术能读到的名字。换一块色板时，动画是 260 毫秒。系统打开 `prefers-reduced-motion` 时，动画和过渡会被压到可以忽略的时长。

| 标记 | 做什么 | 键 |
|---|---|---|
| `Aa` | 阅读室，仍在这个标签 | — |
| `←` | 上一组关系 | 左方向键 |
| `→` | 下一组关系 | 右方向键 |
| `↻` | 碰运气 | `R` |
| `⌕` | 检索 | `/` |
| `1:1` | 对比度、色觉预览、复制格式 | `K` |
| `◐` | 灰度。色相拿掉。色名、十六进制和比值仍对原来的换算 | `C` |
| `↓` | 壁纸 PNG | — |
| `≡` | 总索引，可按 2、3、4 色筛选 | `G` |
| `A` | Dr Non、研究，以及红 / 黑 | `A` |
| `{}` | 可带走的 JSON | `J` |
| `⧉` | 与那个写了字的按钮同一份简报 | — |
| `i` | 原则，以及 Dr Non 的短论 | `I` 或 `?` |

有表单打开、正在输入，或按着 Command、Control、Alt 时，方向键、`/` 和字母不会被这间展厅拿走。那些快捷键仍属于浏览器。

颜色不是唯一的信息。编号、色名、读数和对比度那一行都是文字。

## 这个版本添上的东西

和田的单位是关系。这个版本把关系放大，并让两色、三色、四色的面积不相等。两色的权重是 1.618 比 1，大约 61.8 / 38.2。三色是 1.45、0.9、0.65。四色是 1.55、0.85、0.7、0.55。始终有一块占主导。这些比例属于这间展厅，不是从印刷色板里抽出来的规矩。

页面接着在浏览器里算出一组读数：

- 温度：偏暖、偏冷，或冷暖对峙（warm-led、cool-led、warm–cool tension）
- 能量：安静、清楚，或带电（quiet、clear、electric）
- 明度：亮、中间调，或暗（light、mid-tone、dark）
- 反差：接近、有节制，或高反差（close values、measured contrast、high contrast）
- 一间建议的房间，名单是闭合的：quiet editorial、domestic warmth、night instrument、botanical study、electric argument、mineral calm、confectionery shock、civic daylight、archival room

上面那张 002，画面上的一行是：冷暖对峙；带电；有节制的反差。建议的房间是 night instrument。明度也被算了，这一块是暗，但那个词不在这一行里。读数是 Dr Non 的，算法是确定的，不是和田的话，也不访问任何接口。

`A` 是研究室。里面有一组个人研究：红 `#A72144`，黑 `#111314`，那里称之为 classy and dangerous。这一对不放进 348 组里。同一间屋子保留和田三造（1883–1967）一份很短、有出处的年表：《南风》；1927 年的日本标准色协会；《Haishoku Sōkan》（1933–34），后来以 *A Dictionary of Color Combinations* 再版；第 27 届奥斯卡，*Gate of Hell* 的彩色服装设计；1958 年被授予文化功劳者（Person of Cultural Merit）。链接是 [Art Platform Japan](https://artplatform.go.jp/artists/A2089)、[奥斯卡记录](https://www.oscars.org/oscars/ceremonies/1955/C) 和 [青幻舍 Seigensha](https://en.seigensha.com/books/978-4-86152-247-5/)。更短的论证在 [ABOUT.md](ABOUT.md)、[ABOUT.zh-CN.md](ABOUT.zh-CN.md) 和 [ABOUT.th.md](ABOUT.th.md)。

`i` 后面的短论写了三遍：英文、泰文（`lang="th"`，IBM Plex Sans Thai，不带回圈），简体中文（`lang="zh-Hans"`，Noto Sans SC）。工具轨上的字是英文。壁纸的标签三种语言都有。

## 出处

关系来自和田三造。[Matt DesLauriers 的 `dictionary-of-colour-combinations`](https://github.com/mattdesl/dictionary-of-colour-combinations)（MIT，版权 2020）就是 `data/colors.json`。它订正并重新包装了 [Dain M. Blodorn Kim](https://github.com/dblodorn/sanzo-wada) 更早的 MIT 汇编（版权 2024）。Kim 的代码不在本仓库。RGB 和十六进制值是那份数据的屏幕换算。

选择、不相等的面积、界面、检索词、角色、图解和读数，是 Dr Non Arkaraprasertkul 的。与青幻舍、和田的遗产继承人、数据作者都没有从属关系。本站不复制书页扫描、封面或出版社正文。

字体是 Archivo Narrow（Omnibus-Type）、IBM Plex Sans Thai（IBM）、Noto Sans SC（Google）、JetBrains Mono（JetBrains），SIL Open Font License，向 Google Fonts 请求。那是字体托管，不是统计脚本。页面带有 Content-Security-Policy，没有分析脚本。

对比度用的是 WCAG 2.2 的相对亮度公式。色觉矩阵来自 Machado、Oliveira 与 Fernandes，2009。两者都不是对印刷书的判断，预览也不是诊断。

读过、参考过、但没有抄进来的书、论文和网站，写在 [CREDITS.md](CREDITS.md) 和[出处页](credits.html)。那份名单不是背书。

改这间屋子的视觉约定在 [context.md](context.md)，是英文。

## 几何

[`make/text-to-cad`](make/text-to-cad/README.md) 是一份共用参考：一段写成文字的零件，要离开页面，成为几何体。浏览器里的实现是 [designon](https://designon.nonarkara.org/)。命令行跑在 M5 或云端机器上，不在 M3 上。上游是 [earthtojake/text-to-cad](https://github.com/earthtojake/text-to-cad)（MIT）。署名：earthtojake。

## 令牌

`tokens/palette.tokens.json` 是 348 组配色的设计令牌 JSON，Penpot 的 Tokens 面板可以导入。Figma 的 Tokens Studio 读同一份文件。`npm run build` 写出它。说明在 [tokens/README.md](tokens/README.md)。`1:1` 表里的 JSON 是一块色板。这个文件是全部 348 组。两处的十六进制值都是有出处的屏幕换算。

## 在自己的机器上打开

把 `index.html` 当文件打开，JSON 加载不了。

```bash
bash start.sh
```

启动器用 Python 3，如果有的话；否则用 Node.js。两者都没有时，它会说明缺什么。不需要 `npm install`，不需要 API 密钥，也不需要账号。它只开一个本地服务器，不打开浏览器标签。打开 <http://127.0.0.1:4173>。Ctrl-C 停止。

装了 Node.js 时，`npm run dev` 通过 `scripts/serve.mjs` 提供同一个地址。只有 Python 时，仍可以这样打开房间：

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

Node.js 用来做检查：

```bash
npm run check
```

`tokens/palette.tokens.json` 缺失，或与色表不一致时，这条命令也会失败。

检查把数据钉在 159 个不重复的具名颜色、348 块色板，每块两色、三色或四色，分别是 120、120、108。也钉住多语言标记、出处句子，以及对渐变、阴影和另外几个痕迹的禁止。检查判断不了这间房间好不好。

发布之前，还应该只用键盘走一遍，文字放大到 200%，宽度试 375、768、1280 CSS 像素，打开减少动态效果，并用英文、泰文、中文各搜一次。`npm run verify:browser` 是脚本化的那一轮，需要 `npm ci` 和 Playwright 的 Chromium。展厅本身不需要这些。

## 现状

这个公开版本是 `0.1.0`，由 Dr Non Arkaraprasertkul 与 Codex 做成。Mama Rule——一位年长的、不从事技术工作的人，第一次来，没有人在旁边教——是打 `1.0` 标签之前的那道门。这道门还没有走。仓库里的泰文和中文还没有经过熟练读者签字；三份文本写的是同一组事实，审读仍然开着。

## 许可

两份 MIT。它们不互相重新授权。

- **这间展厅的代码和文字** — [LICENSE](LICENSE)。版权 2026 Non Arkaraprasertkul。可以用，可以分叉，可以改，可以做成你自己的。
- **颜色文件** — `data/colors.json` 仍用 Matt DesLauriers 的 MIT 许可。全文抄在 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。屏幕换算不是印刷油墨，这句话要留着。
- **其余** — 书、字体文件、论文和其他网站保留各自的权利。[CREDITS.md](CREDITS.md)。

## 最后一块

![一幅平涂的收束画。黑猫打着伞，站在 Yellow Orange 上。更小的纸白机器人站在 Dark Tyrian Blue 上，手里的卡片写着 1:1。黑色工具轨在右边。](assets/readme/closing-panel.png)

为这个仓库画的。平涂，硬边，没有水墨。猫是色表里的 Black；耳心是 Hermosa Pink；鼻子是色表里的 Red。项圈上是 348。机器人胸口是 JSON 的花括号，旗子上是 002，背包是 001 号，English Red 和 Cerulian Blue，拼写跟数据集一样。地上的票写着 NO IDEA。这些都不是新的和田配色。画稿在 [assets/readme/closing-panel.svg](assets/readme/closing-panel.svg)。

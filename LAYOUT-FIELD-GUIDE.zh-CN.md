# 版式指南

Palette 为线条、栏、间距和平衡写下的检查。2026 年 10 月 14 日采用。

色域没有改。一组配色仍然占满那个视口。这些检查用于排文字、线条和网格的页面。样本页是 `specimen.html`。

L1 到 B5 是 Palette 的检查。文末的来源是起点，不是那些书里的原句，也不是 Desizn Circle 图片的描摹。

流利的读者尚未签字确认这份简体中文。

## Token

写在 `tokens/palette.tokens.json` 的 `interface` 组里。数值来自 `layout.css` 的 `:root`。主份额沿用展厅里已有的 token，不另造一个。

| Token | 数值 | 作用 |
|---|---|---|
| `space-4` | 4px | 半个单位 |
| `space-8` | 8px | 节奏单位 |
| `space-16` | 16px | 两个单位。线条前面那段文字下方的空隙 |
| `space-24` | 24px | 三个单位 |
| `space-32` | 32px | 四个单位。一条基线 |
| `space-48` | 48px | 六个单位 |
| `space-64` | 64px | 八个单位 |
| `space-96` | 96px | 十二个单位 |
| `gutter` | 24px | 栏间距。等于 `reading.gutter` 的 24px 最小值 |
| `grid-columns` | 12 | 桌面 |
| `grid-columns-mobile` | 4 | 手机 |
| `baseline` | 2rem | 阅读室正文是 1.25rem，行高 1.6 |
| `rule-1`、`rule-2`、`rule-3` | 1px、2px、3px | 仅有的线条粗细 |
| `rule-max` | 3 | 一页最多几种粗细 |
| `optical-centre-offset` | 4% | 视觉中心高出几何中心的距离 |
| `font.geometric` | Jost, Archivo Narrow, Arial, sans-serif | 只用于标题和字标 |
| `number.dominant-share` | 0.618 | 重块沿用这个已有数值 |

竖向空隙是 8px 的倍数，因此也能落在 32px 的基线上。

## 线条

线条是 1、2 或 3 像素的色条，不是盒子的边框。

**L1.** 线条分开层级，不分开同一层里的条目。

通过：线条放在标签和标题之间，或标题和出处之间。不通过：在英文、泰文、中文三行之间画线，或在两块红色之间画线。

**L2.** 线条的起点和终点落在栏边上。

通过：起止都在 12 栏或 4 栏的栏线上。不通过：线条停在任意宽度上。

**L3.** 线条在后文之上留 1 个单位，在前文之下留 2 个单位。

单位是 8px。通过：前文下面 16px，后文上面 8px。不通过：两边一样宽，或较宽的空隙放错了边。

**L4.** 一页最多三种线条粗细。

通过：每条线都是 1、2 或 3 像素，并且没有第四种粗细。不通过：出现 4 像素的线，或这三种之外的又一种粗细。

样本页上，3 像素的线标出进入标题的那一层，2 像素的线标出进入说明的那一层，1 像素的线标出进入平衡板的那一层。轴线再次使用 1 像素。它属于图，不是用来隔开条目的线。

## 网格

**G1.** 文字和线条共用左对齐线。

通过：这些块从第 1 栏开始。不通过：每一块自己另起一条左边。

**G2.** 标题字的宽度卡在栏上。

通过：标题盒子的起点和终点都在栏线上。不通过：标题盒子的宽度没有落在栏上。

**G3.** 桌面 12 栏，手机 4 栏。栏间距 24px，与 `reading.gutter` 的最小值相同。

通过：就是这三个数。不通过：栏数不同，或栏间距不在尺度上。

切换点是 760px，与展厅里轨道变窄的宽度相同。

## 间距

**S1.** 间距来自尺度，节奏按 8px 前进。

通过：margin、padding 和 gap 使用尺度、栏间距、基线，或零。不通过：临时写一个 12px 或 18px。

**S2.** 竖向节奏锁在基线上。

通过：一行字的行盒是 2rem，或 2rem 的整数倍。标题行盒是 96px，等于三条基线。不通过：行盒对不齐基线。

**S3.** 内部间距至多是外部间距的一半。

通过：一组内部的空隙不超过这组外部空隙的一半。样本页上，一种文字内部是 8px，行与行之间是 16px。不通过：内外一样，让不同的组看起来是一组；或外面比里面更紧。

1:2 是 Palette 的检查。起点是 Wertheimer 1923 年关于接近分组的论述。这个比例不是那篇论文里的数字。

## 平衡

**B1.** 视觉重量来自面积、明暗、饱和和孤立。

通过：重的东西重在其中一种原因上，说明文字写出是哪一种。不通过：重量靠阴影、渐变或图片。

**B2.** 不对称的平衡。主块占宽度的 60% 到 70%。

通过：主块使用 `interface.number.dominant-share`（0.618）。不通过：左右镜像，或主块不在这个范围内。

**B3.** 视觉中心大约在几何中心上方 4%。

通过：轴线使用 `optical-centre-offset`。不通过：题目要求上移时，轴线仍放在几何中心。

**B4.** 至少有一块负空间，大小接近主形。

通过：主块右侧的象牙色区域与主块面积相同。红色形状放在这块区域里，并不铺满。不通过：只剩一条窄缝，或空白与主形没有关系。

**B5.** 每个屏幕一个焦点。

通过：第一屏由字标带领，第二屏由黑色块带领。不通过：同一屏上两个同样大的主角。

## 平衡板

这块板用 CSS 画成。它不是 Desizn Circle 图片的复制，那些图片也没有嵌进来。

油墨是这次检索得到的第 190 号配色：Ivory Buff `#ebd3a2`、English Red `#d96629`、Black `#111314`。这些是有署名的数字转换，不是印刷油墨。打开 `index.html#plate-190`。

黑色长方块是主块。它的宽和高都是主份额，因此面积与右侧象牙色区域相同。它的竖向中心落在轴线上。轴线是 1 像素的线，两端各有一个圆点。左半段和左点是 Ivory Buff，这样才能在黑色上看见。右半段和右点是 Black，这样才能在象牙色上看见。两块 English Red 的长方形，一块大、一块小，放在象牙色区域里，不压住轴线，也不是左右镜像。

中文保持简体，使用 Noto Sans SC，并加 `lang="zh-Hans"`。

## 这一页和检查

`tests/layout.test.mjs` 检查线条是否停在栏边上、间距是否来自尺度、线条粗细是否不超过三种。裁切、看起来的大小和平衡仍要看截图。那次查看不是用户测试。

## 署名

- Desizn Circle（@desizncircle）只作为题目：[DeYHElAEoM8](https://www.instagram.com/p/DeYHElAEoM8/) 与 [Ddx-GPxEkBi](https://www.instagram.com/p/Ddx-GPxEkBi/)。图片没有复制。
- OMORO 与这些题目一同被点名。这里没有另放一张 OMORO 的图。
- Herbert Bayer，Universal 字母，1925。[Letterform Archive](https://letterformarchive.org/news/bauhaus-typefaces-part-two/)。[Design Reviewed](https://designreviewed.com/designer/herbert-bayer/)。
- P22，以及 The Foundry（Freda Sack 与 David Quay）。他们的 Bayer 复刻没有收入本项目。
- Christian Holm，CTAN `universa`，没有收入。
- Owen Earl / indestructible type*，Jost，SIL Open Font License。[仓库](https://github.com/indestructible-type/Jost)。
- IBM Plex Sans Thai。Noto Sans SC。
- Anuphan，Cadson Demak（Mint Tantisuwanna），SIL Open Font License，只作一行试验。[仓库](https://github.com/cadsondemak/Anuphan)。
- Josef Müller-Brockmann，《Grid Systems in Graphic Design》，1981。栏的检查是 Palette 的，以那种网格传统为起点。本文件不是对该书的通读。
- Robert Bringhurst，《The Elements of Typographic Style》。见 `TYPOGRAPHY-FIELD-GUIDE.md`。
- Rudolf Arnheim，《Art and Visual Perception》。B1 的因素以视觉重量的论述为起点，这里不引用页码。
- Max Wertheimer，1923，接近与分组。1:2 是 Palette 的比例。
- 和田三造，第 190 号配色，经由 `data/colors.json` 里有署名的数字转换。

## 记录

排字的人需要知道线停在哪里、字离线多远、重的形状如何平衡。原先的代币文件没有间距、网格、基线、线粗或平衡。

色域、十一条控制，以及阅读室的正文都保留着。

这一页选用同一页上的两个屏幕，共用第 1 栏的左边。第一屏是字体样本，第二屏是平衡板。没有做成一叠规则卡片，也没有把板画到色域上面。

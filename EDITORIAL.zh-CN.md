[English](EDITORIAL.md) · 简体中文 · [ไทย](EDITORIAL.th.md)

# 编辑

每一次修改，都应该帮助读者做成一件事，或者把对象理解得更清楚。留下有意义的选择；追问空泛的句子。

这是 Palette 的编辑方法。它不改动整屏的配色。下面标出的展厅句子先留在页面上，以后一次改一句。

英文、简体中文、ไทย三份文件讲同一套方法。流利的读者尚未签字确认中文和泰文。这段文字若放进展厅，泰文使用非回环字体并加 `lang="th"`；中文保持简体并加 `lang="zh-Hans"`。

## 出处

下面的步骤是 Palette 自己的文字。2026年10月12日读过两份 MIT 来源，并作了改写。原文没有抄进本文件。

- Peter Yang，[no-ai-slop](https://github.com/petergyang/no-ai-slop)，提交 [`000650b`](https://github.com/petergyang/no-ai-slop/commit/000650b156983f5159695b441477f4e63b25dc85)，MIT。Copyright (c) 2026 Peter Yang。[LICENSE](https://github.com/petergyang/no-ai-slop/blob/000650b156983f5159695b441477f4e63b25dc85/LICENSE)。
- Jakub Krehel，[make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better)，提交 [`35545ea`](https://github.com/jakubkrehel/make-interfaces-feel-better/commit/35545ea1512ad59fa463e6b1f95ca9c052981fe6)，MIT。Copyright (c) 2026 Jakub Krehel。[LICENSE](https://github.com/jakubkrehel/make-interfaces-feel-better/blob/35545ea1512ad59fa463e6b1f95ca9c052981fe6/LICENSE)。

从 Yang 取用：引用原句，说明读者为什么用不上，再提出最小的改法。不要给文稿打分。从 Krehel 取用：检查人真正会碰到的小交互，包括标签、图标对齐、焦点和可点区域。同一份说明也写在 [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)。两位作者并未被请求为本展背书。

## 不采用

**圆角和阴影。** Krehel 的技能把同心圆角和分层阴影当作打磨。Palette 禁止圆角、渐变、阴影、可见边框、自定义光标和装饰性纹理。一组配色占满视口。分组靠位置、尺度、留白和实色。圆角或阴影会跟整屏的配色争位置。

**整表禁用词语。** Yang 的技能直接禁用一批词，其中包括 delve、leverage、tapestry、realm。Palette 不保留这张表。一个词出问题，是因为整句换个产品也能用，一个名词都不用改。同一个词可以留在引文、历史句子或项目故事里。禁用表最终会改掉本来选好的句子，包括 Dr Non 的句子。

**AI 相似度百分比。** Yang 的检查模式已经拒绝给文稿打分，也拒绝猜测是不是模型写的。百分比就是这个猜测。指出句子。读者可以核对句子，不能核对分数。

**为了显得像人而故意写错。** Yang 保留的是作者声音里已经有的不齐整。他不要求新的错误，Krehel 的技能也不要求。故意的错字、破句子和假的旁白不会让句子更真。在这个展厅里，它们会改错色板编号、色名或署名。留下原有的声音。

## 1. 先审查，再改写

先读完整段。

对每一句弱的句子：

1. 原句照引，并写明它出现在哪里。
2. 说明读者为什么不能据此行动，或不能据此理解对象。
3. 提出最小的改法。改这一句。段落留下。

停在这里。清单被接受之后再改写。有力的句子留下，即使某种检测器会标出它的句式。

## 2. 保留声音

这些句子在起作用时就留下：

- 历史文字，连同日期、人名和出处。
- 引文。
- 属于这个项目的比喻：“A colour is not a property. It is an event between surfaces.” 自然的食欲。Classy and dangerous。
- 项目故事，包括个人的红与黑研究。这项研究标明在 348 组配色之外。

追问那种换一个产品、一个名词都不用改的句子。追问那种没有对象、没有数字、也没有下一步的承诺。

不要把有出处的事实磨成一种气氛。不要为了显得具体，去编造和田三造的色板编号、色名、引文或历史说法。

## 3. 用具体的话替换空承诺

“Unlock a vibrant world of colour” 没有告诉读者能做什么。

同一件事，用本仓库的数字来说：“Explore 348 colour combinations by Sanzo Wada.” 中文可以写成：“浏览和田三造的348组配色。”

这个数字在 2026年10月12日对照 `data/colors.json` 核对过。文件里有 159 个有名字的颜色。`combinations` 数组包含编号 1 到 348，每个编号出现一次。348 就是这个数量。文件变了，句子就改。不要估算，也不要从简介里取数字。

文件里的 RGB 和 hex 是署名的数字转换。它们不是印刷油墨的精确颜色。

## 4. 按任务检查路径，Mama Rule

把可用的展厅交给一位年长、不熟悉技术的人，让他第一次来。只给出目标。不要旁白，也不要指出控件。

这个房间的三个目标：

1. 找到一组配色。
2. 下载一张壁纸。
3. 返回，回到刚离开的那一组，或另一组他能叫出名字的配色。

三项都完成，且没有提示，才算通过。看第一次点击、犹豫，以及从一次普通失误里恢复。一个人是早期失败的来源。一个人不能代表所有人。

这项测试还没有做过。公开版本保持 `0.1.0`，直到做过为止。写下本文件不算做过测试。

## 5. 小交互清单

控件发出去之前检查这些。标签、对齐、焦点和可点区域改自 Krehel。加载和重复点击来自上面三项任务。它们是检查，不是一套新的视觉样式。

- **标签。** 可见的词，或控件只是一个符号时的无障碍名称，要说出将发生什么。“Download PNG” 是标签。单独的箭头需要一个说出“下载”的无障碍名称。装饰性符号对辅助技术隐藏。
- **图标对齐。** 图标挨着词却看起来不居中时，挪动图标。不要用边框、圆角或阴影盖住空隙。
- **焦点。** 键盘焦点落在控件上，并且看得见。Tab 顺序跟着任务走。焦点标记留在现有约定里：实线，或仪器栏已经在用的反色。不要光晕、渐变或投影。
- **加载。** 等待时的句子写出正在加载什么。失败时的句子写出什么失败了、下一步做什么。没有句子的转圈不是一种状态。
- **重复点击。** 第一次的结果还没回来时，第二次点击不再开始第二次下载、第二次复制或第二次跳转。控件要显示出第一次动作已经生效。

每个目标至少 44 × 44 CSS 像素。动效确认色板更换，并在 280 毫秒内停止。`prefers-reduced-motion` 仍然把它收掉。

## 展厅文案：已标出，尚未改写

2026年10月12日读的是 `index.html` 和 `app.js` 里访客能看见的句子。下面这些句子仍在网站上。提出的改法没有执行。引文保持英文，因为页面上就是英文。

| 位置 | 原句 | 读者为什么用不上 | 最小改法 |
|---|---|---|---|
| 搜索页眉 | `348 HISTORIC RELATIONSHIPS · FREE TO EXPLORE` | “Free to explore” 没有说明免费、无需账户，还是可以复制。“Explore” 没有说出动作。 | `348 HISTORIC RELATIONSHIPS · NO ACCOUNT` |
| 搜索标题 | `Find your palette` | “Your” 暗示一份个人色板。房间打开的是 348 组中的一组。 | `Find a combination` |
| 搜索导语 | `We will find related colour schemes.` | 这句话承诺一定有结果。一次查询可以没有匹配，搜索状态已经这样写了。“Colour schemes” 比 combination 更空。 | `Matching combinations are listed below. A search can also return nothing.` |
| 色板，数据加载时 | `Loading colour relationship` 与 `The field is preparing itself.` | 等待没有对象。句子若停在屏幕上，读者不知道在加载什么。`app.js` 的失败句已经写明数据不可用，以及页面必须通过 HTTP 打开。 | `Loading the colour combination.` 与 `Still loading the colour data.` |
| JSON 页标题 | `Take the plate with you.` | 标题说的是一种感觉。按钮已经写着 `COPY JSON`，下一句也列出了文件内容。 | `Copy this plate as JSON.` |
| 壁纸页标题 | `Take the colours with you` | 任务是下载。它下面的标题已经写着 Wallpaper。 | `Download a wallpaper` |
| 壁纸页第一句 | `Download this plate as a full-resolution PNG.` | “Full-resolution” 没有像素尺寸。它下面的控件列出 1440 × 3120、2048 × 2732 和 3840 × 2160。 | `Download this plate as a PNG at the size you choose.` |

故意留下、不建议替换的句子：

- `Start with a feeling. Or don’t.` 访客可以带着一种情绪来，也可以没有。同一页上有随机打开的控件。
- `A colour is not a property. It is an event between surfaces.`
- `Red has the appetite. Black has the nerve.` 以及 `classy and dangerous.`
- 文摘里关于自然食欲的一段，英文、泰文、简体中文都留下。
- `He did not leave us a trend. He left a way of seeing relationships.` 它标明是阐释。旁边有日期的年表保留出处。
- `NO IDEA — SURPRISE ME` 与 `COPY THIS FOR YOUR AGENT`。
- `Colour data is unavailable.` `Serve this repository over HTTP and try again.` `No match for “…”` 以及复制被阻止时的句子。它们已经告诉读者发生了什么、下一步做什么。

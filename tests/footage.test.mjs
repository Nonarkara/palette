import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

const credit = "Footage: '[Film]' (US Government, public domain) via FedFlix / Internet Archive, found with Destockd.";

test("Destockd is the named source for archival motion, with the rights warning intact", async () => {
  const [guide, credits, notices, contract, readme, journal] = await Promise.all([
    read("../PALETTE-FIELD-GUIDE.md"),
    read("../CREDITS.md"),
    read("../THIRD_PARTY_NOTICES.md"),
    read("../context.md"),
    read("../README.md"),
    read("../JOURNAL.md"),
  ]);

  for (const text of [guide, credits]) {
    assert.match(text, /## Motion \/ archival footage/);
    assert.match(text, /https:\/\/www\.destockd\.com\//);
    assert.match(text, /https:\/\/archive\.org\/details\/FedFlix/);
    assert.match(text, /41,000\+/);
    assert.match(text, /no account and no card/i);
    assert.match(text, /visual text search/i);
    assert.match(text, /downloads as an MP4/);
    assert.match(text, /mostly public domain/);
    assert.match(text, /There is no warranty/);
    assert.match(text, /third-party music or footage/);
    assert.match(text, /3–6 seconds/);
    assert.match(text, /muted/);
    assert.match(text, /autoplay/);
    assert.match(text, /playsinline/);
    assert.match(text, /WebM\/AV1/);
    assert.match(text, /720p or smaller/);
    assert.match(text, /1\.5 MB/);
    assert.match(text, /poster frame/);
    assert.match(text, /prefers-reduced-motion/);
    assert.match(text, /Palette tokens/);
    assert.match(text, /crayon rotoscope/);
    assert.match(text, /8 fps/);
    assert.match(text, /sumi-e ink style stays unused/);
    assert.ok(text.includes(credit), "English footage credit line missing");
    assert.match(text, /以文搜图/);
    assert.match(text, /公有领域/);
    assert.match(text, /没有担保/);
    assert.match(text, /第三方的音乐或画面/);
    assert.match(text, /水墨（sumi-e）/);
    assert.match(text, /影像：“\[影片\]”（美国政府，公有领域），经 FedFlix \/ Internet Archive，用 Destockd 找到。/);
    assert.match(text, /สาธารณสมบัติ/);
    assert.match(text, /ไม่มีการรับประกัน/);
    assert.match(text, /บุคคลที่สาม/);
    assert.match(text, /ซูมิเอะ \(sumi-e\)/);
    assert.match(text, /ภาพเคลื่อนไหว: "\[ชื่อภาพยนตร์\]" \(รัฐบาลสหรัฐฯ, สาธารณสมบัติ\) ผ่าน FedFlix \/ Internet Archive พบด้วย Destockd/);
    assert.match(text, /lang="zh-Hans"/);
    assert.match(text, /lang="th"/);
    assert.match(text, /fluent reader has not signed/);
  }

  assert.match(notices, /Destockd/);
  assert.match(notices, /https:\/\/archive\.org\/details\/FedFlix/);
  assert.match(notices, /no warranty/i);
  assert.match(contract, /The colour field stays a colour field/);
  assert.match(contract, credit);
  assert.match(readme, /CREDITS\.md/);
  assert.match(readme, /https:\/\/www\.destockd\.com\//);
  assert.match(journal, /Destockd/);
});

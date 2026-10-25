import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  BookOpen, Search, TrendingUp, BookMarked, Plus, X, Check,
  Pencil, Trash2, ChevronLeft, ChevronRight, ChevronDown, Star, Award,
  Sparkles, Play, Home, Download, Link as LinkIcon, SlidersHorizontal, Upload, ImagePlus, Menu, GripVertical, Pin, Bookmark, Tag, Copy, ClipboardPaste, CalendarDays, Image as ImageIcon, Undo2, Redo2, ArrowUpDown,
  Folder as FolderIc, FolderPlus, Filter, Settings, RefreshCw
} from "lucide-react";

/* ============================================================
   聖書マスタデータ（正式名 / 別名 / 章数）
   ============================================================ */
const BOOKS = [
  { name: "創世記", aliases: ["創"], chapters: 50 },
  { name: "出エジプト記", aliases: ["出"], chapters: 40 },
  { name: "レビ記", aliases: ["レビ"], chapters: 27 },
  { name: "民数記", aliases: ["民"], chapters: 36 },
  { name: "申命記", aliases: ["申"], chapters: 34 },
  { name: "ヨシュア記", aliases: ["ヨシュア"], chapters: 24 },
  { name: "士師記", aliases: [], chapters: 21 },
  { name: "ルツ記", aliases: ["ルツ"], chapters: 4 },
  { name: "サムエル記 第一", aliases: ["サムエル記第一", "サムエル上", "Ⅰサムエル", "1サムエル"], chapters: 31 },
  { name: "サムエル記 第二", aliases: ["サムエル記第二", "サムエル下", "Ⅱサムエル", "2サムエル"], chapters: 24 },
  { name: "列王記 第一", aliases: ["列王記第一", "列王記上", "Ⅰ列王記", "1列王記"], chapters: 22 },
  { name: "列王記 第二", aliases: ["列王記第二", "列王記下", "Ⅱ列王記", "2列王記"], chapters: 25 },
  { name: "歴代誌 第一", aliases: ["歴代誌第一", "歴代誌上", "Ⅰ歴代誌", "1歴代誌"], chapters: 29 },
  { name: "歴代誌 第二", aliases: ["歴代誌第二", "歴代誌下", "Ⅱ歴代誌", "2歴代誌"], chapters: 36 },
  { name: "エズラ記", aliases: ["エズラ"], chapters: 10 },
  { name: "ネヘミヤ記", aliases: ["ネヘミヤ"], chapters: 13 },
  { name: "エステル記", aliases: ["エステル"], chapters: 10 },
  { name: "ヨブ記", aliases: ["ヨブ"], chapters: 42 },
  { name: "詩篇", aliases: ["詩編", "詩"], chapters: 150 },
  { name: "箴言", aliases: [], chapters: 31 },
  { name: "伝道者の書", aliases: ["伝道の書", "コヘレトの言葉", "伝道者の書"], chapters: 12 },
  { name: "雅歌", aliases: [], chapters: 8 },
  { name: "イザヤ書", aliases: ["イザヤ"], chapters: 66 },
  { name: "エレミヤ書", aliases: ["エレミヤ"], chapters: 52 },
  { name: "哀歌", aliases: [], chapters: 5 },
  { name: "エゼキエル書", aliases: ["エゼキエル"], chapters: 48 },
  { name: "ダニエル書", aliases: ["ダニエル"], chapters: 12 },
  { name: "ホセア書", aliases: ["ホセア"], chapters: 14 },
  { name: "ヨエル書", aliases: ["ヨエル"], chapters: 3 },
  { name: "アモス書", aliases: ["アモス"], chapters: 9 },
  { name: "オバデヤ書", aliases: ["オバデヤ"], chapters: 1 },
  { name: "ヨナ書", aliases: ["ヨナ"], chapters: 4 },
  { name: "ミカ書", aliases: ["ミカ"], chapters: 7 },
  { name: "ナホム書", aliases: ["ナホム"], chapters: 3 },
  { name: "ハバクク書", aliases: ["ハバクク"], chapters: 3 },
  { name: "ゼパニヤ書", aliases: ["ゼパニヤ"], chapters: 3 },
  { name: "ハガイ書", aliases: ["ハガイ"], chapters: 2 },
  { name: "ゼカリヤ書", aliases: ["ゼカリヤ"], chapters: 14 },
  { name: "マラキ書", aliases: ["マラキ"], chapters: 4 },
  { name: "マタイの福音書", aliases: ["マタイ"], chapters: 28 },
  { name: "マルコの福音書", aliases: ["マルコ"], chapters: 16 },
  { name: "ルカの福音書", aliases: ["ルカ"], chapters: 24 },
  { name: "ヨハネの福音書", aliases: ["ヨハネ"], chapters: 21 },
  { name: "使徒の働き", aliases: ["使徒言行録", "使徒行伝", "使徒"], chapters: 28 },
  { name: "ローマ人への手紙", aliases: ["ローマの信徒への手紙", "ローマ書", "ローマ"], chapters: 16 },
  { name: "コリント人への手紙 第一", aliases: ["コリント人への手紙第一", "コリント人への第一の手紙", "コリント第一", "Ⅰコリント", "1コリント"], chapters: 16 },
  { name: "コリント人への手紙 第二", aliases: ["コリント人への手紙第二", "コリント人への第二の手紙", "コリント第二", "Ⅱコリント", "2コリント"], chapters: 13 },
  { name: "ガラテヤ人への手紙", aliases: ["ガラテヤ書", "ガラテヤ"], chapters: 6 },
  { name: "エペソ人への手紙", aliases: ["エペソ書", "エフェソの信徒への手紙", "エペソ"], chapters: 6 },
  { name: "ピリピ人への手紙", aliases: ["ピリピ書", "フィリピの信徒への手紙", "ピリピ"], chapters: 4 },
  { name: "コロサイ人への手紙", aliases: ["コロサイ書", "コロサイ"], chapters: 4 },
  { name: "テサロニケ人への手紙 第一", aliases: ["テサロニケ人への手紙第一", "テサロニケ人への第一の手紙", "テサロニケ第一", "Ⅰテサロニケ", "1テサロニケ"], chapters: 5 },
  { name: "テサロニケ人への手紙 第二", aliases: ["テサロニケ人への手紙第二", "テサロニケ人への第二の手紙", "テサロニケ第二", "Ⅱテサロニケ", "2テサロニケ"], chapters: 3 },
  { name: "テモテへの手紙 第一", aliases: ["テモテへの手紙第一", "テモテへの第一の手紙", "テモテ第一", "Ⅰテモテ", "1テモテ"], chapters: 6 },
  { name: "テモテへの手紙 第二", aliases: ["テモテへの手紙第二", "テモテへの第二の手紙", "テモテ第二", "Ⅱテモテ", "2テモテ"], chapters: 4 },
  { name: "テトスへの手紙", aliases: ["テトス書", "テトス"], chapters: 3 },
  { name: "ピレモンへの手紙", aliases: ["ピレモン書", "ピレモン"], chapters: 1 },
  { name: "ヘブル人への手紙", aliases: ["ヘブル書", "ヘブライ人への手紙", "ヘブル"], chapters: 13 },
  { name: "ヤコブの手紙", aliases: ["ヤコブ書", "ヤコブ"], chapters: 5 },
  { name: "ペテロの手紙 第一", aliases: ["ペテロの手紙第一", "ペテロの第一の手紙", "ペテロ第一", "Ⅰペテロ", "1ペテロ"], chapters: 5 },
  { name: "ペテロの手紙 第二", aliases: ["ペテロの手紙第二", "ペテロの第二の手紙", "ペテロ第二", "Ⅱペテロ", "2ペテロ"], chapters: 3 },
  { name: "ヨハネの手紙 第一", aliases: ["ヨハネの手紙第一", "ヨハネの第一の手紙", "ヨハネ第一の手紙", "Ⅰヨハネ", "1ヨハネ"], chapters: 5 },
  { name: "ヨハネの手紙 第二", aliases: ["ヨハネの手紙第二", "ヨハネの第二の手紙", "ヨハネ第二の手紙", "Ⅱヨハネ", "2ヨハネ"], chapters: 1 },
  { name: "ヨハネの手紙 第三", aliases: ["ヨハネの手紙第三", "ヨハネの第三の手紙", "ヨハネ第三の手紙", "Ⅲヨハネ", "3ヨハネ"], chapters: 1 },
  { name: "ユダの手紙", aliases: ["ユダ書", "ユダ"], chapters: 1 },
  { name: "ヨハネの黙示録", aliases: ["黙示録"], chapters: 22 },
];

/* 実績画面で66巻を折りたたむためのまとまり（BOOKS の並び順に対応） */
const BOOK_GROUPS = [
  { label: "モーセ五書", from: 0, to: 4 },
  { label: "歴史書", from: 5, to: 16 },
  { label: "詩歌書", from: 17, to: 21 },
  { label: "大預言書", from: 22, to: 26 },
  { label: "小預言書", from: 27, to: 38 },
  { label: "福音書と使徒の働き", from: 39, to: 43 },
  { label: "パウロの手紙", from: 44, to: 56 },
  { label: "その他の手紙と黙示録", from: 57, to: 65 },
];

const bookByName = (name) => BOOKS.find((b) => b.name === name);
const bookIndexOf = (name) => { const i = BOOKS.findIndex((b) => b.name === name); return i === -1 ? 9999 : i; };

/* ============================================================
   聖書箇所パース関数
   ============================================================ */
function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
const BOOK_NAME_TABLE = BOOKS.flatMap((b) => {
  const names = [b.name, ...b.aliases];
  const withSpacedVariants = [];
  names.forEach((n) => {
    withSpacedVariants.push(n);
    const m = n.match(/^(.+?)(第[一二三])(.*)$/);
    if (m && !n.includes(" ")) withSpacedVariants.push(`${m[1]} ${m[2]}${m[3]}`);
  });
  return withSpacedVariants.map((n) => ({ n, canonical: b.name }));
}).sort((a, b) => b.n.length - a.n.length);
const BOOK_PATTERN = BOOK_NAME_TABLE.map((b) => escapeRegExp(b.n)).join("|");
/* 「申命記 6:5」「ヨハネ 3章」「詩篇 23」のように、節が無く章だけでも拾えるようにしている。
   章のまたぎ（「創世記 2章-5章」）も拾う。
   分かれ道は上から順に試されるので、**並べ替えないこと**。
   ① 章の範囲「2章-5章」「2-5章」  ← 終わりに「章」が付く形
   ② 章の範囲「2章-5」            ← 始めにだけ「章」が付く形
   ③ 節「6:5」「6章5」、範囲つきの「3:16-18」
   ④ 章だけ「3章」
   なお「創世記 2-5」のように「章」がどこにも無い書き方は、
   節なのか章なのか決められないため、これまでどおり章2として扱う */
const REF_REGEX = new RegExp(
  `(${BOOK_PATTERN})\\s*(\\d+)\\s*` +
  `(?:` +
    `章?\\s*[-〜~]\\s*(\\d+)\\s*章` +
    `|章\\s*[-〜~]\\s*(\\d+)` +
    `|[:：章]\\s*(\\d+)(?:\\s*[-〜~]\\s*(\\d+))?` +
    `|章` +
  `)?`,
  "g"
);

/* 短い略称（「創」「出」「民」「申」「詩」「レビ」「使徒」など）は、
   ふつうの日本語の中にたまたま現れることがある。
   そのまま拾うと「国民 3割」が『民数記 3章』に、「出3人」が『出エジプト記 3章』になり、
   聖書箇所をひとつも含まない記録まで「同じ箇所」と見なされてしまう（実際そうなっていた）。
   **2文字までの略称のときだけ**、次の2つを確かめる。
   ・直前が漢字・英数字でないこと（「国民」「提出」のような語の一部を弾く）
   ・1文字の略称は「章」か「:」「：」が付いていること（「出3人」を弾く）
   正式名（「創世記」など）は、これまでどおりどこに置かれても拾う。
   **この判定は parseBibleRefs と splitByCitations の両方で必ず通すこと。**
   片方だけにすると、拾う範囲と色を付ける範囲が食い違う */
const SHORT_NAME_MAX = 2;
const WORDY_CHAR = /[\u4E00-\u9FFF\u3005A-Za-z0-9\uFF10-\uFF19]/;
function bookNameOkAt(text, index, matched, name) {
  if (!name || name.length > SHORT_NAME_MAX) return true;
  const before = index > 0 ? text[index - 1] : "";
  if (before && WORDY_CHAR.test(before)) return false;
  if (name.length === 1 && !/[章:：]/.test(matched)) return false;
  return true;
}

function parseBibleRefs(text) {
  if (!text) return [];
  const refs = []; const seen = new Set(); let match;
  REF_REGEX.lastIndex = 0;
  while ((match = REF_REGEX.exec(text)) !== null) {
    const found = BOOK_NAME_TABLE.find((b) => b.n === match[1]);
    if (!found) continue;
    if (!bookNameOkAt(text, match.index, match[0], match[1])) continue;
    const chapter = parseInt(match[2], 10);
    /* ①と②のどちらで拾えても、終わりの章は同じ意味 */
    const endRaw = match[3] || match[4];
    let chapterEnd = endRaw ? parseInt(endRaw, 10) : undefined;
    /* 逆向き（5章-2章）や、その書に無い章数は範囲として扱わない */
    const maxCh = (bookByName(found.canonical) || {}).chapters || 0;
    if (chapterEnd !== undefined && (chapterEnd <= chapter || (maxCh && chapterEnd > maxCh))) chapterEnd = undefined;
    const ref = {
      book: found.canonical,
      chapter,
      chapterEnd,
      verse: match[5] ? parseInt(match[5], 10) : undefined,
      verseEnd: match[6] ? parseInt(match[6], 10) : undefined,
    };
    const key = `${ref.book}-${ref.chapter}-${ref.chapterEnd || ""}-${ref.verse || ""}-${ref.verseEnd || ""}`;
    if (!seen.has(key)) { seen.add(key); refs.push(ref); }
  }
  return refs;
}
function formatRef(ref) {
  if (!ref || !ref.book) return "";
  let s = ref.book;
  if (ref.chapter) s += ` ${ref.chapter}`;
  /* 章をまたぐときは「創世記 2-5」と続けて見せる */
  if (ref.chapterEnd && ref.chapterEnd > ref.chapter) s += `-${ref.chapterEnd}`;
  if (ref.verse) s += `:${ref.verse}`;
  if (ref.verseEnd) s += `-${ref.verseEnd}`;
  return s;
}
function sameRef(a, b) { if (!a || !b) return false; return a.book === b.book && a.chapter === b.chapter && (a.verse || null) === (b.verse || null); }
/* 2つの聖書箇所が「同じところ」を指しているか。
   ・書が違えば重ならない
   ・章（範囲を含む）が離れていれば重ならない
   ・**どちらにも節が書かれているときは、節まで見る。**
     「ヨハネの福音書 3:16」を書いているときに「ヨハネの福音書 3:5」のメモを
     出さないため。章が同じというだけで拾うと、関係のないメモが並ぶ（実際そうなっていた）
   ・片方に節が無いときは、その章ぜんたいを指しているものとして重なりと見なす
     （3章の通読は 3:16 を含んでいる） */
function refsOverlap(a, b) {
  if (!a || !b || !a.book || !b.book || a.book !== b.book) return false;
  if (a.chapter == null || b.chapter == null) return false;
  const aTo = a.chapterEnd && a.chapterEnd > a.chapter ? a.chapterEnd : a.chapter;
  const bTo = b.chapterEnd && b.chapterEnd > b.chapter ? b.chapterEnd : b.chapter;
  if (aTo < b.chapter || bTo < a.chapter) return false;
  /* 節を見るのは、どちらも1つの章だけを指していて、両方に節があるときだけ */
  if (a.chapter !== aTo || b.chapter !== bTo || !a.verse || !b.verse) return true;
  const aVe = a.verseEnd && a.verseEnd > a.verse ? a.verseEnd : a.verse;
  const bVe = b.verseEnd && b.verseEnd > b.verse ? b.verseEnd : b.verse;
  return !(aVe < b.verse || bVe < a.verse);
}
function primaryRef(text) { const refs = parseBibleRefs(text); return refs[0] || null; }
function truncateAtCitation(text) {
  if (!text) return text;
  const parenRegex = /\([^)]*\)/g;
  let match, lastEnd = null;
  while ((match = parenRegex.exec(text)) !== null) { if (parseBibleRefs(match[0]).length > 0) lastEnd = match.index + match[0].length; }
  if (lastEnd != null) return text.slice(0, lastEnd).trim();
  return text.trim();
}
function formatChapterList(nums) {
  if (!nums || !nums.length) return "";
  const sorted = [...nums].sort((a, b) => a - b);
  const parts = [];
  let start = sorted[0], prev = sorted[0];
  for (let i = 1; i <= sorted.length; i++) {
    const cur = sorted[i];
    if (cur === prev + 1) { prev = cur; continue; }
    parts.push(start === prev ? `${start}` : `${start}-${prev}`);
    start = cur; prev = cur;
  }
  return parts.join(", ");
}

/* ============================================================
   自由タグ
   決まった一覧は持たない。これまでに使われた言葉を集めて候補にするので、
   新しいタグが増えても探す側の作りを直す必要はない
   ============================================================ */
const TAG_MAX = 24;
function normalizeTags(list) {
  if (!Array.isArray(list)) return [];
  const out = []; const seen = new Set();
  list.forEach((t) => {
    const s = String(t == null ? "" : t).replace(/\s+/g, " ").trim().slice(0, TAG_MAX);
    if (!s) return;
    const key = s.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key); out.push(s);
  });
  return out;
}
/* すべての記録から、使われているタグを「よく使う順」に集める */
function allTagsOf(records) {
  const count = new Map();
  (records || []).forEach((r) => (r.tags || []).forEach((t) => count.set(t, (count.get(t) || 0) + 1)));
  return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "ja")).map(([t]) => t);
}

/* ============================================================
   本文の中のURL
   参考資料の項目を廃止したので、URLはメモ欄に直接貼ってもらう。
   閲覧画面では、押せるリンクとして描く
   ============================================================ */
const URL_REGEX = /https?:\/\/[^\s<>"'）)】」、。]+/g;
/* 文章を「URLの部分」と「それ以外」に切り分けて返す。
   末尾の句点やカンマはURLに含めない（「…example.com。」のような書き方に備える）。
   切り分けの決まりはここ1か所にまとめること。
   同じ処理を描画側にも書くと、片方だけ直したときに食い違う */
function splitByUrl(text) {
  const segs = [];
  if (!text) return segs;
  let last = 0, m;
  URL_REGEX.lastIndex = 0;
  while ((m = URL_REGEX.exec(text)) !== null) {
    const raw = m[0];
    const url = raw.replace(/[.,]+$/, "");
    const end = m.index + url.length;
    if (m.index > last) segs.push({ url: null, text: text.slice(last, m.index) });
    segs.push({ url, text: url });
    last = end;
  }
  if (last < text.length) segs.push({ url: null, text: text.slice(last) });
  return segs;
}




/* ============================================================
   レコード関連ヘルパ
   ============================================================ */
function recordAllText(r) {
  const parts = [];
  if (r.type === "reading") { parts.push(r.notes); }
  else if (r.type === "message") {
    /* 新しい項目を足したら、ここにも足すこと。忘れると言葉で探せない */
    parts.push(r.theme, r.passageText, r.purpose, r.mainVerseText, r.notes);
  }
  else if (r.type === "memorization") { parts.push(r.text, r.note); }
  else if (r.type === "memo") { parts.push(r.notes); }
  /* タグも言葉で探せるようにする。これで「タグ用の探し方」を別に作らずに済む */
  parts.push(...(r.tags || []));
  return parts.filter(Boolean).join("\n");
}
function recordRefs(r) {
  const refs = [];
  /* 章をまたぐ箇所（創世記 2章-5章）は、間の章もすべて数え上げる。
     こうしないと「4章」で探したときに見つからない */
  parseBibleRefs(recordAllText(r)).forEach((x) => {
    refs.push(x);
    if (x.chapterEnd && x.chapterEnd > x.chapter) {
      for (let c = x.chapter + 1; c <= x.chapterEnd; c++) refs.push({ book: x.book, chapter: c });
    }
  });
  if (r.type === "reading" && r.book) {
    if (r.chapters && r.chapters.length > 0) r.chapters.forEach((c) => refs.push({ book: r.book, chapter: c }));
    else refs.push({ book: r.book, chapter: null });
  }
  /* その他は書を持たなくなったが、古い記録が読み込まれた場合に備えて残しておく */
  if (r.type === "memo" && r.book) refs.push({ book: r.book, chapter: null });
  return refs;
}
/* 「この記録はどこを扱っているか」を決めるための箇所の一覧。
   `recordRefs` とは役目が違うので、別に用意してある
   （`recordRefs` は探すの絞り込みや実績の集計に使うもので、
   そちらの結果を変えると別の画面に影響が出る）。

   **章だけの言い及びは、同じ章に節つきの箇所があるときは数えないこと。**
   学びの記録で、聖書箇所が「ヨハネの福音書 3:1-12」でも、
   メモに「ヨハネ3章の前半について」と書いてあると、
   章だけの箇所が拾われて章ぜんたいを扱ったことになり、
   「3:13-24」を書いているときにこの記録が並んでいた（実際そうなっていた）。

   ただし**通読で選んだ書・章は別**。あれは「その章を読んだ」という
   はっきりした事実なので、本文に節つきの引用があっても章ぜんたいのまま残す。 */
function narrowRefs(list) {
  const hasVerse = new Set();
  list.forEach((x) => { if (x && x.book && x.chapter != null && x.verse) hasVerse.add(x.book + "-" + x.chapter); });
  return list.filter((x) => x && (x.verse || !hasVerse.has(x.book + "-" + x.chapter)));
}
function recordScopeRefs(r) {
  /* 通読で選んだ章は、そのまま章ぜんたいとして数える */
  const fixed = [];
  if (r.type === "reading" && r.book && (r.chapters || []).length > 0) {
    r.chapters.forEach((c) => fixed.push({ book: r.book, chapter: c }));
  }
  /* 本文から読み取った箇所。章をまたぐ書き方は、間の章も数え上げる */
  const fromText = [];
  parseBibleRefs(recordAllText(r)).forEach((x) => {
    fromText.push(x);
    if (x.chapterEnd && x.chapterEnd > x.chapter) {
      for (let c = x.chapter + 1; c <= x.chapterEnd; c++) fromText.push({ book: x.book, chapter: c });
    }
  });
  return [...fixed, ...narrowRefs(fromText)];
}

/* 並べるときに使う「代表の箇所」。
   **どの種類でも、決まった欄が空なら本文から拾い直すこと。**
   拾い直しを忘れると、その記録だけ目次順のいちばん後ろへ回される */
function primarySortRef(r) {
  if (r.type === "reading") {
    if (r.book) return { book: r.book, chapter: r.chapters && r.chapters.length ? Math.min(...r.chapters) : null, verse: null };
    /* 書を選ばずにメモだけ書いた通読は、本文から拾う */
    return primaryRef(recordAllText(r)) || {};
  }
  /* 「その他」も、本文に書いた聖書箇所で並べる。
     以前は r.book という欄を見ていたが、その欄は廃止済みで
     いつも空になり、目次順のいちばん後ろへ回されていた（実際そうなっていた） */
  if (r.type === "memo") return primaryRef(recordAllText(r)) || {};
  if (r.type === "message") return primaryRef(r.mainVerseText) || primaryRef(recordAllText(r)) || {};
  if (r.type === "memorization") return primaryRef(r.text) || {};
  return {};
}
function compareForSearch(a, b) {
  const ra = primarySortRef(a), rb = primarySortRef(b);
  const ba = bookIndexOf(ra.book), bb = bookIndexOf(rb.book);
  if (ba !== bb) return ba - bb;
  const ca = ra.chapter ?? 9999, cb = rb.chapter ?? 9999;
  if (ca !== cb) return ca - cb;
  const va = ra.verse ?? 9999, vb = rb.verse ?? 9999;
  if (va !== vb) return va - vb;
  return (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || "");
}
function chipRefs(refs) {
  const map = new Map();
  refs.forEach((r) => { if (!r.book) return; const key = `${r.book}-${r.chapter || ""}`; if (!map.has(key)) map.set(key, r); });
  return Array.from(map.values()).slice(0, 4);
}

/* ============================================================
   ストレージ
   ============================================================ */
/* ============================================================
   保存まわり
   ・まず専用ストレージ、だめなら端末のlocalStorageへ、と二段構えにしている
     （片方が使えない環境でも記録が消えないようにするため）
   ============================================================ */
async function storageGet(key) {
  try {
    if (typeof window !== "undefined" && window.storage && window.storage.get) {
      const res = await window.storage.get(key, false);
      if (res && typeof res.value === "string") return res.value;
    }
  } catch (e) { /* 次の手段へ */ }
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
async function storageSet(key, value) {
  let firstError = null;
  try {
    if (typeof window !== "undefined" && window.storage && window.storage.set) {
      await window.storage.set(key, value, false);
      try { localStorage.setItem(key, value); } catch (e) { /* 控えの保存は失敗しても構わない */ }
      return { ok: true };
    }
  } catch (e) { firstError = e; }
  try {
    localStorage.setItem(key, value);
    return { ok: true };
  } catch (e) {
    const err = firstError || e;
    return { ok: false, message: (err && err.message) ? err.message : String(err) };
  }
}

const STORAGE_KEY = "bible-tracker-records";
async function loadRecords() {
  try {
    const raw = await storageGet(STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    /* 中身が壊れていても起動できるようにする。
       配列でなければ空として扱い、記録らしくないものは取り除く */
    if (!Array.isArray(data)) return [];
    return data.filter((r) => r && typeof r === "object" && !Array.isArray(r));
  }
  catch (e) { return []; }
}
async function persistRecords(records) {
  const res = await storageSet(STORAGE_KEY, JSON.stringify(records));
  if (!res.ok) console.error("保存に失敗しました", res.message);
  return res;
}

/* ユーザーが描いたイラスト。記録とは別に保管する */
const ART_KEY = "bible-tracker-illustrations";
const ART_MAX = 5;
const ART_TOTAL_LIMIT = 2_500_000; // 保存する文字数の上限（安全側に設定）
async function loadArtworks() {
  try {
    const raw = await storageGet(ART_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter((a) => a && typeof a === "object" && a.src);
  }
  catch (e) { return []; }
}
async function persistArtworks(list) {
  const payload = JSON.stringify(list);
  if (payload.length > ART_TOTAL_LIMIT) {
    return { ok: false, message: "イラストの合計サイズが大きすぎます。枚数を減らしてください。" };
  }
  return await storageSet(ART_KEY, payload);
}

/* ヘッダの背景に敷く絵。
   イラスト（最大5枚）とは別枠にする。役目が違ううえ、横長で1枚だけなので、枚数の数え上げに混ぜると分かりにくい。

   **絵の中身（data URL）を、ここ（設定の置き場）に持たないこと。**
   ふだんの置き場は端末の容量が小さく（5MBほど）、ヘッダーの絵だけで大半を使ってしまうため、
   記録そのものが保存できなくなる。2.2.0 からは写真の置き場（IndexedDB）へ入れ、
   ここには「photo:番号」だけを持つ（記録に付ける写真と同じ持ち方）。
   ただし、置き場から消えても戻せるよう、絵の控えは DECO_PHOTO_KEY に写しておく（syncDecoPhotos）。
   2.1.1 までに設定した絵（data URL がそのまま入っているもの）は、読み込んだときにそのまま使えるようにし、
   選び直された時点で新しい持ち方に変わる */
const HEADER_KEY = "bible-tracker-headerbg";
const HEADER_LIMIT = 1_200_000; // 古い持ち方のときの上限（安全側）
async function loadHeaderBg() {
  try {
    const raw = await storageGet(HEADER_KEY);
    if (!raw) return null;
    /* 中身が壊れていても起動できるようにする。文字列でなければ無いものとして扱う */
    const d = JSON.parse(raw);
    if (typeof d === "string") return d || null;
    if (d && typeof d === "object" && typeof d.src === "string") return d.src || null;
    return null;
  } catch (e) { return null; }
}
async function persistHeaderBg(src) {
  /* 絵そのものを渡されたときは、先に写真の置き場へ入れて「photo:番号」に変える。
     置き場が使えない端末では、これまでどおり中身を持つ（そのときだけ大きさの上限を見る） */
  let ref = src || null;
  if (src && !isPhotoRef(src)) {
    const id = "ph_" + uid();
    const res = await photoPut(id, src);
    if (res !== null) ref = "photo:" + id;
  }
  const payload = JSON.stringify(ref ? { src: ref } : null);
  if (!isPhotoRef(ref) && payload.length > HEADER_LIMIT) {
    return { ok: false, message: "画像が大きすぎます。もう少し小さいものをお選びください。" };
  }
  const res = await storageSet(HEADER_KEY, payload);
  if (res && res.ok === false) return res;
  /* 置き場から消えても戻せるように、絵の控えを作り直す */
  await syncDecoPhotos(ref);
  return { ...(res || { ok: true }), src: ref };
}

/* ============================================================
   写真の置き場（IndexedDB）　※姉妹アプリ My手帳 から移植
   **写真を記録の中に文字（data URL）のまま持たないこと。**
   端末がふつうに置ける量（5MBほど）をすぐ超えて、記録そのものが保存できなくなる。
   記録には「photo:番号」だけを持たせ、絵の中身はここに置く
   ============================================================ */
const PHOTO_DB = "bible-tracker-photos";
const PHOTO_STORE = "photos";
/* 置き場を開くのを待つ上限。これを過ぎたら「開けなかった」とみなす */
const PHOTO_DB_WAIT_MS = 4000;
/* 置き場が開けた・控えから絵を戻せたことを、絵を出している部品へ知らせる。
   **一度読めなかった部品を、そのままあきらめさせないこと。** */
const photoListeners = new Set();
function notifyPhotoStore() {
  photoListeners.forEach((fn) => { try { fn(); } catch (e) { /* noop */ } });
}
const photoCache = new Map(); // 一度読んだ絵は覚えておく
let photoDbPromise = null;
function photoDB() {
  if (photoDbPromise) return photoDbPromise;
  /* **「開けなかった」を覚えこまないこと。** 起ち上がりの一瞬など、たまたま一度開けなかっただけで
     覚えてしまうと、そのあいだずっと「置き場が無い」ことになり、ヘッダーの絵が白いまま戻らない。
     **返事を待ち続けないこと。** iPhone では、入れ直した直後や更新の直後に indexedDB.open が
     成功も失敗も返さないまま止まることがある。決まった時間で見切り、あとから開けたらそれを使う */
  let failed = false;
  let settled = false;
  const pr = new Promise((resolve) => {
    const finish = (db) => {
      if (settled) { if (db && !photoDbPromise) photoDbPromise = Promise.resolve(db); return; }
      settled = true;
      if (!db) { failed = true; if (photoDbPromise === pr) photoDbPromise = null; }
      resolve(db);
      if (db) notifyPhotoStore();
    };
    const fail = () => finish(null);
    try {
      if (typeof indexedDB === "undefined") { resolve(null); return; }
      const req = indexedDB.open(PHOTO_DB, 1);
      setTimeout(() => { if (!settled) fail(); }, PHOTO_DB_WAIT_MS);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(PHOTO_STORE)) db.createObjectStore(PHOTO_STORE);
      };
      req.onsuccess = () => {
        const db = req.result;
        try {
          db.onversionchange = () => { try { db.close(); } catch (e2) { /* noop */ } photoDbPromise = null; };
          db.onclose = () => { photoDbPromise = null; };
        } catch (e2) { /* 使えなくても構わない */ }
        finish(db);
      };
      req.onerror = fail;
      req.onblocked = fail;
    } catch (e) { fail(); }
  });
  photoDbPromise = failed ? null : pr;
  return pr;
}
function photoTx(mode, fn) {
  return photoDB().then((db) => {
    if (!db) return null;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(PHOTO_STORE, mode);
        const req = fn(tx.objectStore(PHOTO_STORE));
        tx.oncomplete = () => resolve(req && "result" in req ? req.result : true);
        tx.onerror = () => resolve(null);
        tx.onabort = () => resolve(null);
      } catch (e) { resolve(null); }
    });
  });
}
const isPhotoRef = (v) => typeof v === "string" && v.slice(0, 6) === "photo:";
async function photoPut(id, dataUrl) {
  photoCache.set(id, dataUrl);
  return photoTx("readwrite", (st) => st.put(dataUrl, id));
}
async function photoGet(id) {
  if (photoCache.has(id)) return photoCache.get(id);
  const v = await photoTx("readonly", (st) => st.get(id));
  if (typeof v === "string") { photoCache.set(id, v); return v; }
  /* 置き場に無い（消された・開けなかった）ときは、ヘッダーの控えを見る。
     見つかったら置き場へ戻しておく */
  const m = await loadDecoPhotos();
  const d = m && m[id];
  if (typeof d === "string" && d) {
    photoCache.set(id, d);
    photoTx("readwrite", (st) => st.put(d, id));
    return d;
  }
  return null;
}
async function photoDel(id) {
  photoCache.delete(id);
  return photoTx("readwrite", (st) => st.delete(id));
}
/* 記録の中の写真を、置き場へ移す。**保存の前に必ず通すこと**（通さないと data URL のまま記録に残る） */
async function stashPhotos(rec) {
  const imgs = rec && rec.images;
  if (!Array.isArray(imgs) || !imgs.length) return rec;
  const out = [];
  for (const src of imgs) {
    if (isPhotoRef(src)) { out.push(src); continue; }
    const id = "ph_" + uid();
    const res = await photoPut(id, src);
    /* 置き場が使えない端末では、これまでどおり記録の中に持つ */
    out.push(res === null ? src : "photo:" + id);
  }
  return { ...rec, images: out };
}
/* 中身をすみずみまで見て「photo:番号」を拾い集める。
   **記録の images だけを見にいかないこと。** ヘッダーに敷いた絵も同じ置き場にある。
   数えそこねると「もう使われていない絵」と見なされ、片づけで消える */
function collectPhotoRefs(value, out, depth) {
  const set = out || new Set();
  const d = depth || 0;
  if (d > 8 || value === null || value === undefined) return set;
  if (typeof value === "string") { if (isPhotoRef(value)) set.add(value.slice(6)); return set; }
  if (Array.isArray(value)) { for (const v of value) collectPhotoRefs(v, set, d + 1); return set; }
  if (typeof value === "object") {
    for (const k in value) if (Object.prototype.hasOwnProperty.call(value, k)) collectPhotoRefs(value[k], set, d + 1);
  }
  return set;
}
/* 使われなくなった写真を片づける。
   **記録の配列だけを渡さないこと。** 渡されなかったぶんは、まるごと消える。
   まとめ（{ records, headerBg, ... }）を必ず渡すこと。形になっていないときは、安全側に倒して何もしない */
async function sweepPhotos(all) {
  if (!all || typeof all !== "object" || Array.isArray(all) || !("records" in all)) {
    console.warn("sweepPhotos: まとめが渡されていないので、片づけを見送りました");
    return;
  }
  const used = collectPhotoRefs(all);
  /* **ヘッダーの控えにある絵は、ここでは消さないこと。** 控えはヘッダーを保存したときに作り直すので、
     使われなくなったものはそちらで外れ、次の片づけで消える。
     ここで消すと、ほかのタブや古い版が持っていた古い一覧で数えたとき、ヘッダーの絵だけが置き場から消える */
  const deco = await loadDecoPhotos();
  const keys = await photoTx("readonly", (st) => st.getAllKeys());
  if (!Array.isArray(keys)) return;
  for (const k of keys) if (!used.has(k) && !(deco && Object.prototype.hasOwnProperty.call(deco, k))) await photoDel(k);
}

/* ヘッダーの絵の控え。
   **ヘッダーの絵を置き場ひとつにだけ預けないこと。**
   記録の写真は、保存のたびに記録といっしょに「使用中」と数えられ、記録の一覧もしょっちゅう書き直されるので、
   どこかで取りこぼしても自然に戻る。ヘッダーは
   ・絵は選んだ時点で置き場へ、参照（photo:番号）は保存した時点で設定へ、と別々のときに別々の場所へ書く
   ・設定はめったに書き直されない
   ので、一度欠けると戻る道がない。そこで、ふだんの置き場（storageSet）にも絵を写しておき、
   置き場に無いときはここから読んで戻す（My手帳 が実際に「ヘッダーだけ絵が消える」不具合を踏んだ） */
const DECO_PHOTO_KEY = "bible-tracker-decophotos";
let decoPhotos = null;
let decoLoading = null;
function loadDecoPhotos() {
  if (decoPhotos) return Promise.resolve(decoPhotos);
  if (decoLoading) return decoLoading;
  decoLoading = storageGet(DECO_PHOTO_KEY).then((raw) => {
    try { const d = raw ? JSON.parse(raw) : null; decoPhotos = (d && typeof d === "object" && !Array.isArray(d)) ? d : {}; }
    catch (e) { decoPhotos = {}; }
    decoLoading = null;
    if (Object.keys(decoPhotos).length) notifyPhotoStore();
    return decoPhotos;
  });
  return decoLoading;
}
/* いま使っているヘッダーの絵・フォルダの絵だけを控えに残す（使わなくなったものは落とす）。
   **手元に無い絵があっても止めないこと。** 止めると、あとから選んだ絵の控えも作られない。
   ヘッダーとフォルダは別々のときに知らせてくるので、それぞれ最後に聞いた値を覚えておく。
   **まだ一度も聞いていない側（undefined）の控えを落とさないこと。** 起動の直後にフォルダだけ先に
   知らせが来ると、ヘッダーの絵の控えが消えてしまう（My手帳 6-⑤ と同じ決まり） */
const decoRefs = { header: undefined, folders: undefined };
let decoWriting = Promise.resolve();
function writeDecoPhotos() {
  decoWriting = decoWriting.then(async () => {
    const prev = (await loadDecoPhotos()) || {};
    const keepAll = decoRefs.header === undefined || decoRefs.folders === undefined;
    const ids = new Set();
    if (isPhotoRef(decoRefs.header)) ids.add(decoRefs.header.slice(6));
    (decoRefs.folders || []).forEach((r) => { if (isPhotoRef(r)) ids.add(r.slice(6)); });
    const map = keepAll ? { ...prev } : {};
    for (const id of ids) {
      const src = photoCache.get(id) || await photoTx("readonly", (st) => st.get(id)) || prev[id];
      if (typeof src === "string" && src) map[id] = src;
    }
    decoPhotos = map;
    await storageSet(DECO_PHOTO_KEY, JSON.stringify(map));
  }).catch(() => { /* 控えが作れなくても本体は止めない */ });
  return decoWriting;
}
async function syncDecoPhotos(headerRef) {
  decoRefs.header = headerRef || null;
  await writeDecoPhotos();
}
function syncFolderDeco(folders) {
  decoRefs.folders = (folders || []).map((f) => f && f.icon).filter(Boolean);
  return writeDecoPhotos();
}

/* ============================================================
   画面のカスタマイズ（テーマカラーなど）
   ============================================================ */
const THEMES = [
  { key: "teal",   label: "深い緑",   swatch: "#0F766E", vars: { 50:"#F0FDFA",100:"#CCFBF1",200:"#99F6E4",300:"#5EEAD4",600:"#0D9488",700:"#0F766E",800:"#115E59",900:"#134E4A" } },
  /* もとは藍色だったが、菫と見分けがつきにくかったので空色に差し替えた。
     key（"indigo"）は保存された設定と結びついているので変えないこと。
     変えると、この色を選んでいた人の設定が既定の色に戻ってしまう */
  { key: "indigo", label: "空",       swatch: "#0369A1", vars: { 50:"#F0F9FF",100:"#E0F2FE",200:"#BAE6FD",300:"#7DD3FC",600:"#0284C7",700:"#0369A1",800:"#075985",900:"#0C4A6E" } },
  { key: "rose",   label: "臙脂",     swatch: "#BE123C", vars: { 50:"#FFF1F2",100:"#FFE4E6",200:"#FECDD3",300:"#FDA4AF",600:"#E11D48",700:"#BE123C",800:"#9F1239",900:"#881337" } },
  { key: "amber",  label: "琥珀",     swatch: "#B45309", vars: { 50:"#FFFBEB",100:"#FEF3C7",200:"#FDE68A",300:"#FCD34D",600:"#D97706",700:"#B45309",800:"#92400E",900:"#78350F" } },
  { key: "violet", label: "菫",       swatch: "#6D28D9", vars: { 50:"#F5F3FF",100:"#EDE9FE",200:"#DDD6FE",300:"#C4B5FD",600:"#7C3AED",700:"#6D28D9",800:"#5B21B6",900:"#4C1D95" } },
  { key: "slate",  label: "墨",       swatch: "#334155", vars: { 50:"#F8FAFC",100:"#F1F5F9",200:"#E2E8F0",300:"#CBD5E1",600:"#475569",700:"#334155",800:"#1E293B",900:"#0F172A" } },
];
/* 書きかけの記録（自動下書き）。アプリが不意に閉じても失われないようにする */
const DRAFT_KEY = "bible-tracker-draft";
async function loadDraft() {
  try {
    const raw = await storageGet(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw);
    if (!d || typeof d !== "object" || !d.rec || !d.rec.type) return null;
    return d;
  } catch (e) { return null; }
}
async function persistDraft(d) { try { return await storageSet(DRAFT_KEY, JSON.stringify(d)); } catch (e) { return null; } }
async function clearDraft() { try { return await storageSet(DRAFT_KEY, ""); } catch (e) { return null; } }

/* 中身が空っぽの記録かどうか。空の下書きは残さない */
function hasContent(rec) {
  if (!rec) return false;
  const base = emptyRecord(rec.type);
  return Object.keys(base).some((k) => {
    if (k === "id" || k === "createdAt" || k === "date" || k === "type") return false;
    const v = rec[k], d = base[k];
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "string") return v.trim() !== "";
    return v !== d && v !== null && v !== undefined && v !== false;
  });
}

/* 育てている木と、収穫した実の記録 */
const GARDEN_KEY = "bible-tracker-garden";
const DEFAULT_GARDEN = { cycle: null, harvests: [] };
async function loadGarden() {
  try {
    const raw = await storageGet(GARDEN_KEY);
    if (!raw) return { ...DEFAULT_GARDEN };
    const d = JSON.parse(raw);
    if (!d || typeof d !== "object" || Array.isArray(d)) return { ...DEFAULT_GARDEN };
    const cycle = d.cycle && typeof d.cycle === "object" && d.cycle.fruit && d.cycle.startedAt ? d.cycle : null;
    const harvests = Array.isArray(d.harvests) ? d.harvests.filter((h) => h && h.fruit && h.date) : [];
    return { cycle, harvests };
  } catch (e) { return { ...DEFAULT_GARDEN }; }
}
async function persistGarden(g) {
  return await storageSet(GARDEN_KEY, JSON.stringify(g));
}

/* 記録の種類ごとの説明文（＋を押したときに出る案内） */
const TYPEDESC_KEY = "bible-tracker-typedesc";
const DEFAULT_TYPE_NAME = { ...{ reading: "通読", message: "学び", memorization: "聖句", memo: "その他" } };
/* 画面のどこからでも、設定した種類名を引けるようにする */
const TypeNameContext = React.createContext(DEFAULT_TYPE_NAME);
const useTypeName = () => React.useContext(TypeNameContext) || DEFAULT_TYPE_NAME;
const DEFAULT_TYPE_DESC = {
  reading: "読んだ箇所と、感じたこと",
  message: "礼拝や集会で聞いた話",
  memorization: "心にとめておきたいことば",
  memo: "テーマごとの覚え書き",
};
async function loadTypeDesc() {
  const fallback = { desc: { ...DEFAULT_TYPE_DESC }, name: { ...DEFAULT_TYPE_NAME } };
  try {
    const raw = await storageGet(TYPEDESC_KEY);
    if (!raw) return fallback;
    const d = JSON.parse(raw);
    if (!d || typeof d !== "object" || Array.isArray(d)) return fallback;
    /* 説明文だけを保存していた古い形にも対応する */
    if (d.desc || d.name) {
      return { desc: { ...DEFAULT_TYPE_DESC, ...(d.desc || {}) }, name: { ...DEFAULT_TYPE_NAME, ...(d.name || {}) } };
    }
    return { desc: { ...DEFAULT_TYPE_DESC, ...d }, name: { ...DEFAULT_TYPE_NAME } };
  } catch (e) { return fallback; }
}
async function persistTypeDesc(d) { try { return await storageSet(TYPEDESC_KEY, JSON.stringify(d)); } catch (e) { return null; } }

const PREF_KEY = "bible-tracker-prefs";
/* motion＝画面の動きの演出。true で有効。
   古い保存内容には motion が入っていないが、loadPrefs で既定値と混ぜるため
   これまで使っていた人も自動的に「あり」で始まる */
/* fontSize＝文字の大きさ。"s"（これまでと同じ）／"m"／"l"。
   古い保存内容には入っていないが、loadPrefs で既定値と混ぜるため
   これまで使っていた人はこれまでどおりの大きさで始まる */
const DEFAULT_PREFS = { theme: "teal", showMascots: true, lastBackup: null, motion: true, fontSize: "s", sortMode: "book" };
/* 並び順の選択肢。**探す・ブックマークなど、並べ替えを出す所すべてで同じものを使うこと** */
const SORT_MODES = [
  { key: "book", label: "目次順" },
  { key: "dateDesc", label: "新しい順" },
  { key: "dateAsc", label: "古い順" },
];
const FONT_SIZES = [
  { key: "s", label: "小" },
  { key: "m", label: "中" },
  { key: "l", label: "大" },
];
const BACKUP_REMIND_DAYS = 14; // これだけ日が空いたら、そっとお知らせする
/* 前回の書き出し以降に作られた・書き直された記録の数 */
/* **端末に「消さないでほしい」と頼んでおくこと。**
   iPhone は、ホーム画面に追加していないと、しばらく使わないだけで
   記録を消すことがある。頼んでおけば、その見込みが下がる。
   断られても困らないので、返事は待たずに投げっぱなしでよい */
async function askPersist() {
  try {
    if (navigator.storage && navigator.storage.persist && navigator.storage.persisted) {
      if (await navigator.storage.persisted()) return true;
      return await navigator.storage.persist();
    }
  } catch (e) { /* 分からない端末もある */ }
  return false;
}

/* 画面のてっぺんへ戻す。「動きの演出」を切っているとき（端末の「視差効果を減らす」も）は、すべらせない。
   すべらせるのは280〜560ms（距離しだい）。指が触れたら止める。
   画面ごとに window.scrollTo を書かず、ここを通すこと */
let smoothTopRaf = 0;
function scrollPageTop() {
  try {
    const y0 = window.scrollY;
    cancelAnimationFrame(smoothTopRaf);
    const still = document.documentElement.classList.contains("ft-still")
      || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    if (still || y0 < 2) { window.scrollTo(0, 0); return; }
    const dur = Math.min(560, Math.max(280, y0 * 0.25));
    const t0 = performance.now();
    const stop = () => { cancelAnimationFrame(smoothTopRaf); window.removeEventListener("touchstart", stop); window.removeEventListener("wheel", stop); };
    window.addEventListener("touchstart", stop, { passive: true });
    window.addEventListener("wheel", stop, { passive: true });
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      window.scrollTo(0, y0 * (1 - e));
      if (k < 1) smoothTopRaf = requestAnimationFrame(step);
      else stop();
    };
    smoothTopRaf = requestAnimationFrame(step);
  } catch (e) { /* noop */ }
}

const fmtBytes = (n) => (n > 900000 ? `${(n / 1048576).toFixed(1)}MB` : `${Math.max(1, Math.round(n / 1024))}KB`);
/* 「2026年3月8日」の形。日付だけの文字列でも、時刻つきでも受ける */
function fmtJpDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

/* 前回の書き出しのあとに書きかえた数。記録に加えて、フォルダの作成・変更・削除も数える（2.8.0〜）。
   **保存する中身を増やしたら、ここにも数えること。** 数えないと、書き出しを促す丸に出ない */
function unsavedCount(records, prefs, folders) {
  const last = prefs && prefs.lastBackup ? prefs.lastBackup : null;
  const fl = folders || [];
  if (!last) return records.length + fl.length;
  return records.filter((r) => (r.updatedAt || r.createdAt || "") > last).length
    + fl.filter((f) => (f.updatedAt || f.createdAt || "") > last).length
    + ((prefs && prefs.folderDeletes) || []).filter((t) => t > last).length;
}
async function loadPrefs() {
  try {
    const raw = await storageGet(PREF_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : { ...DEFAULT_PREFS };
  } catch (e) { return { ...DEFAULT_PREFS }; }
}
async function persistPrefs(prefs) {
  return await storageSet(PREF_KEY, JSON.stringify(prefs));
}

/* 記録画面の下に添えるひとこと。記録の種類ごとに好きな言葉へ変えられる */
/* ============================================================
   タグマスタ（登録済みのタグ一覧）
   記録に付いているタグから毎回集めるだけだと、
   その記録を消したとたんタグも消えてしまい、次から選べなくなる。
   別に一覧として持っておくことで、言い回しのゆれや重複を防ぐ
   ============================================================ */
const TAG_KEY = "bible-tracker-tags";
async function loadTagMaster() {
  try {
    const raw = await storageGet(TAG_KEY);
    return raw ? normalizeTags(JSON.parse(raw)) : [];
  } catch (e) { return []; }
}
async function persistTagMaster(list) {
  return await storageSet(TAG_KEY, JSON.stringify(normalizeTags(list)));
}

/* ============================================================
   フォルダ（姉妹アプリ My手帳 から移植。2.8.0〜）
   ・自動で集める … 種類・タグ・書・期間の条件に当てはまる記録を集める
   ・手動で入れる … 選んだ記録を入れる（picked）
   どちらか片方だけでも、両方でもよい。
   **フォルダを2種類に分けて持たないこと。** ひとつのフォルダで両方できる。
   **フォルダは「集めて見せるだけの入れもの」。** フォルダを消しても、記録は消さないこと
   ============================================================ */
const FOLDER_KEY = "bible-tracker-folders";
function emptyFolder(name) {
  /* picked ＝ 手動で入れた記録。**「手動で外した」を持たないこと。**
     条件で入ったものを1件だけ外せると、なぜ入らないのかが後から分からなくなる。
     外すのは手動で入れたぶんだけ。条件のぶんは条件を変えて外す */
  return { id: uid(), name: name || "", icon: "", tags: [], types: [], book: "", from: "", to: "",
    picked: [], pinned: false, createdAt: new Date().toISOString(), updatedAt: null };
}
function migrateFolder(f) {
  if (!f || typeof f !== "object") return null;
  return {
    ...emptyFolder(f.name), ...f,
    name: typeof f.name === "string" ? f.name : "",
    icon: typeof f.icon === "string" ? f.icon : "",
    tags: normalizeTags(f.tags),
    types: Array.isArray(f.types) ? [...new Set(f.types.filter((t) => SEARCH_TYPES.includes(t)))] : [],
    book: typeof f.book === "string" && bookByName(f.book) ? f.book : "",
    from: typeof f.from === "string" ? f.from : "",
    to: typeof f.to === "string" ? f.to : "",
    picked: Array.isArray(f.picked) ? f.picked.filter((x) => typeof x === "string") : [],
    pinned: !!f.pinned,
    id: typeof f.id === "string" && f.id ? f.id : uid(),
    updatedAt: typeof f.updatedAt === "string" && f.updatedAt ? f.updatedAt : null,
  };
}
async function loadFolders() {
  try {
    const raw = await storageGet(FOLDER_KEY);
    const d = raw ? JSON.parse(raw) : [];
    return Array.isArray(d) ? d.map(migrateFolder).filter(Boolean) : [];
  } catch (e) { return []; }
}
async function persistFolders(list) {
  const res = await storageSet(FOLDER_KEY, JSON.stringify(list || []));
  /* フォルダの絵も、ヘッダーの絵と同じく控えを作る（置き場から消えても戻せるように） */
  syncFolderDeco(list);
  return res;
}
/* 集める条件が入っているか */
function folderHasCond(f) {
  return !!(f && (normalizeTags(f.tags).length || (f.types || []).length || f.book || f.from || f.to));
}
/* 「9/15」のような短い日付 */
const shortDate = (d) => (d ? `${Number(d.slice(5, 7))}/${Number(d.slice(8, 10))}` : "");
const shortYmd = (d) => (d ? `${d.slice(0, 4)}/${Number(d.slice(5, 7))}/${Number(d.slice(8, 10))}` : "");
/* 条件を、そのまま読める短い文にする。画面に出して「効いている」と伝えるため */
function folderCondText(f, N) {
  if (!f) return "";
  const out = [];
  const types = f.types || [];
  if (types.length) out.push(types.map((t) => (N && N[t]) || TYPE_LABELS[t]).join("・"));
  const tags = normalizeTags(f.tags);
  if (tags.length) out.push(tags.map((t) => "#" + t).join(" "));
  if (f.book) out.push(f.book);
  if (f.from || f.to) out.push(`${f.from ? shortYmd(f.from) : "はじめ"}〜${f.to ? shortYmd(f.to) : "いま"}`);
  return out.join("・");
}
/* フォルダに入る記録。条件で集めたものと、手動で入れたものを合わせる。
   **タグが空だと何も集めない、という作りにしないこと。** 「学びだけ集める」「ヨハネだけ集める」ができなくなる */
function folderRecords(folder, records) {
  if (!folder) return [];
  const tags = normalizeTags(folder.tags).map((t) => t.toLowerCase());
  const types = folder.types || [];
  const picked = new Set(folder.picked || []);
  const hasCond = tags.length > 0 || types.length > 0 || !!folder.book;
  return (records || []).filter((r) => {
    /* 期間は、手動で入れた記録にも効かせる */
    if (folder.from && (r.date || "") < folder.from) return false;
    if (folder.to && (r.date || "") > folder.to) return false;
    if (picked.has(r.id)) return true;
    if (!hasCond && !(folder.from || folder.to)) return false;
    if (!hasCond) return true; // 期間だけのフォルダ
    if (types.length && !types.includes(r.type)) return false;
    if (tags.length && !normalizeTags(r.tags).some((t) => tags.includes(t.toLowerCase()))) return false;
    if (folder.book && !recordRefs(r).some((x) => x.book === folder.book)) return false;
    return true;
  });
}
/* 名前順・更新順・件数順。**固定したものは、どの並びでもいちばん上。**
   名前順は「01.」「02.」のような数も数として比べる */
const FOLDER_SORT_OPTIONS = [
  { key: "name", label: "名前順" },
  { key: "updated", label: "更新順" },
  { key: "count", label: "件数順" },
];
function sortFolders(list, sort, counts) {
  const byName = (a, b) => String(a.name || "").localeCompare(String(b.name || ""), "ja", { numeric: true });
  return [...list].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    if (sort === "updated") return (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || "") || byName(a, b);
    if (sort === "count") return ((counts && counts.get(b.id)) || 0) - ((counts && counts.get(a.id)) || 0) || byName(a, b);
    return byName(a, b);
  });
}
/* 記録の並び。探す・ブックマークと同じ3つ（目次順・新しい順・古い順） */
function sortRecordsBy(list, mode) {
  const arr = [...list];
  if (mode === "dateDesc") arr.sort((a, b) => (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || ""));
  else if (mode === "dateAsc") arr.sort((a, b) => (a.date || a.createdAt || "").localeCompare(b.date || b.createdAt || ""));
  else arr.sort(compareForSearch);
  return arr;
}
/* 探す・フォルダの「手動で入れる」で共通の絞り込み。**別々に書かないこと。** 片方だけ直すと結果が食い違う */
function filterRecordsBy(records, c) {
  const words = String(c.q || "").trim().toLowerCase().split(/[\s　]+/).filter(Boolean);
  const wanted = (c.tags || []).map((t) => t.toLowerCase());
  return (records || []).filter((r) => {
    if (words.length) {
      const hay = (recordAllText(r) + " " + recordTitle(r)).toLowerCase();
      if (!words.every((w) => hay.includes(w))) return false;
    }
    if ((c.types || []).length && !c.types.includes(r.type)) return false;
    if (wanted.length) {
      const has = (r.tags || []).map((t) => t.toLowerCase());
      if (!wanted.every((t) => has.includes(t))) return false;
    }
    if (c.from || c.to) {
      if (!r.date) return false;
      if (c.from && r.date < c.from) return false;
      if (c.to && r.date > c.to) return false;
    }
    if (c.book && !recordRefs(r).some((ref) => ref.book === c.book)) return false;
    return true;
  });
}
/* いまの条件を、ひと目で読める短い文にする（たたんだ帯に出す） */
function criteriaSummary(c, N) {
  if (!c) return "";
  const out = [];
  if (String(c.q || "").trim()) out.push(`「${c.q.trim()}」`);
  if ((c.types || []).length) out.push(c.types.map((t) => (N && N[t]) || TYPE_LABELS[t]).join("・"));
  if ((c.tags || []).length) out.push(c.tags.map((t) => "#" + t).join(" "));
  if (c.book) out.push(c.book);
  if (c.mine) out.push("手動");
  if (c.from || c.to) out.push(`${c.from ? shortYmd(c.from) : "はじめ"}〜${c.to ? shortYmd(c.to) : "いま"}`);
  return out.join("・");
}

const CAPTION_KEY = "bible-tracker-captions";
/* 記録画面の下に添えるひとこと。
   改行をそのまま活かして、絵の下に中央そろえで出す。
   変えたいときはカスタマイズ画面から */
const DEFAULT_CAPTIONS = {
  reading: "私はあなたのみことばを心に蓄えます。\nあなたの前に罪ある者とならないために。\n詩篇 119:11",
  message: "みことばを行う人になりなさい。自分を欺いて、ただ聞くだけの者となってはいけません。\nヤコブの手紙 1:22",
  memorization: "キリストのことばが、あなたがたのうちに豊かに住むようにしなさい。知恵を尽くして互いに教え、忠告し合い、詩と賛美と霊の歌により、感謝をもって心から神に向かって歌いなさい。\nコロサイ人への手紙 3:16",
  memo: "主を恐れることは知恵の初め、\n聖なる方を知ることは悟ることである。\n箴言 9:10",
  empty: "",
};
async function loadCaptions() {
  try {
    const raw = await storageGet(CAPTION_KEY);
    return raw ? { ...DEFAULT_CAPTIONS, ...JSON.parse(raw) } : { ...DEFAULT_CAPTIONS };
  } catch (e) { return { ...DEFAULT_CAPTIONS }; }
}
async function persistCaptions(map) {
  return await storageSet(CAPTION_KEY, JSON.stringify(map));
}

/* 端末の容量を圧迫しないよう、しっかり縮めてから保存する。
   線画などの透過を活かしたいので、軽ければPNG、重ければWebP→JPEGの順に切り替える */
/* 写真の大きさと画質（2.9.0〜。姉妹アプリ My手帳 2.20.4 と同じ値）。
   バックアップの9割近くが写真だったため、軽くした。
   - 記録の写真：長辺720px・画質0.6（PHOTO_SIDE / PHOTO_Q）。2.8.7 までは 900px・WebP 0.72／JPEG 0.78。
     iPhone の Safari は canvas から WebP を書き出せず JPEG になるので、
     **WebP と JPEG で同じ画質を使うこと。** JPEG のほうだけ高くすると、iPhone の写真だけ重くなる（実際そうなっていた）。
   - ヘッダーとフォルダの絵：大きさはそのまま、画質だけ0.65（DECO_Q）。
     ⚠️ フォルダの絵を480pxより小さくしないこと。
   - 切り抜きの下絵（CropSheet の shrinkPhoto(file, 1600, 0.92)）は画質を落とさない。
     ここを落とすと、切り抜いた絵が二重に荒れる */
const PHOTO_SIDE = 720;
const PHOTO_Q = 0.6;
const DECO_Q = 0.65;
/* 記録に付ける写真の縮小。
   **イラスト用の shrinkImage（長辺220px）を使い回さないこと。** 写真が粗くなって見るに堪えない。
   長辺720px・画質0.6で、1枚およそ40〜120KBに収める。
   置き場は IndexedDB なので、この大きさでも記録の保存を圧迫しない */
function shrinkPhoto(file, maxSide = PHOTO_SIDE, quality = PHOTO_Q) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("画像を読み込めませんでした"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("画像を解析できませんでした"));
      img.onload = () => {
        try {
          const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d");
          /* 透過のある絵を敷いたとき、黒くならないように下地を白で塗っておく */
          ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, w, h);
          ctx.drawImage(img, 0, 0, w, h);
          const webp = canvas.toDataURL("image/webp", quality);
          if (webp.startsWith("data:image/webp")) return resolve(webp);
          resolve(canvas.toDataURL("image/jpeg", quality));
        } catch (e) { reject(new Error("画像を変換できませんでした")); }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function shrinkImage(file, maxSide = 220) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("画像を読み込めませんでした"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("画像を解析できませんでした"));
      img.onload = () => {
        try {
          const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, w, h);

          const png = canvas.toDataURL("image/png");
          if (png.length <= 90000) return resolve(png); // 透過を保てる軽さならPNGのまま

          const webp = canvas.toDataURL("image/webp", 0.85);
          if (webp.startsWith("data:image/webp") && webp.length <= 120000) return resolve(webp);

          const c2 = document.createElement("canvas");
          c2.width = w; c2.height = h;
          const x2 = c2.getContext("2d");
          x2.fillStyle = "#FFFFFF"; x2.fillRect(0, 0, w, h);
          x2.drawImage(img, 0, 0, w, h);
          resolve(c2.toDataURL("image/jpeg", 0.8));
        } catch (e) {
          reject(new Error("画像を変換できませんでした"));
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
/* 切り抜いて、決まった形の絵にする（My手帳 2.11.21 と同じ仕組み）。
   **元の絵をそのまま入れないこと。** ヘッダーの帯は横長なので、
   どこを写すかを自分で決めてもらう（CropSheet から呼ぶ）。
   source は data URL（文字）でも File でもよい */
function cropImage(source, { aspect = 1, scale = 1, dx = 0, dy = 0, maxSide = 640, quality = DECO_Q } = {}) {
  return new Promise((resolve, reject) => {
    const start = (dataUrl) => {
      const img = new Image();
      img.onerror = () => reject(new Error("画像として読めませんでした"));
      img.onload = () => {
        const outW = maxSide;
        const outH = Math.max(1, Math.round(maxSide / aspect));
        const cv = document.createElement("canvas");
        cv.width = outW; cv.height = outH;
        const ctx = cv.getContext("2d");
        ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, outW, outH);
        /* 窓いっぱいに広がる大きさを基準に、つまんだぶんを足す */
        const base = Math.max(outW / img.width, outH / img.height);
        const k = base * scale;
        const w = img.width * k;
        const h = img.height * k;
        /* dx/dy は、出す絵のうえでのずれ（px）。**k を掛けないこと** */
        ctx.drawImage(img, (outW - w) / 2 + dx, (outH - h) / 2 + dy, w, h);
        let out = "";
        try { out = cv.toDataURL("image/webp", quality); } catch (e) { out = ""; }
        if (!out || out.length < 40 || out.indexOf("image/webp") < 0) out = cv.toDataURL("image/jpeg", quality);
        resolve(out);
      };
      img.src = dataUrl;
    };
    if (typeof source === "string") { start(source); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("読み込めませんでした"));
    reader.onload = () => start(reader.result);
    reader.readAsDataURL(source);
  });
}

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
/* 端末の地域の日付を返す。
   以前は世界標準時で計算していたため、日本では朝9時より前だと「前日」になっていた */
const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const curYear = () => new Date().getFullYear();
const curMonth = () => new Date().getMonth() + 1;

/* 旧い書の名前 → 新しい書の名前。別名表からその場で作る */
const BOOK_RENAME = (() => {
  const map = {};
  BOOKS.forEach((b) => (b.aliases || []).forEach((a) => { if (!map[a]) map[a] = b.name; }));
  BOOKS.forEach((b) => { delete map[b.name]; });
  return map;
})();
const canonicalBook = (name) => (name && BOOK_RENAME[name]) || name;

function migrateRecord(r) {
  if (!r || typeof r !== "object") return null;
  /* 写真（2.2.0 から）。古い記録には無いので、空の並びにしておく。
     中身がおかしいもの（配列でない・文字でない）は落とす */
  if (!Array.isArray(r.images)) r = { ...r, images: [] };
  else if (r.images.some((x) => typeof x !== "string")) r = { ...r, images: r.images.filter((x) => typeof x === "string") };
  if (r.book && BOOK_RENAME[r.book]) r = { ...r, book: BOOK_RENAME[r.book] };
  if (["reading", "message", "memo"].includes(r.type) && !r.questionItems) {
    const items = [];
    if ((r.questions || "").trim() || (r.resolved || "").trim()) items.push({ id: uid(), text: [r.questions, r.resolved].filter((x) => (x || "").trim()).join("\n\n"), resolved: !!r.questionResolved });
    r = { ...r, questionItems: items };
  }
  /* 記録の種類「疑問」と「疑問メモ」は廃止した。タグで足りるようになったため。
     ただし書かれた内容は捨てない。「疑問」の記録は「その他」に移し、
     疑問メモは元の記録のメモ欄の末尾へ移したうえで、タグ「疑問」を付けておく。
     こうしておけば、これまでどおり探し出せる */
  if (r.type === "question") {
    const body = (r.text || "").trim();
    const tags = [...(r.tags || []), "疑問"];
    if (r.resolved) tags.push("解決済み");
    r = { ...r, type: "memo", notes: [body, (r.notes || "").trim()].filter(Boolean).join("\n\n"), tags };
    delete r.text; delete r.resolved;
  }
  if (Array.isArray(r.questionItems)) {
    const items = r.questionItems.filter((q) => q && (q.text || "").trim());
    r = { ...r };
    if (items.length) {
      const lines = items.map((q) => `疑問${q.resolved ? "（解決済み）" : ""}: ${q.text.trim()}`);
      const base = (r.notes || "").trim();
      r.notes = (base ? base + "\n\n" : "") + lines.join("\n\n");
      r.tags = [...(r.tags || []), "疑問"];
      if (items.every((q) => q.resolved)) r.tags.push("解決済み");
    }
    delete r.questionItems;
  }
  if (["memo", "message"].includes(r.type)) {
    if (!r.links) r = { ...r, links: r.youtubeUrl ? [{ id: uid(), url: r.youtubeUrl, label: "" }] : [] };
    else if (r.links.some((l) => l.label === undefined)) r = { ...r, links: r.links.map((l) => ({ label: "", ...l })) };
  }
  /* 「参考資料」は廃止した。URLはメモ欄に直接貼る作りに変えたので、
     これまでに登録された分をメモ欄の末尾へ移してから、項目そのものを外す。
     消さずに移すこと。ここで捨てると、利用者の記録が黙って失われる */
  if (Array.isArray(r.links)) {
    const lines = r.links.filter((l) => l && (l.url || "").trim())
      .map((l) => ((l.label || "").trim() ? `${l.label.trim()} ${l.url.trim()}` : l.url.trim()));
    r = { ...r };
    if (lines.length) {
      const base = (r.notes || "").trim();
      r.notes = (base ? base + "\n\n" : "") + lines.join("\n");
    }
    delete r.links;
    delete r.youtubeUrl;
  }
  /* 「その他」から「テーマ」と「書」を廃止した。
     テーマは短ければタグへ、長ければメモ欄の先頭へ。書はタグへ移す */
  if (r.type === "memo" && (r.theme !== undefined || r.book !== undefined)) {
    const theme = (r.theme || "").trim();
    const book = (r.book || "").trim();
    const add = [];
    if (book) add.push(book);
    r = { ...r };
    if (theme && theme.length <= 24 && !theme.includes("\n")) add.push(theme);
    else if (theme) {
      const base = (r.notes || "").trim();
      r.notes = theme + (base ? "\n\n" + base : "");
    }
    if (add.length) r.tags = [...(r.tags || []), ...add];
    delete r.theme;
    delete r.book;
  }
  if (!Array.isArray(r.tags)) r = { ...r, tags: [] };
  else r = { ...r, tags: normalizeTags(r.tags) };
  if (r.type === "reading" && r.notes === undefined) {
    r = { ...r, notes: (r.impressiveVerses || []).map((v) => v.text).filter(Boolean).join("\n\n") };
  }
  if (r.type === "message" && r.notes === undefined) {
    r = { ...r, notes: (r.appearedVerses || []).map((v) => v.text).filter(Boolean).join("\n\n") };
  }
  if (r.type === "memorization" && !r.date) {
    r = { ...r, date: r.createdAt ? r.createdAt.slice(0, 10) : todayStr() };
  }
  return r;
}

/* ============================================================
   共通UIパーツ
   ============================================================ */
/* 入力のひと区切り。
   **記録を書く画面では、項目名を出さないこと。**
   何を書く欄かは、欄の中の薄い字（placeholder）で分かるようにしてある。
   名前と説明を並べると、書きたいことより先に字を読むことになって手が止まる。
   label は日付やタグのように、薄い字では言い表せないところだけで使う */
function Field({ label, children, hint, help }) {
  return (
    /* 欄と欄の間は16px。ここを広げると、1画面に入る欄が減って書きにくくなる */
    <div className="block mb-4">
      {label && (
      <span className="flex items-center gap-1 text-[13.5px] font-bold text-neutral-700 mb-1.5 tracking-wide">
        {label}
        {help && <HelpTip text={help} label={typeof label === "string" ? label : undefined} />}
      </span>
      )}
      {children}
      {hint && <span className="block text-[12.5px] text-neutral-500 mt-1.5">{hint}</span>}
    </div>
  );
}

/* ============================================================
   「？」を押しているあいだだけ出る説明
   画面に説明文を出しっぱなしにすると、慣れた人には邪魔になる。
   吹き出しは画面いっぱいに対して位置を決めている（position: fixed）。
   入力欄は縦に流れる箱の中にあるため、その中に置くと端が切れてしまうため
   ============================================================ */
/* 大きさと丸みは指定（style）で直接与えている。
   縦横を同じ数にしておけば、まわりの並び方に関係なく必ず真円になる */
function HelpTip({ text, label }) {
  const btnRef = useRef(null);
  const [box, setBox] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const timers = useRef([]);
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => clearTimers(), []);

  /* 消すときは、すぐ取り去らずに一度うすくしてから。ぱっと消えると目が驚く */
  const close = useCallback(() => {
    clearTimers();
    setLeaving(true);
    timers.current.push(setTimeout(() => { setBox(null); setLeaving(false); }, 200));
  }, []);

  const open = () => {
    const el = btnRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const W = 240;
    const vw = window.innerWidth || 360;
    /* 画面の端からはみ出さないように寄せる */
    let left = r.left + r.width / 2 - W / 2;
    left = Math.max(12, Math.min(left, vw - W - 12));
    clearTimers();
    setLeaving(false);
    setBox({ left, top: r.bottom + 8, width: W, arrow: r.left + r.width / 2 - left });
    /* 時間では消さない。読み終わる速さは人それぞれなので、
       消すのは「周りを触ったとき」と「もう一度「？」を押したとき」だけにする */
  };

  useEffect(() => {
    if (!box || leaving) return;
    /* 説明が出ているあいだに別の場所を触ったら、待たずに消す。
       押した本人（「？」自身）は下のトグルで扱うので、ここでは除く */
    const onDown = (e) => { if (btnRef.current && btnRef.current.contains(e.target)) return; close(); };
    /* 開いたそのひと押しで閉じてしまわないよう、ひと呼吸おいてから聞き始める */
    const id = setTimeout(() => {
      document.addEventListener("pointerdown", onDown, true);
      window.addEventListener("scroll", close, true);
      window.addEventListener("resize", close);
    }, 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener("pointerdown", onDown, true);
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [box, leaving, close]);

  const shown = !!box && !leaving;
  return (
    <>
      <button ref={btnRef} type="button" aria-label={label ? `${label}の説明` : "説明を見る"} aria-expanded={shown}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); shown ? close() : open(); }}
        onContextMenu={(e) => e.preventDefault()}
        className={"shrink-0 border flex items-center justify-center font-bold leading-none ft-tap ft-tap-icon "
          + (shown ? "border-th-800 bg-th-800 text-white" : "border-neutral-300 bg-white text-neutral-400")}
        style={{ width: 18, height: 18, borderRadius: 9999, fontSize: 11 }}>?</button>
      {box && (
        /* 重なり順は指定（style）で直接与える。クラス任せにすると、
           まわりの箱より下に潜り込むことがある（実際、聖句の入力欄で隠れていた） */
        <span className={"fixed pointer-events-none " + (leaving ? "ft-tip-out" : "ft-tip")}
          style={{ left: box.left, top: box.top, width: box.width, zIndex: 2147483000 }}>
          <span className="absolute -top-1.5 w-3 h-3 rotate-45 bg-neutral-900 rounded-[2px]"
            style={{ left: Math.max(8, Math.min(box.arrow - 6, box.width - 20)) }} />
          <span className="relative block rounded-xl bg-neutral-900 text-white text-[12.5px] leading-relaxed px-3 py-2.5 shadow-xl">{text}</span>
        </span>
      )}
    </>
  );
}

/* ============================================================
   記録を1件だけ、ファイルにして受け渡す
   Footprintsを使う人どうしで記録を分け合うため。
   バックアップ（全件）とは別物なので、目印（app）も分けてある
   ============================================================ */
const ONE_RECORD_APP = "footprints-record";

function oneRecordJson(record) {
  /* 受け渡しに要らないものは落とす。
     id は取り込む側で新しく振り直すので入れない（重なりを避けるため）。
     ピン留めやブックマークも、その人の目印なので持ち出さない */
  const r = { ...record };
  delete r.id; delete r.pinned; delete r.bookmarked;
  return JSON.stringify({
    app: ONE_RECORD_APP, version: 1, exportedAt: new Date().toISOString(),
    record: r,
  }, null, 2);
}

/* 受け取ったファイルから記録を取り出す。
   1件だけのファイルと、バックアップ（全件）のどちらでも受け取れるようにしておく。
   人から送られたものがどちらの形かは、送った人しか分からないため */
function recordsFromFile(text) {
  let data;
  try { data = JSON.parse(text); } catch (e) { throw new Error("形式が読み取れません"); }
  const out = [];
  if (data && data.record && typeof data.record === "object") out.push(data.record);
  else if (Array.isArray(data.records)) out.push(...data.records);
  else if (Array.isArray(data)) out.push(...data);
  else throw new Error("Footprintsの記録が見つかりません");
  const cleaned = out.filter((r) => r && typeof r === "object" && r.type);
  if (!cleaned.length) throw new Error("Footprintsの記録が見つかりません");
  return cleaned;
}

/* ============================================================
   文字を貼りつけて取り込む小窓
   ファイルを選ぶ道すじだけだと、
   保存先が分かりにくい端末（Androidなど）で行き詰まる。
   メモ帳などに控えた文字から、そのまま戻せるようにしておく
   ============================================================ */
function PasteDialog({ title, hint, actionLabel, onCancel, onSubmit }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);
  useEffect(() => { const t = setTimeout(() => ref.current && ref.current.focus(), 260); return () => clearTimeout(t); }, []);

  /* 端末が許すなら、貼り付け先から直に読み取る。
     許さない端末でも、下の欄に手で貼れば同じことができる */
  const pasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const t = await navigator.clipboard.readText();
        if (t) { setText(t); return; }
      }
    } catch (e) { /* 読めない端末では、手で貼ってもらう */ }
    ref.current && ref.current.focus();
  };

  const go = async () => {
    if (!text.trim() || busy) return;
    setBusy(true);
    await onSubmit(text);
    setBusy(false);
  };

  return (
    /* ft-sheet-wrap ＝ 入力欄のある小窓は、紙と同じ扱いにする。キーボードが出たとき、installKeyboardInset が
       この外わくの直下の箱ごと持ち上げる（fixed inset-0 のままだと持ち上げの対象にならない） */
    <div data-ft-overlay="" className="ft-sheet-wrap bg-black/50 flex items-center justify-center px-5"
      style={{ zIndex: 2147483400 }} onClick={onCancel}>
      <BackgroundLock />
      <div className="bg-white rounded-2xl p-5 max-w-md w-full border border-neutral-200 shadow-xl anim-pop"
        onClick={(e) => e.stopPropagation()}>
        <h3 className="font-display text-[17px] text-neutral-900 mb-1.5">{title}</h3>
        <p className="text-[13.5px] text-neutral-600 mb-3 leading-relaxed">{hint}</p>
        <textarea ref={ref} value={text} onChange={(e) => setText(e.target.value)}
          placeholder="ここに貼りつけてください"
          className="w-full h-40 rounded-xl border border-neutral-300 p-3.5 ft-input leading-relaxed text-neutral-900 placeholder-neutral-400 resize-none focus:outline-none focus:ring-4 focus:ring-th-800/20 focus:border-th-800" />
        <button type="button" onClick={pasteFromClipboard}
          className={BTN_SECONDARY + " w-full " + BTN_H + " text-[14.5px] mt-2"}>
          <Download size={16} /> 貼り付け先から読み取る
        </button>
        <div className="flex gap-2.5 mt-4">
          <button type="button" onClick={onCancel} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</button>
          <button type="button" onClick={go} disabled={!text.trim() || busy}
            className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>{busy ? "読み込み中…" : actionLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   記録をちょっと見る小窓
   「この箇所を含む記録」から呼ぶ。画面を移らずに中身を確かめられる。
   画面ごと移ってしまうと、読んでいた記録に戻るのが面倒なため
   ============================================================ */
function RecordPeekDialog({ record, onOpen, onClose }) {
  const [closing, close] = useClosing(onClose);
  if (!record) return null;
  return (
    <div data-ft-overlay="" className={"ft-sheet-wrap flex items-end justify-center " + (closing ? "anim-fade-out" : "anim-fade")}
      style={{ zIndex: 2147482000 }} onClick={close}>
      <BackgroundLock />
      <div className="absolute inset-0 bg-black/45" />
      <div className={"relative w-full max-w-md bg-white rounded-t-2xl border-2 border-b-0 border-neutral-200 shadow-xl flex flex-col ft-sheet-box "
        + (closing ? "anim-sheet-out" : "anim-sheet")}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200 shrink-0">
          <TypeBadge type={record.type} />
          <span className="text-[12.5px] font-bold text-neutral-500">{record.date}</span>
          <button type="button" onClick={close} aria-label="閉じる"
            className="ml-auto min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 ft-tap ft-tap-icon"><X size={22} /></button>
        </div>

        <div className="ft-sheet-body overflow-y-auto px-4 py-4">
          <p className="font-display text-[16px] text-neutral-900 mb-2 tracking-wide">{recordTitle(record)}</p>
          <TagChips tags={record.tags} className="mb-4" />
          <div className="space-y-4 ft-text">
            {recordSections(record).map((sc, i) => (
              <div key={i}>
                {sc.label && (
                  <span className="block text-[12.5px] font-bold tracking-wider text-th-800/70 uppercase mb-1.5">{sc.label}</span>
                )}
                <HighlightedText text={sc.text} className="text-[14.5px] text-neutral-900 leading-relaxed whitespace-pre-line" />
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 flex gap-2.5 px-4 py-3 border-t border-neutral-200"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
          <button type="button" onClick={close} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>閉じる</button>
          <button type="button" onClick={() => onOpen(record)} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>この記録を開く</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   タグを選ぶダイアログ
   入力画面と検索画面で共通に使う。
   一覧を画面に出しっぱなしにすると、タグが増えるほど画面を圧迫するので、
   選ぶときだけ開く形にしている
   ============================================================ */
function TagPickDialog({ title, selected, known, onApply, onCancel, onCreate, note }) {
  const [picked, setPicked] = useState(normalizeTags(selected));
  const [draft, setDraft] = useState("");
  const [closing, close] = useClosing(onCancel);

  const q = draft.trim().toLowerCase();
  const list = normalizeTags(known);
  const shown = q ? list.filter((t) => t.toLowerCase().includes(q)) : list;
  /* 打ち込んだ言葉がまだ無いときだけ、新しく作れるようにする */
  const canCreate = !!onCreate && !!draft.trim()
    && !list.some((t) => t.toLowerCase() === draft.trim().toLowerCase());

  const toggle = (t) => setPicked((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  const create = () => {
    const t = normalizeTags([draft])[0];
    if (!t) return;
    onCreate(t);
    setPicked((prev) => prev.includes(t) ? prev : [...prev, t]);
    setDraft("");
  };

  return (
    <div data-ft-overlay="" className={"ft-sheet-wrap flex items-end justify-center " + (closing ? "anim-fade-out" : "anim-fade")}
      style={{ zIndex: 2147483000 }} onClick={close}>
      <BackgroundLock />
      <div className="absolute inset-0 bg-black/45" />
      <div className={"relative w-full max-w-md bg-white rounded-t-2xl border-2 border-b-0 border-neutral-200 shadow-xl flex flex-col ft-sheet-box "
        + (closing ? "anim-sheet-out" : "anim-sheet")}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 shrink-0">
          <span className="font-display text-[17px] text-neutral-900 tracking-wide">{title}</span>
          <button type="button" onClick={close} aria-label="閉じる"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 ft-tap ft-tap-icon"><X size={24} /></button>
        </div>

        <div className="px-4 pt-3 shrink-0">
          <div className="flex gap-2">
            <div className="flex-1 min-w-0">
              <TextInput value={draft} onChange={(e) => setDraft(e.target.value)}
                placeholder={onCreate ? "さがす／新しく作る" : "さがす"}
                onKeyDown={(e) => { if (e.key === "Enter" && canCreate) { e.preventDefault(); create(); } }} />
            </div>
            {/* 出たり消えたりすると目がちらつくので、いつも同じ場所に置いておき、
                打ち込んだ言葉がまだ一覧に無いときだけ押せるようにする */}
            {onCreate && (
              <button type="button" onClick={create} disabled={!canCreate}
                className={(canCreate ? BTN_PRIMARY : BTN_BASE + " bg-neutral-100 border border-neutral-200 text-neutral-400")
                  + " " + BTN_H + " px-3.5 text-[14.5px] shrink-0"}><Plus size={15} /> 作る</button>
            )}
          </div>
          {note && <p className="text-[12.5px] text-neutral-500 mt-2">{note}</p>}
        </div>

        <div className="ft-sheet-body overflow-y-auto px-4 py-3">
          {shown.length === 0 ? (
            <p className="text-[13.5px] text-neutral-500 py-6 text-center">
              {list.length === 0 ? "まだタグがありません。" : "見つかりませんでした。"}
            </p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {shown.map((t) => {
                const on = picked.includes(t);
                return (
                  <button key={t} type="button" onClick={() => toggle(t)} aria-pressed={on}
                    className={"text-[13.5px] font-bold px-3 py-1.5 rounded-full border-2 ft-tap "
                      + (on ? "border-th-800 bg-th-800 text-white" : "border-neutral-200 bg-white text-neutral-600")}>
                    {t}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="shrink-0 flex gap-2.5 px-4 py-3 border-t border-neutral-200"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
          <button type="button" onClick={close} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</button>
          <button type="button" onClick={() => onApply(normalizeTags(picked))}
            className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>
            決定{picked.length > 0 ? `（${picked.length}）` : ""}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   入力画面のタグ欄
   ふだんは付いているタグと1つのボタンだけ。選ぶときにダイアログを開く
   ============================================================ */
function TagField({ value, onChange, knownTags, onCreateTag }) {
  const tags = normalizeTags(value);
  const [open, setOpen] = useState(false);
  return (
    <div>
      {/* 押すところが先、選んだ札はその下。記録を書く画面ではいちばん下に置く */}
      <button type="button" onClick={() => setOpen(true)}
        className="min-h-[46px] px-4 rounded-full border border-neutral-200 bg-white text-[14.5px] text-neutral-500 inline-flex items-center gap-1.5 ft-tap ft-tap-card">
        タグを追加 <Plus size={15} />
      </button>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tags.map((t) => (
            <span key={t} className="ft-chip inline-flex items-center gap-1 rounded-full bg-th-50 border border-th-200 pl-3 pr-1 py-1">
              <span className="text-[13.5px] font-bold text-th-900">{t}</span>
              <TapOnceButton onTap={() => onChange(tags.filter((x) => x !== t))} aria-label={`${t} を外す`}
                className="w-6 h-6 flex items-center justify-center rounded-full text-th-800/60 hover:text-red-700 ft-tap ft-tap-icon"><X size={14} /></TapOnceButton>
            </span>
          ))}
        </div>
      )}
      {open && (
        <TagPickDialog title="タグを選ぶ" selected={tags} known={knownTags}
          onCreate={onCreateTag}
          onApply={(v) => { onChange(v); setOpen(false); }}
          onCancel={() => setOpen(false)} />
      )}
    </div>
  );
}

/* 閲覧画面などで、タグを並べて見せる */
function TagChips({ tags, className }) {
  const list = normalizeTags(tags);
  if (!list.length) return null;
  return (
    <div className={"flex flex-wrap gap-1.5 " + (className || "")}>
      {list.map((t) => (
        <span key={t} className="text-[12.5px] font-bold px-2.5 py-1 rounded-full bg-th-50 text-th-900 border border-th-200">{t}</span>
      ))}
    </div>
  );
}

/* 件数のバッジ。**必ず真円にすること。**
   以前は min-w と左右の余白で作っていたため、桁が増えると横長の楕円になっていた。
   縦横を同じ数で固定し、桁が増えたときは文字のほうを小さくして収める */
function CountBadge({ n, size = 22, className = "" }) {
  if (!n || n <= 0) return null;
  const txt = n > 99 ? "99+" : String(n);
  const fs = txt.length >= 3 ? size * 0.36 : txt.length === 2 ? size * 0.44 : size * 0.52;
  return (
    <span className={"bg-amber-500 text-white font-bold flex items-center justify-center shrink-0 tabular-nums leading-none " + className}
      style={{ width: size, height: size, borderRadius: 9999, fontSize: Math.round(fs * 10) / 10 }}>{txt}</span>
  );
}

/* 入力欄の文字は必ず16px以上にすること（ft-input が受け持つ）。
   iPhoneのSafariは、16pxより小さい入力欄に触れると画面を勝手に拡大する。
   拡大されると横にも動くようになり、書きづらくなる。
   文字の大きさの設定（小・中・大）からも、入力欄だけは外している */
/* **枠の線は1px。** 2pxにすると、欄が並んだときに線ばかりが目に入る（姉妹アプリに合わせた）
   選んだときだけ、色と輪が付いて浮かび上がる */
const inputCls = "w-full rounded-xl bg-white border border-neutral-200 px-3.5 py-3 ft-input leading-normal text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-4 focus:ring-th-800/20 focus:border-th-800 h-[48px]";

/* 共通のボタン配色。主要な操作はすべて同じ深いティールに統一している */
/* iPhoneの切り欠き（ノッチ・ダイナミックアイランド）に隠れないための上余白。
   index.html で viewport-fit=cover にしているため、自分で余白を取る必要がある */
/* アプリの版数。**index.html の window.__FT_VERSION が本物。**
   ここはアーティファクト版（index.html が無い）のための控え。
   数を上げるときは index.html を直すこと */
const APP_VERSION = (typeof window !== "undefined" && window.__FT_VERSION) || "2.6.1";

/* ============================================================
   最新バージョンに更新（2.12.0〜。姉妹アプリ「暗記ノート」「My手帳 2.27.0」と同じ役目）
   1. 公開中の index.html をGitHubから直に取り、window.__FT_VERSION を読んで比べる
   2. 同じなら「最新です」で終わり
   3. ちがえば、その版の係（sw.js?v=新しい版）を登録し、新しい部品が端末にしまわれる
      （activated）のを待ってから、読み込み直す
   ・記録（localStorage）・写真の置き場には**さわらないこと**。入れ替えるのはアプリの部品だけ
   ・**index.html を取るとき、?_=（毎回ちがう数）と cache: "no-store" の両方を付けること。**
     付けないと sw.js のしまってある部品が返り、いつまでも「最新です」になる。
     sw.js（2.12.0〜）は no-store の取りに行きを素通しにする。?_= は、それを知らない
     古い sw.js が動いている端末でも、しまってあるものに当たらないための用心
   ・アーティファクト版（index.html が無い＝window.__FT_VERSION が無い）では使えないので、メニューに出さない
   ============================================================ */
const CAN_SELF_UPDATE = typeof window !== "undefined" && !!window.__FT_VERSION;
const UPDATE_FETCH_MS = 10000; /* 版数を取りに行って、これだけ待っても来なければあきらめる */
const UPDATE_INSTALL_MS = 20000; /* 新しい部品をしまい終わるのを、これだけ待つ（過ぎたら読み込み直す） */
async function fetchLatestVersion() {
  const url = new URL("./", window.location.href);
  url.searchParams.set("_", String(Date.now()));
  const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
  const t = ctrl ? setTimeout(() => ctrl.abort(), UPDATE_FETCH_MS) : null;
  try {
    const res = await fetch(url.href, { cache: "no-store", signal: ctrl ? ctrl.signal : undefined });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const m = (await res.text()).match(/window\.__FT_VERSION\s*=\s*["']([^"']+)["']/);
    if (!m) throw new Error("version not found");
    return m[1];
  }
  finally { if (t) clearTimeout(t); }
}
/* 新しい版の係を入れ、入りきる（activated）まで待つ。
   入れられなかった・待ちきれなかったときも先へ進む。読み込み直せば、index.html は
   「まずネット」で取るので新しい版になり、そこから新しい係も入り直す */
async function installVersion(version) {
  if (!("serviceWorker" in navigator)) {
    await Promise.all([`./app.js?v=${version}`, `./app.css?v=${version}`]
      .map((u) => fetch(u, { cache: "reload" }).catch(() => {})));
    return;
  }
  try {
    /* 登録のしかた（scope）は index.html とそろえること */
    const reg = await navigator.serviceWorker.register("./sw.js?v=" + encodeURIComponent(version), { scope: "./" });
    await new Promise((resolve) => {
      const timer = setTimeout(resolve, UPDATE_INSTALL_MS);
      const done = () => { clearTimeout(timer); resolve(); };
      const settled = (sw) => sw.state === "activated" || sw.state === "redundant";
      const watch = (sw) => {
        if (!sw) return;
        if (settled(sw)) { done(); return; }
        sw.addEventListener("statechange", () => { if (settled(sw)) done(); });
      };
      const sw = reg.installing || reg.waiting;
      if (sw) { watch(sw); return; }
      if (reg.active && new URL(reg.active.scriptURL).searchParams.get("v") === version) { done(); return; }
      reg.addEventListener("updatefound", () => watch(reg.installing));
    });
  } catch (e) { /* 登録できなくても、読み込み直せば新しい版の画面になる */ }
}

const SAFE_TOP = (extra) => ({ paddingTop: `calc(env(safe-area-inset-top) + ${extra}px)` });

const BTN_H = "btn-h"; // 全ボタン共通の高さ（実際の値はグローバルCSSの .btn-h で定義）
/* 押したときの手ごたえ。少し沈み、色がわずかに暗くなる。
   離すとすっと戻る（戻りのほうを少し長くすると気持ちよく感じる） */
/* 沈み方はグローバルCSSの .ft-tap にまとめてある。
   押した手ごたえをボタンごとに書くと、少しずつ深さや速さがずれていく。
   1か所にまとめておけば、全体の手ざわりをここだけで整えられる */
const BTN_BASE = "rounded-xl font-bold flex items-center justify-center gap-1.5 disabled:opacity-40 ft-tap";
const BTN_PRIMARY = BTN_BASE + " bg-th-900 text-white hover:bg-th-800 shadow-sm";
const BTN_SECONDARY = BTN_BASE + " bg-white border border-neutral-300 text-neutral-700 hover:bg-neutral-50";
const BTN_DANGER = BTN_BASE + " bg-rose-800 text-white hover:bg-rose-900 shadow-sm";
const BTN_DANGER_SOFT = BTN_BASE + " bg-white border border-rose-200 text-rose-700 hover:bg-rose-50";
/* 目立たせたくない「キャンセル」。**枠は必ず付けること（2.6.1〜）。** 枠なしだと、暗がりの上の白い小窓の中で
   ボタンだと分からず、字だけが浮いて見えた。字の色は控えめのまま、枠と白地でボタンの形を出す */
const BTN_QUIET = BTN_BASE + " bg-white border border-neutral-300 text-neutral-500 hover:bg-neutral-50";
/* bare ＝ 枠なし。RefBox の中で使う（外枠の線と入力中の縁取りを RefBox が受け持つ）。
   枠を消すのに border-0 を足さないこと。もとの枠の指定と重なってどちらが勝つか分からなくなるので、
   はじめから付けない形にしてある */
const bareInputCls = "w-full bg-transparent px-3.5 py-3 ft-input leading-normal text-neutral-900 placeholder-neutral-400 focus:outline-none h-[48px]";
function TextInput({ bare, ...props }) { return <input {...props} className={(bare ? bareInputCls : inputCls) + " " + (props.className || "")} />; }

/* ============================================================
   ドラム式（ホイール）ピッカー
   ・スクロールのスナップを使い、実機の操作感に近い形で回して選ぶ
   ・中央の帯が現在の選択位置。離すと一番近い項目に吸い付く
   ============================================================ */
const WHEEL_ITEM_H = 40;
const WHEEL_VISIBLE = 5;

function WheelColumn({ items, value, onChange, minWidth = 72 }) {
  const boxRef = useRef(null);
  const offsetRef = useRef(0);          // px：0 = 先頭の項目が中央
  const rafRef = useRef(null);
  const draggingRef = useRef(false);
  const activeRef = useRef(false);      // ドラッグ or 慣性アニメ中
  const lastYRef = useRef(0);
  const startYRef = useRef(0);
  const pointerIdRef = useRef(null);
  const capturedRef = useRef(false);
  const movedRef = useRef(false);
  const lastTRef = useRef(0);
  const velRef = useRef(0);             // px/ms
  const [offset, setOffsetState] = useState(0);

  const itemsRef = useRef(items); itemsRef.current = items;
  const onChangeRef = useRef(onChange); onChangeRef.current = onChange;
  const valueRef = useRef(value); valueRef.current = value;

  /* ドラムが1項目ぶん進むたびに、ごく短く震わせて「カチッ」を返す。
     ・対応していない端末（iPhoneのSafariなど）では何も起こらない。害はない
     ・勢いよく回したときに震えっぱなしにならないよう、40msに1回までにしている
     ・「動きの演出」を切っているときは鳴らさない */
  const prefsForTick = React.useContext(PrefsContext);
  const lastTickRef = useRef(0);
  const tick = () => {
    if (prefsForTick && prefsForTick.motion === false) return;
    const now = performance.now();
    if (now - lastTickRef.current < 40) return;
    lastTickRef.current = now;
    try { if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(4); } catch (e) { /* 使えなくても構わない */ }
  };

  const count = items.length;
  const maxOffset = Math.max(0, (count - 1) * WHEEL_ITEM_H);
  const idxOf = (v) => { const i = items.findIndex((it) => it.value === v); return i < 0 ? 0 : i; };

  const applyOffset = (v) => { offsetRef.current = v; setOffsetState(v); };
  const clampIdx = (i) => Math.max(0, Math.min(itemsRef.current.length - 1, i));

  /* 中央に来ている項目が変わったら即座に確定する（決定ボタンとのズレを防ぐ） */
  const commitFromOffset = () => {
    const idx = clampIdx(Math.round(offsetRef.current / WHEEL_ITEM_H));
    const item = itemsRef.current[idx];
    if (item && item.value !== valueRef.current) {
      valueRef.current = item.value;
      tick();
      onChangeRef.current(item.value);
    }
  };

  const stopAnim = () => { if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } };

  /* 一番近い項目へ吸い付かせる */
  const snap = () => {
    const target = clampIdx(Math.round(offsetRef.current / WHEEL_ITEM_H)) * WHEEL_ITEM_H;
    const start = offsetRef.current;
    const delta = target - start;
    if (Math.abs(delta) < 0.5) { applyOffset(target); commitFromOffset(); activeRef.current = false; return; }
    const dur = 260;
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3); // ease-out
      applyOffset(start + delta * e);
      commitFromOffset();
      if (p < 1) { rafRef.current = requestAnimationFrame(step); }
      else { rafRef.current = null; activeRef.current = false; commitFromOffset(); }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  /* 指を離した後の慣性（勢いを保ったまま、だんだん減速して止まる） */
  const startInertia = () => {
    let v = velRef.current;
    if (Math.abs(v) < 0.05) { snap(); return; }
    const OVER = WHEEL_ITEM_H * 0.9; // 端で少しだけはみ出せる余白
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(34, now - last);
      last = now;
      v *= Math.pow(0.945, dt / 16.67);  // 指数的に減速
      let next = offsetRef.current + v * dt;
      if (next < -OVER) { next = -OVER; v = 0; }
      if (next > maxOffset + OVER) { next = maxOffset + OVER; v = 0; }
      applyOffset(next);
      commitFromOffset();
      const outOfRange = next < 0 || next > maxOffset;
      if (Math.abs(v) > 0.015 && !outOfRange) { rafRef.current = requestAnimationFrame(step); }
      else { rafRef.current = null; snap(); }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  /* 外から値が変わった時だけ位置を合わせる（操作中は触らない） */
  useEffect(() => {
    if (activeRef.current) return;
    const idx = idxOf(value);
    applyOffset(idx * WHEEL_ITEM_H);
  }, [value, count]); // eslint-disable-line

  useEffect(() => () => stopAnim(), []);

  const onPointerDown = (e) => {
    stopAnim();
    draggingRef.current = true;
    activeRef.current = true;
    movedRef.current = false;
    startYRef.current = e.clientY;
    lastYRef.current = e.clientY;
    lastTRef.current = performance.now();
    velRef.current = 0;
    pointerIdRef.current = e.pointerId;
    capturedRef.current = false;
    /* **ここで setPointerCapture しないこと。** 押した瞬間に箱が指を捕まえると、
       指を離したときの相手が「行」ではなく「箱」になり、行の click が届かない
       （Android の Chrome などで「行をタップしても選べない」ように見えていた）。
       捕まえるのは、実際に指が動いてから（下の onPointerMove） */
  };

  const onPointerMove = (e) => {
    if (!draggingRef.current) return;
    const now = performance.now();
    const dy = e.clientY - lastYRef.current;
    const dt = Math.max(1, now - lastTRef.current);
    lastYRef.current = e.clientY;
    lastTRef.current = now;
    if (Math.abs(e.clientY - startYRef.current) > 4) {
      movedRef.current = true;
      if (!capturedRef.current) {
        capturedRef.current = true;
        try { boxRef.current.setPointerCapture(pointerIdRef.current); } catch (err) { /* noop */ }
      }
    }
    const instant = -dy / dt;
    velRef.current = velRef.current * 0.7 + instant * 0.3; // なめらかに平均化
    const OVER = WHEEL_ITEM_H * 0.9;
    const cur = offsetRef.current;
    // 端をはみ出している時だけ引っぱりを弱くして、行き止まり感を出す
    const resist = cur < 0 || cur > maxOffset ? 0.35 : 1;
    let next = cur - dy * resist;
    next = Math.max(-OVER, Math.min(maxOffset + OVER, next));
    applyOffset(next);
    commitFromOffset();
    e.preventDefault();
  };

  const onPointerUp = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (performance.now() - lastTRef.current > 120) velRef.current = 0; // 止めてから離した時は流さない
    startInertia();
  };

  const onWheelEvent = (e) => {
    stopAnim();
    activeRef.current = true;
    const next = Math.max(-WHEEL_ITEM_H * 0.9, Math.min(maxOffset + WHEEL_ITEM_H * 0.9, offsetRef.current + e.deltaY));
    applyOffset(next);
    commitFromOffset();
    clearTimeout(onWheelEvent._t);
    onWheelEvent._t = setTimeout(() => { velRef.current = 0; snap(); }, 90);
  };

  const tapTo = (i) => {
    stopAnim();
    activeRef.current = true;
    velRef.current = 0;
    const start = offsetRef.current;
    const target = i * WHEEL_ITEM_H;
    const t0 = performance.now();
    const dur = 260;
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      applyOffset(start + (target - start) * e);
      commitFromOffset();
      if (p < 1) rafRef.current = requestAnimationFrame(step);
      else { rafRef.current = null; activeRef.current = false; commitFromOffset(); }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const centerPad = WHEEL_ITEM_H * ((WHEEL_VISIBLE - 1) / 2);
  const activeIdx = clampIdx(Math.round(offset / WHEEL_ITEM_H));

  /* ネイティブに（passive:false で）登録する。
     React経由だとブラウザ側にスクロールを持っていかれ、上方向の動きが効かないことがあるため */
  const handlersRef = useRef({});
  handlersRef.current = { onPointerDown, onPointerMove, onPointerUp, onWheelEvent };
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const down = (e) => handlersRef.current.onPointerDown(e);
    const move = (e) => handlersRef.current.onPointerMove(e);
    const up = (e) => handlersRef.current.onPointerUp(e);
    const wheel = (e) => { e.preventDefault(); handlersRef.current.onWheelEvent(e); };
    el.addEventListener("pointerdown", down, { passive: false });
    el.addEventListener("pointermove", move, { passive: false });
    el.addEventListener("pointerup", up, { passive: false });
    el.addEventListener("pointercancel", up, { passive: false });
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("wheel", wheel);
    };
  }, []);

  return (
    <div
      ref={boxRef}
      className="relative overflow-hidden select-none"
      style={{ height: WHEEL_ITEM_H * WHEEL_VISIBLE, minWidth, touchAction: "none", cursor: "grab" }}
    >
      <div style={{ transform: `translateY(${centerPad - offset}px)` }}>
        {items.map((it, i) => {
          const dist = Math.abs(i - offset / WHEEL_ITEM_H);
          const isActive = i === activeIdx;
          return (
            <div
              key={it.value === "" ? `__empty${i}` : String(it.value)}
              onClick={() => { if (movedRef.current) { movedRef.current = false; return; } tapTo(i); }}
              className="flex items-center justify-center"
              style={{
                height: WHEEL_ITEM_H,
                opacity: Math.max(0.22, 1 - dist * 0.3),
                transform: `scale(${Math.max(0.76, 1 - dist * 0.09)})`,
                fontWeight: isActive ? 700 : 500,
                /* 選ばれている行はテーマカラー。色の数値を直接書かないこと。
                   書き決めにすると、テーマを変えたときにここだけ緑のまま残る */
                color: isActive ? "var(--th-800)" : "#404040",
                fontSize: isActive ? "17px" : "16px",
                whiteSpace: "nowrap",
              }}
            >
              {it.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* zIndex ＝ 重なり順。ほかの小窓の上にさらに重ねるときは、大きい数を渡すこと */
function WheelSheet({ title, onClose, onConfirm, children, zIndex = 2147483000 }) {
  return (
    <div data-ft-overlay="" className="ft-sheet-wrap flex items-end justify-center" style={{ zIndex }} onClick={onClose}>
      <BackgroundLock />
      <div className="absolute inset-0 bg-black/40 anim-fade" />
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl border-t border-neutral-200 shadow-xl anim-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
          <span className="font-display text-[15.5px] text-neutral-900">{title}</span>
          <button type="button" onClick={onClose} aria-label="閉じる"
            className="min-w-[52px] min-h-[52px] flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100"><X size={28} /></button>
        </div>
        <div className="relative px-4 pt-3">
          <div
            className="pointer-events-none absolute left-4 right-4 border-y-2 border-th-700/35 bg-th-50/40 rounded-md"
            style={{ height: WHEEL_ITEM_H, top: `calc(0.75rem + ${WHEEL_ITEM_H * ((WHEEL_VISIBLE - 1) / 2)}px)` }}
          />
          <div className="relative flex justify-center gap-2">{children}</div>
        </div>
        {/* 足もとは、日付・タグの紙と同じ「キャンセル／決定」の並びにそろえる */}
        <div className="px-4 pt-3 flex gap-2.5" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 14px)" }}>
          <button type="button" onClick={onClose} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</button>
          <button type="button" onClick={onConfirm} className={BTN_PRIMARY + " flex-[1.6] " + BTN_H + " text-[14.5px]"}>決定</button>
        </div>
      </div>
    </div>
  );
}

/* 1列のドラム選択フィールド（書・章・節・年・月などで共用） */
function DrumSelect({ value, onChange, options, placeholder = "選択", title, className, disabled }) {
  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState(value ?? "");
  const items = [{ value: "", label: placeholder }, ...options];
  const current = options.find((o) => o.value === value);

  const openSheet = () => { if (disabled) return; setTemp(value ?? ""); setOpen(true); };
  const confirm = () => { onChange(temp === "" ? "" : temp); setOpen(false); };

  return (
    <>
      <button type="button" onClick={openSheet} disabled={disabled}
        className={inputCls + " flex items-center justify-between text-left disabled:opacity-50 " + (className || "")}>
        <span className={current ? "text-neutral-900 truncate" : "text-neutral-400 truncate"}>{current ? current.label : placeholder}</span>
        <ChevronDown size={18} className="text-neutral-500 shrink-0 ml-2" />
      </button>
      {open && (
        <WheelSheet title={title || placeholder} onClose={() => setOpen(false)} onConfirm={confirm}>
          <WheelColumn items={items} value={temp} onChange={setTemp} minWidth={180} />
        </WheelSheet>
      )}
    </>
  );
}

/* 日付：年・月・日の3連ドラム。onChangeは従来通り e.target.value 形式で返す */
/* ============================================================
   カレンダーの見出し（＜ 年月 今日 ＞）と、年月をまとめて選ぶ小窓。
   実績画面のカレンダーと、日付を選ぶ欄で共通に使う。
   **同じものを2か所に書かないこと。** 押しやすさや動きが片方だけ古くなる
   ============================================================ */
function MonthNavHeader({ label, onPrev, onNext, onJump, onToday }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <button type="button" onClick={onPrev} aria-label="前へ"
        className="min-w-[56px] min-h-[56px] flex items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 ft-tap ft-tap-icon shadow-sm"><ChevronLeft size={26} /></button>
      <div className="flex items-center gap-1 min-w-0">
        <button type="button" onClick={onJump} aria-label="年月を選ぶ"
          className="flex items-center gap-1 px-2 min-h-[44px] rounded-lg hover:bg-neutral-100 ft-tap">
          <span className="font-display text-[17px] text-neutral-900 whitespace-nowrap">{label}</span>
          <ChevronDown size={16} className="text-neutral-500 shrink-0" />
        </button>
        {onToday && (
          <button type="button" onClick={onToday}
            className="min-h-[36px] px-2.5 rounded-lg text-[12.5px] font-bold text-th-800 hover:bg-th-50 ft-tap">今日</button>
        )}
      </div>
      <button type="button" onClick={onNext} aria-label="次へ"
        className="min-w-[56px] min-h-[56px] flex items-center justify-center rounded-2xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100 ft-tap ft-tap-icon shadow-sm"><ChevronRight size={26} /></button>
    </div>
  );
}

/* 年と月をドラムで選ぶ小窓。
   zIndex は、重ねる相手より大きい数を渡すこと（日付を選ぶ小窓の上に出すため） */
function MonthJumpSheet({ year, month, years, onClose, onConfirm, zIndex }) {
  const [y, setY] = useState(year);
  const [m, setM] = useState(month);
  return (
    <WheelSheet title="表示する期間" onClose={onClose} onConfirm={() => onConfirm(y, m)} zIndex={zIndex}>
      <WheelColumn minWidth={96} value={y} onChange={setY} items={years.map((v) => ({ value: v, label: `${v}年` }))} />
      <WheelColumn minWidth={78} value={m} onChange={setM} items={Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}月` }))} />
    </WheelSheet>
  );
}

/* 年の候補。いまの年と、示している年のまわりを並べる */
/* 年の選び方。今年をまんなかに、前後100年ぶんを並べる。
   それより外の年の記録を持っている人のために、その年までは足しておく
   （足さないと、その記録の年月へ飛べなくなる） */
const YEARS_SPAN = 100;
function jumpYears(shownY, extra = []) {
  const now = new Date().getFullYear();
  const cands = [shownY, ...extra].filter((n) => Number.isFinite(n));
  const lo = Math.min(now - YEARS_SPAN, ...cands);
  const hi = Math.max(now + YEARS_SPAN, ...cands);
  const out = [];
  for (let y = lo; y <= hi; y++) out.push(y);
  return out;
}

/* 日付を選ぶ欄。
   ドラム式だと曜日が分からず「いつの話か」が思い浮かびにくいので、
   カレンダーから選ぶ形にしている。
   日付を登録するところは、すべてこの部品を使うこと（記録の日付・探すの期間） */
const WEEK_LABELS = ["日", "月", "火", "水", "木", "金", "土"];
const weekColor = (i) => (i === 0 ? "text-rose-600" : i === 6 ? "text-sky-700" : "text-neutral-500");

function DateInput({ className, value, onChange, row }) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const parse = (v) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
    return m ? { y: +m[1], mo: +m[2], d: +m[3] } : null;
  };
  const p = parse(value);
  /* いま開いている月と、選んでいる日 */
  const [cursor, setCursor] = useState(() => (p ? { y: p.y, mo: p.mo } : { y: today.getFullYear(), mo: today.getMonth() + 1 }));
  const [picked, setPicked] = useState(() => value || "");
  const [closing, close] = useClosing(() => setOpen(false));
  /* 年月をまとめて選ぶ小窓。日付を選ぶ小窓の上に重ねるので、重なり順を大きくする */
  const [jumpOpen, setJumpOpen] = useState(false);

  const openSheet = () => {
    const q = parse(value);
    setCursor(q ? { y: q.y, mo: q.mo } : { y: today.getFullYear(), mo: today.getMonth() + 1 });
    setPicked(value || "");
    setOpen(true);
  };
  const shiftMonth = (delta) => setCursor((c) => {
    let mo = c.mo + delta, y = c.y;
    if (mo < 1) { mo = 12; y -= 1; }
    if (mo > 12) { mo = 1; y += 1; }
    return { y, mo };
  });
  const confirm = () => { onChange && onChange({ target: { value: picked } }); setOpen(false); };

  /* その月のマス目。前後の空きは null で埋める */
  const firstDow = new Date(cursor.y, cursor.mo - 1, 1).getDay();
  const lastDay = new Date(cursor.y, cursor.mo, 0).getDate();
  const cells = [...Array(firstDow).fill(null), ...Array.from({ length: lastDay }, (_, i) => i + 1)];
  const key = (d) => `${cursor.y}-${String(cursor.mo).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const todayKey = ymd(today);

  return (
    <>
      {row ? (
        /* 記録を書く画面の日付。**1行に畳んで見せること。** ふだんは「今日」のままなので、
           項目としては場所を取らず、すぐ下から本文を書き始められる。押すとカレンダーが開く */
        <button type="button" onClick={openSheet}
          className="w-full min-h-[46px] rounded-2xl border border-neutral-200 bg-white px-4 flex items-center gap-2 text-left ft-tap ft-tap-card">
          <CalendarDays size={16} className="text-neutral-400 shrink-0" />
          <span className={"flex-1 min-w-0 truncate text-[14.5px] " + (p ? "text-neutral-700" : "text-neutral-400")}>
            {p
              ? `${value === ymd(today) ? "今日・" : ""}${p.y}年${p.mo}月${p.d}日（${"日月火水木金土"[new Date(p.y, p.mo - 1, p.d).getDay()]}）`
              : "日付を選択"}
          </span>
          <ChevronDown size={16} className="text-neutral-400 shrink-0" />
        </button>
      ) : (
      <button type="button" onClick={openSheet}
        className={"h-[48px] rounded-xl border border-neutral-300 bg-white flex items-center justify-between px-3 text-left ft-tap ft-tap-card " + (className || "w-[170px]")}>
        <span className={"text-[15.5px] truncate " + (p ? "text-neutral-900" : "text-neutral-400")}>
          {p ? `${p.y}/${p.mo}/${p.d}` : "日付を選択"}
        </span>
        <ChevronDown size={18} className="text-neutral-500 shrink-0 ml-1" />
      </button>
      )}

      {open && (
        <div data-ft-overlay="" className={"ft-sheet-wrap flex items-end justify-center " + (closing ? "anim-fade-out" : "anim-fade")}
          style={{ zIndex: 2147483000 }} onClick={close}>
      <BackgroundLock />
          <div className="absolute inset-0 bg-black/45" />
          <div className={"relative w-full max-w-md bg-white rounded-t-2xl border-2 border-b-0 border-neutral-200 shadow-xl flex flex-col ft-sheet-box "
            + (closing ? "anim-sheet-out" : "anim-sheet")}
            onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 shrink-0">
              <span className="font-display text-[17px] text-neutral-900 tracking-wide">日付を選ぶ</span>
              <button type="button" onClick={close} aria-label="閉じる"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 ft-tap ft-tap-icon"><X size={24} /></button>
            </div>

            <div className="ft-sheet-body overflow-y-auto px-4 py-3">
              {/* 見出しは実績画面のカレンダーと同じ部品。年月を押すと期間を選べる */}
              <MonthNavHeader
                label={`${cursor.y}年 ${cursor.mo}月`}
                onPrev={() => shiftMonth(-1)}
                onNext={() => shiftMonth(1)}
                onJump={() => setJumpOpen(true)}
                onToday={() => { setCursor({ y: today.getFullYear(), mo: today.getMonth() + 1 }); setPicked(todayKey); }}
              />

              <div className="grid grid-cols-7 gap-1 text-center text-[12.5px] font-bold mb-1">
                {WEEK_LABELS.map((d, i) => <div key={d} className={weekColor(i)}>{d}</div>)}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {cells.map((d, i) => {
                  if (d === null) return <div key={"e" + i} />;
                  const ds = key(d);
                  const isPicked = ds === picked;
                  const isToday = ds === todayKey;
                  const dow = (firstDow + d - 1) % 7;
                  return (
                    <button key={ds + (isPicked ? "-s" : "")} type="button" onClick={() => setPicked(ds)}
                      className={"aspect-square min-h-[42px] rounded-lg text-[15.5px] font-bold flex items-center justify-center border-2 ft-tap "
                        + (isPicked ? "bg-th-800 border-th-800 text-white ft-daypop"
                          : isToday ? "border-th-300 bg-th-50 " + weekColor(dow)
                            : "border-transparent " + weekColor(dow) + " hover:bg-neutral-100")}>
                      {d}
                    </button>
                  );
                })}
              </div>

            </div>

            <div className="shrink-0 flex gap-2.5 px-4 py-3 border-t border-neutral-200"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
              <button type="button" onClick={close} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</button>
              <button type="button" onClick={confirm} disabled={!picked}
                className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>決定</button>
            </div>

            {jumpOpen && (
              <MonthJumpSheet year={cursor.y} month={cursor.mo} years={jumpYears(cursor.y)}
                zIndex={2147483100}
                onClose={() => setJumpOpen(false)}
                onConfirm={(y, mo) => { setCursor({ y, mo }); setJumpOpen(false); }} />
            )}
          </div>
        </div>
      )}
    </>
  );
}

function TextArea({ value, onChange, className, minRows, bare, ...rest }) {
  const ref = useRef(null);
  /* いまの高さを、どの中身で測ったか。同じ中身で二度測らない（2.13.0〜） */
  const sizedFor = useRef(null);
  /* 中身に合わせて高さを測り直す。
     測るときに一度 height を auto に戻すが、そのあいだ欄が縮むため、
     何もしないとまわりの巻き物（スクロール位置）が動いてしまう。
     「長い文章を書き始めると画面が勝手にずれる」のはこれが原因だった。
     測る前に位置を覚えておき、直後に戻すこと。

     **2.13.0〜：1文字打つごとの重さを減らした**（打つ・変換を確定するときの「カクッ」の一因）。
     2.12.0 までは、1文字ごとに「打った瞬間（onInput）」と「描き直したあと（useEffect）」の2回、
     毎回いったん縮めて測り直していた。縮めるたびに画面ぜんたいの組み直しが3回ずつ起き、
     しかも useEffect は「描いたあと」に動くので、元に戻す・聖書箇所の挿入のときは
     古い高さのまま1こま描かれてから伸びていた。
     ・同じ中身なら測らない（sizedFor）
     ・書き足して欄からはみ出したときは、縮めずにそのまま伸ばす（伸ばすだけなら、まわりの位置は動かない）
     ・縮めて測るのは、文字が減った・改行が減ったときと、はじめの1回だけ
     ・中身が外から変わったとき（元に戻す・挿入・下書きの復元）は、描く前（useLayoutEffect）に合わせる */
  const resize = () => {
    const el = ref.current;
    if (!el) return;
    const v = el.value;
    const prev = sizedFor.current;
    if (prev === v) return;
    sizedFor.current = v;
    const lines = (t) => { let c = 0; for (let i = 0; i < t.length; i++) if (t.charCodeAt(i) === 10) c++; return c; };
    const mayShrink = prev == null || v.length < prev.length || lines(v) < lines(prev);
    if (!mayShrink) {
      const sh = el.scrollHeight;
      if (sh > el.clientHeight) el.style.height = sh + "px";
      return;
    }
    const holders = [];
    for (let p = el.parentElement; p; p = p.parentElement) {
      if (p.scrollHeight > p.clientHeight + 1) holders.push([p, p.scrollTop]);
    }
    const winY = window.scrollY;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
    holders.forEach(([p, top]) => { if (p.scrollTop !== top) p.scrollTop = top; });
    if (window.scrollY !== winY) window.scrollTo(0, winY);
  };
  React.useLayoutEffect(() => { resize(); }, [value]);
  const style = minRows ? { minHeight: `${minRows * 1.7 + 1.5}em` } : undefined;
  /* rows={1} は必ず付けること。
     textarea は何も指定しないと「2行ぶん」の高さから始まるため、
     1行だけの欄が、となりの入力欄より2〜3割ほど背の高い箱に見えてしまう。
     実際の高さは下の resize() が中身に合わせて決めるので、
     rows を1にしても書き足せば普通に伸びる。
     minRows を渡した欄は minHeight のほうが効くので、見た目は変わらない */
  return <textarea ref={ref} rows={1} value={value} onChange={onChange} onInput={resize} style={style} className={(bare ? bareInputCls : inputCls) + " resize-none overflow-hidden " + (className || "")} {...rest} />;
}
function Select({ value, onChange, children }) {
  return (
    <div className="relative">
      <select value={value} onChange={onChange} className={inputCls + " appearance-none pr-10"}>{children}</select>
      <ChevronDown size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
    </div>
  );
}
/* 連続した数値を [開始, 終了] の範囲にまとめる */
function chapterRanges(nums) {
  const sorted = [...new Set(nums || [])].sort((a, b) => a - b);
  if (!sorted.length) return [];
  const out = [];
  let s = sorted[0], p = sorted[0];
  for (let i = 1; i <= sorted.length; i++) {
    const c = sorted[i];
    if (c === p + 1) { p = c; continue; }
    out.push([s, p]);
    s = c; p = c;
  }
  return out;
}

/* 章の複数選択。小さなマスを狙うのをやめ、ドラムで「◯章から◯章まで」を足していく方式 */
function ChapterMultiSelect({ book, selected, onChange }) {
  const b = bookByName(book);
  const total = b ? b.chapters : 0;
  const [from, setFrom] = useState(1);
  const [to, setTo] = useState(1);

  useEffect(() => { setFrom(1); setTo(1); }, [book]);

  const chosen = selected || [];
  const chapterOptions = Array.from({ length: total }, (_, i) => ({ value: i + 1, label: `${i + 1}章` }));
  const toOptions = chapterOptions.filter((o) => o.value >= from);

  const addRange = () => {
    const lo = Math.min(from, to), hi = Math.max(from, to);
    const set = new Set(chosen);
    for (let i = lo; i <= hi; i++) set.add(i);
    onChange([...set].sort((a, c) => a - c));
  };
  const removeRange = (s, e) => onChange(chosen.filter((n) => n < s || n > e));

  if (!b) return <p className="text-[14.5px] text-neutral-500">先に読んだ箇所の書を選んでください</p>;

  const ranges = chapterRanges(chosen);
  return (
    <div className="rounded-xl bg-white border border-neutral-300 p-3">
      <div className="flex items-end gap-2">
        <div className="flex-1 min-w-0">
          <span className="block text-[12.5px] font-bold text-neutral-500 mb-1">開始</span>
          <DrumSelect value={from} onChange={(v) => { setFrom(v); if (v > to) setTo(v); }} options={chapterOptions} placeholder="章" title="開始の章" />
        </div>
        <span className="text-neutral-400 font-bold pb-3.5 shrink-0">〜</span>
        <div className="flex-1 min-w-0">
          <span className="block text-[12.5px] font-bold text-neutral-500 mb-1">終了</span>
          <DrumSelect value={to} onChange={setTo} options={toOptions} placeholder="章" title="終わりの章" />
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button type="button" onClick={addRange} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>
          <Plus size={16} /> この範囲を追加
        </button>
      </div>

      <div className="flex gap-2 mt-2">
        <button type="button" onClick={() => onChange(Array.from({ length: total }, (_, i) => i + 1))}
          className="flex-1 min-h-[38px] rounded-lg text-[12.5px] font-bold text-th-800 hover:bg-th-50">全{total}章を選択</button>
        {chosen.length > 0 && (
          <button type="button" onClick={() => onChange([])}
            className="flex-1 min-h-[38px] rounded-lg text-[12.5px] font-bold text-neutral-500 hover:bg-neutral-100">選択をクリア</button>
        )}
      </div>

      <div className="border-t-2 border-neutral-100 mt-3 pt-3">
        {ranges.length === 0 ? (
          <p className="text-[13.5px] text-neutral-500">まだ選ばれていません</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {ranges.map(([s, e]) => (
              <span key={`${s}-${e}`} className="inline-flex items-center gap-1 rounded-full bg-th-50 border border-th-200 pl-3 pr-1 py-1 ft-chip">
                <span className="text-[13.5px] font-bold text-th-900">{s === e ? `${s}章` : `${s}-${e}章`}</span>
                <button type="button" onClick={() => removeRange(s, e)}
                  className="w-7 h-7 flex items-center justify-center rounded-full text-th-700 hover:bg-th-100"><X size={15} /></button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
/* 旧約は39巻、新約は27巻 */
const OT_COUNT = 39;
/* compact ＝ 旧約・新約の切り替えを、選ぶ欄の左に並べて1行に収める。
   探すの絞り込みで使う。縦に積むと、それだけで2行ぶんの高さになるため */
function BookSelect({ value, onChange, compact }) {
  const isNew = value ? bookIndexOf(value) >= OT_COUNT : false;
  const [testament, setTestament] = useState(isNew ? "new" : "old");
  useEffect(() => { if (value) setTestament(bookIndexOf(value) >= OT_COUNT ? "new" : "old"); }, [value]);
  const list = testament === "old" ? BOOKS.slice(0, OT_COUNT) : BOOKS.slice(OT_COUNT);
  const toggle = (
    <div className={compact ? "flex gap-1 shrink-0" : "flex gap-1.5 mb-2"}>
      {[["old", "旧約"], ["new", "新約"]].map(([k, label]) => (
        <button key={k} type="button" onClick={() => setTestament(k)}
          className={(compact ? "px-2 min-h-[40px] " : "flex-1 " + BTN_H + " ") + "ft-tap rounded-lg border-2 text-[13.5px] font-bold "
            + (testament === k ? "border-th-700 bg-th-50 text-th-900" : "border-neutral-200 bg-white text-neutral-500")}>
          {label}
        </button>
      ))}
    </div>
  );
  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        {toggle}
        <div className="flex-1 min-w-0">
          <DrumSelect value={value} onChange={onChange} placeholder="書を選択"
            title={testament === "old" ? "旧約聖書から選ぶ" : "新約聖書から選ぶ"}
            options={list.map((b) => ({ value: b.name, label: b.name }))} />
        </div>
      </div>
    );
  }
  return (
    <div>
      {toggle}
      <DrumSelect
        value={value}
        onChange={onChange}
        placeholder="書を選択"
        title={testament === "old" ? "旧約聖書から選ぶ" : "新約聖書から選ぶ"}
        options={list.map((b) => ({ value: b.name, label: b.name }))}
      />
    </div>
  );
}
/* タップした部品が、ほんの一瞬うすくなってから画面が変わるようにする。
   押したことが手に伝わり、切り替わりも唐突でなくなる */
/* 押してから「画面が動きはじめる」までの間。
   ここで決まるのは動きはじめる時刻だけで、
   画面が滑ってくる速さ（.anim-right の0.26秒）とは別物。
   下の .ft-tap-pressed を45msで暗くしているので、
   暗くなりきった直後に動きはじめる勘定になっている。
   ここを縮めるときは、必ず .ft-tap-pressed の速さも一緒に見ること。
   暗くなる途中で切り替わると、押した手ごたえが見えないまま消える */
function useTapThen(fn, ms = 60) {
  const [pressed, setPressed] = useState(false);
  const t = useRef(null);
  useEffect(() => () => clearTimeout(t.current), []);
  const run = useCallback((...args) => {
    if (!fn || pressed) return;
    setPressed(true);
    /* try/finally：押した先の処理がつまずいても、沈んだまま（＝次から押しても効かない）にしない */
    t.current = setTimeout(() => { try { fn(...args); } finally { setPressed(false); } }, ms);
  }, [fn, pressed, ms]);
  return [pressed, run];
}
const TAP_DIM = "brightness-90 opacity-80";

/* 押すと少し暗くなり、ひと呼吸おいてから画面が変わるボタン */
function TapButton({ onClick, className = "", children, delay, ...rest }) {
  const [pressed, go] = useTapThen(onClick, delay);
  return (
    <button onClick={go} {...rest}
      className={className + " ft-tap " + (pressed ? "ft-tap-pressed" : "")}>
      {children}
    </button>
  );
}

/* 値が変わるだけのボタン（ピン留め・ブックマーク・タグを外す・絞り込みの札・下のタブ）は、
   TapButton（ひと呼吸おいてから動く）ではなく、こちらで受けること。
   **TapButton を印の入り切りに使わないこと。** 押したあとの60msのあいだに来た2度目を捨てるので、
   「ゆっくり押せば入るのに、速く押すと入らない」という不具合に見える。

   2.3.2 から、**ふつうの click だけで受ける**（指を離した時点＝pointerup で受けるのはやめた）。
   以前は pointerup で先に動かし、あとから来る click をアプリ全体で0.7秒捨てていたが、
   ・pointerup で画面の形が変わると、直後の click が「指の下にいま在る別の部品」に届く（写真の✕が2枚消えた事故の原因）
   ・その0.7秒のあいだに少しずれて押した次のボタン（12px超）は、pointerup でも click でも受けられず「1回では効かない」
   という、2つの受け方がぶつかることで起きる不具合の元になっていた。
   click は、指が離れた場所と押した部品が同じときにだけ1回だけ届くので、二重にも取りこぼしにもならない。
   素早く続けて押したときに iPhone が click を配らない件は、全ボタンに付けた
   touch-action: manipulation（下の CSS）で「ダブルタップで拡大」を止めて防いでいる。
   **ボタンに onPointerUp / onTouchEnd で動く処理を足さないこと。** 同じ理由で、また二重・取りこぼしが起きる */
function useTapOnce(fn) {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  return {
    onClick: (e) => { fnRef.current && fnRef.current(e); },
  };
}
function TapOnceButton({ onTap, children, className = "", ...rest }) {
  const h = useTapOnce(onTap);
  return <button type="button" {...rest} {...h} className={className}>{children}</button>;
}

/* iPhoneの設定でおなじみの、入り切りのつまみ。値が変わるだけなので TapOnceButton で受ける */
function Switch({ on, onChange, label }) {
  return (
    <TapOnceButton onTap={() => onChange(!on)} role="switch" aria-checked={!!on} aria-label={label}
      className="shrink-0 flex items-center justify-end ft-tap" style={{ minHeight: 44, minWidth: 60 }}>
      <span className="block rounded-full"
        style={{ width: 52, height: 32, padding: 3, background: on ? "var(--th-700)" : "#D4D4D4", transition: "background 200ms cubic-bezier(0.16,1,0.3,1)" }}>
        <span className="block rounded-full bg-white shadow-sm"
          style={{ width: 26, height: 26, transform: on ? "translateX(20px)" : "none", transition: "transform 200ms cubic-bezier(0.16,1,0.3,1)" }} />
      </span>
    </TapOnceButton>
  );
}

/* ピン留め／ブックマークの目印ボタン */
function MarkButton({ on, onClick, label, icon }) {
  return (
    <TapOnceButton onTap={onClick} aria-label={label} aria-pressed={on}
      className={"w-10 h-10 rounded-xl border-2 flex items-center justify-center shrink-0 ft-tap ft-tap-icon "
        + (on ? "border-th-800 bg-th-800 text-white" : "border-neutral-200 bg-white text-neutral-400")}>
      {/* 付けた瞬間だけ弾ませたいので、key を変えて描き直させている */}
      <span key={on ? "on" : "off"} className={"flex " + (on ? "ft-mark" : "")}>{icon}</span>
    </TapOnceButton>
  );
}

/* 本文の中の聖書箇所を、テーマカラーで見えるようにする。
   括弧つきの引用（節まであるもの）はまとめて色を付け、
   本文中に出てくる「ヨハネの福音書 3:16」のような書き方にも色を付ける */
/* 引用（本文＋聖書箇所）と、それ以外の文に切り分ける。
   引用の範囲は splitByCitations にまかせること（閲覧画面の縦線の範囲）。

   区切りのところにある空行は、文字として残さず「空ける行数」として持ち回る。
   ブロックの上端・下端に改行を残しても、端末によって表示されたりされなかったりして
   間隔が安定しないため。書いたとおりの空きが出るように、あとで余白に直す */
function splitByQuote(text) {
  const raw = [];
  let pos = 0;
  splitByCitations(text).forEach((seg) => {
    if (seg.start > pos) raw.push({ quote: false, text: text.slice(pos, seg.start) });
    raw.push({ quote: true, text: text.slice(seg.start, seg.end) });
    pos = seg.end;
  });
  if (pos < text.length) raw.push({ quote: false, text: text.slice(pos) });

  const countNl = (t) => (t.match(/\n/g) || []).length;
  const parts = raw.map((b) => {
    const lead = (b.text.match(/^(?:[ \t]*\n)+/) || [""])[0];
    const trail = (b.text.match(/(?:\n[ \t]*)+$/) || [""])[0];
    const body = b.text.slice(lead.length, b.text.length - trail.length);
    return { quote: b.quote, body, lead: countNl(lead), trail: countNl(trail), nl: countNl(b.text) };
  });

  const out = [];
  let carry = 0;   // 前の区切りから持ち越した改行の数
  parts.forEach((p2) => {
    const before = carry + p2.lead;
    /* 空行だけの部分は、間隔として次へ回す。
       **改行の数は、その部分ぜんたいで数えること。** 先頭側（lead）と末尾側（trail）の両方で数えると、
       同じ改行を2回数えてしまい、引用と引用のあいだが書いた空行の数より広く空く
       （聖書箇所＋1行あける＋聖書箇所で、1行のはずが3行ぶん空いていた） */
    if (p2.body.trim() === "") { carry = carry + p2.nl; return; }
    /* 区切りそのもので1行ぶん改まるので、その1つを引いた残りを空ける */
    const gap0 = out.length === 0 ? 0 : Math.max(0, before - 1);
    /* ふつうの文の中の空行も、ここで段落に切り分けて「空ける行数」にする（2.6.2〜）。
       以前は1つの <p> の中に空行を残して、そのまま1行ぶん空けていた。
       引用のあとの空行は余白で空けていたため、同じ「1行あけ」でも空きの高さが違って見えた。
       **空行はすべて gapBefore で空けること。** 片方だけ文字の空行に戻すと、また食い違う */
    if (!p2.quote) {
      const re = /\n(?:[ \t\u3000]*\n)+/g;
      let last = 0, mm, gap = gap0;
      while ((mm = re.exec(p2.body)) !== null) {
        const piece = p2.body.slice(last, mm.index);
        if (piece.trim() !== "") { out.push({ quote: false, text: piece, gapBefore: out.length === 0 ? 0 : gap }); gap = 0; }
        gap += countNl(mm[0]) - 1;
        last = mm.index + mm[0].length;
      }
      const tail = p2.body.slice(last);
      if (tail.trim() !== "") out.push({ quote: false, text: tail, gapBefore: out.length === 0 ? 0 : gap });
    } else {
      out.push({ quote: p2.quote, text: p2.body, gapBefore: gap0 });
    }
    carry = p2.trail;
  });
  return out;
}

/* 文の中のURLを押せるリンクにし、聖書箇所には印を付けて描く。
   withRefColor が false のときは箇所の色付けをしない（引用の中は全体を整えるため） */
/* 本文の中のURL。押すと、アプリの中で開く小窓を呼び出す。
   色はテーマカラーではなく落ち着いた青にしている。
   テーマカラーだと聖書箇所の色と紛らわしく、本文の中で目立ちすぎるため */
/* 本文の中のURL。
   色はテーマカラーではなく落ち着いた青。下線は引かない。

   **自前で確認を出さないこと。**
   iPhoneはリンクを押すと必ず「このリンクを開きますか？」を出すので、
   こちらでも確認を出すと二度手間になる（実際そうなって戻した）。
   開いたあとの見せ方（下からせり上がるアプリ内ブラウザ）も端末が受け持つ */
function InlineLink({ url, children }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" draggable={false}
      className="ft-link text-sky-700 break-all">{children}</a>
  );
}

/* 文の中のURLだけをリンクにして描く。
   **聖書箇所に色や太字を付けないこと。**
   引用は左の縦線で示しているので、そのうえ字まで飾ると
   本文が読みにくくなる（依頼により取りやめ） */
function renderInline(text) {
  return splitByUrl(text).map((sg, i) => sg.url
    ? <InlineLink key={i} url={sg.url}>{sg.text}</InlineLink>
    : <React.Fragment key={i}>{sg.text}</React.Fragment>);
}

function HighlightedText({ text, className }) {
  if (!text) return null;
  const blocks = splitByQuote(text);
  /* 引用の中は、本文よりすこし落ち着いた色にする。
     渡された指定の文字色だけを差し替えるので、大きさや行間は本文と揃ったまま */
  const quoteClass = (className || "").replace(/text-neutral-\d+/, "text-neutral-600");

  /* かたまりの間隔。
     ・空行を書いていないとき … 6px（引用の縦線の区切りが分かるだけの、いちばん狭い間隔）
     ・空行を書いたとき … 空行1つにつき、本文ちょうど1行ぶん（字の大きさ×行間）
     **空行の空きは、引用のまわりでも、ふつうの文どうしでも同じ高さにすること（2.6.2〜）。**
     2.1.1 では引用のまわりだけ0.75行ぶんに詰めていたが、ふつうの文の空行は1行ぶんのままだったので、
     同じ「1行あけ」なのに引用のあとだけ狭く見えた（依頼により揃えた）。
     聖書箇所を詰めて並べたいときは、空行を書かずに続ければ6pxで並ぶ。
     高さは px で出す。引用の外わく（div）は字の大きさの指定を持たないので、em だと本文とずれるため */
  const fontPx = (() => { const m = (className || "").match(/text-\[(\d+(?:\.\d+)?)px\]/); return m ? parseFloat(m[1]) : 16; })();
  const lineH = /leading-relaxed/.test(className || "") ? 1.625
    : /leading-normal/.test(className || "") ? 1.5
    : /leading-tight/.test(className || "") ? 1.25 : 1.5;
  const gapStyle = (b, i) => (i === 0 ? undefined
    : { marginTop: b.gapBefore > 0 ? `${(b.gapBefore * fontPx * lineH).toFixed(2)}px` : "0.375rem" });

  return (
    <div>
      {blocks.map((b, i) => b.quote ? (
        /* 引用ブロック。左に縦線を引き、その分だけ字下げする。
           右端は入れ物の右端のままなので、ふつうの文とぴったり揃う */
        <div key={i} className="ft-quote rounded-r-sm" style={gapStyle(b, i)}>
          {/* 斜体にはしない。日本語だと読みづらくなるため（依頼により解除） */}
          <p className={quoteClass}>{renderInline(b.text)}</p>
        </div>
      ) : (
        <p key={i} className={className} style={gapStyle(b, i)}>{renderInline(b.text)}</p>
      ))}
    </div>
  );
}

/* 本文の中の聖書箇所に色を付ける。返すのは文字と<span>の並び */
/* highlightRefs（聖書箇所に色を付ける処理）は取りやめた。
   引用は左の縦線で示している */

function RecognizedRefs({ text, inline }) {
  /* 同じ文字なら読み直さない（2.13.0〜）。入力画面では、どの欄に1文字打っても
     画面ぜんたいが描き直され、ほかの欄の聖書箇所まで毎回読み直していた */
  const refs = useMemo(() => parseBibleRefs(text), [text]);
  if (!refs.length) return null;
  const chips = refs.map((r, i) => <span key={i} className="text-[11.5px] font-bold px-2 py-0.5 rounded-full bg-th-50 text-th-800 border border-th-300 ft-chip">{formatRef(r)}</span>);
  /* inline ＝ 枠の中の帯（RefBox）に、挿入ボタンといっしょに並べる */
  return inline ? <>{chips}</> : <div className="flex flex-wrap gap-1.5 mt-2">{chips}</div>;
}

/* 記録に付ける写真。**タグのすぐ上、記録のいちばん下に置くこと**（姉妹アプリ My手帳 と同じ）。
   書くことが主で、写真はおまけなので、上のほうに置くと本文までが遠くなる。
   ・**0枚のときも、追加のボタン1本だけにすること**（点線の大きな箱にしない。写真が主役の記録ばかりではない）。
     1枚以上あるときと同じボタン・同じ余白で、並べた写真の下に付く
   ・**枚数にかかわらず、2列・正方形にすること。** 1枚めだけ大きくすると、2枚めを足した瞬間に
     写真の大きさが変わり、✕の位置も動く（押した指の下に別の✕が来る原因にもなる）
   ・上限に達したときの知らせは出さない。ボタンに「あと○枚」「写真は ○ 枚まで」と出ているため。
     出すのは、読み込めない画像があったときだけ
   ・✕は TapOnceButton で受ける（値が変わるだけのボタン）。白いふちを付けて、白い写真の上でも見えるようにする */
const MAX_IMAGES = 4;
function ImagesField({ images, onChange, onError }) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const list = images || [];
  const rest = Math.max(0, MAX_IMAGES - list.length);
  const pick = async (files) => {
    if (!files || !files.length) return;
    setBusy(true);
    try {
      const out = [];
      /* 入りきらないぶんは、黙って捨てる（ボタンの「あと○枚」で分かるようにしてある） */
      for (const f of Array.from(files).slice(0, rest)) {
        try { out.push(await shrinkPhoto(f)); }
        catch (e) { onError && onError("読み込めない画像がありました"); }
      }
      if (out.length) onChange([...list, ...out].slice(0, MAX_IMAGES));
    } finally { setBusy(false); }
  };
  const open = () => { if (fileRef.current) fileRef.current.click(); };
  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" multiple
        style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
        /* **files を配列に写してから value を空にすること。** value を空にした時点で
           e.target.files も空になるので、先に写さないと1枚も受け取れない。
           value を空にするのは、同じ写真をもう一度選んだときにも onChange が起きるようにするため */
        onChange={(e) => { const fs = Array.from(e.target.files || []); e.target.value = ""; pick(fs); }} />
      {list.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-2">
          {list.map((src, i) => (
            <div key={i} className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100"
              style={{ aspectRatio: "1 / 1" }}>
              <Photo src={src} className="block w-full h-full" style={{ objectFit: "cover" }} />
              <TapOnceButton onTap={() => onChange(list.filter((_, k) => k !== i))} aria-label="この写真を外す"
                className="absolute top-1.5 right-1.5 z-10 w-9 h-9 rounded-full bg-black/55 text-white border-2 border-white/90 flex items-center justify-center ft-tap ft-tap-icon">
                <X size={17} strokeWidth={2.5} />
              </TapOnceButton>
            </div>
          ))}
        </div>
      )}
      <button type="button" onClick={open} disabled={busy || rest === 0}
        className={BTN_SECONDARY + " w-full " + BTN_H + " text-[14.5px]"}>
        {busy ? <Spinner size={15} /> : <Plus size={15} />}
        {busy ? "読み込み中" : rest === 0 ? `写真は ${MAX_IMAGES} 枚まで` : `写真を追加（あと${rest}枚）`}
      </button>
    </div>
  );
}

/* 「聖書箇所を挿入」つきの入力欄。
   **入力欄と挿入ボタンを、ひとつの枠にまとめること。** 枠の下に別のリンクとして置いていたときは、
   ボタンがどの欄に入るのか分かりにくかった。いまは、入力欄の下に薄い帯を敷き、左端に挿入ボタン、
   そのとなり（入り切らなければ次の行）に、読み取れた聖書箇所の札を並べる。
   入力欄は bare（枠なし）にして、この外枠の線と入力中の縁取りを使う。
   ・帯と入力欄のあいだ、札と札のあいだ以外に、余白をはさまないこと */
function RefBox({ children, inserter, refsText }) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden focus-within:border-th-800 focus-within:ring-4 focus-within:ring-th-800/20">
      {children}
      <div className="border-t border-neutral-100 bg-neutral-50 px-2.5 py-1.5 flex flex-wrap items-center gap-1.5">
        {inserter}
        <RecognizedRefs text={refsText} inline />
      </div>
    </div>
  );
}

/* テキスト中に含まれる聖句引用ごとに、その部分だけを聖句へ追加できるようにする */
/* 本文と、そのあとに続く聖書箇所を「ひとつの引用」として切り出す。
   閲覧画面の縦線（引用ブロック）は、この範囲を使う。「〇〇を聖句に追加」の機能は、間違えて押しやすいので 2.1.0 で無くした（コードは、縦線の範囲を決める側だけ残してある）。
   **同じ判定を2か所に書かないこと。** 別々に書くと、色が付く範囲と
   縦線の範囲と、色を付ける範囲が食い違う（実際そうなっていた）。

   引用と見なす書き方は2つ。
   ① 括弧に入れる … 本文（ヨハネの福音書 3:16）
   ② 行の終わりに置く … 本文のあとで改行し、その行に「ヨハネの第一の手紙 2:27」
   ②は、行の終わりであることを条件にしている。
   文の途中に出てくる箇所（「ヨハネ 3:16 について考えた」など）まで拾うと、
   引用でないものを引用と見なしてしまうため。
   返すのは { start, end, text, ref }。start〜end が色を付ける範囲 */
function splitByCitations(text) {
  if (!text) return [];
  const blankLineRegex = /\n[ \t]*\n/g;

  /* 引用の目印になる箇所を、文の前から順に集める */
  const marks = [];
  /* 全角の（）も見る。日本語で書くとこちらのほうが多い */
  const paren = /[（(][^）)]*[）)]/g;
  let m;
  while ((m = paren.exec(text)) !== null) {
    const refs = parseBibleRefs(m[0]);
    if (refs.length && refs[0].verse) marks.push({ from: m.index, to: m.index + m[0].length, ref: refs[0] });
  }
  const inParen = (i) => marks.some((k) => i >= k.from && i < k.to);
  /* 先に位置だけ全部集めてから中身を調べること。
     調べる途中で parseBibleRefs を呼ぶと、同じ正規表現の読み取り位置が
     先頭に戻されて、いつまでも終わらなくなる */
  const hits = [];
  REF_REGEX.lastIndex = 0;
  let r;
  while ((r = REF_REGEX.exec(text)) !== null) hits.push({ index: r.index, str: r[0], name: r[1] });
  for (const h of hits) {
    if (inParen(h.index)) continue;
    /* 短い略称のふりをした、ただの日本語を弾く（「国民 3割」など）。
       parseBibleRefs と同じ判定を必ず通すこと */
    if (!bookNameOkAt(text, h.index, h.str, h.name)) continue;
    const refs = parseBibleRefs(h.str);
    if (!refs.length || !refs[0].verse) continue;
    /* その行の終わりに置かれているか。うしろは空白か、訳名のような短い添え書きだけ */
    const after = text.slice(h.index + h.str.length);
    const rest = (after.match(/^[^\n]*/) || [""])[0];
    if (!/^[\s　]*(（[^）\n]{0,12}）|\([^)\n]{0,12}\))?[\s　]*$/.test(rest)) continue;
    marks.push({ from: h.index, to: h.index + h.str.length + rest.length, ref: refs[0] });
  }
  marks.sort((a, b) => a.from - b.from);

  const segments = [];
  let lastEnd = 0;
  for (const k of marks) {
    if (k.from < lastEnd) continue;
    /* 直前の引用（または文頭）から今回までの範囲で、いちばん近い空行の直後が本文の始まり */
    const zone = text.slice(lastEnd, k.from);
    let start = lastEnd, bl;
    blankLineRegex.lastIndex = 0;
    while ((bl = blankLineRegex.exec(zone)) !== null) start = lastEnd + bl.index + bl[0].length;
    while (start < k.from && /\s/.test(text[start])) start++;
    const body = text.slice(start, k.from).trim();
    if (body) {
      /* 引用の文は「本文＋書 章:節」の形にし、括弧や訳名は含めない */
      segments.push({ start, end: k.to, text: body + "\n" + formatRef(k.ref), ref: k.ref });
    }
    lastEnd = k.to;
  }
  return segments;
}
/* 閉じる。**ms を渡さないかぎり、待たずにその場で閉じること。**
   ・ms を渡さないとき：押したその場で閉じる（2.9.1 までと同じ）。「closing」はいつも false。
     守るのは、同じひと押しから二重に届いたぶんだけ（250ms）。
   ・ms を渡したとき（2.10.0〜。姉妹アプリ My手帳 2.20.6 と同じ作り）：closing を true にして
     退場のクラス（anim-right-out など）へ切り替え、その動きの長さぶん待ってから onClose を呼ぶ。
     待っているあいだに二重に押されても弾く。onClose を呼んだあとは closing を戻す
     （画面が消えるならまとめて消え、消えないなら元の位置へ戻る）。
     **ms は、動きの長さ（FT_EXIT_RIGHT_MS ＝ .anim-right-out の長さ）と必ず同じにすること。**
     片方だけ変えると、消えたあと待つか、消える前に閉じるかのどちらかになる。
   ・「画面の動き」を切っている／端末の「視差効果を減らす」のときは、待たずにすぐ閉じる（motionIsOff）。
   ・**左端から払って戻る（useEdgeSwipeBack）には、ms を渡した方を渡さないこと。**
     指について動く分ですでに退場の動きができているので、ms なしの別の useClosing を渡す
     （渡すと、退場のクラスが指の動きの上から translate を奪い、位置が跳ねて見える）。
   ・**「戻る」「保存」「保存しない」など、閉じる道はぜんぶ同じ close を通すこと。**
     片方だけ動かすと、押すボタンによって消え方が変わり、ちぐはぐに見える */
function motionIsOff() {
  try {
    return !!document.querySelector(".ft-still")
      || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  } catch (e) { return false; }
}
function useClosing(onClose, ms = 0) {
  const cb = useRef(onClose);
  cb.current = onClose;
  const last = useRef(0);
  const busy = useRef(false);
  const [closing, setClosing] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);
  const startClose = useCallback((...args) => {
    if (ms > 0 && !motionIsOff()) {
      if (busy.current) return;
      busy.current = true;
      setClosing(true);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        const done = () => { busy.current = false; setClosing(false); };
        const r = cb.current && cb.current(...args);
        if (r && typeof r.then === "function") r.then(done, done);
        else done();
      }, ms);
      return;
    }
    const now = Date.now();
    if (now - last.current < 250) return;
    last.current = now;
    cb.current && cb.current(...args);
  }, [ms]);
  return [closing, startClose];
}
/* 右から入った画面が、右へ戻っていく長さ（2.10.0〜）。
   **GLOBAL の .anim-right / .anim-right-out / .anim-scrim-out-push の長さ（0.3s）と必ず同じにすること** */
const FT_EXIT_RIGHT_MS = 300;

/* 画面が右から入りきったら、その箱に data-ft-entered を付ける（2.10.0〜）。
   メニューから画面へ移るとき（AppMain の goFromMenu）、入りきったかをこれで見る。
   **時間を決め打ちで待たないこと。** iPhone が重いと動きの始まりが遅れ、
   入りきる前に下の画面が消えて、ひとつ下の画面（ホームなど）がのぞく。
   **クラスを外す形にしないこと。** React が描き直しで className を付け直すと、動きがもう一度流れる */
function markEntered(e) {
  const name = e && e.animationName;
  if (name !== "ft-right-in" && name !== "ft-up-in") return;
  const el = e.target;
  if (el && el.setAttribute) el.setAttribute("data-ft-entered", "");
}
if (typeof document !== "undefined" && document.addEventListener) {
  document.addEventListener("animationend", markEntered, true);
  document.addEventListener("animationcancel", markEntered, true);
}

/* 重なって出る画面が開いているあいだ、うしろの画面（本体）を動かないようにする。
   iPhone は body の overflow:hidden だけではページを送ってしまう。紙の中の入力欄に触れて
   キーボードが出ると、うしろの一覧が送られ、fixed の層ごとずれて、あいた所に一覧がのぞく。
   そこで、開いた瞬間のページ位置を覚え、送られたら留めた位置へ引き戻す。
   **引き戻しは scroll だけで行い、visualViewport の resize では行わないこと（2.6.0〜）。**
   キーボードの出入りそのものに反応して引き戻すと、iPhone の送りと引き戻しが交互に描かれ、
   ヘッダーが一度下がって戻る揺れになる。
   何枚か重なることがあるので、枚数を数えて最後の1枚が閉じたときだけ元に戻す。
   **body を position: fixed にしないこと。** body を流れから外すとページが「送れない状態」になり、
   iPhone が viewport-fit=cover で広げていた画面を測り直す。下端が60px前後切り上がり、
   fixed の下タブや右下のボタンがまとめて持ち上がる（姉妹アプリ My手帳 で実際に起きた）。
   **重なって出るものは、すべてこれを通すこと。** hook を直接呼べない場所（open && (...) の中など）では、
   外わくの最初の子に <BackgroundLock /> を置く。 */
let overlayCount = 0;
let overlayLockY = 0;
let overlayPrevOverflow = "";
let overlayPin = null;
/* キーボードを出さない input の種類（installKeyboardInset が使う） */
const FT_NO_KB_TYPES = { checkbox: 1, radio: 1, button: 1, submit: 1, reset: 1, range: 1, file: 1, color: 1, image: 1, hidden: 1 };
function useLockBackground() {
    React.useLayoutEffect(() => {
        if (typeof document === "undefined")
            return undefined;
        const body = document.body;
        if (overlayCount === 0) {
            overlayLockY = window.scrollY || document.documentElement.scrollTop || 0;
            overlayPrevOverflow = body.style.overflow || "";
            body.style.overflow = "hidden";
            /* **1px の遊びを持たせること。** ぴったり比べると、慣性の最後のひとこまでも
               引き戻しが走り、指を離した瞬間に画面が小さく震える */
            overlayPin = () => {
                /* **入力中も引き戻すこと（2.16.7〜）。** 2.16.1〜2.16.6 は入力中だけ引き戻しを止めていたため、
                   紙で打っているあいだに指を動かすと、うしろの一覧が送られていた。
                   2.16.6 から iOS がキーボードのために画面を送ることはない（installKeyboardInset が、
                   本物の入力欄にはキーボードより上でしかフォーカスを入れない）ので、取り合いは起きない */
                const y = window.scrollY || document.documentElement.scrollTop || 0;
                if (Math.abs(y - overlayLockY) > 1)
                    window.scrollTo(0, overlayLockY);
            };
            window.addEventListener("scroll", overlayPin, { passive: true });
            /* ❌ visualViewport の resize で引き戻さないこと（2.17.0〜）。キーボードの出入りそのものに反応して、
               上の揺れを起こしていた */
        }
        overlayCount += 1;
        return () => {
            overlayCount -= 1;
            if (overlayCount <= 0) {
                overlayCount = 0;
                body.style.overflow = overlayPrevOverflow;
                if (overlayPin) {
                    window.removeEventListener("scroll", overlayPin);
                    overlayPin = null;
                }
                /* 留めていたあいだの位置へ戻す。**戻さないと一覧がいちばん上へ跳ぶ** */
                window.scrollTo(0, overlayLockY);
            }
        };
    }, []);
}
/* キーボードに隠れる高さを --ft-kb に入れておく（2.11.17〜）。
   **重なる画面の中の送り場（.flex-1.overflow-y-auto）は、この高さぶん下に余白を足す**（GLOBAL_CSS）。
   iPhone はキーボードを出しても fixed の画面の高さを変えないので、送り場の下のほうが
   キーボードの裏に入ったまま、いちばん下まで送っても出てこなかった。
   そこで指がページまで届き、useLockBackground が引き戻すので「送っても戻ってくる」ように見えた。
   **useLockBackground の引き戻しをやめて直さないこと。** 一覧が透ける件（2.11.11）が戻る。
   ・レイアウトの高さ − 見えている高さ − 見えている上端 ＝ キーボード（と上の ^ v ✓ の帯）の高さ
   ・60px 未満は 0 とみなす（下のバーの出入りなどの小さなずれで余白を揺らさない）

   **余白は、キーボードが出る「前」に足しておくこと（2.11.18〜）。**
   2.11.17 では、キーボードが出たあとで余白を足していた。すると iPhone が入力欄を見せようとした
   瞬間には送り場にまだ送る余地がなく、代わりにページごと送ってしまい、それを
   useLockBackground が引き戻すので「画面が下がって、また戻る」動きが出た。さらにそのあと
   こちらで送り場を送っていたので、動きが二度重なっていた。
   いまは入力欄に指が触れた時点（touchstart / pointerdown）と focusin で、前回のキーボードの高さ
   （はじめは画面の高さの 45%）を**すぐに**（requestAnimationFrame を待たずに）足しておく。
   余白は送り場のいちばん下に足すだけなので、足した瞬間に見た目は動かない。
   iPhone は送り場の中を送って入力欄を見せるので、ページは送られず、動きは一度だけになる。
   ・❌ **こちらから送り場を送る処理を戻さないこと。** iPhone の動きと二重になる
   ・❌ **余白を rAF や setTimeout のあとで足さないこと。** iPhone の送りに間に合わない */
(function installKeyboardInset() {
    if (typeof window === "undefined" || typeof document === "undefined")
        return;
    const vv = window.visualViewport;
    if (!vv)
        return;
    let raf = 0;
    let shown = -1;
    /* 前回のキーボードの高さ。**向き（縦・横）ごとに端末に覚えておくこと（2.15.0〜、2.16.0で改めた）。**
       入力欄に入った瞬間（focusin）に、この高さで紙を先に持ち上げる。ここがずれると、
       入力欄がキーボードの縁の下に残り、iPhone が画面ぜんたい（ヘッダーごと）をずらして見せ、
       こちらが測り直して紙を動かすと、またずらし戻す ──「下がって戻る」揺れになる。
       ・**覚えるのは「キーボードそのものの高さ」＝ レイアウトの高さ − 見えている高さ。**
         2.15.0 は「− 見えている上端（offsetTop）」まで引いた値を覚えていた。iPhone が画面をずらすと
         その値は本当のキーボードより小さくなり、次に開いたときの持ち上げが足りず、揺れがくり返した。
         2.15.0 の値（数字ひとつ）は読み捨てる
       ・まだ出たことがなければ、画面の高さの 50% を見込む。**少なめに見込まないこと。**
         多めなら紙が少し高く上がって、測れたところで静かに下がるだけ（下の隙間は白で埋めてある）。
         少なめだと、上の揺れが出る */
    const KB_KEY = "bible-tracker-kb-last";
    const orient = () => ((window.innerWidth || 0) > (window.innerHeight || 0) ? "l" : "p");
    let kbMem = {};
    try {
        const o = JSON.parse(window.localStorage.getItem(KB_KEY) || "{}");
        if (o && typeof o === "object" && !Array.isArray(o))
            kbMem = o;
    }
    catch (e) { }
    const rememberKb = (raw) => {
        const k = orient();
        if (Math.abs(raw - (kbMem[k] || 0)) < 4)
            return;
        kbMem[k] = raw;
        try {
            window.localStorage.setItem(KB_KEY, JSON.stringify(kbMem));
        }
        catch (e) { }
    };
    const layoutHeight = () => Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const guessKb = () => {
        const m = Number(kbMem[orient()]);
        if (m >= 60 && m < 2000)
            return m;
        return Math.round(layoutHeight() * 0.5);
    };
    /* この向きのキーボードの高さを、実際に測って覚えているか（見込みの 50% ではなく）。2.10.1〜 */
    const kbKnown = () => {
        const m = Number(kbMem[orient()]);
        return m >= 60 && m < 2000;
    };
    /* ================================================================
       キーボードと入力欄（2.16.6〜）
       ----------------------------------------------------------------
       **iOS は、フォーカスが入った時点の本物のカーソルの位置で、画面ぜんたいを押し上げるかを決める。**
       だから、どの画面のどの入力欄も、タップで iOS に直接フォーカスさせない（2.16.5 までは「キーボードに
       隠れない欄」「下タブの画面の欄」を iOS にまかせていて、そこからずれが戻っていた）。
         1. touchend で preventDefault（iOS の「タップで入れる」を止める）
         2. 画面の上のほう（見出しの下あたり）に置いた、見えない入力欄（data-ft-kb-proxy）にフォーカス
            → キーボードが下から出てくる。iOS から見ると入力欄はキーボードより上なので、押し上げない
         3. キーボードが出たのを待って（KB_WAIT_MS 以上）、押した入力欄のある所を
            ゆっくり（KB_UP_MS、ease-out）キーボードの上へ持ち上げる。**キーボードの高さは実際に測った値を使う**
              ・紙：紙の箱を transform（CSS transition）
              ・全画面：送り場の中身（子）を transform。終わったら scrollTop へ置きかえる。見出し・下のボタンは動かさない
              ・下タブの画面など（ページそのもの）：ページを同じ曲線で送る
         4. 持ち上がりきったら、本物の入力欄へフォーカスを移す（キーボードは出たまま）。打ちかけの文字も移す
       ・すでに打っている欄をタップしたとき（カーソルを動かす）だけは iOS にまかせる
       ・カーソルの絵は描かない（2.16.5）。押した欄にはフォーカス枠だけを出す
       ・❌ 本物の入力欄に、キーボードの裏になる位置で focus() しない
       ・❌ 押し上げに window.scrollTo のくり返しで対抗しない／offsetTop で画面を下へずらして相殺しない
         （2.16.2〜2.16.5 の「相殺」は、iOS が報告する量と実際の動きが食い違うと、画面ぜんたいを下げてしまう。やめた）
       ================================================================ */
    const KB_WAIT_MS = 150;   /* タップからこれより前には持ち上げはじめない（キーボードを先に見せる） */
    const KB_FALLBACK_MS = 420; /* キーボードの出た知らせを、ここまで待つ */
    const KB_FALLBACK2_MS = 480; /* それでも来なければ、さらにここまで待つ。来なければ画面のキーボードは無いとみなす */
    const KB_UP_MS = 450;     /* 持ち上げる時間。目に優しい遅さにしてある */
    const KB_DOWN_MS = 360;   /* 下ろす時間 */
    const KB_EASE_UP = "cubic-bezier(0.22,1,0.36,1)";   /* --ease-out と同じ */
    const KB_EASE_DOWN = "cubic-bezier(0.22,1,0.36,1)";
    /* 持ち上げの残りがこの px 以下になったら、本物の入力欄へフォーカスを移す（2.10.1〜）。
       持ち上げは ease-out なので、時間の半分ほどで 96% まで進み、あとは数 px しか動かない。
       その見えない残りを待たずにカーソルを出す。**残り（数 px）は GAP（12px）より小さくしておくこと。**
       フォーカスが入った時点で、欄の下端がキーボードの上端より上にあれば、iPhone は画面を押し上げない。
       0 にすると 2.10.0 までと同じ（持ち上げが終わってからフォーカス）。紙と全画面だけに使う */
    const KB_EARLY_PX = 3;
    /* KB_EASE_UP（cubic-bezier(0.22,1,0.36,1)）で、進み具合が prog に達する時点（0〜1）。二分探索 */
    const easeUpTimeAt = (prog) => {
        if (prog <= 0)
            return 0;
        if (prog >= 1)
            return 1;
        const bx = (t) => 3 * (1 - t) * (1 - t) * t * 0.22 + 3 * (1 - t) * t * t * 0.36 + t * t * t;
        const by = (t) => 3 * (1 - t) * (1 - t) * t + 3 * (1 - t) * t * t + t * t * t;
        let lo = 0, hi = 1;
        for (let i = 0; i < 30; i++) {
            const mid = (lo + hi) / 2;
            if (by(mid) < prog)
                lo = mid;
            else
                hi = mid;
        }
        return bx(hi);
    };
    const GAP = 12;
    const root = document.documentElement;
    let ctx = "";
    const motionOn = () => {
        if (document.querySelector(".ft-still"))
            return false;
        try {
            return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        }
        catch (e) {
            return true;
        }
    };
    const coarse = () => { try {
        return window.matchMedia("(pointer: coarse)").matches;
    }
    catch (e) {
        return true;
    } };
    const NO_KB_TYPES = FT_NO_KB_TYPES;
    /* キーボードで打つ欄か（どの画面にあっても）。日付・時刻などの選ぶ欄は含めない */
    const TEXT_TYPES = { text: 1, search: 1, email: 1, url: 1, tel: 1, password: 1, number: 1 };
    const isTyping = (el) => {
        if (!el || !el.tagName)
            return false;
        if (el.tagName === "TEXTAREA")
            return !el.readOnly && !el.disabled;
        if (el.tagName === "INPUT")
            return !el.readOnly && !el.disabled && !!TEXT_TYPES[(el.type || "text").toLowerCase()];
        return false;
    };
    const isProxy = (el) => !!(el && el.hasAttribute && el.hasAttribute("data-ft-kb-proxy"));
    const rawKb = () => Math.round(layoutHeight() - vv.height);
    const kbTopNow = () => (rawKb() >= 60 ? vv.height + (vv.offsetTop || 0) : layoutHeight() - guessKb());
    /* 送れる余地（--ft-kb）。全画面の送り場の最後・ページの最後に足す。足しても見た目は動かない */
    const setReserve = (kb) => {
        kb = Math.max(0, Math.round(kb || 0));
        if (kb < 60)
            kb = 0;
        if (kb === shown)
            return;
        shown = kb;
        root.style.setProperty("--ft-kb", kb + "px");
        if (kb > 0)
            root.setAttribute("data-ft-kb", "");
        else
            root.removeAttribute("data-ft-kb");
    };
    /* キーボードが出たあと、全画面の送り場をキーボードの上端で終わらせる（下のボタンの帯はキーボードの裏へ残す） */
    const FOOT_SEL = "[data-ft-overlay] > div:last-child > .absolute.inset-0.flex-col > .flex-1.overflow-y-auto ~ .shrink-0";
    const setFix = (on) => {
        if (on === root.hasAttribute("data-ft-kbfix"))
            return;
        if (on) {
            let fh = 0;
            document.querySelectorAll(FOOT_SEL).forEach((f) => { fh = Math.max(fh, Math.round(f.getBoundingClientRect().height)); });
            root.style.setProperty("--ft-kbfoot", fh + "px");
            root.setAttribute("data-ft-kbfix", "");
        }
        else
            root.removeAttribute("data-ft-kbfix");
    };
    const setCtx = (c) => {
        ctx = c;
        if (c)
            root.setAttribute("data-ft-kbctx", c);
        else
            root.removeAttribute("data-ft-kbctx");
        /* **ここで指の見張りを入り切りしないこと（2.17.2〜）。**
           2.17.1 までは「紙で打っているあいだ」だけ見張っていたので、キーボードを出していない
           ときに紙の字（見出し・ラベル・ボタンの字）を上下に払うと、紙ごと・うしろの一覧ごと
           動いてしまった。いまは指が紙の上に降りた時点で見張りを付ける（下の tgStart） */
    };
    const ctxOf = (el) => (el.closest(".ft-sheet-wrap") ? "sheet" : el.closest("[data-ft-overlay]") ? "overlay" : "page");
    let satProbe = null;
    const safeTop = () => {
        if (!satProbe) {
            satProbe = document.createElement("div");
            satProbe.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;visibility:hidden;pointer-events:none;padding-top:env(safe-area-inset-top)";
            document.body.appendChild(satProbe);
        }
        return parseFloat(getComputedStyle(satProbe).paddingTop) || 0;
    };
    const scrollerOf = (el, stop) => {
        for (let n = el.parentElement; n && n !== stop; n = n.parentElement) {
            const oy = getComputedStyle(n).overflowY;
            if ((oy === "auto" || oy === "scroll") && n.scrollHeight > n.clientHeight + 1)
                return n;
        }
        return null;
    };
    const sheetBoxOf = (el) => {
        const w = el.closest(".ft-sheet-wrap");
        if (!w)
            return null;
        let n = el;
        while (n && n.parentElement !== w)
            n = n.parentElement;
        return n && n !== w ? n : null;
    };
    const showRing = (el) => {
        if (/(^|\s)focus:ring-4(\s|$)/.test(el.className))
            el.classList.add("ft-kb-pending-ring");
    };
    const hideRing = (el) => { el.classList.remove("ft-kb-pending-ring"); };
    /* 見えない入力欄。**画面の上のほう**（見出しの下あたり）に置く。キーボードの高さによらず、いつもキーボードより上 */
    const makeProxy = (el) => {
        const isTA = el.tagName === "TEXTAREA";
        const p = document.createElement(isTA ? "textarea" : "input");
        if (!isTA) {
            try {
                p.type = (el.type || "text").toLowerCase() === "password" ? "password" : (el.type || "text");
            }
            catch (e) { }
        }
        ["inputmode", "enterkeyhint", "autocapitalize", "autocorrect", "autocomplete", "spellcheck", "lang", "dir"].forEach((a) => {
            const v = el.getAttribute(a);
            if (v != null)
                p.setAttribute(a, v);
        });
        p.setAttribute("aria-hidden", "true");
        p.setAttribute("data-ft-kb-proxy", "");
        p.tabIndex = -1;
        Object.assign(p.style, { position: "fixed", left: "0", top: Math.round(safeTop() + 64) + "px", width: "100%", height: "40px",
            margin: "0", padding: "0", border: "0", fontSize: "16px", background: "transparent", color: "transparent",
            caretColor: "transparent", outline: "none", boxShadow: "none", pointerEvents: "none", resize: "none", zIndex: "-1" });
        document.body.appendChild(p);
        return p;
    };
    /* 打ちかけの文字を、決めた位置（at）へ差しこむ（2.13.0〜。それまでは末尾へ足すだけだった） */
    const insertTextAt = (el, v, at) => {
        try {
            const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
            const set = Object.getOwnPropertyDescriptor(proto, "value").set;
            const cur = el.value || "";
            set.call(el, cur.slice(0, at) + v + cur.slice(at));
            el.dispatchEvent(new Event("input", { bubbles: true }));
        }
        catch (e) { }
    };
    /* ---- 押したところにカーソルを置く（2.13.0〜） ----
       2.12.0 までは、まだ入っていない欄を押すと、カーソルはいつも「文字の最後」に置かれていた
       （見えない入力欄を経由するので、どこを押したかを iPhone が知らないため）。
       文の途中を直そうとして押しても最後へ飛ぶ ──「カーソルの位置が変にずれる」の正体。
       そこで、押した瞬間（touchend）に、同じ字形・同じ幅の見えない写し（mirror）を作って、
       押した点がどの文字のあいだかを数える。写しは測ったらすぐ消す。
       ・測れなかったとき・中身が空のときは null（これまでどおり最後へ置く）
       ・lineBottom は「押した行の下端」（欄の上端から）。持ち上げは、欄の下端ではなくこの行を
         キーボードの上へ出す（背の高い欄の上のほうを押したとき、押した行が上へ消えないように）。
         最後の行を押したときは、欄の下端と同じになる（これまでと同じ動き） */
    const MIRROR_PROPS = ["direction", "borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth", "borderStyle",
        "paddingTop", "paddingRight", "paddingBottom", "paddingLeft", "fontStyle", "fontVariant", "fontWeight", "fontStretch",
        "fontSize", "lineHeight", "fontFamily", "fontFeatureSettings", "fontKerning", "textAlign", "textTransform", "textIndent",
        "letterSpacing", "wordSpacing", "tabSize", "wordBreak", "overflowWrap", "lineBreak"];
    const caretAt = (el, cx, cy) => {
        let m = null;
        try {
            const v = el.value || "";
            const n = v.length;
            if (!n || !el.isConnected)
                return null;
            const r = el.getBoundingClientRect();
            const cs = getComputedStyle(el);
            const isTA = el.tagName === "TEXTAREA";
            m = document.createElement("div");
            MIRROR_PROPS.forEach((k) => { try {
                m.style[k] = cs[k];
            }
            catch (e) { } });
            Object.assign(m.style, { position: "fixed", left: "0px", top: "0px", width: (el.offsetWidth || r.width) + "px", height: "auto",
                boxSizing: "border-box", margin: "0", overflow: "hidden", visibility: "hidden", pointerEvents: "none", zIndex: "-1",
                transform: "none", whiteSpace: isTA ? "pre-wrap" : "pre" });
            const tn = document.createTextNode(v);
            m.appendChild(tn);
            document.body.appendChild(m);
            const mr = m.getBoundingClientRect();
            const lx = cx - r.left + (el.scrollLeft || 0);
            const ly = cy - r.top + (el.scrollTop || 0);
            const lh = parseFloat(cs.lineHeight) || (parseFloat(cs.fontSize) || 16) * 1.5;
            const rg = document.createRange();
            const box = (i) => {
                if (v[i] === "\n")
                    return null;
                rg.setStart(tn, i);
                rg.setEnd(tn, i + 1);
                const b = rg.getClientRects()[0];
                return b && (b.width || b.height) ? b : null;
            };
            const mid = (b) => (b.top + b.bottom) / 2 - mr.top;
            /* 改行でない文字の位置だけを並べ、押した行（またはその次の行）の最初の文字を二分探索で探す */
            const idx = [];
            for (let i = 0; i < n; i++)
                if (v[i] !== "\n")
                    idx.push(i);
            let lo = 0, hi = idx.length;
            while (lo < hi) {
                const k = (lo + hi) >> 1;
                const b = box(idx[k]);
                if (b && mid(b) + lh / 2 > ly)
                    hi = k;
                else
                    lo = k + 1;
            }
            const scrollY0 = el.scrollTop || 0;
            const padB = (parseFloat(cs.paddingBottom) || 0) + (parseFloat(cs.borderBottomWidth) || 0);
            if (lo >= idx.length)
                return { pos: n, lineBottom: null, padB };
            const j = idx[lo];
            const bj = box(j);
            if (!bj)
                return null;
            const cj = mid(bj);
            /* 押したのが空の行（改行だけの行）のとき：その行の頭へ */
            let q = 0;
            while (j - q - 1 >= 0 && v[j - q - 1] === "\n")
                q++;
            const up = Math.max(0, Math.min(q, Math.round((cj - ly) / lh)));
            if (up > 0)
                return { pos: j - up, lineBottom: cj - up * lh + lh / 2 - scrollY0, padB };
            /* 同じ行の中で、押した点より右に中心がある最初の文字の前 */
            let pos = n;
            for (let i = j; i < n; i++) {
                if (v[i] === "\n") {
                    pos = i;
                    break;
                }
                const b = box(i);
                if (!b)
                    continue;
                if (Math.abs(mid(b) - cj) > lh / 2) {
                    pos = i;
                    break;
                }
                if (lx < (b.left + b.right) / 2 - mr.left) {
                    pos = i;
                    break;
                }
            }
            return { pos, lineBottom: cj + lh / 2 - scrollY0, padB };
        }
        catch (e) {
            return null;
        }
        finally {
            if (m && m.parentNode)
                m.parentNode.removeChild(m);
        }
    };
    /* 押した欄の下端（持ち上げの目安）。押した行がわかっていれば、その行まで（caretAt の説明） */
    const fieldBottom = (p) => {
        const r = p.el.getBoundingClientRect();
        const c = p.caret;
        if (!c || c.lineBottom == null)
            return r.bottom;
        return Math.min(r.bottom, r.top + c.lineBottom + c.padB);
    };
    /* ---- 左端の帯（data-ft-edge、左端スワイプで戻る）の下にある入力欄（2.13.0〜） ----
       全画面の左端 36px には、スワイプで戻るための透明な帯が、入力欄の上に重なっている。
       入力欄の左はし（行の頭）を押すと、指は帯に当たる。帯のままにしておくと、
       ・まだ入っていない欄：見えない入力欄の流れ（下の faEnd）を通らず、端末が欄へじかにフォーカスする
         （＝ iPhone が画面ぜんたいを押し上げる、いちばん避けたい形）か、何も起きない
       ・打っている欄：行の頭にカーソルを置けない
       そこで、帯の上のタップは、その下にある入力欄のタップとして扱う。払う操作（戻る）は今までどおり帯のもの */
    const EDGE_SEL = "[data-ft-edge]";
    const fieldUnder = (t, x, y) => {
        if (!t || !t.closest)
            return null;
        const direct = t.closest("input, textarea");
        if (direct)
            return direct;
        if (!t.closest(EDGE_SEL) || !document.elementsFromPoint)
            return null;
        const list = document.elementsFromPoint(x, y);
        for (let i = 0; i < list.length; i++) {
            const nd = list[i];
            if (nd.closest && nd.closest(EDGE_SEL))
                continue;
            return nd.closest ? nd.closest("input, textarea") : null;
        }
        return null;
    };
    /* ---- 紙：紙の箱を transform で上げ下げ ---- */
    const liftedBoxes = new Set();
    const setSheetY = (box, y, ms, ease) => {
        y = Math.max(0, Math.round(y || 0));
        if (y === (box.__ftLiftY || 0))
            return;
        box.__ftLiftY = y;
        clearTimeout(box.__ftLiftT);
        box.style.transition = (ms && motionOn()) ? `transform ${ms}ms ${ease}` : "none";
        box.style.transform = y ? `translateY(${-y}px)` : "";
        if (y)
            liftedBoxes.add(box);
        else
            liftedBoxes.delete(box);
        box.__ftLiftT = setTimeout(() => { box.style.transition = ""; }, (ms || 0) + 40);
    };
    const sheetCap = (box) => {
        const natTop = box.getBoundingClientRect().top + (box.__ftLiftY || 0);
        return Math.max(0, natTop - safeTop() - 8);
    };
    const lowerSheets = () => { [...liftedBoxes].forEach((b) => { if (b.isConnected)
        setSheetY(b, 0, KB_DOWN_MS, KB_EASE_DOWN);
    else
        liftedBoxes.delete(b); }); };
    /* ---- 全画面：送り場の中身（子）を transform で上げ、終わったら scrollTop へ置きかえる ---- */
    const startScrollerLift = (sc, y) => {
        const max = sc.scrollHeight - sc.clientHeight - sc.scrollTop;
        y = Math.max(0, Math.min(Math.round(y), max));
        if (y < 1)
            return 0;
        if (!motionOn()) {
            sc.scrollTop += y;
            return 0;
        }
        const kids = [...sc.children];
        sc.__ftLift = { y, kids: kids.map((k) => [k, k.style.transform, k.style.transition]) };
        kids.forEach((k) => { k.style.transition = "none"; k.style.transform = "translateY(0px)"; });
        void sc.offsetHeight;
        kids.forEach((k) => { k.style.transition = `transform ${KB_UP_MS}ms ${KB_EASE_UP}`; k.style.transform = `translateY(${-y}px)`; });
        return y;
    };
    const endScrollerLift = (sc) => {
        const L = sc && sc.__ftLift;
        if (!L)
            return;
        sc.__ftLift = null;
        L.kids.forEach(([k, t]) => { k.style.transition = "none"; k.style.transform = t; });
        sc.scrollTop += L.y;
        void sc.offsetHeight;
        L.kids.forEach(([k, , tr]) => { k.style.transition = tr; });
    };
    /* ---- ページそのもの（下タブの画面など）：同じ曲線でページを送る ---- */
    let pageAnim = 0;
    const scrollPageBy = (dy, ms) => {
        cancelAnimationFrame(pageAnim);
        const from = window.scrollY || document.documentElement.scrollTop || 0;
        const max = Math.max(0, document.documentElement.scrollHeight - layoutHeight());
        const to = Math.max(0, Math.min(max, from + dy));
        if (Math.abs(to - from) < 1)
            return;
        if (!ms || !motionOn()) {
            window.scrollTo(0, to);
            return;
        }
        const t0 = performance.now();
        const ease = (t) => 1 - Math.pow(1 - t, 4);
        const step = (now) => {
            const t = Math.min(1, (now - t0) / ms);
            window.scrollTo(0, Math.round(from + (to - from) * ease(t)));
            if (t < 1)
                pageAnim = requestAnimationFrame(step);
        };
        pageAnim = requestAnimationFrame(step);
    };
    /* ---- 紙（シート・小窓）は、中身を払っても動かさない（2.16.7〜。2.17.2 で作り直し） ----
       iOS は、紙の中に送れる余地が無くても、指の動きでページ（見える窓）を送ってしまう。
       その送りが紙ごと画面をずらし、うしろの一覧まで動いて見えていた（useLockBackground が
       引き戻すので、揺れて戻る動きにもなる）。**紙は、置いた場所から動かさない。**
       ・紙の中で**実際に送れる箱**（タグの一覧・アイコンの一覧・横に並ぶ絵など）は、
         その向きに送れる余地があるうちは、これまでどおり送らせる（送りの邪魔をしない）
       ・それ以外の指の動きは touchmove で止める（preventDefault）
       ・**入力欄の上の指の動きも止める（2.17.2〜）。** 2.17.1 までは「カーソルを動かすため」に
         素通ししていたが、そのせいで欄の字を上へ払うと紙ごと動いていた。
         ただし**中を送れる textarea だけは送らせる**（下の canScroll）。
         カーソルは、置きたいところを軽く叩けば動く（払う操作では動かさない）
       ・**passive: false の touchmove を、いつも付けておかないこと。** アプリぜんたいの送りが重くなる。
         指が紙の上に降りた瞬間（touchstart）に付け、離したら外す。touchstart は touchmove より先に
         届くので、これで間に合う
       ・全画面（記録の入力）には使わない。欄が伸び、ほかの欄を見ながら書くので、送れるままにしてある */
    let tg = null;
    let tgMoveOn = false;
    const canScroll = (n, dx, dy) => {
        /* textarea は「中を送れるときだけ」送らせる。字を選ぶための払いでは紙を動かさない */
        if (n.tagName === "TEXTAREA") {
            if (Math.abs(dy) < Math.abs(dx) || n.scrollHeight <= n.clientHeight + 1)
                return false;
            return dy > 0 ? n.scrollTop > 0 : n.scrollTop + n.clientHeight < n.scrollHeight - 1;
        }
        const cs = getComputedStyle(n);
        if (Math.abs(dy) >= Math.abs(dx)) {
            if (!/(auto|scroll)/.test(cs.overflowY) || n.scrollHeight <= n.clientHeight + 1)
                return false;
            return dy > 0 ? n.scrollTop > 0 : n.scrollTop + n.clientHeight < n.scrollHeight - 1;
        }
        if (!/(auto|scroll)/.test(cs.overflowX) || n.scrollWidth <= n.clientWidth + 1)
            return false;
        return dx > 0 ? n.scrollLeft > 0 : n.scrollLeft + n.clientWidth < n.scrollWidth - 1;
    };
    const tgMove = (e) => {
        if (!tg || !e.touches || !e.touches[0])
            return;
        /* **止められないとき（e.cancelable が false）も、引き戻しは行うこと。**
           送りがもう始まってしまった指は preventDefault が効かない。そこで抜けると、
           押さえているあいだ画面が持ち上がったままになる */
        if (!e.cancelable) {
            tgPin();
            return;
        }
        const p = e.touches[0];
        const dx = p.clientX - tg.x, dy = p.clientY - tg.y;
        tg.x = p.clientX;
        tg.y = p.clientY;
        if (!dx && !dy)
            return;
        const t = tg.t;
        const wrap = tg.wrap;
        /* 紙の外で始まった指（紙が閉じた直後など）は止めない */
        if (!wrap || !wrap.isConnected)
            return;
        /* **字を打つところから始まった指は、送り場をさかのぼらずに、その場で止めること（2.17.3〜）。**
           2.17.3 の最初の直しでは、入力欄の親（.ft-sheet-body＝overflow-y-auto）まで見に行き、
           そこに送る余地があると素通ししていた。iOS はキーボードが出ているあいだ、入力欄の上の指を
           「ページを送る指」として扱うので、素通しした瞬間にページごと持ち上がっていた
           （計画名・フォルダ名の欄から画面が持ち上がる件）。
           1行の入力欄（input）は中を縦に送る必要がないので、つねに止める。
           textarea だけは、**自分の中に送る余地があるときだけ**送らせる */
        const field = tg.field;
        if (field && !(field.tagName === "TEXTAREA" && canScroll(field, dx, dy))) {
            e.preventDefault();
            tgPin();
            return;
        }
        for (let n = t; n && n.nodeType === 1 && n !== wrap && n !== document.body && n !== root; n = n.parentElement) {
            if (canScroll(n, dx, dy))
                return;
        }
        e.preventDefault();
        tgPin();
    };
    /* 止めきれずに送られてしまったぶんを、その場で引き戻す（2.17.3〜）。
       **useLockBackground の引き戻し（scroll を聞いてから戻す）だけに任せないこと。**
       指を置いたまま送っているあいだ、iOS は scroll のあとの scrollTo をすぐ打ち消すので、
       押さえている間じゅう画面が持ち上がったままに見える。ここで touchmove のたびに戻す。
       ・紙の外わく自身が送られることもある（overflow: clip が使えない端末）ので、そこも 0 へ */
    const tgPin = () => { if (tg) tgPinOf(tg); };
    const tgPinOf = (g) => {
        const w = g.wrap;
        if (w && (w.scrollTop || w.scrollLeft)) {
            w.scrollTop = 0;
            w.scrollLeft = 0;
        }
        /* **紙の外がわの送り場も戻すこと（2.17.3〜）。**
           紙は見た目こそ画面いっぱいの fixed だが、**DOM ではその紙を開いた画面の子孫**。
           iOS は入力欄から送る箱を探すとき DOM をさかのぼるので、紙を通り越して
           うしろの画面の送り場（.flex-1.overflow-y-auto）やページまで動かしてしまう。
           指を置いた時点の位置を覚えておき、動いていたら戻す */
        const outs = g.outs;
        for (let i = 0; i < outs.length; i++) {
            const o = outs[i];
            if (o[0].scrollTop !== o[1])
                o[0].scrollTop = o[1];
            if (o[0].scrollLeft !== o[2])
                o[0].scrollLeft = o[2];
        }
        const y = window.scrollY || document.documentElement.scrollTop || 0;
        if (Math.abs(y - g.sy) > 1)
            window.scrollTo(0, g.sy);
    };
    /* 紙の外がわにある「動きうる箱」と、そのときの位置を控える。
       **数は多くない**（紙を開いた画面の送り場くらい）ので、指が降りるたびに数えてよい */
    const tgOuters = (wrap) => {
        const out = [];
        for (let n = wrap.parentElement; n && n.nodeType === 1 && n !== document.body && n !== root; n = n.parentElement) {
            if (n.scrollHeight > n.clientHeight + 1 || n.scrollWidth > n.clientWidth + 1)
                out.push([n, n.scrollTop, n.scrollLeft]);
        }
        return out;
    };
    const tgMoveBind = (on) => {
        if (on === tgMoveOn)
            return;
        tgMoveOn = on;
        if (on)
            document.addEventListener("touchmove", tgMove, { passive: false, capture: true });
        else
            document.removeEventListener("touchmove", tgMove, { capture: true });
    };
    const tgStart = (e) => {
        const p = e.touches && e.touches[0];
        const t = p && e.touches.length === 1 ? e.target : null;
        const wrap = t && t.closest ? t.closest(".ft-sheet-wrap") : null;
        /* **指が2本以上のときは見張らないこと。** 写真をつまんで大きさを変える操作を殺してしまう */
        tg = wrap ? {
            x: p.clientX, y: p.clientY, t, wrap,
            /* 字を打つところ（計画名・フォルダ名・さがす欄など）から始まった指か */
            field: t.closest("input, textarea, [contenteditable='true']"),
            /* 指を置いた時点の送り位置。ここへ引き戻す */
            sy: window.scrollY || document.documentElement.scrollTop || 0,
            outs: tgOuters(wrap),
        } : null;
        tgMoveBind(!!tg);
    };
    /* 指を離したあとも、惰性で送られることがある。数こま見張って引き戻す（2.17.3〜） */
    const tgEnd = () => {
        const g = tg;
        tgPin();
        tgMoveBind(false);
        if (g) {
            let left = 8;
            const again = () => {
                tgPinOf(g);
                if (--left > 0)
                    requestAnimationFrame(again);
            };
            requestAnimationFrame(again);
        }
        tg = null;
    };
    document.addEventListener("touchstart", tgStart, { passive: true, capture: true });
    document.addEventListener("touchend", tgEnd, { passive: true, capture: true });
    document.addEventListener("touchcancel", tgEnd, { passive: true, capture: true });
    /* ---- こちらでフォーカスを入れる ---- */
    let pending = null;
    /* 本物の入力欄へフォーカスを移す（キーボードは出たまま）。打ちかけの文字も移す。
       2.10.1〜 は、持ち上げの途中（残りが KB_EARLY_PX 以下）でも呼ぶ。そのときは pending を残したまま
       （onFocusIn・adjustFor が、持ち上げの途中で割りこまないように）、終わりの片づけは finishPending が行う */
    const focusRealNow = (p) => {
        if (p.focused)
            return;
        p.focused = true;
        const ours = document.activeElement === p.proxy;
        const v = p.proxy.value;
        if (ours && p.el.isConnected) {
            try {
                p.el.focus({ preventScroll: true });
            }
            catch (e) {
                p.el.focus();
            }
            /* 押したところ（p.caret）があればそこへ、無ければこれまでどおり文字の最後へ（2.13.0〜） */
            const len0 = (p.el.value || "").length;
            const at = p.caret ? Math.max(0, Math.min(p.caret.pos, len0)) : len0;
            if (v)
                insertTextAt(p.el, v, at);
            try {
                const n = at + (v ? v.length : 0);
                p.el.setSelectionRange(n, n);
            }
            catch (e) { }
        }
        hideRing(p.el);
        if (p.proxy.parentNode)
            p.proxy.parentNode.removeChild(p.proxy);
    };
    const finishPending = (focusReal) => {
        const p = pending;
        pending = null;
        if (!p)
            return;
        clearTimeout(p.timer);
        clearTimeout(p.fallback);
        clearTimeout(p.early);
        clearTimeout(p.earlyFocus);
        const early = p.focused;
        endScrollerLift(p.sc);
        if (focusReal)
            focusRealNow(p);
        else if (!p.focused) {
            hideRing(p.el);
            if (p.proxy.parentNode)
                p.proxy.parentNode.removeChild(p.proxy);
        }
        /* 見込みの高さで足していた余地などを、実際のキーボードに合わせ直す */
        if (focusReal) {
            measure();
            /* 途中でフォーカスを移したときは、そのときの focusin を見送っている（pending が残っていたため）。
               ここで、focusin と同じ合わせ直しを済ませる */
            if (early && document.activeElement === p.el)
                afterFocus(p.el);
        }
    };
    /* キーボードが出たら（または待ちきれなくなったら）、押した欄をキーボードの上へゆっくり持ち上げる。
       fromFallback：true ＝知らせを待ちきれなかった／"early" ＝覚えている高さで先に動き出す（2.10.1〜） */
    const startSlide = (fromFallback) => {
        const p = pending;
        if (!p || p.started)
            return;
        const kbOut = rawKb() >= 60 || layoutShrunk();
        /* 押した欄が、見込みのキーボードの上端より上に収まっているか */
        const fitsNow = () => p.el.isConnected && Math.ceil(fieldBottom(p) + GAP - kbTopNow()) <= 0;
        /* 覚えている高さで先に動き出すのは、持ち上げが要るときだけ（2.10.1〜）。
           持ち上げの要らない欄は、これまでどおりキーボードの出た知らせを待ってからフォーカスする */
        if (fromFallback === "early" && !kbOut && fitsNow())
            return;
        /* キーボードの出た知らせがまだ来ていない。いちど待ち足す。それでも来なければ、画面のキーボードが
           出ない端末（外付けキーボードの iPad など）とみなし、持ち上げずに本物へ移す（2.16.7〜）。
           **欄が見込みのキーボードより上に収まっているときは、待ち足さない（2.10.1〜）。**
           どちらにしても持ち上げずに本物へ移すだけなので、待つ意味がない */
        let noKb = false;
        if (fromFallback === true && !kbOut) {
            const fits = fitsNow();
            if (!fits && !p.waited) {
                p.waited = true;
                p.fallback = setTimeout(() => startSlide(true), KB_FALLBACK2_MS);
                return;
            }
            noKb = !fits;
        }
        const wait = KB_WAIT_MS - (Date.now() - p.at);
        if (wait > 0) {
            clearTimeout(p.timer);
            p.timer = setTimeout(() => startSlide(fromFallback), wait);
            return;
        }
        p.started = true;
        clearTimeout(p.fallback);
        clearTimeout(p.early);
        const el = p.el;
        if (!el.isConnected) {
            finishPending(false);
            return;
        }
        if (rawKb() >= 60)
            rememberKb(rawKb());
        if (p.ctx === "overlay" && rawKb() >= 60)
            setFix(true);
        const need = noKb ? 0 : Math.ceil(fieldBottom(p) + GAP - kbTopNow());
        let moved = false;
        /* 実際に動かす量（残りの px から、途中でフォーカスする時点を決める）。ページでは使わない */
        let dist = 0;
        if (need > 0) {
            if (p.ctx === "sheet") {
                const box = sheetBoxOf(el);
                if (box) {
                    const cur = box.__ftLiftY || 0;
                    const target = Math.min(sheetCap(box), cur + need);
                    const rem = need - (target - cur);
                    if (rem > 0) {
                        /* 背の高い紙で上がりきらないぶんは、紙の中の送り場を送る */
                        const isc = scrollerOf(el, box);
                        if (isc)
                            isc.scrollTop += Math.min(rem, isc.scrollHeight - isc.clientHeight - isc.scrollTop);
                    }
                    setSheetY(box, target, KB_UP_MS, KB_EASE_UP);
                    moved = target !== cur;
                    dist = Math.max(0, target - cur);
                }
            }
            else if (p.ctx === "overlay") {
                const sc = scrollerOf(el, el.closest("[data-ft-overlay]"));
                const y = sc ? startScrollerLift(sc, need) : 0;
                if (y) {
                    p.sc = sc;
                    moved = true;
                    dist = y;
                }
            }
            else {
                scrollPageBy(need, KB_UP_MS);
                moved = true;
            }
        }
        const anim = moved && motionOn();
        p.timer = setTimeout(() => finishPending(true), anim ? KB_UP_MS + 20 : 0);
        /* 持ち上げの見えない残りを待たずに、本物へフォーカスを移す（2.10.1〜。紙と全画面だけ）。
           フォーカスの時点で残りは KB_EARLY_PX 以下＝欄の下端はキーボードの上端より (GAP − 残り) px 上にある。
           +20ms は、transition が次のこまから動き出すぶん */
        if (anim && dist > 0 && KB_EARLY_PX > 0 && (p.ctx === "sheet" || p.ctx === "overlay")) {
            const at = dist <= KB_EARLY_PX ? 0 : Math.ceil(KB_UP_MS * easeUpTimeAt(1 - KB_EARLY_PX / dist));
            if (at + 20 < KB_UP_MS + 20)
                p.earlyFocus = setTimeout(() => { if (pending === p && !p.focused)
                    focusRealNow(p); }, at + 20);
        }
    };
    let fa = null;
    const faStart = (e) => {
        const p = e.touches && e.touches[0];
        if (!p || e.touches.length > 1) {
            fa = null;
            return;
        }
        const t = e.target;
        const el = fieldUnder(t, p.clientX, p.clientY);
        if (!el || !isTyping(el) || isProxy(el)) {
            fa = null;
            return;
        }
        /* 左端の帯の上から押したか（fieldUnder の説明）。打っている欄でも、帯の上ならこちらでカーソルを動かす */
        const viaEdge = !(t.closest && t.closest("input, textarea"));
        const already = document.activeElement === el;
        fa = (!already || viaEdge) ? { x: p.clientX, y: p.clientY, at: Date.now(), el, moved: false, already } : null;
    };
    const faMove = (e) => {
        const p = e.touches && e.touches[0];
        if (fa && p && Math.hypot(p.clientX - fa.x, p.clientY - fa.y) > 10)
            fa.moved = true;
    };
    const faEnd = (e) => {
        const s0 = fa;
        fa = null;
        if (!s0 || s0.moved || Date.now() - s0.at > 600 || (e.touches && e.touches.length))
            return;
        const el = s0.el;
        const pt = (e.changedTouches && e.changedTouches[0]) || { clientX: s0.x, clientY: s0.y };
        if (s0.already) {
            /* 打っている欄の左はし（帯の上）を押した：カーソルだけを、押したところへ */
            if (!el.isConnected || document.activeElement !== el || !coarse())
                return;
            e.preventDefault();
            const c = caretAt(el, pt.clientX, pt.clientY);
            if (c) {
                try {
                    el.setSelectionRange(c.pos, c.pos);
                }
                catch (err) { }
            }
            return;
        }
        if (!el.isConnected || !isTyping(el) || document.activeElement === el || !coarse())
            return;
        e.preventDefault();
        /* 押したところを、欄が動きだす前に測っておく（caretAt の説明） */
        const caret = caretAt(el, pt.clientX, pt.clientY);
        if (pending)
            finishPending(false);
        const c = ctxOf(el);
        setCtx(c);
        /* 送れる余地を先に足す（見た目は動かない）。持ち上げるときに送る先になる */
        if (c !== "sheet")
            setReserve(Math.max(shown > 0 ? shown : 0, guessKb()));
        const proxy = makeProxy(el);
        showRing(el);
        try {
            proxy.focus({ preventScroll: true });
        }
        catch (err) {
            proxy.focus();
        }
        pending = { el, proxy, ctx: c, sc: null, caret, at: Date.now(), started: false, focused: false, timer: 0, fallback: 0, early: 0, earlyFocus: 0 };
        /* キーボードがもう出ている（別の欄から移ってきた）ときは、すぐ持ち上げへ */
        if (rawKb() >= 60)
            startSlide();
        else {
            pending.fallback = setTimeout(() => startSlide(true), KB_FALLBACK_MS);
            /* この向きのキーボードの高さを覚えていれば、知らせを待たずに KB_WAIT_MS で持ち上げはじめる（2.10.1〜）。
               キーボードがせり上がるのと、欄の持ち上げが並んで進む。見込みと違えば、終わったあと adjustFor が合わせる。
               ページ（探す など）は、これまでどおり知らせを待つ */
            if (c !== "page" && kbKnown())
                pending.early = setTimeout(() => startSlide("early"), KB_WAIT_MS);
        }
    };
    /* ---- キーボードの ^ v で移ったとき・見込みと違ったとき：隠れているぶんだけ合わせる ---- */
    const adjustFor = (el) => {
        if (!el || !isTyping(el) || isProxy(el) || pending)
            return;
        if (rawKb() < 60 && !layoutShrunk())
            return;
        const c = ctxOf(el);
        /* 全画面の textarea は iOS にまかせる（送り場はキーボードの上端で終わっている） */
        if (c === "overlay" && el.tagName === "TEXTAREA")
            return;
        const need = Math.ceil(el.getBoundingClientRect().bottom + GAP - (vv.height + (vv.offsetTop || 0)));
        if (c === "sheet") {
            const box = sheetBoxOf(el);
            if (!box || Math.abs(need) < 2)
                return;
            const cur = box.__ftLiftY || 0;
            setSheetY(box, Math.max(0, Math.min(sheetCap(box), cur + need)), KB_UP_MS, KB_EASE_UP);
            return;
        }
        if (need <= 1)
            return;
        if (c === "overlay") {
            const sc = scrollerOf(el, el.closest("[data-ft-overlay]"));
            if (sc)
                sc.scrollTop += need;
        }
        else
            scrollPageBy(need, KB_UP_MS);
    };
    let baseH = 0;
    /* 最後に合わせたキーボードの高さ。**高さが変わったときだけ**合わせ直す（2.16.7〜）。
       見える窓が指で動いただけ（visualViewport の scroll）で合わせ直すと、紙が指について動いて崩れた */
    let lastRaw = -1;
    const layoutShrunk = () => baseH > 0 && layoutHeight() < baseH - 60;
    let settle = 0;
    const onFocusIn = (e) => {
        const t = e.target;
        if (isProxy(t) || !isTyping(t) || !coarse())
            return;
        if (pending && t === pending.el)
            return;
        if (pending)
            finishPending(false);
        afterFocus(t);
    };
    /* 入力欄にフォーカスが入ったあとの合わせ直し（onFocusIn と、途中でフォーカスを移したときの finishPending から） */
    const afterFocus = (t) => {
        setCtx(ctxOf(t));
        if (ctx !== "sheet" && shown <= 0)
            setReserve(guessKb());
        adjustFor(t);
        clearTimeout(settle);
        settle = setTimeout(() => {
            if (rawKb() < 60 && !layoutShrunk() && !pending) {
                setReserve(0);
                setFix(false);
                lowerSheets();
            }
        }, 1500);
    };
    const measure = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
            const lh = layoutHeight();
            const raw = Math.round(lh - vv.height);
            const a = document.activeElement;
            const typing = isTyping(a);
            if (!typing && raw < 60)
                baseH = lh;
            if (pending) {
                /* キーボードが出た知らせ。持ち上げはここから（KB_WAIT_MS より前なら、そこまで待つ） */
                if (raw >= 60 && pending.ctx !== "sheet")
                    setReserve(raw);
                if (raw >= 60 || layoutShrunk())
                    startSlide();
                return;
            }
            if (typing && raw >= 60) {
                rememberKb(raw);
                if (ctx !== "sheet")
                    setReserve(raw);
                if (ctx === "overlay")
                    setFix(true);
                if (Math.abs(raw - lastRaw) >= 4) {
                    lastRaw = raw;
                    adjustFor(a);
                }
                return;
            }
            if (typing) {
                if (layoutShrunk() && Math.abs(lh - lastRaw) >= 4) {
                    lastRaw = lh;
                    adjustFor(a);
                }
                return;
            }
            lastRaw = -1;
            lowerSheets();
            if (raw >= 60)
                return; /* キーボードが引っ込む途中。全画面・ページは引っ込みきるまで今のまま */
            setFix(false);
            setReserve(0);
            setCtx("");
            if (overlayCount > 0) {
                const y = window.scrollY || document.documentElement.scrollTop || 0;
                if (Math.abs(y - overlayLockY) > 1)
                    window.scrollTo(0, overlayLockY);
            }
        });
    };
    /* 入力欄から外れたら（ほかの入力欄へ移ったのでなければ）、紙はキーボードといっしょに下ろしはじめる */
    const onFocusOut = () => {
        setTimeout(() => {
            const a = document.activeElement;
            if (isTyping(a))
                return;
            if (pending)
                finishPending(false);
            clearTimeout(settle);
            lowerSheets();
            measure();
        }, 0);
    };
    /* 紙の入力欄から始まったタップの click を、入力欄の外へ流さない（2.13.1〜）。
       iPhone は入力欄へ入れる（mousedown）→ mouseup → click の順に配り、あとの2つは
       その時点の位置で当たり直す。focusin で紙を持ち上げると、同じタップの click が
       暗がりや紙の外わくに当たり、紙が閉じてしまう。
       「入力欄で押し始めたのに、入力欄の外で click になった」ものだけを、紙の中で止める。
       暗がりで押し始めたタップ（ふつうに閉じる操作）は止めない */
    let downEl = null;
    let downAt = 0;
    /* 押し始めたとき、紙の中で打っている最中だったか（その入力欄） */
    let downTyping = null;
    let downAt2 = 0;
    const noteDown = (e) => {
        const t = e.target;
        const a = document.activeElement;
        /* touchstart と pointerdown の両方で呼ばれる。2回めで上書きしない（2回めの時点では外れていることがある） */
        if (e.type === "pointerdown" && downTyping && Date.now() - downAt2 < 80)
            return noteDownEl(e);
        downTyping = (coarse() && isTyping(a) && a.closest(".ft-sheet-wrap")) ? a : null;
        downAt2 = Date.now();
        noteDownEl(e);
    };
    const noteDownEl = (e) => {
        const t = e.target;
        const el = t && t.closest ? t.closest("input, textarea, [contenteditable]") : null;
        /* 2.17.0 から全画面の入力欄も数える。focusin で送り場の箱が縮み、中が送られると、
           同じタップの click が「いま指の下にある別のボタン」へ届くことがあるため */
        if (isTyping(el)) {
            downEl = el;
            downAt = Date.now();
        }
        else {
            downEl = null;
        }
    };
    /* 打っている最中に暗がりを押したら、まずキーボードだけを閉じる（2.15.0〜）。
       紙まで閉じると、打ちかけの文字が消える。もう一度押せば、いつもどおり紙が閉じる。
       紙の中のボタン（✕・キャンセル・保存）はそのまま効く */
    const scrimTap = (e) => {
        const a = downTyping;
        downTyping = null;
        /* 押し始めた時点で打っていたかで決める。端末によっては、暗がりに触れた時点（mousedown）で
           入力欄から外れ、click のときにはもう打っていない */
        if (!a || !a.isConnected || Date.now() - downAt2 > 1500)
            return false;
        const wrap = a.closest(".ft-sheet-wrap");
        const t = e.target;
        if (!wrap || !t || !wrap.contains(t))
            return false;
        let box = a;
        while (box && box.parentElement !== wrap)
            box = box.parentElement;
        if (!box || box.contains(t))
            return false;
        e.stopPropagation();
        e.preventDefault();
        if (document.activeElement === a)
            a.blur();
        return true;
    };
    const guardClick = (e) => {
        if (scrimTap(e))
            return;
        const d = downEl;
        if (!d)
            return;
        downEl = null;
        if (Date.now() - downAt > 1500)
            return;
        const t = e.target;
        if (t === d || (t && d.contains && d.contains(t)))
            return;
        if (!t || !t.closest || !t.closest(".ft-sheet-wrap, [data-ft-overlay]"))
            return;
        e.stopPropagation();
        e.preventDefault();
    };
    /* ---- キーボードを引っ込める操作（2.16.0〜） ---- */
    /* 1行の入力欄（input）。textarea の Enter は改行なので数えない */
    const isLineInput = (el) => !!el && el.tagName === "INPUT" && !el.readOnly && !el.disabled
        && !NO_KB_TYPES[(el.type || "text").toLowerCase()];
    /* 日本語入力の「変換を確定する Enter」か。
       Safari は確定の Enter を compositionend のあとに keyCode 229・isComposing=false で送ってくるので、
       isComposing だけでは見分けられない。**これを通すと、変換を確定しただけで決定・キーボードが閉じる** */
    let compEndAt = 0;
    const imeEnter = (e) => e.isComposing || e.keyCode === 229 || Date.now() - compEndAt < 80;
    const onKeyDown = (e) => {
        if (e.key !== "Enter" && e.keyCode !== 13)
            return;
        const t = e.target;
        if (!isLineInput(t))
            return;
        if (imeEnter(e)) {
            /* 確定の Enter は、各画面の onKeyDown（名前の決定・タグを作る・合言葉でひらく）へ届けない */
            e.stopPropagation();
            return;
        }
        if (e.shiftKey || e.altKey || e.metaKey || e.ctrlKey)
            return;
        /* 各画面の Enter の役目（決定・作る・検索する）を先にすませてから外す。
           capture で受けて setTimeout にしているのは、React の中で止められても必ず届くようにするため */
        setTimeout(() => { if (document.activeElement === t)
            t.blur(); }, 0);
    };
    /* 入力欄の外を「タップ」したら、キーボードを引っ込める。
       ・指で押して、ほとんど動かさずに離したものだけ。**送った（スクロールした）ときは閉じない**
       ・ボタン・リンク・ほかの入力欄など、押して何かが起きるものは除く（押したものがそのまま効く。
         キーボードも出たまま。紙の「保存」「キャンセル」「作る」など）
       ・入力欄のまわり 12px は入力欄のうちとみなす（指が少しずれても閉じない）
       ・紙の暗がりを押したときは、ここでキーボードを引っ込め、scrimTap が紙を閉じないようにする
         （1回め＝キーボードだけ、2回め＝紙を閉じる。2.15.0 のまま） */
    const KEEP_KB = "input, textarea, select, button, a, label, [contenteditable], [role='button'], [role='option'], [role='tab'], [tabindex]:not([tabindex='-1']), .ft-link";
    let tap = null;
    const onTapStart = (e) => {
        const a = document.activeElement;
        const p = e.touches && e.touches[0];
        if (!p || e.touches.length > 1 || !(isLineInput(a) || (a && a.tagName === "TEXTAREA") || (a && a.isContentEditable))) {
            tap = null;
            return;
        }
        tap = { x: p.clientX, y: p.clientY, at: Date.now(), target: e.target, active: a, moved: false };
    };
    const onTapMove = (e) => {
        const p = e.touches && e.touches[0];
        if (tap && p && Math.hypot(p.clientX - tap.x, p.clientY - tap.y) > 10)
            tap.moved = true;
    };
    const onAnyScroll = (e) => {
        if (tap)
            tap.moved = true;
        /* 紙の外わくが送られたら、すぐ 0 へ戻す（overflow: clip が使えない端末の用心。上の CSS の説明） */
        const t = e && e.target;
        if (t && t.classList && t.classList.contains("ft-sheet-wrap") && (t.scrollTop || t.scrollLeft)) {
            t.scrollTop = 0;
            t.scrollLeft = 0;
        }
    };
    const onTapEnd = () => {
        const s0 = tap;
        tap = null;
        if (!s0 || s0.moved || Date.now() - s0.at > 600)
            return;
        const a = s0.active;
        if (document.activeElement !== a)
            return;
        const t = s0.target;
        if (!t || !t.closest || t.closest(KEEP_KB))
            return;
        const r = a.getBoundingClientRect();
        if (s0.x >= r.left - 12 && s0.x <= r.right + 12 && s0.y >= r.top - 12 && s0.y <= r.bottom + 12)
            return;
        a.blur();
    };
    document.addEventListener("compositionend", () => { compEndAt = Date.now(); }, true);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("touchstart", onTapStart, { passive: true, capture: true });
    document.addEventListener("touchmove", onTapMove, { passive: true, capture: true });
    document.addEventListener("touchend", onTapEnd, { passive: true, capture: true });
    document.addEventListener("scroll", onAnyScroll, { passive: true, capture: true });
    document.addEventListener("touchstart", noteDown, { passive: true, capture: true });
    document.addEventListener("pointerdown", noteDown, { passive: true, capture: true });
    document.addEventListener("click", guardClick, true);
    /* こちらでフォーカスを入れる（2.16.2〜）。touchend だけは passive: false（preventDefault するため） */
    document.addEventListener("touchstart", faStart, { passive: true, capture: true });
    document.addEventListener("touchmove", faMove, { passive: true, capture: true });
    document.addEventListener("touchend", faEnd, { passive: false, capture: true });
    document.addEventListener("touchcancel", () => { fa = null; }, { passive: true, capture: true });
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("focusout", onFocusOut, true);
    vv.addEventListener("resize", measure);
    /* 見える窓が下へずれただけ（高さは同じ）のときも、紙の上端を合わせ直す */
    vv.addEventListener("scroll", measure);
    window.addEventListener("orientationchange", measure);
    measure();
})();

function BackgroundLock() {
  useLockBackground();
  return null;
}

/* 指やマウスで押したボタンから、押し終わったあとにフォーカスを外す（2.3.2）。
   Android の Chrome などは、押したボタンにフォーカスを残す。残ったままだと、
   フォーカス用の枠や色が「押したあともずっと付いたまま」に見える。
   ・外すのは、指・マウスで押したとき（click の detail が1以上）だけ。
     キーボードの Enter / Space で押したとき（detail が0）は外さない。外すと、キーボードで操作している人が
     いまどこにいるのか分からなくなる（キーボード用の枠は CSS の :focus-visible で出している）
   ・押した先の処理が入力欄などへフォーカスを移したときは、そちらを奪わない
     （フォーカスが「押したボタン自身」に残っているときだけ外す）
   ・入力欄・チェックボックスなどは対象外。外すとキーボードが閉じたり、選んだ手ごたえが消えたりする
   ・capture（いちばん先）で受けるのは、部品側で stopPropagation されても取りこぼさないため。
     外すのは setTimeout で、部品の処理がすべて終わったあと */
(function installTapBlur() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const SEL = 'button, [role="button"], [role="switch"], [role="tab"], a[href], summary';
  document.addEventListener("click", (e) => {
    if (!e.detail) return;
    const t = e.target;
    const el = t && t.closest ? t.closest(SEL) : null;
    if (!el) return;
    setTimeout(() => {
      if (document.activeElement === el && typeof el.blur === "function") el.blur();
    }, 0);
  }, true);
})();

/* 重なって出る画面の入れ物。出るときと戻るときの動きを受け持つ */
function OverlayScreen({ from = "right", closing, children, zIndex = 50 }) {
  useLockBackground();
  const inCls = from === "bottom" ? "anim-up" : "anim-right";
  const outCls = from === "bottom" ? "anim-down-out" : "anim-right-out";
  /* 暗がりの退場は、画面の退場と同じ長さで薄れさせる（2.10.0〜）。
     **共用の anim-fade-out（0.2秒）にしないこと。** 画面が右へ出きる前に暗がりだけ先に消える */
  const scrimOutCls = from === "bottom" ? "anim-fade-out" : "anim-scrim-out-push";
  return (
    /* data-ft-overlay ＝ 重なる画面の外わく（送り場の余白・はみ出し止めの目印）。
       data-ft-scrim ＝ 地の暗がり。左端から払って戻るとき、払った量に合わせて薄くする。外さないこと。
       data-ft-lift ＝ メニューから移ってくる途中の画面（goFromMenu が入りきったかを見る） */
    <div className="fixed inset-0" data-ft-overlay="" data-ft-lift={zIndex === MENU_LIFT_Z ? "" : undefined} style={{ zIndex }}>
      <div data-ft-scrim="" className={"absolute inset-0 bg-black/25 " + (closing ? scrimOutCls : "anim-fade")} />
      <div className={"absolute inset-0 " + (closing ? outCls : inCls)}>{children}</div>
    </div>
  );
}

/* 「photo:番号」を、実際に出せる絵（data URL）に直す。
   **一度読めなかっただけで、あきらめないこと。** 開いた直後は置き場（IndexedDB）がまだ開き終わっておらず、
   ここで空にすると、ヘッダーや写真だけが白いまま残る。
   **1秒足らずであきらめないこと。** 更新の直後は、置き場が開くまでに数秒かかることがある */
function usePhotoSrc(src) {
  const [url, setUrl] = useState(() => (isPhotoRef(src) ? (photoCache.get(src.slice(6)) || "") : src || ""));
  useEffect(() => {
    let alive = true;
    if (!isPhotoRef(src)) { setUrl(src || ""); return undefined; }
    const cached = photoCache.get(src.slice(6));
    if (cached) { setUrl(cached); return undefined; }
    let timer = null;
    let got = false;
    const WAITS = [300, 600, 1200, 2400, 4800];
    const tryGet = (i) => {
      photoGet(src.slice(6)).then((v) => {
        if (!alive || got) return;
        if (v) { got = true; setUrl(v); return; }
        if (i < WAITS.length) { timer = setTimeout(() => tryGet(i + 1), WAITS[i]); return; }
        setUrl("");
      });
    };
    const onStore = () => { if (alive && !got) tryGet(WAITS.length); };
    photoListeners.add(onStore);
    tryGet(0);
    return () => { alive = false; photoListeners.delete(onStore); if (timer) clearTimeout(timer); };
  }, [src]);
  return url;
}
/* 写真1枚。**<img src> に photo:番号 をそのまま渡さないこと**（出ない）。かならずこれを通す */
function Photo({ src, className, style, alt = "" }) {
  const url = usePhotoSrc(src);
  if (!url) return <span className={"block bg-neutral-100 " + (className || "")} style={style} aria-hidden="true" />;
  return <img src={url} alt={alt} draggable={false} className={className} style={style} />;
}

/* 読み込み中の目印。少し時間がかかる処理で使う */
function Spinner({ size = 22, className = "" }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={"spin " + className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.2" />
      <path d="M12 3 a9 9 0 0 1 9 9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
/* 画面の真ん中に出す「探しています」。
   ボタンの上に小さく出すだけだと気づきにくいので、
   画面全体を薄く覆って、真ん中で大きく回す */
function LoadingOverlay({ label = "読み込んでいます" }) {
  return (
    <div data-ft-overlay="" className="ft-sheet-wrap flex items-center justify-center anim-fade" style={{ zIndex: 2147481000 }}>
      <BackgroundLock />
      <div className="absolute inset-0 bg-neutral-50/75" />
      <div className="relative flex flex-col items-center text-th-800">
        <Spinner size={56} />
        <p className="text-[14.5px] font-bold text-neutral-600 mt-4">{label}</p>
      </div>
    </div>
  );
}

function LoadingBlock({ label = "読み込んでいます" }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-th-800">
      <Spinner size={30} />
      <p className="text-[12.5px] font-bold text-neutral-500 mt-3">{label}</p>
    </div>
  );
}

/* 途中保存のアイコン。左が「保存する」、右が「保存できた」 */
function SaveArrowIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3.5 L12 14.5" />
      <path d="M6.5 9.5 L12 15 L17.5 9.5" />
      <path d="M5 20.5 L19 20.5" />
    </svg>
  );
}
function SaveCheckIcon({ size = 22 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 12.5 L9.5 17.5 L19.5 6.5" />
    </svg>
  );
}

/* 今ある文の末尾に聖書箇所を足す */
const appendRef = (cur, ref) => {
  const base = (cur || "").replace(/\s+$/, "");
  return base ? base + " " + ref : ref;
};

/* 選んだ書・章のうち、「読んだ箇所」の文字に書かれていない章を、文字として書き足す。
   記録画面の「続きから」で開いたときや、前の版で保存した通読は、書・章だけ入っていて
   文字の欄が空（または別のこと）のことがある。そのままだと、見えない章で「過去のメモ」が出たり、
   文字を書き換えたとたんに章が消えたりするので、開いたときに見える形にそろえる */
function showPickedChapters(r) {
  if (!r || r.type !== "reading" || !r.book || !(r.chapters || []).length) return r;
  const kept = keepPickedChapters(r.book, r.chapters, r.passageText).chapters;
  const missing = r.chapters.filter((c) => !kept.includes(c)).sort((a, b) => a - b);
  if (!missing.length) return r;
  const runs = [];
  missing.forEach((c) => {
    const last = runs[runs.length - 1];
    if (last && c === last[1] + 1) last[1] = c; else runs.push([c, c]);
  });
  const text = runs.map(([a, b]) => (a === b ? `${r.book} ${a}章` : `${r.book} ${a}章-${b}章`)).join(" ");
  return { ...r, passageText: appendRef(r.passageText, text) };
}

/* 通読の「選んだ書・章」（book / chapters）を、いまの「読んだ箇所」の文字に合わせる。
   書・章は画面に出ない控えなので、文字を消したり書き換えたりしても残ったままになり、
   消したはずの箇所で「過去のメモ」が出続けたり、読んでいない章が読んだことに
   なったりしていた（実際そうなっていた）。
   **文字に残っている章だけを残す。** 1つも残らなければ、書・章ごと空にする。
   変わらないときは同じ並びを返すので、呼ぶ側は「変わったか」で見分けられる */
function keepPickedChapters(book, chapters, text) {
  const list = chapters || [];
  if (!book || !list.length) return { book: book || "", chapters: list };
  const inText = new Set();
  parseBibleRefs(text || "").forEach((x) => {
    if (x.book !== book || x.chapter == null) return;
    const to = x.chapterEnd && x.chapterEnd > x.chapter ? x.chapterEnd : x.chapter;
    for (let c = x.chapter; c <= to; c++) inText.add(c);
  });
  const kept = list.filter((c) => inText.has(c));
  if (kept.length === list.length) return { book, chapters: list };
  return kept.length ? { book, chapters: kept } : { book: "", chapters: [] };
}

/* 書・章・節を選んでテキストへ挿入するミニピッカー */
function RefInserter({ onInsert, onPickRange, label }) {
  const [open, setOpen] = useState(false);
  const [book, setBook] = useState("");
  const [chapter, setChapter] = useState(null);
  const [chapterEnd, setChapterEnd] = useState("");
  const [verse, setVerse] = useState("");
  const [verseEnd, setVerseEnd] = useState("");

  const reset = () => { setBook(""); setChapter(null); setChapterEnd(""); setVerse(""); setVerseEnd(""); };
  const multiChapter = chapterEnd !== "" && Number(chapterEnd) > Number(chapter || 0);
  const confirm = () => {
    if (!book || !chapter) return;
    let ref;
    if (multiChapter) {
      ref = `${book} ${chapter}章-${chapterEnd}章`;
    } else if (verse) {
      ref = `${book} ${chapter}:${verse}`;
      if (verseEnd) ref += `-${verseEnd}`;
    } else {
      ref = `${book} ${chapter}章`;
    }
    if (onPickRange) {
      /* 通読の「読んだ箇所」用。文字ではなく、書と章の並びを返す */
      const from = Number(chapter);
      const to = multiChapter ? Number(chapterEnd) : from;
      const chapters = [];
      for (let i = from; i <= to; i++) chapters.push(i);
      onPickRange({ book, chapters, passageText: ref });
    } else {
      onInsert(ref);
    }
    reset();
    setOpen(false);
  };

  const close = () => { reset(); setOpen(false); };

  return (
    <>
      {/* **この印は、対象の欄の「枠の中」に置くこと**（RefBox）。
          欄の外に置くと、どの欄に入るのか分かりにくかった。
          章・節の選び方は、ドラムを順に開く形が選びやすいので、この窓のままにしてある
          （下から出る1枚の紙にまとめたものは取りやめた） */}
      <button type="button" onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 min-h-[32px] rounded-full border border-th-200 bg-white text-[12.5px] font-bold text-th-800 ft-tap shrink-0">
        <BookOpen size={14} /> {label || "聖書箇所を挿入"}
      </button>
      {open && (
        <div data-ft-overlay="" className="fixed inset-0 flex items-center justify-center px-5" style={{ zIndex: 2147483100 }} onClick={close}>
      <BackgroundLock />
          <div className="absolute inset-0 bg-black/45" />
          <div className="relative w-full max-w-sm bg-white rounded-2xl border border-neutral-200 shadow-xl anim-pop max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
              <span className="font-display text-[15.5px] text-neutral-900">聖書箇所を選ぶ</span>
              <button type="button" onClick={close} aria-label="閉じる"
                className="min-w-[52px] min-h-[52px] flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100"><X size={28} /></button>
            </div>
            <div className="p-4 space-y-2.5">
      <BookSelect value={book} onChange={(v) => { setBook(v); setChapter(null); setVerse(""); setVerseEnd(""); }} />
      {book && (
              <div className="flex items-center gap-2">
                <span className="w-8 shrink-0 text-[13.5px] font-bold text-neutral-600">章</span>
                <DrumSelect
                  value={chapter ?? ""}
                  onChange={(v) => { setChapter(v === "" ? null : v); setChapterEnd(""); setVerse(""); setVerseEnd(""); }}
                  placeholder="—"
                  title="章を選択"
                  options={Array.from({ length: bookByName(book)?.chapters || 0 }, (_, i) => ({ value: i + 1, label: `${i + 1}章` }))}
                />
                <span className="text-neutral-500 font-bold shrink-0">〜</span>
                <DrumSelect
                  value={chapterEnd === "" ? "" : Number(chapterEnd)}
                  onChange={(v) => { setChapterEnd(v === "" ? "" : String(v)); if (v !== "") { setVerse(""); setVerseEnd(""); } }}
                  placeholder="—"
                  title="終わりの章を選択"
                  disabled={!chapter}
                  options={Array.from({ length: bookByName(book)?.chapters || 0 }, (_, i) => i + 1)
                    .filter((n) => !chapter || n > Number(chapter))
                    .map((n) => ({ value: n, label: `${n}章` }))}
                />
              </div>
            )}
      {chapter && (
              <div className={"flex items-center gap-2 " + (multiChapter ? "opacity-40 pointer-events-none" : "")}>
                <span className="w-8 shrink-0 text-[13.5px] font-bold text-neutral-600">節</span>
          <DrumSelect
            value={verse === "" ? "" : Number(verse)}
            onChange={(v) => { setVerse(v === "" ? "" : String(v)); setVerseEnd(""); }}
            placeholder="—"
            title="節を選択"
            options={Array.from({ length: 176 }, (_, i) => ({ value: i + 1, label: `${i + 1}節` }))}
          />
          <span className="text-neutral-400 font-bold shrink-0">〜</span>
          <DrumSelect
            value={verseEnd === "" ? "" : Number(verseEnd)}
            onChange={(v) => setVerseEnd(v === "" ? "" : String(v))}
            placeholder="—"
            title="終わりの節を選択"
            disabled={!verse}
            options={Array.from({ length: 176 }, (_, i) => i + 1)
              .filter((n) => !verse || n > Number(verse))
              .map((n) => ({ value: n, label: `${n}節` }))}
          />
        </div>
      )}
            <div className="flex gap-2 px-4 pb-4 pt-1">
              <button type="button" onClick={close} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>閉じる</button>
              <button type="button" onClick={confirm} disabled={!book || !chapter} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>挿入する</button>
            </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* 入力欄1つ分の削除確認。記録そのものの削除（赤）と区別できるよう、こちらは橙色にしている */
/* 今月・今年の聖句が、ほかの記録にすでに付いているときの確認 */
function HighlightTakeoverDialog({ what, existing, onConfirm, onCancel }) {
  return (
    <div data-ft-overlay="" className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center px-6" style={{ zIndex: 2147483400 }}>
      <BackgroundLock />
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-neutral-200 shadow-xl anim-pop max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-[17px] text-neutral-900 mb-2">{what}には、すでに別の聖句があります</h3>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 mb-3">
          <p className="text-[13.5px] text-neutral-700 whitespace-pre-line">{clampText(existing.text, 3)}</p>
        </div>
        <p className="text-[13.5px] text-neutral-600 mb-5 leading-relaxed">
          こちらの記録に変えると、上の記録からは外れます。変えますか。
        </p>
        <div className="flex gap-2.5">
          <button onClick={onCancel} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>やめる</button>
          <button onClick={onConfirm} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>変える</button>
        </div>
      </div>
    </div>
  );
}

function ConfirmItemDeleteDialog({ label, onConfirm, onCancel }) {
  return (
    <div data-ft-overlay="" className="fixed inset-0 flex items-center justify-center px-6" style={{ zIndex: 2147483100 }}>
      <BackgroundLock />
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl p-5 max-w-sm w-full border border-neutral-200 shadow-xl max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-[17px] text-neutral-900 mb-2">{label}を削除します</h3>
        <p className="text-[13.5px] text-neutral-600 mb-5">この入力欄と、入力した内容が消えます。記録そのものは削除されません。</p>
        <div className="flex gap-2.5">
          <button type="button" onClick={onCancel} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</button>
          <button type="button" onClick={onConfirm} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>削除</button>
        </div>
      </div>
    </div>
  );
}

/* QuestionList（疑問メモの入力欄）は廃止した。
   疑問はタグで表せるようになったため。移行は migrateRecord が受け持つ */
/* ============================================================
   画面端スワイプで「戻る」ジェスチャー
   ・画面左端に専用の透明な帯（stripRef）を敷き、そこだけで検知する
     （下の方にあるボタン類に判定を邪魔されず、上から下まで感度を均一にするため）
   ・指の動きにリアルタイムで追従し、離した時にしきい値/速度で判定
   ============================================================ */
function useEdgeSwipeBack(onBack, canClose) {
  const stripRef = useRef(null);
  const screenRef = useRef(null);
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;
  const canCloseRef = useRef(canClose);
  canCloseRef.current = canClose;

  useEffect(() => {
    const strip = stripRef.current;
    const screen = screenRef.current;
    if (!strip || !screen) return;

    const THRESHOLD = 0.14; // 画面幅に対してこの割合を超えたら「戻る」確定
    const VELOCITY_THRESHOLD = 0.18; // px/ms：速く払った場合はしきい値未満でも確定
    const SETTLE_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"; // 戻る確定：すっと吸い込まれるように抜ける
    const SPRING_EASE = "cubic-bezier(0.16, 1, 0.3, 1)"; // キャンセル：跳ねずに元の位置へスッと収まる

    let active = false;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let width = 1;
    let pointerId = null;

    let clearTimer = null;
    /* 地の暗がりも、画面といっしょに動かす。画面だけ払い出して暗がりを残すと、
       払い終えて閉じ終わるまでのあいだ、うしろの画面が暗いまま見える */
    const root = screen.closest("[data-ft-overlay]");
    const scrim = root ? root.querySelector("[data-ft-scrim]") : null;
    const setTransform = (x, animate, easing, duration) => {
      clearTimeout(clearTimer);
      screen.style.transition = animate ? `transform ${duration}ms ${easing}` : "none";
      screen.style.transform = x === 0 ? "translateX(0px)" : `translateX(${x}px)`;
      if (scrim) {
        scrim.style.transition = animate ? `opacity ${duration}ms ${easing}` : "none";
        scrim.style.opacity = String(Math.max(0, 1 - x / (width || 1)));
      }
      if (x === 0) {
        // 元の位置に戻り切ったら inline style を消す
        // （transform が残っていると、上に重ねるシート類の基準位置がずれてしまうため）
        const wait = animate ? duration + 30 : 0;
        clearTimer = setTimeout(() => {
          screen.style.transition = ""; screen.style.transform = "";
          if (scrim) { scrim.style.transition = ""; scrim.style.opacity = ""; }
        }, wait);
      }
    };

    const onPointerDown = (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      active = true;
      dragging = false;
      startX = e.clientX;
      startY = e.clientY;
      startTime = performance.now();
      width = screen.offsetWidth || window.innerWidth || 375;
      pointerId = e.pointerId;
    };

    const onPointerMove = (e) => {
      if (!active) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      if (!dragging) {
        if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
        if (dx <= 0 || Math.abs(dy) > Math.abs(dx) * 1.3) { active = false; return; }
        dragging = true;
        try { strip.setPointerCapture(pointerId); } catch (err) { /* noop */ }
      }
      const clamped = Math.max(0, Math.min(dx, width));
      setTransform(clamped, false);
      e.preventDefault();
    };

    const finish = (e) => {
      if (!active) return;
      active = false;
      if (!dragging) return;
      dragging = false;
      const dx = Math.max(0, Math.min(e.clientX - startX, width));
      const dt = Math.max(1, performance.now() - startTime);
      const velocity = dx / dt;
      const passed = dx / width > THRESHOLD || velocity > VELOCITY_THRESHOLD;
      if (passed) {
        if (canCloseRef.current && !canCloseRef.current()) {
          setTransform(0, true, SPRING_EASE, 340);
          return;
        }
        const remaining = width - dx;
        const duration = Math.max(110, Math.min(220, remaining / 1.3));
        setTransform(width, true, SETTLE_EASE, duration);
        setTimeout(() => onBackRef.current && onBackRef.current(), duration);
      } else {
        setTransform(0, true, SPRING_EASE, 340);
      }
    };

    strip.addEventListener("pointerdown", onPointerDown);
    strip.addEventListener("pointermove", onPointerMove, { passive: false });
    strip.addEventListener("pointerup", finish);
    strip.addEventListener("pointercancel", finish);
    return () => {
      strip.removeEventListener("pointerdown", onPointerDown);
      strip.removeEventListener("pointermove", onPointerMove);
      strip.removeEventListener("pointerup", finish);
      strip.removeEventListener("pointercancel", finish);
      clearTimeout(clearTimer);
    };
  }, []);

  return { stripRef, screenRef };
}

/* ほっこりした羊。記録が無い場所に置いて、画面が寂しくならないようにしている */
function SheepMascot({ size = 132, withNotes = false, className = "" }) {
  return (
    <svg viewBox="0 0 150 112" width={size} height={size * 112 / 150} className={className} aria-hidden="true">
      {withNotes && (
        <g fill="#D6D3D1">
          <circle cx="18" cy="36" r="3.4" /><rect x="20" y="22" width="1.8" height="15" rx="0.9" />
          <circle cx="32" cy="25" r="2.8" /><rect x="33.6" y="13" width="1.6" height="13" rx="0.8" />
        </g>
      )}
      {/* 脚 */}
      <g fill="#D6D3D1">
        <rect x="50" y="80" width="10" height="21" rx="5" />
        <rect x="78" y="80" width="10" height="21" rx="5" />
      </g>
      {/* 耳（顔の後ろ） */}
      <g fill="#E7E5E4">
        <ellipse cx="94" cy="59" rx="7" ry="4.6" transform="rotate(-30 94 59)" />
        <ellipse cx="123" cy="59" rx="7" ry="4.6" transform="rotate(30 123 59)" />
      </g>
      {/* もこもこの体 */}
      <g fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="2.5">
        <circle cx="52" cy="60" r="19" />
        <circle cx="70" cy="50" r="21" />
        <circle cx="88" cy="59" r="18" />
        <circle cx="61" cy="74" r="17" />
        <circle cx="82" cy="75" r="16" />
      </g>
      {/* 顔 */}
      <ellipse cx="108" cy="69" rx="15" ry="14" fill="#F5F5F4" stroke="#E7E5E4" strokeWidth="2.5" />
      <g fill="#FFFFFF" stroke="#E7E5E4" strokeWidth="2.5">
        <circle cx="101" cy="58" r="7.5" />
        <circle cx="113" cy="57" r="6.5" />
      </g>
      <circle cx="103" cy="70" r="2.1" fill="#57534E" />
      <circle cx="114" cy="70" r="2.1" fill="#57534E" />
      <path d="M106 76.5 q2.6 2.6 5.2 0" stroke="#A8A29E" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* 首もとの鈴（アプリの色） */}
      <circle cx="95" cy="81" r="3.8" fill="#0F766E" opacity="0.9" />
    </svg>
  );
}

/* ろば */
function DonkeyMascot({ size = 132, className = "" }) {
  return (
    <svg viewBox="0 0 150 112" width={size} height={size * 112 / 150} className={className} aria-hidden="true">
      <g fill="#C7C2BE">
        <rect x="46" y="78" width="9" height="24" rx="4.5" /><rect x="62" y="80" width="9" height="22" rx="4.5" />
        <rect x="84" y="78" width="9" height="24" rx="4.5" /><rect x="98" y="80" width="9" height="22" rx="4.5" />
      </g>
      <path d="M40 60 q-10 8 -7 19" stroke="#C7C2BE" strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx="33" cy="80" r="4.5" fill="#A8A29E" />
      <path d="M95 46 L113 26 L129 40 L111 60 Z" fill="#DAD5D1" />
      <ellipse cx="113" cy="14" rx="5" ry="12" transform="rotate(-16 113 14)" fill="#DAD5D1" stroke="#C7C2BE" strokeWidth="2.5" />
      <ellipse cx="130" cy="16" rx="5" ry="12" transform="rotate(14 130 16)" fill="#DAD5D1" stroke="#C7C2BE" strokeWidth="2.5" />
      <ellipse cx="72" cy="62" rx="34" ry="21" fill="#DAD5D1" stroke="#C7C2BE" strokeWidth="2.5" />
      <ellipse cx="122" cy="36" rx="15" ry="13" fill="#E3DFDB" stroke="#C7C2BE" strokeWidth="2.5" />
      <ellipse cx="132" cy="44" rx="8.5" ry="7" fill="#F2EFEC" stroke="#C7C2BE" strokeWidth="2" />
      <circle cx="130" cy="43" r="1.3" fill="#8A827C" /><circle cx="135" cy="44.5" r="1.3" fill="#8A827C" />
      <circle cx="119" cy="33" r="2.1" fill="#57534E" />
      <path d="M110 24 q6 -4 11 -1" stroke="#A8A29E" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M102 50 q7 6 13 2" stroke="#0F766E" strokeWidth="3.4" fill="none" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
}

/* ハト（オリーブの枝をくわえている） */
function DoveMascot({ size = 132, className = "" }) {
  return (
    <svg viewBox="0 0 165 112" width={size} height={size * 112 / 165} className={className} aria-hidden="true">
      <path d="M44 64 Q20 52 8 58 Q16 66 8 76 Q26 78 46 72 Z" fill="#F5F5F4" stroke="#E0DEDB" strokeWidth="2.5" strokeLinejoin="round" />
      <g stroke="#E0A83C" strokeWidth="3" strokeLinecap="round"><path d="M68 84 v9" /><path d="M82 84 v9" /></g>
      <ellipse cx="74" cy="62" rx="33" ry="23" fill="#FFFFFF" stroke="#E0DEDB" strokeWidth="2.5" />
      <circle cx="104" cy="45" r="15" fill="#FFFFFF" stroke="#E0DEDB" strokeWidth="2.5" />
      <path d="M118 45 L130 49 L118 52 Z" fill="#E8B44A" stroke="#D9A23C" strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="107" cy="42" r="2.2" fill="#57534E" />
      <ellipse cx="70" cy="58" rx="24" ry="13" transform="rotate(-14 70 58)" fill="#F5F5F4" stroke="#E0DEDB" strokeWidth="2.5" />
      <path d="M58 60 q13 -3 22 2" stroke="#E5E3E0" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M130 49 q11 3 19 0" stroke="#0F766E" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="141" cy="43" rx="5.5" ry="3.2" transform="rotate(-26 141 43)" fill="#0F766E" opacity="0.85" />
      <ellipse cx="150" cy="52" rx="5.5" ry="3.2" transform="rotate(18 150 52)" fill="#0F766E" opacity="0.85" />
    </svg>
  );
}

/* さかな */
function FishMascot({ size = 132, className = "" }) {
  return (
    <svg viewBox="0 0 150 112" width={size} height={size * 112 / 150} className={className} aria-hidden="true">
      <path d="M104 58 L142 34 Q136 58 142 82 Z" fill="#E7E5E4" stroke="#D6D3D1" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="68" cy="58" rx="40" ry="27" fill="#FFFFFF" stroke="#E0DEDB" strokeWidth="2.5" />
      <ellipse cx="74" cy="34" rx="14" ry="7" transform="rotate(-12 74 34)" fill="#F2F0EE" stroke="#E0DEDB" strokeWidth="2.2" />
      <ellipse cx="66" cy="82" rx="13" ry="6.5" transform="rotate(10 66 82)" fill="#F2F0EE" stroke="#E0DEDB" strokeWidth="2.2" />
      <circle cx="42" cy="52" r="3.2" fill="#57534E" />
      <path d="M30 63 q5 4 10 1" stroke="#A8A29E" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M88 42 q6 16 0 32" stroke="#0F766E" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
      <circle cx="24" cy="36" r="3" fill="#0F766E" opacity="0.4" />
      <circle cx="15" cy="26" r="2" fill="#0F766E" opacity="0.3" />
    </svg>
  );
}

/* らくだ */
function CamelMascot({ size = 132, className = "" }) {
  return (
    <svg viewBox="0 0 150 112" width={size} height={size * 112 / 150} className={className} aria-hidden="true">
      <g fill="#CFC7BD">
        <rect x="48" y="76" width="9" height="26" rx="4.5" /><rect x="64" y="78" width="9" height="24" rx="4.5" />
        <rect x="86" y="76" width="9" height="26" rx="4.5" /><rect x="100" y="78" width="9" height="24" rx="4.5" />
      </g>
      <path d="M42 58 q-9 8 -6 17" stroke="#CFC7BD" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M98 44 L114 22 L128 34 L110 58 Z" fill="#E3D9CB" />
      <ellipse cx="74" cy="60" rx="34" ry="20" fill="#E3D9CB" stroke="#CFC7BD" strokeWidth="2.5" />
      <ellipse cx="74" cy="42" rx="20" ry="13" fill="#E3D9CB" stroke="#CFC7BD" strokeWidth="2.5" />
      <ellipse cx="112" cy="16" rx="4" ry="6" transform="rotate(-20 112 16)" fill="#E3D9CB" stroke="#CFC7BD" strokeWidth="2" />
      <ellipse cx="120" cy="30" rx="13" ry="11" fill="#EDE5D9" stroke="#CFC7BD" strokeWidth="2.5" />
      <ellipse cx="130" cy="37" rx="8" ry="6.5" fill="#F5EFE6" stroke="#CFC7BD" strokeWidth="2" />
      <circle cx="128" cy="36" r="1.2" fill="#8A827C" /><circle cx="133" cy="37" r="1.2" fill="#8A827C" />
      <circle cx="117" cy="27" r="2" fill="#57534E" />
      <path d="M64 40 q10 -5 20 -1" stroke="#0F766E" strokeWidth="3.4" fill="none" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

/* ぶどう */
function GrapesMascot({ size = 132, className = "" }) {
  return (
    <svg viewBox="0 0 150 112" width={size} height={size * 112 / 150} className={className} aria-hidden="true">
      <path d="M75 30 q2 -10 -6 -16" stroke="#A8A29E" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      <ellipse cx="56" cy="16" rx="12" ry="7" transform="rotate(-24 56 16)" fill="#0F766E" opacity="0.7" />
      <ellipse cx="88" cy="18" rx="10" ry="6" transform="rotate(20 88 18)" fill="#0F766E" opacity="0.5" />
      <g fill="#FFFFFF" stroke="#DDD9D5" strokeWidth="2.5">
        <circle cx="58" cy="42" r="11" /><circle cx="76" cy="40" r="11" /><circle cx="93" cy="44" r="11" />
        <circle cx="66" cy="58" r="11" /><circle cx="84" cy="58" r="11" />
        <circle cx="57" cy="74" r="10" /><circle cx="75" cy="75" r="11" /><circle cx="93" cy="72" r="10" />
        <circle cx="66" cy="90" r="10" /><circle cx="84" cy="89" r="10" />
      </g>
    </svg>
  );
}

const DEFAULT_MASCOT_COUNT = 6;
function DefaultMascot({ variant = 0, size = 132, withNotes = false, className = "" }) {
  if (variant === 1) return <DonkeyMascot size={size} className={className} />;
  if (variant === 2) return <DoveMascot size={size} className={className} />;
  if (variant === 3) return <FishMascot size={size} className={className} />;
  if (variant === 4) return <CamelMascot size={size} className={className} />;
  if (variant === 5) return <GrapesMascot size={size} className={className} />;
  return <SheepMascot size={size} withNotes={withNotes} className={className} />;
}

/* アップロードしたイラストを画面のあちこちに散らすための仕組み。
   未登録のときは ひつじ・ろば・ハト が場所ごとに出る */
const ArtworkContext = React.createContext([]);
const PrefsContext = React.createContext(null);
function hashSeed(str) {
  let h = 0;
  for (let i = 0; i < String(str).length; i++) h = (h * 31 + String(str).charCodeAt(i)) >>> 0;
  return h;
}
/* どの seed がどの画面かの一覧。イラスト設定画面で「どこに出るか」を見せるために使う */
const MASCOT_GROUPS = [
  { key: "reading" },
  { key: "message" },
  { key: "memorization" },
  { key: "memo" },
  { key: "empty" },
];
/* 何枚目の絵が、どの場所に出るかを見分けるための色。
   絵の枠と、その絵が出る場所の枠を同じ色にする。
   MASCOT_SPOTS の並び順＝割り当ての順なので、番号で対応が取れる */
const PAIR_COLORS = [
  { ring: "#0EA5E9", bg: "#F0F9FF" },   // 青
  { ring: "#F59E0B", bg: "#FFFBEB" },   // 橙
  { ring: "#8B5CF6", bg: "#F5F3FF" },   // 紫
  { ring: "#10B981", bg: "#ECFDF5" },   // 緑
  { ring: "#EC4899", bg: "#FDF2F8" },   // 桃
];
const pairColor = (i) => PAIR_COLORS[i % PAIR_COLORS.length];

/* イラストのまとまりの見出し。
   **書き決めにしないこと。** 記録の種類の名前はカスタマイズ画面で変えられるので、
   書き決めにすると「通読」を別の名前にしたときに、ここだけ古い名前が残ってしまう */
function mascotGroupLabel(key, typeNames) {
  if (key === "empty") return "からっぽの画面";
  return `${typeNameOf(key, typeNames)}・ほか`;
}
function typeNameOf(key, typeNames) {
  return (typeNames && typeNames[key]) || TYPE_LABELS[key] || key;
}
/* 場所の名前。記録画面のものは `form` を持たせてあり、種類の名前から作る */
function mascotSpotLabel(spot, typeNames) {
  if (!spot) return "";
  return spot.form ? `${typeNameOf(spot.form, typeNames)}の記録画面` : spot.label;
}
/* 各グループが受け持つ場所。記録の種類ごとに「その種類の画面」＋「共通の場所」を分担する */
const MASCOT_SPOTS = [
  /* からっぽの画面 */
  { seed: "calendar-empty", group: "empty", label: "日ごとの記録・記録のない日" },
  { seed: "records-empty", group: "empty", label: "記録一覧・記録なし" },
  { seed: "search-empty", group: "empty", label: "探す・結果なし" },
  { seed: "book-empty", group: "empty", label: "書別・記録なし" },
  /* 通読 */
  { seed: "form-reading", group: "reading", form: "reading" },
  { seed: "progress-foot", group: "reading", label: "実績の最後" },
  /* 学び */
  { seed: "form-message", group: "message", form: "message" },
  { seed: "records-end", group: "message", label: "記録一覧の最後" },
  /* 聖句 */
  { seed: "form-memorization", group: "memorization", form: "memorization" },
  { seed: "home-banner", group: "memorization", label: "ホーム上部" },
  /* その他 */
  { seed: "form-memo", group: "memo", form: "memo" },
  /* 実績の最後の絵は「通読」と同じものを使う（依頼による）。
     まとまり（group）を変えると、既定の絵もそのまとまりのものになる */
  { seed: "menu", group: "memo", label: "メニュー" },
  { seed: "tags-empty", group: "empty", label: "タグの整理・タグなし" },
  { seed: "help", group: "memo", label: "ヘルプ画面" },
];

/* 一覧の並び順で順ぐりに割り当てる（デフォルトの絵を選ぶときに使う） */
/* はじめからの絵は「分類ごと」に決める。
   画面のカスタマイズで見えている見本と、実際に出る絵を必ず一致させるため、
   MASCOT_GROUPS の並び順をそのまま絵の番号として使う。
   （以前は MASCOT_SPOTS の並び順で決めていたため、見本と実物がずれていた） */
function slotFor(seed, count) {
  if (count <= 0) return 0;
  const spot = MASCOT_SPOTS.find((sp) => sp.seed === seed);
  const i = spot ? MASCOT_GROUPS.findIndex((g) => g.key === spot.group) : -1;
  return (i >= 0 ? i : hashSeed(seed)) % count;
}
/* その場所を受け持つグループに登録された絵を探す。
   誰も登録していないグループの場所には、はじめから用意した絵が出る */
function pickArtwork(seed, artworks) {
  if (!artworks || !artworks.length) return null;
  const spot = MASCOT_SPOTS.find((sp) => sp.seed === seed);
  if (!spot) return null;
  const pool = artworks.filter((a) => a.group === spot.group);
  if (!pool.length) return null;
  const order = MASCOT_SPOTS.filter((sp) => sp.group === spot.group).findIndex((sp) => sp.seed === seed);
  return pool[(order < 0 ? 0 : order) % pool.length];
}
function Mascot({ seed = "a", size = 132, withNotes = false, className = "" }) {
  const artworks = React.useContext(ArtworkContext);
  const prefs = React.useContext(PrefsContext);
  if (prefs && prefs.showMascots === false) return null;
  const art = pickArtwork(seed, artworks);
  if (!art) return <DefaultMascot variant={slotFor(seed, DEFAULT_MASCOT_COUNT)} size={size} withNotes={withNotes} className={className} />;
  return (
    <img src={art.src} alt="" aria-hidden="true"
      className={"object-contain " + className}
      style={{ width: size, height: size, maxWidth: "100%" }} />
  );
}


/* ============================================================
   果樹を育てる（ホーム画面）
   通読した日数と記録の件数の**両方**が条件に届くと、次の段階へ進む。
   最後の段階は「21日かつ25件」（2.11.0〜。それより前に植えた木は「35日かつ42件」のまま）なので、
   日数だけ経っても実らない。
   **画面に出す文には日数を書かないこと。**
   日数だけで実るかのように読めてしまい、実際と食い違う
   ============================================================ */
/* 育てられる実。ripe=熟した色、mid=色づき始め、blossom=花の色 */
const FRUITS = [
  { key: "apple",  label: "りんご",   ripe: "#E2685C", mid: "#E8A88F", blossom: "#F9DCD8", shape: "round" },
  { key: "pear",   label: "梨",       ripe: "#D8C077", mid: "#DDD3A2", blossom: "#FFFFFF", shape: "pear" },
  { key: "peach",  label: "桃",       ripe: "#F0A0AA", mid: "#F4C6CA", blossom: "#F9CBD3", shape: "round" },
  { key: "orange", label: "オレンジ", ripe: "#E8994A", mid: "#EDC08D", blossom: "#FFF6E4", shape: "round" },
  { key: "cherry", label: "さくらんぼ", ripe: "#D8556B", mid: "#E294A2", blossom: "#FBDEE5", shape: "cherry" },
];
const fruitByKey = (k) => FRUITS.find((f) => f.key === k) || FRUITS[0];

const SOIL_D = "#C9A883", SOIL_L = "#DCC0A0";
const LEAF_D = "#5FA985", LEAF_L = "#7FC3A0", TRUNK = "#B2896B", TRUNK_D = "#9A7357";
const YOUNG = "#8FBF92";

/* 2色を混ぜる。青い実にほんのり品種の色を混ぜ、何を育てているか分かるようにする */
function blend(a, b, t) {
  const h = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const [r1, g1, b1] = h(a), [r2, g2, b2] = h(b);
  const m = (x, y) => Math.round(x + (y - x) * t).toString(16).padStart(2, "0");
  return `#${m(r1, r2)}${m(g1, g2)}${m(b1, b2)}`;
}

/* 土の山。全ステージ共通の足元 */
function Soil() {
  return (
    <g>
      <ellipse cx="60" cy="116" rx="46" ry="12" fill={SOIL_D} />
      <ellipse cx="60" cy="113" rx="46" ry="11" fill={SOIL_L} />
      <ellipse cx="44" cy="112" rx="4" ry="2" fill={SOIL_D} opacity="0.55" />
      <ellipse cx="74" cy="115" rx="5" ry="2" fill={SOIL_D} opacity="0.45" />
      <ellipse cx="60" cy="108" rx="3" ry="1.6" fill={SOIL_D} opacity="0.4" />
    </g>
  );
}

/* 葉っぱ1枚 */
function Leaf({ x, y, rot = 0, len = 13, w = 8, color = LEAF_L }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 Q${len * 0.55} ${-w} ${len} 0 Q${len * 0.55} ${w} 0 0 Z`} fill={color} />
      <path d={`M2 0 L${len - 2} 0`} stroke="#FFFFFF" strokeWidth="1" opacity="0.5" strokeLinecap="round" />
    </g>
  );
}

/* 幹と枝 */
function Trunk() {
  return (
    <g>
      <path d="M54 116 Q56 96 55.5 80 L64.5 80 Q64 96 66 116 Z" fill={TRUNK} />
      <path d="M60 100 L46 88" stroke={TRUNK_D} strokeWidth="4" strokeLinecap="round" />
      <path d="M60 94 L74 84" stroke={TRUNK_D} strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

/* こんもりした葉のかたまり */
function Canopy({ full = true }) {
  return full ? (
    <g>
      <circle cx="60" cy="60" r="27" fill={LEAF_D} />
      <circle cx="38" cy="74" r="18" fill={LEAF_D} />
      <circle cx="82" cy="74" r="18" fill={LEAF_D} />
      <circle cx="60" cy="76" r="20" fill={LEAF_L} />
      <circle cx="46" cy="58" r="16" fill={LEAF_L} />
      <circle cx="76" cy="60" r="15" fill={LEAF_L} />
    </g>
  ) : (
    <g>
      <circle cx="60" cy="70" r="21" fill={LEAF_D} />
      <circle cx="44" cy="80" r="14" fill={LEAF_D} />
      <circle cx="76" cy="80" r="14" fill={LEAF_D} />
      <circle cx="58" cy="78" r="15" fill={LEAF_L} />
      <circle cx="50" cy="66" r="12" fill={LEAF_L} />
    </g>
  );
}

/* 実のなる位置 */
const SPOTS = [[44, 62], [72, 54], [60, 84], [84, 74], [36, 80], [64, 66]];

function Fruit({ x, y, r, color, shape, stem = true }) {
  if (shape === "cherry") {
    return (
      <g>
        {stem && <>
          <path d={`M${x - 4} ${y - r} Q${x - 2} ${y - r - 8} ${x + 3} ${y - r - 10}`} stroke="#7FA86B" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d={`M${x + 5} ${y - r + 1} Q${x + 5} ${y - r - 7} ${x + 3} ${y - r - 10}`} stroke="#7FA86B" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </>}
        <circle cx={x - 4} cy={y} r={r * 0.82} fill={color} />
        <circle cx={x + 5} cy={y + 1.5} r={r * 0.82} fill={color} />
        <circle cx={x - 5.5} cy={y - 1.5} r={r * 0.24} fill="#FFFFFF" opacity="0.55" />
      </g>
    );
  }
  if (shape === "pear") {
    return (
      <g>
        {stem && <path d={`M${x} ${y - r * 1.15} L${x} ${y - r * 1.55}`} stroke="#8A6B4F" strokeWidth="1.8" strokeLinecap="round" />}
        <path d={`M${x} ${y - r * 1.2}
                  C${x - r * 0.62} ${y - r * 0.9} ${x - r * 0.5} ${y - r * 0.15} ${x - r * 0.92} ${y + r * 0.35}
                  C${x - r * 1.2} ${y + r * 1.1} ${x + r * 1.2} ${y + r * 1.1} ${x + r * 0.92} ${y + r * 0.35}
                  C${x + r * 0.5} ${y - r * 0.15} ${x + r * 0.62} ${y - r * 0.9} ${x} ${y - r * 1.2} Z`} fill={color} />
        <ellipse cx={x - r * 0.35} cy={y + r * 0.3} rx={r * 0.2} ry={r * 0.3} fill="#FFFFFF" opacity="0.5" />
      </g>
    );
  }
  return (
    <g>
      {stem && <path d={`M${x} ${y - r * 0.95} L${x + 0.5} ${y - r - 4}`} stroke="#8A6B4F" strokeWidth="1.8" strokeLinecap="round" />}
      <circle cx={x} cy={y} r={r} fill={color} />
      <ellipse cx={x - r * 0.34} cy={y - r * 0.32} rx={r * 0.22} ry={r * 0.3} fill="#FFFFFF" opacity="0.5" transform={`rotate(-25 ${x - r * 0.34} ${y - r * 0.32})`} />
      {stem && <path d={`M${x + 1} ${y - r - 2} q6 -3 8 1 q-6 3 -8 -1 Z`} fill={LEAF_L} />}
    </g>
  );
}

function Blossom({ x, y, r, color }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy={-r * 0.72} rx={r * 0.42} ry={r * 0.6} fill={color} transform={`rotate(${a})`} />
      ))}
      <circle cx="0" cy="0" r={r * 0.34} fill="#F2C14E" />
    </g>
  );
}

function Sparkle({ x, y, s = 4, color = "#F2C14E", twinkle = false, delay = 0 }) {
  return (
    <path
      className={twinkle ? "ft-sparkle" : undefined}
      style={twinkle ? { animationDelay: `${delay}s` } : undefined}
      d={`M${x} ${y - s} Q${x + s * 0.28} ${y - s * 0.28} ${x + s} ${y} Q${x + s * 0.28} ${y + s * 0.28} ${x} ${y + s} Q${x - s * 0.28} ${y + s * 0.28} ${x - s} ${y} Q${x - s * 0.28} ${y - s * 0.28} ${x} ${y - s} Z`}
      fill={color} />
  );
}

/* 10段階の果樹。stage は 1〜10 */
function FruitTree({ stage = 1, fruit = "apple", size = 150, className = "", sparkle = false }) {
  const f = fruitByKey(fruit);
  const s = Math.min(10, Math.max(1, stage));
  return (
    <svg viewBox="0 0 120 132" width={size} height={size * 132 / 120} className={className} aria-hidden="true">
      <Soil />

      {/* 今日の記録が入った日は、木のまわりがきらめく */}
      {sparkle && (
        <g>
          <Sparkle x={60} y={13} s={6} twinkle delay={0} />
          <Sparkle x={27} y={26} s={4.5} twinkle delay={0.5} />
          <Sparkle x={94} y={22} s={5} twinkle delay={0.9} />
          <Sparkle x={12} y={56} s={3.5} twinkle delay={1.4} />
          <Sparkle x={109} y={50} s={4} twinkle delay={1.9} />
        </g>
      )}

      {s === 1 && (
        <g>
          <ellipse cx="60" cy="106" rx="5" ry="3.6" fill="#A98763" />
          <ellipse cx="58.5" cy="105" rx="2" ry="1.4" fill="#C4A284" />
          <Sparkle x={30} y={92} s={4} color="#E7D6B8" />
          <Sparkle x={90} y={86} s={5} color="#E7D6B8" />
          <Sparkle x={74} y={100} s={3} color="#E7D6B8" />
        </g>
      )}

      {s === 2 && (
        <g>
          <path d="M60 110 Q59 102 60 96" stroke={YOUNG} strokeWidth="3" fill="none" strokeLinecap="round" />
          <Leaf x={60} y={96} rot={-32} len={14} w={8.5} color={LEAF_L} />
        </g>
      )}

      {s === 3 && (
        <g>
          <path d="M60 110 Q59 100 60 90" stroke={YOUNG} strokeWidth="3.2" fill="none" strokeLinecap="round" />
          <Leaf x={59} y={91} rot={-152} len={16} w={9.5} color={LEAF_L} />
          <Leaf x={61} y={91} rot={-28} len={16} w={9.5} color={LEAF_D} />
        </g>
      )}

      {s === 4 && (
        <g>
          <path d="M60 112 Q58 96 60 80" stroke={TRUNK} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M60 94 L50 87" stroke={TRUNK} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M60 88 L71 82" stroke={TRUNK} strokeWidth="2.6" strokeLinecap="round" />
          <Leaf x={50} y={87} rot={-160} len={14} w={8} color={LEAF_D} />
          <Leaf x={71} y={82} rot={-20} len={14} w={8} color={LEAF_L} />
          <Leaf x={59} y={80} rot={-145} len={13} w={7.5} color={LEAF_L} />
          <Leaf x={61} y={79} rot={-38} len={13} w={7.5} color={LEAF_D} />
        </g>
      )}

      {s === 5 && (<g><Trunk /><Canopy full={false} /></g>)}

      {s >= 6 && (<g><Trunk /><Canopy /></g>)}

      {s === 6 && SPOTS.slice(0, 5).map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4.6" fill={f.blossom} />
          <circle cx={x} cy={y} r="2.4" fill={f.mid} opacity="0.7" />
        </g>
      ))}

      {s === 7 && SPOTS.map(([x, y], i) => <Blossom key={i} x={x} y={y} r={i % 2 ? 7 : 8.4} color={f.blossom} />)}

      {s === 8 && SPOTS.slice(0, 4).map(([x, y], i) => (
        <Fruit key={i} x={x} y={y} r={5} color={blend(YOUNG, f.ripe, 0.18)} shape={f.shape} stem={false} />
      ))}

      {s === 9 && SPOTS.slice(0, 5).map(([x, y], i) => (
        <Fruit key={i} x={x} y={y} r={7.6} color={i % 2 ? f.mid : YOUNG} shape={f.shape} />
      ))}

      {s === 10 && (
        <g>
          {SPOTS.map(([x, y], i) => <Fruit key={i} x={x} y={y} r={9.4} color={f.ripe} shape={f.shape} />)}
          <Sparkle x={22} y={54} s={5} twinkle delay={0.2} />
          <Sparkle x={100} y={46} s={6} twinkle delay={0.8} />
          <Sparkle x={96} y={96} s={4} twinkle delay={1.2} />
          <Sparkle x={26} y={96} s={4} twinkle delay={1.7} />
        </g>
      )}
    </svg>
  );
}

/* 10段階の姿とみことば。進むための条件は下の STAGE_PACES に分けてある */
const STAGES = [
  { n: 1,  name: "ふかふかの土",
    verse: "良い地に蒔かれたものとは、みことばを聞いて悟る人のことです。本当に実を結び、あるものは百倍、あるものは六十倍、あるものは三十倍の実を結びます。", ref: "マタイの福音書 13:23" },
  { n: 2,  name: "ちいさな芽",
    verse: "見よ、わたしは新しいことを行う。\n今、それが芽生えている。\nあなたがたは、それを知らないのか。\n必ず、わたしは荒野に道を、\n荒れ地に川を設ける。", ref: "イザヤ書 43:19" },
  { n: 3,  name: "かわいい双葉",
    verse: "私が植えて、アポロが水を注ぎました。しかし、成長させたのは神です。", ref: "コリント人への手紙 第一 3:6" },
  { n: 4,  name: "本葉と小枝",
    verse: "主のおしえを喜びとし\n昼も夜も　そのおしえを口ずさむ人。\nその人は\n流れのほとりに植えられた木。\n時が来ると実を結び\nその葉は枯れず\nそのなすことはすべて栄える。", ref: "詩篇 1:2-3" },
  { n: 5,  name: "青々とした若木",
    verse: "しかし、主を待ち望む者は新しく力を得、\n鷲のように、翼を広げて上ることができる。\n走っても力衰えず、歩いても疲れない。", ref: "イザヤ書 40:31" },
  { n: 6,  name: "小さなつぼみ",
    verse: "神のなさることは、すべて時にかなって美しい。", ref: "伝道者の書 3:11" },
  { n: 7,  name: "可憐な花（満開）",
    verse: "しかし、わたしが与える水を飲む人は、いつまでも決して渇くことがありません。わたしが与える水は、その人の内で泉となり、永遠のいのちへの水が湧き出ます。", ref: "ヨハネの福音書 4:14" },
  { n: 8,  name: "青くて小さな実",
    verse: "しかし、御霊の実は、愛、喜び、平安、寛容、親切、善意、誠実、柔和、自制です。このようなものに反対する律法はありません。", ref: "ガラテヤ人への手紙 5:22-23" },
  { n: 9,  name: "大きく膨らんだ実",
    verse: "私を強くしてくださる方によって、私はどんなことでもできるのです。", ref: "ピリピ人への手紙 4:13" },
  { n: 10, name: "熟した美味しそうな実",
    verse: "ですから、私の愛する兄弟たち。堅く立って、動かされることなく、いつも主のわざに励みなさい。あなたがたは、自分たちの労苦が主にあって無駄でないことを知っているのですから。", ref: "コリント人への手紙 第一 15:58" },
];

/* 記録の日付。無ければ作成日を使う */
const recDate = (r) => (r && (r.date || (r.createdAt || "").slice(0, 10))) || "";

/* 日数も件数も、記録の種類を問わずすべて数える。
   木がきらめく条件「今日なにか記録したか」と揃えている。
   日数は記録に付けた日付の種類数（同じ日に何件書いても1日）。 */
function cycleCounts(records, startedAt) {
  const inCycle = (records || []).filter((r) => r && recDate(r) >= startedAt);
  const days = new Set(inCycle.map(recDate).filter(Boolean));
  return { days: days.size, count: inCycle.length };
}

/* 段階ごとに要る [日数, 件数]（かつ判定）。並びは STAGES と同じ（段階1〜10）。
   **2.14.0〜：すべての木を CURRENT_PACE の表で判定する（`cycle.pace` は判定に使わない）。**
   段階は保存しておらず毎回数え直すので、昔植えた木も更新の瞬間に今のペースの段階へ進む。
   ・pace 1 … 2.10.3 までの表（35日・42件で実る）。今は使っていない（記録として残している）
   ・pace 2 … 2.11.0 からの表（21日・25件で実る）。始めのほうを早めて、変化を感じやすくしてある
   ペースを変えるときは、既存の表を書き換えず新しい番号を足して CURRENT_PACE を上げる（今の方針では全員に即反映される）。 */
const STAGE_PACES = {
  1: [[0, 0], [1, 1], [3, 3], [5, 6], [7, 10], [14, 17], [21, 25], [27, 32], [32, 38], [35, 42]],
  2: [[0, 0], [1, 1], [2, 2], [4, 5], [6, 7], [9, 11], [12, 15], [15, 18], [18, 22], [21, 25]],
};
const CURRENT_PACE = 2; // これから植える木のペース
/* 2.14.0〜：木に保存された pace は見ずに、すべての木を CURRENT_PACE で判定する。
   昔植えた木（pace が無い・1 の木）も今のペースで育つ。段階は毎回数え直しているので、
   途中の木は更新した瞬間に、今のペースの段階まで一気に進む（意図した動き）。
   cycle.pace は植えた時点の記録として残すだけで、判定には使わない。 */
const paceOf = (_cycle) => CURRENT_PACE;

/* 条件を満たしている一番上の段階を返す */
function stageOf(days, count, pace = 1) {
  const table = STAGE_PACES[pace] || STAGE_PACES[1];
  let cur = STAGES[0];
  STAGES.forEach((st, i) => { const [d, c] = table[i]; if (days >= d && count >= c) cur = st; });
  return cur;
}

/* 画面右上の三本線メニュー。各画面から共通で開けるようにコンテキストで配る */
const MenuContext = React.createContext(null);
/* 書き出していない記録の件数。三本線のバッジなどで使う */
const UnsavedContext = React.createContext(0);

/* 重なって出る画面のヘッダに置く三本線。記録の作成・編集画面には出さない */
/* 三本線と、その右上に出す未保存の印。
   印は必ず「アイコンを包んだ span」を基準に置くこと。
   以前はボタンの角からの距離（top:12 / right:9 など）で置いていた。
   この置き方はボタンとアイコンの大きさが特定の組み合わせのときしか合わず、
   タブの見出し（ボタン56px・アイコン32px）では印がアイコンに重なっていた。
   アイコン基準にしておけば、どの大きさの組み合わせでも必ず右上に出る */
function MenuIconWithBadge({ size, unsaved, ringClass }) {
  return (
    <span className="relative inline-flex">
      <Menu size={size} strokeWidth={2.4} />
      {unsaved > 0 && (
        <span className={"absolute bg-amber-500 border-2 " + ringClass}
          style={{ top: -5, right: -5, width: 14, height: 14, borderRadius: 9999 }} />
      )}
    </span>
  );
}

/* 重なって出る画面の三本線。
   **大きさはタブの見出し（ScreenHeader）とそろえること。**
   別々の数にしていたため、画面を移ると三本線の大きさが変わって見えた */
const MENU_BTN = 56;
const MENU_ICON = 32;
/* guard：開く前に確かめたいことがある画面（画面のカスタマイズの「保存していない変更」）だけ渡す。
   guard(open) の形で呼ぶので、確かめ終わったら open() を呼ぶこと（2.10.0〜） */
function MenuButton({ size = MENU_BTN, guard }) {
  const openMenu = React.useContext(MenuContext);
  const unsaved = React.useContext(UnsavedContext);
  if (!openMenu) return null;
  return (
    <button onClick={guard ? () => guard(openMenu) : openMenu} aria-label={unsaved > 0 ? `メニュー（未保存 ${unsaved}件）` : "メニュー"}
      className="relative flex items-center justify-center rounded-xl text-neutral-800 hover:bg-neutral-200/70 ft-tap ft-tap-icon shrink-0"
      style={{ minWidth: size, minHeight: size }}>
      <MenuIconWithBadge size={MENU_ICON} unsaved={unsaved} ringClass="border-white" />
    </button>
  );
}

/* 画面の上に留める見出しと帯（下の4タブの画面だけで使う）。
   **画面ぜんたいを送る場所で、見出しや帯を position: sticky にしないこと。**
   iPhone（WebKit）は sticky の部品を「流れの中の本来の場所」で見えているか判断し、
   本来の場所が画面から大きく離れると絵を捨てる。下へ送ると見出しが先に、
   少し下の帯があとから透けて消え、うしろの記録が見えてしまう（姉妹アプリ My手帳 で実機確認ずみ）。
   Mac や Android（Chromium）では起きないので、そちらで確かめて「直った」と判断しないこと。
   ここでは、見出しと帯を画面に固定（position: fixed）し、流れの中には同じ高さの場所取りを置く。
   高さは測って追いかける。**数字で決め打ちにしないこと**（文字を大きくすると中身が見出しの下にもぐる） */
function TopChrome({ children }) {
  const boxRef = useRef(null);
  const [h, setH] = useState(0);
  /* 描く前に測る。useEffect にしないこと。一瞬、中身が見出しの下にもぐって見える */
  React.useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;
    const put = () => {
      const v = el.getBoundingClientRect().height;
      setH((p) => (Math.abs(p - v) < 0.1 ? p : v));
    };
    put();
    /* 画面を回したときは、見張りだけに任せず、少しあとにも測り直す */
    const later = () => { put(); requestAnimationFrame(put); setTimeout(put, 160); setTimeout(put, 420); };
    window.addEventListener("resize", later);
    window.addEventListener("orientationchange", later);
    let ro = null;
    if (typeof ResizeObserver !== "undefined") { ro = new ResizeObserver(put); ro.observe(el); }
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", later);
      window.removeEventListener("orientationchange", later);
    };
  }, []);
  return (
    <>
      <div aria-hidden="true" style={{ height: h }} />
      <div ref={boxRef} className="ft-topchrome ft-page">
        <div className="max-w-lg lg:max-w-5xl mx-auto">{children}</div>
      </div>
    </>
  );
}

/* 画面の説明文は置かない。使い方はメニューの「ヘルプ」と「？」にまとめてある。
   説明が無くなったぶん、画面名は大きくしてある */
function ScreenHeader({ title, right }) {
  const openMenu = React.useContext(MenuContext);
  const unsaved = React.useContext(UnsavedContext);
  /* 見出しの高さを測って、みんなが使えるところ（--ft-head-h）に書いておく。
     **数を決め打ちしないこと。** 文字の大きさを変えると見出しも高くなり、
     その下に貼りつけた部品が見出しに食い込む */
  const headRef = useRef(null);
  useEffect(() => {
    const el = headRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    /* 幅（--ft-head-w）も書いておく。ヘッダーの写真を切り抜くとき、帯と同じ形の窓にするため
       （headerBandAspect が読む）。広い画面では帯が画面いっぱいではないので、画面の幅では代わりにならない */
    const write = () => {
      const r = el.getBoundingClientRect();
      if (r.height > 0) document.documentElement.style.setProperty("--ft-head-h", Math.round(r.height) + "px");
      if (r.width > 0) document.documentElement.style.setProperty("--ft-head-w", Math.round(r.width) + "px");
    };
    write();
    const ro = new ResizeObserver(write);
    ro.observe(el);
    /* **見張りだけに任せないこと。** 画面を回した直後はまだ並べ替えの途中なので、少しあとにもう一度測る */
    const later = () => {
      write();
      requestAnimationFrame(write);
      setTimeout(write, 160);
      setTimeout(write, 420);
    };
    window.addEventListener("resize", later);
    window.addEventListener("orientationchange", later);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", later);
      window.removeEventListener("orientationchange", later);
    };
  }, []);
  return (
    <div ref={headRef} className="ft-hdr px-5 pb-2.5 ft-page border-b border-th-200" style={SAFE_TOP(18)}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0"><h1 className="font-display text-[27px] text-neutral-900 tracking-wide truncate">{title}</h1></div>
        <div className="flex items-center gap-1 shrink-0">
          {right}
          {openMenu && (
            <button onClick={openMenu} aria-label={unsaved > 0 ? `メニュー（未保存 ${unsaved}件）` : "メニュー"}
              className="relative flex items-center justify-center rounded-xl text-neutral-800 hover:bg-neutral-200/70 ft-tap ft-tap-icon shrink-0"
              style={{ minWidth: MENU_BTN, minHeight: MENU_BTN }}>
              <MenuIconWithBadge size={MENU_ICON} unsaved={unsaved} ringClass="border-neutral-50" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* 右から出てくる一般的なドロワーメニュー */
function MenuRow({ it }) {
  const [pressed, go] = useTapThen(it.onClick);
  /* busy ＝ その行の仕事（更新の確認など）の最中。しるしをくるくるに替え、押しても受けない */
  return (
    <button onClick={it.busy ? undefined : go} aria-busy={it.busy ? "true" : undefined}
      className={"w-full flex items-center gap-3 px-5 py-3.5 text-left min-h-[56px] ft-tap ft-tap-card "
        + (pressed ? "bg-neutral-200 ft-tap-pressed" : "hover:bg-neutral-50")}>
      <span className="w-10 h-10 rounded-xl bg-th-50 border border-th-200 flex items-center justify-center shrink-0 text-th-800">{it.busy ? <Spinner size={20} /> : it.icon}</span>
      <span className="flex-1 min-w-0">
        <span className="block font-display text-[17px] text-neutral-900 tracking-wide">{it.label}</span>
        {it.desc && <span className="block text-[12.5px] text-neutral-500 mt-0.5">{it.desc}</span>}
      </span>
      <CountBadge n={it.badge} size={22} />
      <ChevronRight size={18} className="text-neutral-400 shrink-0" />
    </button>
  );
}

/* 移った先の画面の下へ、板を沈める（2.10.0〜。姉妹アプリ My手帳 2.20.6 と同じ）。
   メニューの行を押したら、板は**その場に残したまま**この高さへ下げ、
   右から入ってくる画面（MENU_LIFT_Z）に上からかぶせてもらう。
   ・MENU_UNDER_Z は、メニューを開ける画面のうちいちばん上のもの（記録の閲覧の 60）より上、
     移った先の画面より下。**60 以下にしないこと。** 記録の閲覧から開いたとき、板がその下へもぐってパッと消える
   ・**板を右へ滑らせないこと**（入ってくる画面とすれ違う）。**その場で消さないこと**（パッと消えて見える）
   ・かぶせ終わったら（AppMain の goFromMenu）、見えないところで外す */
const MENU_UNDER_Z = 65;
const MENU_LIFT_Z = 66;
function SideMenu({ open, onClose, items, footer, instant, under }) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const [shield, setShield] = useState(false);

  useEffect(() => {
    let t;
    if (open) {
      setMounted(true);
      t = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
      return () => cancelAnimationFrame(t);
    }
    /* 移った先の画面の下に沈めていたとき（under）は、もう画面に隠れている。
       **ここで滑らせたり薄れさせたりしないこと。** すぐ外す */
    if (under) {
      setShown(false);
      setShield(false);
      setMounted(false);
      return undefined;
    }
    /* 画面へ移るときは、メニューが左へ滑って消える動きを見せない。
       元の画面はそのままで、新しい画面だけが右から来るようにするため */
    if (instant) {
      /* 画面へ移るときは、メニューを動かさずその場で消す。
         ただし要素を即座に外すと、その位置にある別のものがタップを拾って
         違う画面が開いてしまう。透明なまま少しの間だけ残して受け止める */
      setShown(false);
      setShield(true);
      const q = setTimeout(() => { setShield(false); setMounted(false); }, 320);
      return () => clearTimeout(q);
    }
    setShown(false);
    const timer = setTimeout(() => setMounted(false), 260);
    return () => clearTimeout(timer);
  }, [open]); // eslint-disable-line

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted) return null;
  /* 沈めた板（under）は、閉じたその描き直しで外すこと（2.11.1〜）。
     goFromMenu の finish は、板を閉じる（open=false）のと同時に、移った先の画面を
     66 から 50 へ下ろす（menuLift を外す）。上の useEffect で mounted を落とすのを待つと、
     そのあいだの1コマだけ、板（65）が画面（50）より上に来て、メニューがチラッと映っていた。
     **useEffect の setMounted(false) だけに任せないこと。** */
  if (!open && under) return null;
  return (
    <div data-ft-overlay="" className="fixed inset-0" style={{ zIndex: under ? MENU_UNDER_Z : 2147483200 }}>
      <BackgroundLock />
      <div
        onClick={under ? undefined : onClose}
        className="absolute inset-0 bg-black/40"
        style={{ opacity: shown ? 1 : 0, transition: "opacity 240ms cubic-bezier(0.16,1,0.3,1)" }}
      />
      <div
        className="absolute top-0 right-0 h-full w-[84%] max-w-[340px] bg-white shadow-xl flex flex-col"
        style={{ transform: shown ? "translateX(0)" : "translateX(100%)", transition: "transform 260ms cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="ft-hdr flex items-center justify-between px-5 pb-4 border-b border-neutral-200 shrink-0" style={SAFE_TOP(16)}>
          <span className="font-display text-[18px] text-neutral-900">メニュー</span>
          <button onClick={onClose} aria-label="閉じる"
            className="min-w-[52px] min-h-[52px] flex items-center justify-center rounded-xl text-neutral-600 hover:bg-neutral-100"><X size={28} /></button>
        </div>
        <div className="flex-1 overflow-y-auto py-2 ft-seq">
          {items.map((it) => (
            <MenuRow key={it.label} it={it} />
          ))}
        </div>
        {footer && (
          /* **高さは下の帯（タブ）とそろえること。**
             以前は中身なりの高さで、通常の画面の帯と食い違って見えていた。
             --ft-nav-h は帯の厚み（56px ＋ 切り欠き）。数字を書き写さないこと */
          <div className="border-t border-neutral-200 px-5 shrink-0 flex items-center"
            style={{ minHeight: "var(--ft-nav-h, 56px)", paddingBottom: "env(safe-area-inset-bottom)" }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* YouTubeの埋め込み再生は廃止した。
   メモ欄に貼られたURLは、種類を問わず同じように押せるリンクとして描いている
   （HighlightedText が受け持つ） */

/* ============================================================
   種類ラベル / バッジ
   ============================================================ */
/* 「疑問」は廃止した。古い記録は migrateRecord で「その他」へ移している。
   万一残っていても壊れないよう、TYPE_COLORS には控えを残してある */
const TYPE_LABELS = { reading: "通読", message: "学び", memorization: "聖句", memo: "その他" };
/* 探すの「記録の種類」で並べる順。TYPE_LABELS の並びをそのまま使う */
const SEARCH_TYPES = ["reading", "message", "memorization", "memo"];
const TYPE_BADGE = {
  reading: "bg-blue-50 text-blue-800 border border-blue-200",
  message: "bg-amber-50 text-amber-800 border border-amber-200",
  memorization: "bg-emerald-50 text-emerald-800 border border-emerald-200",
  memo: "bg-neutral-100 text-neutral-700 border border-neutral-300",
  /* 「疑問」は廃止したが、万一残っていても色が付くように控えを残す */
  question: "bg-rose-50 text-rose-800 border border-rose-200",
};
function TypeBadge({ type }) { const N = useTypeName(); return <span className={"text-[11.5px] font-bold px-2 py-0.5 rounded-full " + TYPE_BADGE[type]}>{N[type] || TYPE_LABELS[type]}</span>; }

/* tags はどの種類の記録にも共通で持たせる自由なラベル。
   決まった一覧を持たず、これまでに使った言葉を集めて候補にするので、
   新しいタグが増えても探す側の作りを直す必要はない */
function emptyRecord(type) {
  /* images ＝ 記録に付けた写真（「photo:番号」の並び）。**どの種類にも持たせること** */
  const base = { id: uid(), type, createdAt: new Date().toISOString(), tags: [], images: [] };
  if (type === "reading") return { ...base, date: todayStr(), book: "", chapters: [], passageText: "", notes: "" };
  if (type === "message") return { ...base, date: todayStr(), theme: "", passageText: "", mainVerseText: "", notes: "" };
  if (type === "memorization") return { ...base, date: todayStr(), text: "", note: "", monthYear: null, monthMonth: null, themeYear: null };
  /* その他は「日付・メモ・タグ」だけの、いちばん自由な記録 */
  return { ...base, date: todayStr(), notes: "" };
}

/* ============================================================
   削除確認ダイアログ
   ============================================================ */
function ConfirmDeleteDialog({ onConfirm, onCancel }) {
  return (
    <div data-ft-overlay="" className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center px-6">
      <BackgroundLock />
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-neutral-200 shadow-xl anim-pop max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-[17px] text-neutral-900 mb-2">この記録を削除しますか？</h3>
        <p className="text-[13.5px] text-neutral-600 mb-5">記録そのものが消えます。この操作は取り消せません。</p>
        <div className="flex gap-2.5">
          <button onClick={onCancel} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</button>
          <button onClick={onConfirm} className={BTN_DANGER + " flex-1 " + BTN_H + " text-[14.5px]"}>削除する</button>
        </div>
      </div>
    </div>
  );
}

function ExitConfirmDialog({ onSave, onDiscard, onStay }) {
  return (
    <div data-ft-overlay="" className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center px-6">
      <BackgroundLock />
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-neutral-200 shadow-xl anim-pop max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-[17px] text-neutral-900 mb-2">保存されていない内容があります</h3>
        <p className="text-[13.5px] text-neutral-600 mb-5">この記録を保存しますか？保存しない場合、入力した内容は失われます。</p>
        <div className="flex gap-2.5 mb-2.5">
          <button onClick={onDiscard} className={BTN_DANGER_SOFT + " flex-1 " + BTN_H + " text-[14.5px]"}>保存しない</button>
          <button onClick={onSave} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>保存する</button>
        </div>
        <button onClick={onStay} className={BTN_QUIET + " w-full " + BTN_H + " text-[14.5px]"}>キャンセル</button>
      </div>
    </div>
  );
}

/* 同じ箇所に残した過去の記録を、静かに思い出させるパネル */
function PastNotesPanel({ notes }) {
  const [open, setOpen] = useState(false);
  if (!notes.length) return null;
  return (
    <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50/60 overflow-hidden">
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-2 px-3.5 py-3 text-left min-h-[48px] ft-tap ft-tap-card">
        <Sparkles size={16} className="text-amber-700 shrink-0" />
        <span className="flex-1 text-[13.5px] font-bold text-amber-900">この箇所には過去のメモがあります（{notes.length}件）</span>
        <ChevronDown size={17} className={"text-amber-700 shrink-0 ft-chev " + (open ? "ft-chev-on" : "")} />
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-2 ft-open-y">
          {notes.map((r) => (
            <div key={r.id} className="rounded-lg bg-white border border-amber-200 px-3 py-2.5">
              <div className="flex items-center gap-2 mb-1">
                <TypeBadge type={r.type} />
                <span className="text-[11.5px] font-bold text-neutral-500 ml-auto">{r.date}</span>
              </div>
              <p className="text-[13.5px] text-neutral-700 whitespace-pre-line">{clampText(recordFullDisplay(r), 4)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   記録フォーム
   ============================================================ */
function RecordForm({ initial, draft, onSave, onCancel, onDelete, allRecords, captions, onAutoDraft, typeLocked, knownTags, onCreateTag }) {
  /* 通読は、選んだ書・章を「読んだ箇所」の文字にも出しておく（showPickedChapters） */
  const startRecord = () => showPickedChapters(initial ? migrateRecord(initial) : (draft || emptyRecord(initial?.type || "reading")));
  const [type, setType] = useState(initial?.type || draft?.type || "reading");
  const [record, setRecord] = useState(startRecord);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [imgMsg, setImgMsg] = useState("");
  /* 今月・今年の聖句を、ほかの記録から付け替えるとき。
     ここでは記録を書き換えず、どれから外すかだけ覚えておき、
     保存が押されたときに実際の付け替えを行う。
     先に外してしまうと、そのあと「キャンセル」されたときに
     元の記録だけ印が消える、という取り返しのつかないことが起きる */
  const [takeover, setTakeover] = useState(null);
  const [steal, setSteal] = useState({ month: null, year: null });
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [baseline, setBaseline] = useState(() => JSON.stringify(startRecord()));

  /* 種類を変えたら中身を作り直す。
     画面を開いた直後には作り直さない。開いた直後にも走らせると、
     「続きから」で引き継いだ内容や書きかけの下書きが消えてしまう。
     「何回目の実行か」で判定すると、Reactの厳格モードでは処理が2回走るため
     すり抜けてしまう。そこで「前回どの種類で用意したか」を覚えておき、
     変わったときだけ作り直す（何回走っても結果が同じになる） */
  const preparedForRef = useRef(type);
  useEffect(() => {
    if (preparedForRef.current === type) return;
    preparedForRef.current = type;
    if (!initial) {
      const fresh = emptyRecord(type);
      undoStack.current = []; redoStack.current = [];
      setRecord(fresh);
      setBaseline(JSON.stringify(fresh));
    }
  }, [type]); // eslint-disable-line
  /* 元に戻す・やり直す。直前の書きかえを、記録ぜんたいのまま覚えておく（項目ごとの差分にしない。
     あとで食い違うおそれがある）。**同じ欄への続けた入力は、ひとまとめ**（1.2秒以内）にする。
     1文字ずつ戻ると、書いた文を消すのに何十回も押すことになるため */
  const recRef = useRef(null);
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const lastEdit = useRef({ key: null, t: 0 });
  const set = (patch) => {
    const cur = recRef.current;
    const keys = Object.keys(patch);
    const key = keys.length === 1 ? keys[0] : null;
    const now = Date.now();
    const merge = key && lastEdit.current.key === key && now - lastEdit.current.t < 1200;
    if (!merge && cur) undoStack.current = [...undoStack.current, cur].slice(-100);
    redoStack.current = [];
    lastEdit.current = { key, t: now };
    setRecord((r) => ({ ...r, ...patch }));
  };
  const undo = () => {
    if (!undoStack.current.length) return;
    const prev = undoStack.current[undoStack.current.length - 1];
    undoStack.current = undoStack.current.slice(0, -1);
    redoStack.current = [...redoStack.current, recRef.current];
    lastEdit.current = { key: null, t: 0 };
    setRecord(prev);
  };
  const redo = () => {
    if (!redoStack.current.length) return;
    const next = redoStack.current[redoStack.current.length - 1];
    redoStack.current = redoStack.current.slice(0, -1);
    undoStack.current = [...undoStack.current, recRef.current];
    lastEdit.current = { key: null, t: 0 };
    setRecord(next);
  };
  const canUndo = undoStack.current.length > 0;
  const canRedo = redoStack.current.length > 0;
  const save = () => { doneRef.current = true; onSave({ ...record, type, updatedAt: new Date().toISOString() }, { steal }); };

  /* 自動下書き。入力が止まって少ししたら、そっと控えを取る。
     アプリが背面に回ったときや閉じられるときは、その場ですぐ控える */
  recRef.current = record;
  const typeRef = useRef(type);
  typeRef.current = type;
  /* **保存・削除・「保存せずに閉じる」のあとは、書きかけを書かないこと（doneRef）。**
     消したはずの記録が、あとから「書きかけの記録があります」に戻ってくるのを防ぐ。
     記録を消す・閉じる新しい道を足したら、その前に doneRef を立てること */
  const doneRef = useRef(false);
  useEffect(() => {
    if (!onAutoDraft) return;
    const t = setTimeout(() => { if (!doneRef.current) onAutoDraft({ ...record, type }); }, 800);
    return () => clearTimeout(t);
  }, [record, type]); // eslint-disable-line
  useEffect(() => {
    if (!onAutoDraft) return;
    const flush = () => { if (!doneRef.current) onAutoDraft({ ...recRef.current, type: typeRef.current }); };
    const onHide = () => { if (document.visibilityState === "hidden") flush(); };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", flush);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", flush);
    };
  }, []); // eslint-disable-line

  const isDirty = () => JSON.stringify(record) !== baseline;
  const guardClose = () => {
    if (isDirty()) { setShowExitConfirm(true); return false; }
    return true;
  };
  const cancelForm = () => { doneRef.current = true; onCancel(); };
  const [closing, close] = useClosing(cancelForm);
  const [savingClose, setSavingClose] = useState(false);
  const saveTimer = useRef(null);
  useEffect(() => () => clearTimeout(saveTimer.current), []);
  const handleCloseAttempt = () => { if (guardClose()) close(); };
  /* 保存は押したその場で行う（退場の動きを待たない） */
  const saveWithExit = () => {
    if (savingClose) return;
    setSavingClose(true);
    save();
  };
  /* 中身が空のままでは保存できない（空の記録が増えるのを防ぐ） */
  const canSave = hasContent({ ...record, type });

  /* 途中保存（ヘッダの下向き矢印）。書きかけのまま、記録だけを残す。
     下の「保存」と違い、**画面は閉じない**。
     同じidを上書きするので、何度押しても記録は増えない。

     **ここで setType や record の作り直しを行わないこと。**
     画面の構造（新規か編集か）が変わると入力欄が作り直され、
     打っている最中のカーソルが外れる（実際にそうなった）。
     残すのは記録だけで、画面はそのままにしておく。

     保存した時点の中身を baseline に置き直すので、
     そのあと何も書き足さずに閉じれば「保存されていません」とは訊かれない。
     自動下書き（doneRef）はここでは止めない。続きを書いたぶんの控えは、
     これまでどおり取りたいため */
  const [justSaved, setJustSaved] = useState(false);
  const [savedTick, setSavedTick] = useState(0);
  const keepTimer = useRef(null);
  useEffect(() => () => clearTimeout(keepTimer.current), []);
  const saveKeepOpen = () => {
    if (!canSave || savingClose) return;
    /* 「今月・今年の聖句」の付け替えも、ここで確定させる（下の「保存」と同じ）。
       途中保存で実在の記録になる以上、印を2つの記録が持ったままにはできない */
    onSave({ ...record, type, updatedAt: new Date().toISOString() }, { keepOpen: true, steal });
    setBaseline(JSON.stringify(record));
    setJustSaved(true);
    setSavedTick((n) => n + 1);
    clearTimeout(keepTimer.current);
    keepTimer.current = setTimeout(() => setJustSaved(false), 1800);
  };

  /* いま扱っている聖書箇所に、過去の記録があれば拾い上げる */
  /* いま扱っている箇所に、過去の記録があれば拾い上げる。
     見るのは「箇所」の欄だけ。メモに書いたことは、いま書いている途中で
     揺れ動くので、探す手がかりにはしない */
  const pastNotes = useMemo(() => {
    let refs = [];
    if (type === "reading") {
      /* 選んだ章と、手で書いた「読んだ箇所」の両方を見る
         （書・章を選ばずに直接書く人もいる。選んだ書・章は最後に選んだ1つしか
         覚えていないので、文字のほうに別の書があれば、それも拾う）。
         選んだ章は章ぜんたいのまま残し、文字から読んだぶんだけ絞る（recordScopeRefs と同じ） */
      const picked = keepPickedChapters(record.book, record.chapters, record.passageText);
      const fixed = picked.book ? picked.chapters.map((c) => ({ book: picked.book, chapter: c })) : [];
      refs = [...fixed, ...narrowRefs(parseBibleRefs(record.passageText || ""))];
    } else if (type === "message") {
      refs = narrowRefs(parseBibleRefs(record.passageText || ""));
    }
    if (!refs.length) return [];
    return (allRecords || [])
      .filter((r) => r.id !== record.id && recordFullDisplay(r).trim())
      /* **章だけでなく節まで見ること。** 判定は refsOverlap にまかせる。
         相手の記録がどこを扱っているかは recordScopeRefs で決める
         （章だけの言い及びに引きずられないようにするため） */
      .filter((r) => recordScopeRefs(r).some((x) => refs.some((t) => refsOverlap(x, t))))
      .sort((a, b) => (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || ""))
      .slice(0, 6);
  }, [type, record.book, record.chapters, record.passageText, record.id, allRecords]);

  const typeNames = useTypeName();
  const formTitle = initial ? "記録を編集" : (typeLocked ? `${typeNames[type] || TYPE_LABELS[type] || ""}を記録` : "新しい記録");
  const yearOptions = Array.from({ length: 7 }, (_, i) => curYear() - 3 + i);

  /* 今月・今年の聖句を付けようとしたとき、すでに別の記録に付いていないか調べる。
     付いていれば確認を出し、「変える」を選ばれたときだけ、
     どれから外すかを覚えておく（実際に外すのは保存のとき） */
  const holderOfMonth = (y, m) => (allRecords || []).find(
    (r) => r.type === "memorization" && r.id !== record.id && r.monthYear === y && r.monthMonth === m);
  const holderOfYear = (y) => (allRecords || []).find(
    (r) => r.type === "memorization" && r.id !== record.id && r.themeYear === y);

  const wantMonth = (y, m) => {
    if (!y || !m) { set({ monthYear: y || null, monthMonth: m || null }); return; }
    const other = holderOfMonth(y, m);
    if (!other) { setSteal((p) => ({ ...p, month: null })); set({ monthYear: y, monthMonth: m }); return; }
    setTakeover({ kind: "month", what: `${y}年${m}月の聖句`, existing: other,
      apply: () => { setSteal((p) => ({ ...p, month: other.id })); set({ monthYear: y, monthMonth: m }); } });
  };
  const wantYear = (y) => {
    if (!y) { set({ themeYear: null }); return; }
    const other = holderOfYear(y);
    if (!other) { setSteal((p) => ({ ...p, year: null })); set({ themeYear: y }); return; }
    setTakeover({ kind: "year", what: `${y}年の聖句`, existing: other,
      apply: () => { setSteal((p) => ({ ...p, year: other.id })); set({ themeYear: y }); } });
  };

  const { stripRef, screenRef } = useEdgeSwipeBack(cancelForm, guardClose);

  return (
    /* 閲覧画面（60）より手前に出す。閲覧から編集を開くため */
    <OverlayScreen from="bottom" closing={closing || savingClose} zIndex={70}>
      <div ref={stripRef} data-ft-edge="" className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div ref={screenRef} className="absolute inset-0 bg-white flex flex-col">
      {/* ヘッダー：左に「×」、まんなかに種類（しるしと名前）、右に「元に戻す・やり直す・途中保存」。
          ピン留め・ブックマークは、付け外しできる場所を閲覧画面側に一本化したので、ここには置かない。
          まんなかを本当にまんなかにするため、3つの区画（1fr / 自分の幅 / 1fr）に分けている */}
      <div className="ft-hdr grid grid-cols-[1fr_auto_1fr] items-center gap-1 px-3 pb-2.5 border-b border-neutral-200 shrink-0 max-w-2xl mx-auto w-full" style={SAFE_TOP(16)}>
        <div className="flex justify-start">
          <button type="button" onClick={handleCloseAttempt} aria-label="閉じる"
            className="min-w-[48px] min-h-[46px] flex items-center justify-center rounded-full text-neutral-500 hover:bg-neutral-100 ft-tap ft-tap-icon"><X size={26} /></button>
        </div>
        <span className="flex items-center justify-center gap-1.5 min-w-0">
          <span className="text-th-800 flex shrink-0">{(TYPE_GUIDE.find((t) => t.key === type) || {}).icon}</span>
          <span className="font-display text-[15.5px] text-neutral-900 truncate">{typeNames[type] || TYPE_LABELS[type]}</span>
        </span>
        <div className="flex items-center justify-end">
          {/* 無効のときは色を変えず、薄くするだけ（背景に絵を敷いたとき、字が白くなっても区別できるように） */}
          <TapOnceButton onTap={undo} disabled={!canUndo} aria-label="元に戻す"
            className="w-9 h-10 flex items-center justify-center rounded-full text-neutral-600 disabled:opacity-30 ft-tap ft-tap-icon"><Undo2 size={20} /></TapOnceButton>
          <TapOnceButton onTap={redo} disabled={!canRedo} aria-label="やり直す"
            className="w-9 h-10 flex items-center justify-center rounded-full text-neutral-600 disabled:opacity-30 ft-tap ft-tap-icon"><Redo2 size={20} /></TapOnceButton>
          {/* 途中保存。押しても画面は閉じない。押せたあいだ（1.8秒）だけチェックに入れ替わり、
              濃いティールで塗られる。2つのアイコンは重ねて置き、透明度と拡大率で入れ替えて
              いるので、入れ替わってもボタンの幅は動かない。
              **塗られているあいだだけ `ft-onbg-keep` を付けること。** ヘッダに絵を敷いたとき、
              自前の下地（濃いティール）を持つのはこの瞬間だけ。いつも付けると、塗っていない
              ときの `text-th-800` が白く抜かれなくなり、暗い膜の上で見えなくなる */}
          <TapOnceButton onTap={saveKeepOpen} disabled={!canSave} aria-label="途中保存"
            className={"relative ml-1 w-10 h-10 flex items-center justify-center rounded-full disabled:opacity-30 ft-tap ft-tap-icon "
              + (justSaved ? "bg-th-800 text-white ft-onbg-keep" : "text-th-800")}>
            {/* 保存できたときの、ひと粒の波紋。押すたびに key を変えて描き直させている
                （クラスを足すだけでは、すでに置かれている要素は動かない） */}
            {savedTick > 0 && (
              <span key={savedTick} aria-hidden="true"
                className="ft-ring absolute inset-0 rounded-full bg-th-800 pointer-events-none" />
            )}
            <span className="relative flex items-center justify-center" style={{ width: 22, height: 22 }}>
              <span className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: justSaved ? 0 : 1, transform: justSaved ? "scale(0.55)" : "scale(1)", transition: "opacity 180ms ease-out, transform 180ms ease-out" }}>
                <SaveArrowIcon size={22} />
              </span>
              <span className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: justSaved ? 1 : 0, transform: justSaved ? "scale(1)" : "scale(0.55)", transition: "opacity 180ms ease-out, transform 180ms ease-out" }}>
                <SaveCheckIcon size={22} />
              </span>
            </span>
          </TapOnceButton>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full">
        {/* **書き始めるまでの距離を短くすること。** 日付はふだん「今日」のままなので、1行に畳んで
            いちばん上に置く（押すとカレンダー）。すぐ下から本文が始まる。タグは、いちばん下。
            項目名は出さないこと。部品を見れば何を選ぶ場所か分かる */}
        {!initial && !typeLocked && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {Object.entries(TYPE_LABELS).map(([k, v]) => (
              <FilterPill key={k} on={type === k} onClick={() => setType(k)}>{typeNames[k] || v}</FilterPill>
            ))}
          </div>
        )}
        <div className="mb-4">
          <DateInput row value={record.date} onChange={(e) => set({ date: e.target.value })} />
        </div>

        {type === "reading" && (
          <>
            <Field>
              <RefBox refsText={record.passageText}
                inserter={<RefInserter onPickRange={({ book, chapters, passageText }) => set({ book, chapters, passageText: appendRef(record.passageText, passageText) })} />}>
                <TextInput bare value={record.passageText || ""} onChange={(e) => {
                  /* 文字を消した・書き換えたら、選んだ書・章もそれに合わせる（keepPickedChapters）。
                     変わったときだけ一緒に渡すこと。いつも渡すと、1文字ごとに
                     「元に戻す」の区切りができてしまう */
                  const v = e.target.value;
                  const picked = keepPickedChapters(record.book, record.chapters, v);
                  if (picked.chapters === record.chapters) set({ passageText: v });
                  else set({ passageText: v, ...picked });
                }} placeholder="読んだ箇所（例：ヨハネの福音書 3章）" />
              </RefBox>
            </Field>
            <PastNotesPanel notes={pastNotes} />
            <Field>
              <RefBox refsText={record.notes} inserter={<RefInserter onInsert={(ref) => set({ notes: appendRef(record.notes, ref) })} />}>
                <TextArea bare value={record.notes} onChange={(e) => set({ notes: e.target.value })} minRows={3} placeholder="気づいたこと、感じたこと" />
              </RefBox>
            </Field>
          </>
        )}

        {type === "message" && (
          <>
            {/* テーマ（礼拝メッセージの題）。
                ここに聖書箇所を挿入する仕組みは付けない。題を書く場所なので不要 */}
            <Field>
              <TextInput value={record.theme || ""} onChange={(e) => set({ theme: e.target.value })} placeholder="テーマ" />
            </Field>
            <Field>
              <RefBox refsText={record.passageText} inserter={<RefInserter onInsert={(ref) => set({ passageText: appendRef(record.passageText, ref) })} />}>
                <TextInput bare value={record.passageText} onChange={(e) => set({ passageText: e.target.value })} placeholder="聖書箇所" />
              </RefBox>
            </Field>
            <PastNotesPanel notes={pastNotes} />
            <Field>
              <RefBox refsText={record.mainVerseText} inserter={<RefInserter onInsert={(ref) => set({ mainVerseText: appendRef(record.mainVerseText, ref) })} />}>
                <TextArea bare value={record.mainVerseText} onChange={(e) => set({ mainVerseText: e.target.value })} minRows={2} placeholder="主題聖句" />
              </RefBox>
            </Field>
            <Field>
              <RefBox refsText={record.notes} inserter={<RefInserter onInsert={(ref) => set({ notes: appendRef(record.notes, ref) })} />}>
                <TextArea bare value={record.notes} onChange={(e) => set({ notes: e.target.value })} minRows={7} placeholder="聞いたこと、心に残ったこと" />
              </RefBox>
            </Field>
          </>
        )}

        {type === "memorization" && (
          <>
            <Field>
              {/* 学びの「主題聖句」と同じ高さ（2行ぶん）にそろえている */}
              <RefBox refsText={record.text} inserter={<RefInserter onInsert={(ref) => set({ text: appendRef(record.text, ref) })} />}>
                <TextArea bare value={record.text} onChange={(e) => set({ text: e.target.value })} minRows={2} placeholder="覚えたい聖書のことば" />
              </RefBox>
            </Field>
            <Field>
              <RefBox refsText={record.note} inserter={<RefInserter onInsert={(ref) => set({ note: appendRef(record.note, ref) })} />}>
                <TextArea bare value={record.note} onChange={(e) => set({ note: e.target.value })} minRows={2} placeholder="メモ" />
              </RefBox>
            </Field>
            {/* 「今月／今年の聖句にする」は、入り切りのスイッチの2行を白いカード1枚にまとめる。
                ONにした行のすぐ下に、年・月を選ぶ欄が出る。高さは決め打ちにしない
                （中の文字の大きさに合わせて伸び縮みする） */}
            <div className="rounded-2xl border border-neutral-200 bg-white overflow-hidden mb-4">
              <div className="px-4 py-2 min-h-[58px] flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-[15.5px] text-neutral-900 flex items-center gap-1.5 min-w-0"><Star size={15} className="text-th-800 shrink-0" /> 今月の聖句</span>
                  <HelpTip label="今月の聖句" text="選んだ月のあいだ、ホーム画面に表示されます。" />
                  <span className="flex-1" />
                  <Switch on={!!record.monthYear} label="今月の聖句にする"
                    onChange={(v) => v ? wantMonth(curYear(), curMonth()) : (setSteal((p) => ({ ...p, month: null })), set({ monthYear: null, monthMonth: null }))} />
                </div>
                {record.monthYear && (
                  <div className="flex gap-2 pb-2">
                    <div className="flex-1"><DrumSelect value={record.monthYear} onChange={(v) => wantMonth(v, record.monthMonth)} placeholder="年" title="年を選択" options={yearOptions.map((y) => ({ value: y, label: `${y}年` }))} /></div>
                    <div className="flex-1"><DrumSelect value={record.monthMonth} onChange={(v) => wantMonth(record.monthYear, v)} placeholder="月" title="月を選択" options={Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}月` }))} /></div>
                  </div>
                )}
              </div>
              <div className="border-t border-neutral-200 px-4 py-2 min-h-[58px] flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-[15.5px] text-neutral-900 flex items-center gap-1.5 min-w-0"><Star size={15} className="text-th-800 shrink-0" /> 今年の聖句</span>
                  <HelpTip label="今年の聖句" text="1年のあいだ、ホーム画面に表示されます。" />
                  <span className="flex-1" />
                  <Switch on={!!record.themeYear} label="今年の聖句にする"
                    onChange={(v) => v ? wantYear(curYear()) : (setSteal((p) => ({ ...p, year: null })), set({ themeYear: null }))} />
                </div>
                {record.themeYear && (
                  <div className="pb-2">
                    <DrumSelect value={record.themeYear} onChange={(v) => wantYear(v)} placeholder="年" title="年を選択" options={yearOptions.map((y) => ({ value: y, label: `${y}年` }))} />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {type === "memo" && (
          <>
            <Field>
              <RefBox refsText={record.notes} inserter={<RefInserter onInsert={(ref) => set({ notes: appendRef(record.notes, ref) })} />}>
                <TextArea bare value={record.notes} onChange={(e) => set({ notes: e.target.value })} minRows={7} placeholder="書きとめておきたいこと" />
              </RefBox>
            </Field>
          </>
        )}

        {/* 写真 → タグ の順。**記録の種類にかかわらず、ここに置くこと**（どの種類でも同じ場所にある） */}
        <Field>
          <ImagesField images={record.images} onChange={(v) => set({ images: v })} onError={(m) => setImgMsg(m)} />
          {imgMsg && <p className="text-[12.5px] text-red-700 mt-1.5">{imgMsg}</p>}
        </Field>
        <Field>
          <TagField value={record.tags} onChange={(v) => set({ tags: v })} knownTags={knownTags} onCreateTag={onCreateTag} />
        </Field>

        <div className="flex flex-col items-center pt-3 pb-1">
          <div className="opacity-70"><Mascot seed={"form-" + type} size={104} /></div>
          {((captions && captions[type]) || "").trim() && (
            /* 改行をそのまま出す。ひとことは何行になってもよい */
            <p className="text-[12.5px] text-neutral-500 mt-1.5 text-center px-4 leading-relaxed whitespace-pre-line">{captions[type]}</p>
          )}
        </div>
      </div>

      <div className="shrink-0 flex gap-2.5 px-5 py-4 border-t border-neutral-200 bg-white max-w-2xl mx-auto w-full" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}>
        {initial && <button onClick={() => setConfirmDelete(true)} className={BTN_DANGER_SOFT + " flex-1 " + BTN_H + " text-[14.5px]"}><Trash2 size={16} /> 削除</button>}
        <TapButton onClick={handleCloseAttempt} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</TapButton>
        <TapButton onClick={saveWithExit} disabled={!canSave} style={{ flex: 1.4 }} className={BTN_PRIMARY + " " + BTN_H + " text-[14.5px]"}><Check size={17} /> 保存</TapButton>
      </div>
      </div>

      {takeover && (
        <HighlightTakeoverDialog what={takeover.what} existing={takeover.existing}
          onConfirm={() => { takeover.apply(); setTakeover(null); }}
          onCancel={() => setTakeover(null)} />
      )}
      {confirmDelete && <ConfirmDeleteDialog onConfirm={() => { doneRef.current = true; onDelete(record.id); }} onCancel={() => setConfirmDelete(false)} />}
      {showExitConfirm && (
        <ExitConfirmDialog
          onSave={() => { setShowExitConfirm(false); save(); }}
          onDiscard={() => { setShowExitConfirm(false); cancelForm(); }}
          onStay={() => setShowExitConfirm(false)}
        />
      )}
    </OverlayScreen>
  );
}

/* ============================================================
   重複登録の確認ダイアログ
   ============================================================ */
function DuplicateDialog({ existing, onRegister, onViewExisting, onCancel }) {
  return (
    <div data-ft-overlay="" className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center px-6">
      <BackgroundLock />
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-neutral-200 shadow-xl anim-pop max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-[17px] text-neutral-900 mb-3">同じ聖句が登録済みです</h3>
        <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 mb-4">
          <p className="text-[13.5px] font-bold text-th-800 mb-1">{formatRef(primaryRef(existing.text))}</p>
          <p className="text-[13.5px] text-neutral-700 line-clamp-3">{existing.text}</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <button onClick={onRegister} className={BTN_PRIMARY + " " + BTN_H + " text-[15.5px]"}>それでも登録する</button>
          <button onClick={onViewExisting} className={BTN_SECONDARY + " " + BTN_H + " text-[15.5px]"}>以前の登録内容を見る</button>
          <button onClick={onCancel} className={BTN_QUIET + " " + BTN_H + " text-[14.5px]"}>キャンセル</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   記録の表示ヘルパ
   ============================================================ */
function recordTitle(r) {
  if (r.type === "reading") return `${r.book || "（書が未選択）"} ${formatChapterList(r.chapters)}`;
  /* 学びは、題（テーマ）があればそれがいちばん分かりやすい */
  if (r.type === "message") return (r.theme || "").trim() || r.passageText || formatRef(primaryRef(r.mainVerseText)) || "学び";
  if (r.type === "memorization") return formatRef(primaryRef(r.text)) || "聖句";
  if (r.type === "memo") return (r.tags || [])[0] || (r.notes || "").split("\n")[0].slice(0, 40) || "その他";
  return "";
}
function recordSnippet(r) {
  if (r.type === "reading") return r.notes || "";
  if (r.type === "message") return r.mainVerseText || r.notes || "";
  if (r.type === "memorization") return r.text || "";
  if (r.type === "memo") return r.notes || "";
  return "";
}
/* 記録の中身を「項目名つきのかたまり」で返す。
   項目名は画面側で小さなラベルとして描くので、ここでは記号を付けない */
function recordSections(r) {
  if (!r) return [];
  if (r.type === "reading") return r.notes ? [{ label: null, text: r.notes }] : [];
  if (r.type === "message") {
    /* 並びは入力画面と同じ順にすること。見る側と書く側で順が違うと戸惑う */
    const out = [];
    if (r.theme) out.push({ label: "テーマ", text: r.theme });
    if (r.passageText) out.push({ label: "聖書箇所", text: r.passageText });
    if (r.mainVerseText) out.push({ label: "主題聖句", text: r.mainVerseText });
    if (r.notes) out.push({ label: "メモ", text: r.notes });
    return out;
  }
  if (r.type === "memorization") {
    const out = [];
    if (r.text) out.push({ label: null, text: r.text });
    if (r.note) out.push({ label: "メモ", text: r.note });
    return out;
  }
  if (r.type === "memo") return r.notes ? [{ label: null, text: r.notes }] : [];
  return [];
}
/* 何行かだけ見せたいときは、CSSではなくここで文字そのものを切ること。
   line-clamp と whitespace-pre-line を一緒に使うと、iPhoneのSafariでは
   見た目だけ切り詰められ、箱の高さは全文ぶん確保されてしまう。
   （たたみ部品の中に、大きな余白ができる原因になっていた） */
function clampText(text, lines, maxChars = 220) {
  const s = String(text == null ? "" : text).replace(/\n{3,}/g, "\n\n").trim();
  if (!s) return "";
  const arr = s.split("\n");
  let out = arr.slice(0, lines).join("\n");
  let cut = arr.length > lines;
  if (out.length > maxChars) { out = out.slice(0, maxChars); cut = true; }
  return cut ? out.replace(/\s+$/, "") + "…" : out;
}

/* 一覧のプレビューや書き出し用。こちらは1本の文字列にする */
function recordFullDisplay(r) {
  return recordSections(r).map((sc) => (sc.label ? sc.label + "\n" : "") + sc.text).join("\n\n");
}
/* 言葉で探したとき、当たった語を色で塗る。検索は記録ぜんたいに共通の操作なので、
   記録ごとの色ではなくテーマ色（.ft-hit）を使う */
function HitText({ text, word }) {
  if (!word || !text) return text;
  const lower = text.toLowerCase();
  const w = word.toLowerCase();
  const out = [];
  let pos = 0, i;
  while ((i = lower.indexOf(w, pos)) !== -1) {
    if (i > pos) out.push(text.slice(pos, i));
    out.push(<mark key={i} className="ft-hit">{text.slice(i, i + w.length)}</mark>);
    pos = i + w.length;
  }
  if (pos < text.length) out.push(text.slice(pos));
  return out;
}
/* 当たった語のまわりの短い抜き出し（最大3か所）。札に見えている文にはないところを見せるために使う */
function hitSnippets(r, word) {
  const all = recordAllText(r);
  const lower = all.toLowerCase();
  const w = word.toLowerCase();
  const out = [];
  let pos = 0, i;
  while (out.length < 3 && (i = lower.indexOf(w, pos)) !== -1) {
    const from = Math.max(0, i - 14);
    const to = Math.min(all.length, i + w.length + 26);
    out.push({ pre: (from > 0 ? "…" : "") + all.slice(from, i).replace(/\n/g, " "), hit: all.slice(i, i + w.length), post: all.slice(i + w.length, to).replace(/\n/g, " ") + (to < all.length ? "…" : "") });
    pos = to;
  }
  return out;
}

/* 記録の札。
   hit ＝ 言葉で探したときの語（当たった語を塗り、札に見えていない場所に当たったときは抜き出しを出す）。
   selectMode / selected / onLongPress ＝ 長押しで選ぶモード（探す画面の結果で、まとめて消すときに使う） */
function RecordCard({ r, onClick, hit, selectMode, selected, onLongPress }) {
  const [pressed, go] = useTapThen(onClick);
  const chips = chipRefs(recordRefs(r));
  const title = recordTitle(r);
  const snippet = recordSnippet(r) ? clampText(recordSnippet(r), 3) : "";
  const lp = useRef({ t: null, fired: false, x: 0, y: 0 });
  useEffect(() => () => clearTimeout(lp.current.t), []);
  const clear = () => clearTimeout(lp.current.t);
  const seen = hit ? (title + "\n" + snippet).toLowerCase().includes(hit.toLowerCase()) : true;
  const extra = hit && !seen ? hitSnippets(r, hit) : [];
  return (
    <button
      onClick={() => { if (lp.current.fired) { lp.current.fired = false; return; } go(); }}
      onPointerDown={onLongPress ? (e) => {
        lp.current.fired = false; lp.current.x = e.clientX; lp.current.y = e.clientY;
        clear();
        lp.current.t = setTimeout(() => { lp.current.fired = true; onLongPress(); }, 500);
      } : undefined}
      onPointerMove={onLongPress ? (e) => { if (Math.hypot(e.clientX - lp.current.x, e.clientY - lp.current.y) > 10) clear(); } : undefined}
      onPointerUp={onLongPress ? clear : undefined}
      onPointerCancel={onLongPress ? clear : undefined}
      onContextMenu={onLongPress ? (e) => e.preventDefault() : undefined}
      style={{ ...(onLongPress ? { WebkitTouchCallout: "none" } : null), ...(selectMode ? { paddingLeft: 48 } : null) }}
      className={(pressed ? "ft-tap-pressed " : "") + "w-full text-left border bg-white rounded-2xl px-4 py-3.5 flex flex-col gap-1.5 relative ft-tap ft-tap-card hover:bg-neutral-50/70 "
        + (selected ? "border-th-800 bg-th-50/40" : "border-neutral-200")}>
      {selectMode && (
        <span aria-hidden="true" className={"absolute left-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-2 flex items-center justify-center " + (selected ? "border-th-800 bg-th-800 text-white" : "border-neutral-300 bg-white")}>
          {selected && <Check size={14} strokeWidth={3} />}
        </span>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <TypeBadge type={r.type} />
        {r.date && <span className="text-[12.5px] font-bold text-neutral-500 ml-auto">{r.date}</span>}
        {r.pinned && <Pin size={15} className="text-th-800 shrink-0" fill="currentColor" strokeWidth={1.5} />}
        {r.bookmarked && <Bookmark size={15} className="text-th-800 shrink-0" fill="currentColor" strokeWidth={1.5} />}
      </div>
      <div className="text-[15.5px] text-neutral-900 font-bold"><HitText text={title} word={hit} /></div>
      {snippet && <div className="text-[13.5px] text-neutral-600 whitespace-pre-line"><HitText text={snippet} word={hit} /></div>}
      {/* 写真の小さな見本。**札の中では押せるようにしないこと。**
          札そのものを押して開くのが先で、中に別の押し所があると、どちらが効くのか分からなくなる */}
      {(r.images || []).length > 0 && (
        <div className="flex gap-1.5 mt-0.5">
          {(r.images || []).slice(0, 4).map((src, i) => (
            <span key={i} className="block w-12 h-12 rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100 shrink-0">
              <Photo src={src} className="block w-full h-full" style={{ objectFit: "cover" }} />
            </span>
          ))}
          {(r.images || []).length > 4 && (
            <span className="self-center text-[11.5px] font-bold text-neutral-500">＋{(r.images || []).length - 4}</span>
          )}
        </div>
      )}
      {chips.length > 0 && <div className="flex flex-wrap gap-1.5 mt-0.5">{chips.map((c, i) => <span key={i} className="text-[11.5px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">{c.book}{c.chapter ? ` ${c.chapter}` : ""}</span>)}</div>}
      {extra.length > 0 && (
        <div className="mt-0.5 rounded-lg bg-th-50/60 border border-th-100 px-2.5 py-1.5 space-y-0.5">
          {extra.map((x, i) => <div key={i} className="text-[12.5px] text-neutral-600">{x.pre}<mark className="ft-hit">{x.hit}</mark>{x.post}</div>)}
        </div>
      )}
    </button>
  );
}

/* ============================================================
   ① ホーム画面（今年の聖句・今月の聖句・カレンダー）
   ============================================================ */
function ymd(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function startOfWeek(d) { const r = new Date(d); r.setDate(r.getDate() - r.getDay()); r.setHours(0, 0, 0, 0); return r; }

function CalendarView({ records, onOpenDay }) {
  const [viewMode, setViewMode] = useState("week"); // week | month
  const [cursor, setCursor] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [selectedDate, setSelectedDate] = useState(null);

  const byDate = useMemo(() => {
    const map = {};
    records.filter((r) => ["reading", "message"].includes(r.type) && r.date).forEach((r) => { (map[r.date] = map[r.date] || []).push(r); });
    return map;
  }, [records]);

  const shiftMonth = (delta) => { let m = cursor.m + delta, y = cursor.y; if (m < 0) { m = 11; y -= 1; } if (m > 11) { m = 0; y += 1; } setCursor({ y, m }); setSelectedDate(null); };
  const shiftWeek = (delta) => { setWeekStart((prev) => { const d = new Date(prev); d.setDate(d.getDate() + delta * 7); return d; }); setSelectedDate(null); };
  /* 押した向きへ、カレンダーが紙送りされるように見せる。
     dir は「どちらへ動かしたか」、seq は「何回動かしたか」。
     seq を key に混ぜているのは、同じ向きに続けて押しても毎回動かすため */
  const [flip, setFlip] = useState({ dir: 0, seq: 0 });
  const shift = (delta) => {
    setFlip((f) => ({ dir: delta, seq: f.seq + 1 }));
    return viewMode === "week" ? shiftWeek(delta) : shiftMonth(delta);
  };
  const flipCls = flip.dir === 0 ? "" : flip.dir > 0 ? "ft-page-l" : "ft-page-r";

  /* 期間ジャンプ（年・月を選んで一気に移動） */
  const [jumpOpen, setJumpOpen] = useState(false);
  const shownY = viewMode === "week" ? weekStart.getFullYear() : cursor.y;
  const shownM = viewMode === "week" ? weekStart.getMonth() + 1 : cursor.m + 1;
  const doJump = (y, m) => {
    if (viewMode === "week") setWeekStart(startOfWeek(new Date(y, m - 1, 1)));
    else setCursor({ y, m: m - 1 });
    setSelectedDate(null);
    setJumpOpen(false);
  };
  const goToday = () => {
    const now = new Date();
    if (viewMode === "week") setWeekStart(startOfWeek(now));
    else setCursor({ y: now.getFullYear(), m: now.getMonth() });
    setSelectedDate(null);
  };
  /* 記録のある年も候補に入れて、古い記録まで一気に飛べるようにする */
  const yearsForJump = jumpYears(shownY, records.map((r) => (r.date ? Number(r.date.slice(0, 4)) : NaN)));


  const renderDayCell = (d, ds, key) => {
    const list = byDate[ds]; const has = !!list; const isSelected = selectedDate === ds;
    const types = has ? new Set(list.map((r) => r.type)) : new Set();
    const dow = new Date(ds + "T00:00:00").getDay();
    const plainColor = dow === 0 ? "text-rose-600" : dow === 6 ? "text-sky-700" : "text-neutral-700";
    const hoverBg = dow === 0 ? "hover:bg-rose-50" : dow === 6 ? "hover:bg-sky-50" : "hover:bg-neutral-100";
    return (
      /* 選んだ瞬間だけ弾ませたいので、選択の有無を key に混ぜて描き直させている */
      <button key={key + (isSelected ? "-s" : "")} onClick={() => { setSelectedDate(ds); onOpenDay(ds); }}
        /* **記録のある日を枠で囲まないこと。**
           日が続くと枠が連なって、ひとかたまりの塊のように見える（実際そう見えていた）。
           日付の下に短い線を1本だけ引いて、控えめに示す */
        className={"aspect-square min-h-[40px] rounded-lg text-[14.5px] flex items-center justify-center relative border-2 ft-tap " +
          (isSelected ? "bg-th-800 border-th-800 text-white font-bold ft-daypop"
            : has ? `border-transparent font-bold ${plainColor} ${hoverBg}`
              : `border-transparent font-normal ${plainColor} ${hoverBg}`)}>
        {d}
        {has && !isSelected && (
          /* **大きさも色も style で直に書くこと。**
             クラス任せにすると、その指定が用意されていない場では
             線が描かれないまま消える（実際そうなっていた）。
             ここは細い線1本なので、書き出しても短くて済む */
          <span aria-hidden="true"
            style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)",
                     width: 16, height: 3, borderRadius: 999,
                     backgroundColor: "var(--th-700)", opacity: 0.55 }} />
        )}
      </button>
    );
  };

  let monthCells = [];
  if (viewMode === "month") {
    const first = new Date(cursor.y, cursor.m, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
    for (let i = 0; i < startWeekday; i++) monthCells.push(null);
    for (let d = 1; d <= daysInMonth; d++) monthCells.push(d);
  }

  const weekDays = viewMode === "week" ? Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); return d; }) : [];
  const weekEnd = weekDays[6];

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button onClick={() => setViewMode("week")} className={"flex-1 min-h-[40px] rounded-lg text-[13.5px] font-bold border-2 ft-tap " + (viewMode === "week" ? "bg-th-50 border-th-800 text-th-900" : "border-neutral-300 text-neutral-600")}>週間</button>
        <button onClick={() => setViewMode("month")} className={"flex-1 min-h-[40px] rounded-lg text-[13.5px] font-bold border-2 ft-tap " + (viewMode === "month" ? "bg-th-50 border-th-800 text-th-900" : "border-neutral-300 text-neutral-600")}>月間</button>
      </div>

      {/* 見出しは、日付を選ぶ欄と同じ部品 */}
      <MonthNavHeader
        label={`${shownY}年 ${shownM}月`}
        onPrev={() => shift(-1)}
        onNext={() => shift(1)}
        onJump={() => setJumpOpen(true)}
        onToday={goToday}
      />

      {jumpOpen && (
        <MonthJumpSheet year={shownY} month={shownM} years={yearsForJump}
          onClose={() => setJumpOpen(false)} onConfirm={doJump} />
      )}

      <div className="grid grid-cols-7 gap-1 text-center text-[12.5px] font-bold mb-1">
        {/* 曜日の並びと色は、日付を選ぶ欄と同じものを使う（食い違わないように） */}
        {WEEK_LABELS.map((d, i) => <div key={d} className={weekColor(i)}>{d}</div>)}
      </div>

      {viewMode === "week" ? (
        <div key={"w" + flip.seq} className={"grid grid-cols-7 gap-1 " + flipCls}>{weekDays.map((d) => renderDayCell(d.getDate(), ymd(d), ymd(d)))}</div>
      ) : (
        <div key={"m" + flip.seq} className={"grid grid-cols-7 gap-1 " + flipCls}>
          {monthCells.map((d, i) => d === null ? <div key={i} /> : renderDayCell(d, `${cursor.y}-${String(cursor.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`, i))}
        </div>
      )}

    </div>
  );
}

/* 今年・今月の聖句カード。「続きから」など他のカードと同じ形にそろえている */
/* VerseCard（積み上げて並べる聖句カード）は廃止した。
   HighlightBanner が「今月／今年」の切り替えで1枚だけ出す作りに変えたため */
function HighlightBanner({ records }) {
  /* 今月・今年を切り替えて1枚だけ出す。
     2枚並べると縦に長くなり、ホーム画面のほかのものが押しやすさを損なうため。
     はじめは「今月」を選んでおく */
  const [tab, setTab] = useState("month");
  const [open, setOpen] = useState(false);
  /* どちら向きに入れ替わったか。押した側から入ってくるように見せる */
  const [dir, setDir] = useState("r");
  const pickTab = (id) => {
    if (id === tab) return;
    setDir(id === "year" ? "r" : "l");
    setTab(id);
    setOpen(false);
  };
  const yearly = useMemo(() => {
    const list = records.filter((r) => r.type === "memorization" && r.themeYear === curYear());
    return list.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))[0] || null;
  }, [records]);
  const monthly = useMemo(() => {
    const list = records.filter((r) => r.type === "memorization" && r.monthYear === curYear() && r.monthMonth === curMonth());
    return list[0] || null;
  }, [records]);

  /* 片方しか無いときは、あるほうを見せる */
  const shown = tab === "month" ? (monthly || yearly) : (yearly || monthly);
  const shownIsMonth = shown && shown === monthly;

  if (!yearly && !monthly) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 p-3 mb-3 flex items-center gap-3">
        <Mascot seed="home-banner" size={64} className="shrink-0" />
        <p className="text-[12.5px] text-neutral-500 flex-1">
          今年・今月の聖句は、まだありません。
        </p>
      </div>
    );
  }

  const Tab = ({ id, children }) => {
    const on = tab === id;
    const has = id === "month" ? !!monthly : !!yearly;
    return (
      <button type="button" onClick={() => pickTab(id)} aria-pressed={on}
        className={"flex-1 min-h-[40px] rounded-lg text-[13.5px] font-bold ft-tap transition-colors duration-200 "
          + (on ? "bg-white text-th-900 shadow-sm" : "text-neutral-500")
          + (has ? "" : " opacity-45")}>
        {/* 選ばれた側の字が軽く弾む。下のタブと同じ手ざわり */}
        <span key={on ? "on" : "off"} className={on ? "inline-block ft-tabpop" : ""}>{children}</span>
      </button>
    );
  };

  return (
    <div className="rounded-2xl border border-th-700/25 bg-white p-3 mb-3 shadow-sm">
      {/* 切り替え。両方あるときだけ出す。片方しか無いなら選ぶ意味がない */}
      {yearly && monthly && (
        <div className="flex gap-1 p-1 rounded-xl bg-neutral-100 mb-2.5">
          <Tab id="month">今月</Tab>
          <Tab id="year">今年</Tab>
        </div>
      )}
      {/* key を変えて、切り替えるたびに入ってくる動きをやり直させる */}
      <button key={tab} onClick={() => setOpen((v) => !v)}
        className={"w-full text-left flex items-start gap-3 ft-tap rounded-xl "
          + (dir === "r" ? "ft-swap-r" : "ft-swap-l")}>
        <span className="w-11 h-11 rounded-xl bg-th-50 border border-th-200 flex items-center justify-center shrink-0">
          {/* 聖句の絵は Star。BookMarked は「その他」の絵なので使わない */}
          <Star size={20} className="text-th-800" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[11.5px] font-bold tracking-wider text-th-800/70">
            {shownIsMonth ? `${curMonth()}月の聖句` : `${curYear()}年の聖句`}
          </span>
          {/* たたんでいるときは、見た目で2行に切る。
              **clampText は使わないこと。** あれは「改行の数」で切るので、
              1行に長々と書かれた聖句だと何も切られず、開いても閉じても同じに見える。
              line-clamp を使うが、そのときは改行をそのまま出す指定を外すこと。
              一緒に使うとiPhoneで高さだけ全文ぶん確保されてしまう */}
          {open ? (
            <span className="block text-[14.5px] leading-relaxed text-neutral-900 whitespace-pre-line mt-0.5">
              {shown.text}
            </span>
          ) : (
            /* **block を一緒に付けないこと。** line-clamp は display を
               -webkit-box に変える指定なので、block と取り合いになり、
               どちらが勝つかで切れたり切れなかったりする */
            <span className="text-[14.5px] leading-relaxed text-neutral-900 mt-0.5 line-clamp-2"
              style={{ minHeight: "3.25em" }}>
              {shown.text.replace(/\s*\n\s*/g, " ")}
            </span>
          )}
        </span>
        <ChevronDown size={18} className={"text-neutral-400 shrink-0 mt-3 ft-chev " + (open ? "ft-chev-on" : "")} />
      </button>
    </div>
  );
}

/* 直近の通読から「次に読む箇所」を割り出す */
/* 通読のつづき。最後に読んだところの次を出す */
function computeNextReading(records) {
  const readings = records.filter((r) => r.type === "reading" && r.book);
  if (readings.length === 0) return { book: BOOKS[0].name, chapter: 1, first: true };
  const sorted = [...readings].sort((a, b) => (b.date || "").localeCompare(a.date || "")
    || (b.createdAt || "").localeCompare(a.createdAt || ""));
  const last = sorted[0];
  const chapters = (last.chapters || []).filter((c) => typeof c === "number");
  const maxCh = chapters.length ? Math.max(...chapters) : 0;
  const b = BOOKS.find((x) => x.name === last.book);
  if (b && maxCh < b.chapters) return { book: last.book, chapter: maxCh + 1 };
  const i = BOOKS.findIndex((x) => x.name === last.book);
  const nextBook = BOOKS[(i + 1) % BOOKS.length];
  return { book: nextBook.name, chapter: 1, newBook: true, finished: last.book };
}

/* 「ここから始めましょう」「続きから」の案内。記録画面のいちばん上に置く */
function ContinueCard({ records, onStart }) {
  const next = useMemo(() => computeNextReading(records), [records]);
  if (!next) return null;
  return (
    <button
      onClick={() => onStart({ book: next.book, chapters: [next.chapter] })}
      className="w-full text-left rounded-2xl border border-th-700/25 bg-white p-4 mb-4 flex items-center gap-3 ft-tap ft-tap-card shadow-sm"
    >
      <span className="w-11 h-11 rounded-xl bg-th-50 border border-th-200 flex items-center justify-center shrink-0">
        <BookOpen size={20} className="text-th-800" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[11.5px] font-bold tracking-wider text-th-800/70">
          {next.first ? "はじめから" : next.newBook ? `${next.finished} を読み終えました。次は` : "続きから"}
        </span>
        <span className="block font-display text-[18px] text-neutral-900 truncate">{next.book} {next.chapter}章</span>
      </span>
      <ChevronRight size={20} className="text-neutral-400 shrink-0" />
    </button>
  );
}

/* しばらく保存していない・記録がたまってきた、どちらかのときに知らせる */
const BACKUP_REMIND_COUNT = 10;
function BackupReminder({ records, prefs, onOpenBackup }) {
  /* 数は AppMain で数えたもの（フォルダの変更も入っている）を使う。ここで数え直さないこと */
  const n = React.useContext(UnsavedContext);
  if (n === 0) return null;
  const last = prefs && prefs.lastBackup ? new Date(prefs.lastBackup) : null;
  const days = last ? Math.floor((Date.now() - last.getTime()) / 86400000) : null;
  /* **書き出していない記録が1件でもあれば知らせること。**
     件数の敷居を設けていたため、1件書いても何も出ず、
     保存忘れを防ぐという役目を果たしていなかった */
  const lastLabel = last ? `${last.getFullYear()}年${last.getMonth() + 1}月${last.getDate()}日` : null;
  return (
    <button onClick={onOpenBackup}
      className="w-full text-left rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 mb-3 flex items-center gap-3 ft-tap ft-tap-card">
      <span className="relative w-10 h-10 rounded-xl bg-white border border-amber-200 flex items-center justify-center shrink-0 text-amber-700">
        <Download size={18} />
        <CountBadge n={n} size={20} className="absolute -top-1.5 -right-1.5" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-[13.5px] font-bold text-amber-900">まだ書き出していない記録が{n}件あります</span>
        <span className="block text-[12.5px] text-neutral-600">
          {lastLabel ? `前回の保存： ${lastLabel}` : "まだ一度も保存していません"}
        </span>
      </span>
      <ChevronRight size={18} className="text-amber-700/60 shrink-0" />
    </button>
  );
}

/* 育てる実を選ぶダイアログ */
function FruitPickDialog({ title, note, current, onPick, onCancel }) {
  const [sel, setSel] = useState(current || FRUITS[0].key);
  return (
    <div data-ft-overlay="" className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center px-6">
      <BackgroundLock />
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-neutral-200 shadow-xl anim-pop max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-[17px] text-neutral-900 mb-1.5">{title}</h3>
        {note && <p className="text-[12.5px] text-neutral-500 leading-relaxed mb-3">{note}</p>}
        {/* 実を選び直すたびに、木がふわっと差し替わる */}
        <div key={sel} className="flex justify-center mb-2 ft-grow">
          <FruitTree stage={10} fruit={sel} size={150} />
        </div>
        <div className="grid grid-cols-5 gap-1.5 mb-5">
          {FRUITS.map((f) => (
            <button key={f.key} onClick={() => setSel(f.key)}
              className={"rounded-xl border-2 py-2 px-1 text-[11.5px] font-bold ft-tap " + (sel === f.key ? "border-th-700 bg-th-50 text-th-900" : "border-neutral-200 bg-white text-neutral-500")}>
              <span className="block w-full flex justify-center mb-0.5">
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                  <circle cx="12" cy="14" r="8" fill={f.ripe} />
                  <path d="M12 6 L12 3" stroke="#8A6B4F" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2.5">
          {onCancel && <button onClick={onCancel} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>あとで</button>}
          <button onClick={() => onPick(sel)} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>これを植える</button>
        </div>
      </div>
    </div>
  );
}

/* 育てる実を変えるときの注意喚起 */
function ConfirmReplantDialog({ fruit, onConfirm, onCancel }) {
  return (
    <div data-ft-overlay="" className="fixed inset-0 z-[80] bg-black/50 flex items-center justify-center px-6">
      <BackgroundLock />
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-neutral-200 shadow-xl anim-pop">
        <h3 className="font-display text-[17px] text-neutral-900 mb-2">木を植え直します</h3>
        <p className="text-[13.5px] text-neutral-700 leading-relaxed mb-2">
          {fruitByKey(fruit).label}の種を新しく蒔きます。今の木は土からのやり直しになり、
          <span className="font-bold">育ってきた日数と件数は0から数え直し</span>になります。
        </p>
        <p className="text-[12.5px] text-neutral-500 leading-relaxed mb-5">
          これまでの記録と、収穫した実は消えません。
        </p>
        <div className="flex gap-2.5">
          <button onClick={onCancel} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>やめる</button>
          <button onClick={onConfirm} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>植え直す</button>
        </div>
      </div>
    </div>
  );
}

/* 収穫したときのダイアログ */
function HarvestDialog({ fruit, onReplant, onLater }) {
  const f = fruitByKey(fruit);
  return (
    <div data-ft-overlay="" className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center px-6">
      <BackgroundLock />
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-neutral-200 shadow-xl anim-pop text-center">
        <div className="flex justify-center mb-1 ft-grow">
          <FruitTree stage={10} fruit={fruit} size={160} />
        </div>
        <h3 className="font-display text-[18px] text-neutral-900 mb-1.5">{f.label}を収穫しました</h3>
        <p className="text-[13.5px] text-neutral-600 leading-relaxed mb-5">
          収穫した実は、メニューの「収穫した実」に残ります。
        </p>
        <div className="flex gap-2.5">
          <button onClick={onLater} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>このままにする</button>
          <button onClick={onReplant} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>次の種を植える</button>
        </div>
      </div>
    </div>
  );
}

/* ホーム画面の果樹。イラストとみことばだけを見せる */
/* ホーム画面の木の大きさ。
   **植える前と植えたあとで必ず同じ数にすること。**
   別々にしていたため、植える前だけ小さく見えていた。
   ここはホーム画面のいちばん大事な絵なので、大きめにとってある */
const TREE_SIZE = 220;

function TreeArea({ records, garden, onStart, onHarvest }) {
  const cycle = garden.cycle;
  if (!cycle) {
    return (
      <button onClick={onStart} className="w-full flex flex-col items-center pt-1 pb-2 ft-tap">
        <span className="flex ft-grow"><FruitTree stage={1} fruit="apple" size={TREE_SIZE} /></span>
        <span className="text-[15.5px] font-bold text-th-900 mt-1">種を選んで植える</span>
      </button>
    );
  }
  const { days, count } = cycleCounts(records, cycle.startedAt);
  const st = stageOf(days, count, paceOf(cycle));
  const ripe = st.n === 10;
  const today = todayStr();
  const hasToday = (records || []).some((r) => r && recDate(r) === today);
  /* 実が熟して、まだ収穫していないときだけ、木がゆっくり息をする。
     「押せますよ」を言葉ではなく動きで伝えるため。それ以外の日は静かなまま */
  const canHarvest = ripe && !cycle.harvested;
  const inner = (
    <>
      {/* 立ち上がりと呼吸は別の要素に分けている。
          ひとつの要素に2つ重ねると、あとに書いたほうだけが効いてしまうため */}
      <span className="flex ft-grow">
        <span className={"flex " + (canHarvest ? "ft-breathe" : "")}>
          <FruitTree stage={st.n} fruit={cycle.fruit} size={TREE_SIZE} sparkle={hasToday} />
        </span>
      </span>
      <p className="text-[13.5px] text-neutral-700 leading-relaxed whitespace-pre-line text-center mt-2 px-2">{st.verse}</p>
      <p className="text-[12.5px] text-neutral-500 mt-1">{st.ref}</p>
    </>
  );
  if (canHarvest) {
    return (
      <button onClick={onHarvest} className="w-full flex flex-col items-center pt-1 pb-2 ft-tap" aria-label="実を収穫する">
        {inner}
      </button>
    );
  }
  return <div className="w-full flex flex-col items-center pt-1 pb-2">{inner}</div>;
}

/* ＋を押したときに出る、記録の種類を選ぶシート */
const TYPE_GUIDE = [
  { key: "reading",      icon: <BookOpen size={22} />,     desc: "読んだ箇所と、感じたこと" },
  { key: "message",      icon: <Play size={22} />,          desc: "礼拝や集会で聞いた話" },
  { key: "memorization", icon: <Star size={22} />,          desc: "心にとめておきたいことば" },
  { key: "memo",         icon: <BookMarked size={22} />,    desc: "テーマごとの覚え書き" },
];

function TypeRow({ t, names, descs, onPick }) {
  const [pressed, go] = useTapThen(() => onPick(t.key));
  return (
    <button type="button" onClick={go}
      className={"w-full flex items-center gap-3 px-3 py-3 min-h-[64px] rounded-xl text-left ft-tap ft-tap-card "
        + (pressed ? "bg-neutral-200 ft-tap-pressed" : "hover:bg-neutral-50")}>
      {/* **説明の文は置かないこと。** 名前としるしで分かる。開いた瞬間から選べるほうがよい */}
      <span className="w-11 h-11 rounded-xl bg-th-50 border border-th-200 flex items-center justify-center text-th-800 shrink-0">{t.icon}</span>
      <span className="flex-1 min-w-0 text-[15.5px] font-bold text-neutral-900">{(names && names[t.key]) || TYPE_LABELS[t.key]}</span>
      <ChevronRight size={18} className="text-neutral-400 shrink-0" />
    </button>
  );
}

function TypePickSheet({ onPick, onCancel, descs, names, onImportFile, onPasteImport }) {
  const [closing, close] = useClosing(onCancel);
  const fileRef = useRef(null);
  return (
    <div data-ft-overlay="" className="ft-sheet-wrap flex items-end justify-center" style={{ zIndex: 2147483000 }} onClick={close}>
      <BackgroundLock />
      <div className={"absolute inset-0 bg-black/40 " + (closing ? "anim-fade-out" : "anim-fade")} />
      <div className={"relative w-full max-w-lg bg-white rounded-t-2xl border-t border-neutral-200 shadow-xl "
          + (closing ? "anim-sheet-out" : "anim-sheet")}
        onClick={(e) => e.stopPropagation()}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
          <span className="font-display text-[15.5px] text-neutral-900">何を記録しますか</span>
          <button type="button" onClick={close} aria-label="閉じる"
            className="min-w-[52px] min-h-[52px] flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100"><X size={28} /></button>
        </div>
        {/* **ここは順に現れさせないこと。**
            記録を書き始めるための入口なので、開いた瞬間から選べるほうがよい。
            1つずつ出てくると、待たされているように感じる（依頼により取りやめ） */}
        <div className="p-2">
          {TYPE_GUIDE.map((t) => (
            <TypeRow key={t.key} t={t} names={names} descs={descs} onPick={onPick} />
          ))}
          {/* 人から受け取ったファイルを取り込む口。
              いちばん下に置く。ふだん使うのは上の種類なので、じゃまにならないように */}
        </div>
        {/* 取り込みの2つは、順に現れる並び（ft-seq）の外に出す。
            中に入れると5〜7番目になり、そのぶん遅れて出てくる。
            記録の種類とは性質も違うので、いっしょに数えないほうがよい */}
        <div className="px-2 pb-2">
          {onImportFile && (
            <>
              <div className="border-t border-neutral-200 mx-2 mb-1.5" />
              {/* **種類で絞り込まないこと。**
                  Androidの選択画面は、種類の分からないファイルを選べなくする。
                  .json は種類が付かないことが多く、灰色のまま選べなくなる（実際そうなった）。
                  何でも選べるようにして、中身が違えば読み込むときに知らせる */}
              <input ref={fileRef} type="file" className="hidden"
                onChange={(e) => {
                  const f = e.target.files && e.target.files[0];
                  e.target.value = "";
                  if (f) onImportFile(f);
                }} />
              {/* 上の種類の行（TypeRow）と、絵と字の位置がぴったりそろうようにする。
                  枠の大きさ・すきま・字の大きさは TypeRow と同じ数にすること */}
              <button type="button" onClick={() => fileRef.current && fileRef.current.click()}
                className="w-full flex items-center gap-3 px-3 py-3 min-h-[64px] rounded-xl text-left hover:bg-neutral-50 ft-tap ft-tap-card">
                <span className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 shrink-0">
                  <Download size={22} />
                </span>
                <span className="flex-1 min-w-0 text-[15.5px] font-bold text-neutral-900">ファイルから取り込む</span>
                <ChevronRight size={18} className="text-neutral-400 shrink-0" />
              </button>
              {/* ファイルの行方が分かりにくい端末のために、文字から取り込む道すじも用意する */}
              <button type="button" onClick={onPasteImport}
                className="w-full flex items-center gap-3 px-3 py-3 min-h-[64px] rounded-xl text-left hover:bg-neutral-50 ft-tap ft-tap-card">
                <span className="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 shrink-0">
                  <ClipboardPaste size={22} />
                </span>
                <span className="flex-1 min-w-0 text-[15.5px] font-bold text-neutral-900">文字から取り込む</span>
                <ChevronRight size={18} className="text-neutral-400 shrink-0" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* 前回、保存しないまま閉じられた記録を知らせるカード */
function DraftDialog({ draft, onResume, onDiscard, names }) {
  if (!draft) return null;
  const label = (names && names[draft.rec.type]) || TYPE_LABELS[draft.rec.type] || "記録";
  const when = draft.savedAt ? new Date(draft.savedAt) : null;
  const whenText = when && !isNaN(when)
    ? `${when.getMonth() + 1}月${when.getDate()}日 ${String(when.getHours()).padStart(2, "0")}:${String(when.getMinutes()).padStart(2, "0")}`
    : null;
  return (
    <div data-ft-overlay="" className="fixed inset-0 z-[75] bg-black/50 flex items-center justify-center px-6">
      <BackgroundLock />
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-neutral-200 shadow-xl anim-pop">
      <div className="flex items-start gap-3">
        <span className="w-11 h-11 rounded-xl bg-white border border-amber-200 flex items-center justify-center shrink-0">
          <Pencil size={20} className="text-amber-600" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[11.5px] font-bold tracking-wider text-amber-700">書きかけの{label}があります</p>
          {whenText && <p className="text-[12.5px] text-neutral-500 mt-0.5">{whenText} まで入力</p>}
        </div>
      </div>
      <div className="flex gap-2.5 mt-5">
        <button onClick={onDiscard} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>破棄する</button>
        <button onClick={onResume} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>続きを書く</button>
      </div>
      </div>
    </div>
  );
}

function HomeScreen({ records, prefs, onOpenBackup, garden, onStartCycle, onHarvest }) {
  return (
    /* 下の帯（タブ）に隠れないための逃げ場。**数字を書かないこと。**
       ft-pad-nav が「帯の厚み＋切り欠き＋少しの余裕」を1か所で決めている。
       ここを広げすぎると、木と段階の聖句がある画面が縦に収まらなくなる */
    <div className="ft-pad-nav">
      <TopChrome><ScreenHeader title="ホーム" /></TopChrome>
      {/* ヘッダは動かさず、中身だけがそっと立ち上がる（ヘッダは sticky なので動かすとぶれる） */}
      <div className="px-5 pt-4 ft-rise">
        <HighlightBanner records={records} />
        <TreeArea records={records} garden={garden} onStart={onStartCycle} onHarvest={onHarvest} />
        <BackupReminder records={records} prefs={prefs} onOpenBackup={onOpenBackup} />
      </div>
    </div>
  );
}

/* ============================================================
   ② 記録画面
   ============================================================ */
function RecordScreen({ records, onOpenDetail, onStartReading }) {
  /* 直近で保存・編集したものから10件。
     作った日ではなく「最後に手を入れた日」で並べること。
     古い記録を書き直したときに、下のほうに埋もれてしまわないようにするため */
  const recent = useMemo(() => [...records]
    .sort((a, b) => ((b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || "")))
    .slice(0, 10), [records]);
  return (
    <div className="ft-pad-fab">
      <TopChrome><ScreenHeader title="記録" /></TopChrome>
      <div className="px-5 pt-4 ft-rise">
        {/* 通読のつづきは、記録画面のいちばん上に置く */}
        <ContinueCard records={records} onStart={onStartReading} />
        <h3 className="text-[12.5px] font-bold tracking-wider text-th-800/70 uppercase mb-3">最近の記録</h3>
        {/* 記録がまだ無いときの案内は、2列の並びの中に入れない。
            中に入れると、横長の画面で左半分だけに寄ってしまう。
            記録があるときの2列はそのまま */}
        {recent.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-6 text-center flex flex-col items-center">
            <Mascot seed="records-empty" size={168} withNotes />
            <p className="text-[14.5px] text-neutral-500 mt-2">まだ記録はありません</p>
          </div>
        ) : (
          <div className="space-y-2.5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-2.5">
            {recent.map((r) => <RecordCard key={r.id} r={r} onClick={() => onOpenDetail(r)} />)}
          </div>
        )}
        {recent.length > 0 && (
          <div className="flex flex-col items-center pt-6 pb-2 opacity-75">
            <Mascot seed="records-end" size={116} />
            <p className="text-[12.5px] text-neutral-500 mt-1">直近10件はここまで</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   ③ 検索画面
   ============================================================ */
/* 並べ替えの切り替え。**端末まかせの選択画面（<select>）は使わないこと。**
   ふだんは目に入らず、探したいときにだけ気づけばよいので、小さな文字のボタンにしてある。
   押すたびに 目次順 → 新しい順 → 古い順 と入れ替わる（値が変わるだけなので TapOnceButton） */
function SortToggle({ value, onChange }) {
  const i = Math.max(0, SORT_MODES.findIndex((m) => m.key === value));
  const cur = SORT_MODES[i];
  const next = SORT_MODES[(i + 1) % SORT_MODES.length];
  return (
    <TapOnceButton onTap={() => onChange(next.key)} aria-label={`並べ替え：いま${cur.label}。押すと${next.label}`}
      className="ml-auto h-9 pl-2.5 pr-3 flex items-center gap-1 rounded-full text-[12.5px] font-bold text-neutral-500 hover:bg-neutral-100 shrink-0 ft-tap ft-tap-icon">
      <ArrowUpDown size={14} /> {cur.label}
    </TapOnceButton>
  );
}

/* 絞り込みのボタン。記録の種類など、押して切り替えるものは
   すべてこれを使う。見た目と押し心地をばらけさせないため */
function FilterPill({ on, onClick, children }) {
  return (
    <TapOnceButton aria-pressed={on} onTap={onClick}
      className={"text-[12.5px] font-bold px-3 py-1 rounded-full border-2 ft-tap "
        + (on ? "border-th-800 bg-th-800 text-white" : "border-neutral-200 bg-white text-neutral-600")}>
      {children}
    </TapOnceButton>
  );
}

function SearchScreen({ records, setRecords, onDeleteMany, openDetail, allKnownTags, defaultSort, resetSig = 0 }) {
  const typeNames = useTypeName();
  const [keyword, setKeyword] = useState("");
  const [filterBook, setFilterBook] = useState("");
  /* 選んだタグ。複数選ぶと「すべて含む」で絞り込む */
  const [filterTags, setFilterTags] = useState([]);
  const [tagDialog, setTagDialog] = useState(false);
  /* 記録の種類。こちらは複数選ぶと「どれかに当てはまる」で絞り込む。
     タグは「すべて含む」、種類は「どれか」。目的が違うので、あえて揃えていない */
  const [filterTypes, setFilterTypes] = useState([]);
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(true);


  /* 検索は「検索」ボタンを押したときに実行する。
     押した条件だけを applied に取り込み、結果はそれをもとに作る */
  const [applied, setApplied] = useState({ keyword: "", book: "", tags: [], types: [], from: "", to: "" });
  const [searched, setSearched] = useState(false); // 一度でも検索したか
  const [searching, setSearching] = useState(false);
  const [resultKey, setResultKey] = useState(0);

  /* 下の「探す」をもう一度押されたとき（2回め）は、条件も結果も消して、はじめの状態に戻す。
     1回めは、いま見ている表示のまま、いちばん上へ戻すだけ（AppMain の pressTab） */
  /* 長押しで選ぶモード。まとめて消すときに使う。
     選ぶのは、いま画面に出ている結果の中だけ（条件を変えたら選びなおしになるよう、検索のたびに解く） */
  const [selecting, setSelecting] = useState(false);
  const [selIds, setSelIds] = useState([]);
  const [confirmMany, setConfirmMany] = useState(false);
  const stopSelect = () => { setSelecting(false); setSelIds([]); setConfirmMany(false); };
  const toggleSel = (id) => setSelIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  useEffect(() => {
    if (!resetSig) return;
    stopSelect();
    setKeyword(""); setFilterBook(""); setFilterTags([]); setFilterTypes([]); setFilterFrom(""); setFilterTo("");
    setApplied({ keyword: "", book: "", tags: [], types: [], from: "", to: "" });
    setSearched(false); setFiltersOpen(true);
  }, [resetSig]);
  const searchTimer = useRef(null);
  useEffect(() => () => clearTimeout(searchTimer.current), []);
  const runSearch = () => {
    stopSelect();
    setSearching(true);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setApplied({ keyword, book: filterBook, tags: filterTags, types: filterTypes, from: filterFrom, to: filterTo });
      setResultKey((k) => k + 1);
      setSearched(true);
      setFiltersOpen(false); // 結果が見やすいように、絞り込みは閉じる
      setSearching(false);
    }, 380);
  };
  const dirty = applied.keyword !== keyword || applied.book !== filterBook
    || applied.tags.join("\u0000") !== filterTags.join("\u0000")
    || applied.types.join("\u0000") !== filterTypes.join("\u0000")
    || applied.from !== filterFrom || applied.to !== filterTo;
  /* 探す手がかりが何かひとつでもあるか。
     **絞り込みを増やしたら、必ずここにも足すこと。**
     足し忘れると、その絞り込みだけを選んでも検索ボタンが押せないままになる */
  const hasCriteria = !!keyword.trim() || !!filterBook || filterTags.length > 0
    || filterTypes.length > 0 || !!filterFrom || !!filterTo;
  /* 条件が同じでも押せるようにしておく（2.8.0〜）。ボタンが欄の下にあり、押せない理由が見えにくいため */
  const canSearch = hasCriteria;
  void dirty;
  const appliedCriteria = { q: applied.keyword, types: applied.types, tags: applied.tags, book: applied.book, from: applied.from, to: applied.to };
  /* 選択解除 … 条件も結果も消して、はじめの状態（欄を開いた形）へ戻す */
  const clearAll = () => {
    stopSelect();
    setKeyword(""); setFilterBook(""); setFilterTags([]); setFilterTypes([]); setFilterFrom(""); setFilterTo("");
    setApplied({ keyword: "", book: "", tags: [], types: [], from: "", to: "" });
    setSearched(false); setFiltersOpen(true);
  };

  const baseFiltered = useMemo(() => filterRecordsBy(records, { q: applied.keyword, types: applied.types, tags: applied.tags, book: applied.book, from: applied.from, to: applied.to }), [records, applied]);

  /* はじめの並び順は、カスタマイズで決めたもの。指定が無ければ目次順 */
  const [sortMode, setSortMode] = useState(() => defaultSort || "book");
  const sortedRecords = useMemo(() => {
    const arr = [...baseFiltered];
    if (sortMode === "dateDesc") arr.sort((a, b) => (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || ""));
    else if (sortMode === "dateAsc") arr.sort((a, b) => (a.date || a.createdAt || "").localeCompare(b.date || b.createdAt || ""));
    else arr.sort(compareForSearch);
    return arr;
  }, [baseFiltered, sortMode]);

  /* 選べるタグは、外から渡された一覧（登録済み＋実際に使われている分） */
  const knownTags = allKnownTags || [];

  return (
    /* 下の帯（タブ）に隠れない分だけの余白。＋ボタンが無い画面なので ft-pad-fab は要らない */
    <div className="ft-pad-nav">
      <TopChrome>
      <ScreenHeader title="探す" />
      {/* **条件の帯は、見出しと同じ TopChrome に入れること。**
          下まで見ていった先で探し直したくなったとき、いちいち上まで戻らずに済む。
          ここを sticky にしないこと（TopChrome の説明を参照）。高さは TopChrome が測る。
          帯を押すと条件の欄が開け閉めする。探したあとは、いまの条件を短い文で出す（My手帳 と同じ。2.8.0〜） */}
      <div className="px-5 pt-4 pb-3 ft-page ft-rise">
        <CriteriaBar open={filtersOpen} active={searched} summary={criteriaSummary(appliedCriteria, typeNames)}
          onToggle={() => { setFiltersOpen((v) => { if (!v) requestAnimationFrame(() => requestAnimationFrame(scrollPageTop)); return !v; }); }} />
      </div>
      </TopChrome>

      {/* 条件の欄は貼りつけない。開くと背が高く、貼りつけると結果を見せる場所がほとんど無くなる */}
      <div className="px-5 space-y-3">
        {filtersOpen && (
          /* 以前の絞り込みの欄と同じ見た目（rounded-xl・bg-neutral-50・p-2.5・space-y-2.5）。
             iPhoneで開いたとき、はじめの状態がスクロールなしで収まるように詰めてある */
          <div className="space-y-2.5 rounded-xl border border-neutral-200 bg-neutral-50 p-2.5 ft-open">
            <RecordFilterFields q={keyword} onQ={setKeyword} onEnter={() => { if (canSearch) runSearch(); }}
              types={filterTypes} onToggleType={(t) => setFilterTypes((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])}
              tags={filterTags} onOpenTags={() => setTagDialog(true)} onRemoveTag={(t) => setFilterTags((prev) => prev.filter((x) => x !== t))}
              book={filterBook} onBook={(v) => setFilterBook(v)}
              from={filterFrom} to={filterTo} onFrom={setFilterFrom} onTo={setFilterTo} />
            {/* **「検索する」は欄のいちばん下に置くこと（2.8.0〜）。** 大きなスマホを片手で持つと、
                親指が画面の上まで届かない。条件を選び終えた指のすぐ先で押せるようにする */}
            <SearchActions canClear={hasCriteria || searched} onClear={clearAll}
              canSearch={canSearch} onSearch={runSearch} busy={searching} />
          </div>
        )}

        {/* 件数と並べ替えは、探したあとにだけ出す。
            探す前は並べ替える対象そのものが無いので、置いておくと迷いのもとになる */}
        {searched && !searching && (selecting ? (
          <SelectModeHead count={selIds.length} allOn={selIds.length === sortedRecords.length}
            onToggleAll={() => setSelIds(selIds.length === sortedRecords.length ? [] : sortedRecords.map((r) => r.id))} />
        ) : (
          <div className="flex items-center justify-between gap-2 pt-1">
            <h3 className="text-[12.5px] font-bold tracking-wider text-th-800/70 uppercase">
              {sortedRecords.length}件
            </h3>
            <SortToggle value={sortMode} onChange={setSortMode} />
          </div>
        ))}
        {tagDialog && (
          <TagPickDialog title="タグで絞り込む" selected={filterTags} known={knownTags}
            onApply={(v) => { setFilterTags(v); setTagDialog(false); }}
            onCancel={() => setTagDialog(false)} />
        )}

        {searching && <LoadingOverlay label="探しています" />}
        {searching || !searched ? null : (
        <div key={resultKey} className="ft-seq space-y-2.5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-2.5 lg:items-start">
          {sortedRecords.length === 0 && (
            <div className="flex flex-col items-center py-6 lg:col-span-2 ft-noresult">
              <Mascot seed="search-empty" size={142} />
              <p className="text-[14.5px] text-neutral-500 mt-1">該当する記録がありません</p>
            </div>
          )}
          {sortedRecords.map((r) => (
            <RecordCard key={r.id} r={r} hit={applied.keyword.trim()}
              selectMode={selecting} selected={selIds.includes(r.id)}
              onLongPress={selecting ? undefined : () => { setSelecting(true); setSelIds([r.id]); }}
              onClick={() => (selecting ? toggleSel(r.id) : openDetail(r))} />
          ))}
        </div>
        )}
      </div>

      {/* 選ぶモードの帯。下の帯（タブ）の上に重ねて、そのあいだだけタブを隠す */}
      {selecting && (
        <SelectModeBar dangerLabel="削除" dangerIcon={<Trash2 size={15} />} disabled={selIds.length === 0}
          onDanger={() => setConfirmMany(true)} onDone={stopSelect} />
      )}
      {confirmMany && (
        <div data-ft-overlay="" className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center px-6">
          <BackgroundLock />
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-neutral-200 shadow-xl anim-pop">
            <h3 className="font-display text-[17px] text-neutral-900 mb-2">{selIds.length}件の記録を削除しますか？</h3>
            <p className="text-[13.5px] text-neutral-600 mb-5">記録そのものが消えます。この操作は取り消せません。</p>
            <div className="flex gap-2.5">
              <button onClick={() => setConfirmMany(false)} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</button>
              <button
                /* **ここで setRecords を直に呼ばないこと。** 消した記録に付いていた写真が置き場に残る */
                onClick={() => { onDeleteMany(selIds); stopSelect(); }}
                className={BTN_DANGER + " flex-1 " + BTN_H + " text-[14.5px]"}>削除する</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   ④ 実績
   ============================================================ */
/* 「何章読んだか」を書ごとに数える。実績画面と書ごとの画面で共通に使う */
function chapterCountsByBook(records) {
  const map = {};
  records.filter((r) => r.type === "reading" && r.book).forEach((r) => {
    if (!map[r.book]) map[r.book] = {};
    (r.chapters || []).forEach((c) => { map[r.book][c] = (map[r.book][c] || 0) + 1; });
  });
  return map;
}

const tileColor = (n) => (n === 0 ? "bg-neutral-200" : n === 1 ? "bg-th-600" : n === 2 ? "bg-th-800" : "bg-amber-500");

/* 読んだ回数を色で表すタイル。書ごとの画面の上部に出す */
function ChapterTiles({ book, counts }) {
  const info = bookByName(book);
  if (!info) return null;
  const readCount = Object.keys(counts || {}).length;
  const done = readCount === info.chapters && info.chapters > 0;
  return (
    <div className={"rounded-2xl border-2 p-4 mb-4 " + (done ? "border-amber-300 bg-amber-50" : "border-neutral-200 bg-white")}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-[13.5px] font-bold text-neutral-700 flex items-center gap-1.5">
          {done && <Award size={15} className="text-amber-600" />}通読の達成度
        </span>
        <span className={"ml-auto text-[12.5px] font-bold px-2 py-0.5 rounded-full " + (readCount > 0 ? "bg-th-100 text-th-900" : "bg-neutral-100 text-neutral-500")}>
          {readCount}/{info.chapters}章
        </span>
      </div>
      <div className="flex flex-wrap gap-[3px]">
        {Array.from({ length: info.chapters }, (_, idx) => idx + 1).map((c) => (
          <div key={c} title={`${c}章：${(counts || {})[c] || 0}回`} style={{ width: 14, height: 14 }}
            className={"rounded-[2px] " + tileColor((counts || {})[c] || 0)} />
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3 text-[11.5px] font-bold text-neutral-500 flex-wrap">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-neutral-200 inline-block" /> 未読</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-th-600 inline-block" /> 1回</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-th-800 inline-block" /> 2回</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" /> 3回以上</span>
      </div>
    </div>
  );
}

/* 細い進捗バー */
function MiniBar({ value, total }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <span className="block h-1.5 rounded-full bg-neutral-200 overflow-hidden">
      <span className="block h-full rounded-full bg-th-700" style={{ width: `${pct}%` }} />
    </span>
  );
}

function ProgressScreen({ records, onOpenDetail, onOpenBook, onOpenDay }) {
  const countByBook = useMemo(() => chapterCountsByBook(records), [records]);

  const totalChapters = BOOKS.reduce((s, b) => s + b.chapters, 0);
  const uniqueRead = BOOKS.reduce((s, b) => s + Object.keys(countByBook[b.name] || {}).length, 0);
  const pct = totalChapters ? Math.round((uniqueRead / totalChapters) * 100) : 0;

  /* 最後に読んだ書が入っているまとまりだけ、はじめから開いておく */
  const initialOpen = useMemo(() => {
    const last = [...records]
      .filter((r) => r.type === "reading" && r.book)
      .sort((a, b) => (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || ""))[0];
    if (!last) return [];
    const i = bookIndexOf(last.book);
    const g = BOOK_GROUPS.find((x) => i >= x.from && i <= x.to);
    return g ? [g.label] : [];
  }, [records]);

  const [openGroups, setOpenGroups] = useState(initialOpen);
  const toggleGroup = (label) =>
    setOpenGroups((prev) => (prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]));

  return (
    <div className="ft-pad-nav">
      <TopChrome><ScreenHeader title="実績" /></TopChrome>
      <div className="px-5 pt-4 ft-rise">
        <div className="rounded-2xl bg-gradient-to-br from-th-700 to-th-900 text-white p-4 mb-3 flex items-center gap-4">
          <Award size={30} className="shrink-0 opacity-90" />
          <div className="flex-1">
            <div className="text-[12.5px] font-bold opacity-80 tracking-wide">通読の達成度（初回既読）</div>
            <div className="text-[24px] font-display leading-tight">{uniqueRead} / {totalChapters} 章</div>
          </div>
          <div className="text-[28px] font-display">{pct}%</div>
        </div>

        <h3 className="text-[12.5px] font-bold tracking-wider text-th-800/70 uppercase mb-3 mt-5">日ごとの記録</h3>
        <CalendarView records={records} onOpenDay={onOpenDay} />

        <h3 className="text-[12.5px] font-bold tracking-wider text-th-800/70 uppercase mb-3 mt-6">書ごとの記録</h3>
        <div className="space-y-2.5">
          {BOOK_GROUPS.map((g) => {
            const books = BOOKS.slice(g.from, g.to + 1);
            const gTotal = books.reduce((s, b) => s + b.chapters, 0);
            const gRead = books.reduce((s, b) => s + Object.keys(countByBook[b.name] || {}).length, 0);
            const gDone = books.filter((b) => Object.keys(countByBook[b.name] || {}).length === b.chapters).length;
            const open = openGroups.includes(g.label);
            return (
              <div key={g.label} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                <button type="button" onClick={() => toggleGroup(g.label)}
                  className="w-full flex items-center gap-3 px-4 py-3 min-h-[56px] text-left ft-tap ft-tap-card active:bg-neutral-50">
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14.5px] font-bold text-neutral-900">{g.label}</span>
                    <span className="block text-[11.5px] text-neutral-500 mt-0.5">
                      {books.length}巻 ・ {gRead}/{gTotal}章{gDone > 0 ? ` ・ ${gDone}巻読了` : ""}
                    </span>
                    <span className="block mt-1.5"><MiniBar value={gRead} total={gTotal} /></span>
                  </span>
                  <ChevronDown size={18} className={"text-neutral-400 shrink-0 ft-chev " + (open ? "ft-chev-on" : "")} />
                </button>
                {open && (
                  <div className="border-t-2 border-neutral-100 ft-open-y">
                    {books.map((b) => {
                      const counts = countByBook[b.name] || {};
                      const readCount = Object.keys(counts).length;
                      const recCount = records.filter((r) => recordRefs(r).some((ref) => ref.book === b.name)).length;
                      const done = readCount === b.chapters && b.chapters > 0;
                      return (
                        <button key={b.name} type="button" onClick={() => onOpenBook(b.name)}
                          className={"w-full flex items-center gap-3 px-4 py-2.5 min-h-[52px] text-left border-b border-neutral-100 last:border-b-0 hover:bg-neutral-50 ft-tap ft-tap-card " + (done ? "bg-amber-50/60" : "")}>
                          <span className="flex-1 min-w-0">
                            <span className="flex items-center gap-1.5">
                              {done && <Award size={13} className="text-amber-600 shrink-0" />}
                              <span className="text-[13.5px] font-bold text-neutral-900 truncate">{b.name}</span>
                            </span>
                            <span className="block mt-1.5"><MiniBar value={readCount} total={b.chapters} /></span>
                          </span>
                          <span className="flex flex-col items-end shrink-0 gap-0.5">
                            <span className={"text-[11.5px] font-bold px-2 py-0.5 rounded-full " + (readCount > 0 ? "bg-th-100 text-th-900" : "bg-neutral-100 text-neutral-500")}>
                              {readCount}/{b.chapters}章
                            </span>
                            <span className="text-[11.5px] font-bold text-neutral-500">記録{recCount}件</span>
                          </span>
                          <ChevronRight size={15} className="text-neutral-400 shrink-0" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {/* いちばん下に添えることば。絵の下に中央そろえで置く */}
        <div className="flex flex-col items-center pt-8 pb-2">
          <div className="opacity-70"><Mascot seed="progress-foot" size={120} /></div>
          <p className="text-[12.5px] text-neutral-500 mt-1.5 text-center px-4 leading-relaxed whitespace-pre-line">
            {"聖書はすべて神の霊感によるもので、教えと戒めと矯正と義の訓練のために有益です。\nテモテへの手紙 第二 3:16"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   書をタップしたとき：その書が含まれる記録の一覧
   ============================================================ */
/* ある1日の記録の一覧。実績の「日ごとの記録」で日付を押すと開く */
function DayRecordsScreen({ date, records, onClose, onOpenDetail }) {
  const [closing, close] = useClosing(onClose);
  const { stripRef, screenRef } = useEdgeSwipeBack(close);
  const list = useMemo(() => {
    const all = records.filter((r) => r.date === date);
    const pinned = all.filter((r) => r.pinned);
    const rest = all.filter((r) => !r.pinned);
    return [...pinned, ...rest];
  }, [records, date]);

  return (
    <OverlayScreen from="right" closing={closing}>
    <div ref={screenRef} className="absolute inset-0 ft-page flex flex-col">
      <div ref={stripRef} data-ft-edge="" className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div className="ft-hdr bg-white border-b border-neutral-200 px-4 pb-3 flex items-center gap-2 shrink-0" style={SAFE_TOP(12)}>
        <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-th-800 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
        <h2 className="font-display text-[20px] text-neutral-900 truncate flex-1 tracking-wide">{date}</h2>
        <MenuButton />
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full">
        {list.length === 0 ? (
          <div className="flex flex-col items-center py-8">
            <Mascot seed="calendar-empty" size={148} />
            <p className="text-[14.5px] text-neutral-500 mt-1">この日はまだ記録がありません</p>
          </div>
        ) : (
          <>
            <h3 className="text-[12.5px] font-bold tracking-wider text-th-800/70 uppercase mb-3">{list.length}件の記録</h3>
            <div className="space-y-2.5 ft-seq lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-2.5">
              {list.map((r) => <RecordCard key={r.id} r={r} onClick={() => onOpenDetail(r)} />)}
            </div>
          </>
        )}
      </div>
    </div>
    </OverlayScreen>
  );
}

function BookRecordsScreen({ book, records, onClose, onOpenDetail, defaultSort }) {
  /* はじめの並び順は、カスタマイズで決めたもの。指定が無ければ目次順 */
  const [sortMode, setSortMode] = useState(() => defaultSort || "book");
  const sortFn = (a, b) => {
    if (sortMode === "dateDesc") return (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || "");
    if (sortMode === "dateAsc") return (a.date || a.createdAt || "").localeCompare(b.date || b.createdAt || "");
    return compareForSearch(a, b);
  };
  /* ピン留めした記録を先に、そのあと並べ替えの順で */
  const list = useMemo(() => {
    const all = records.filter((r) => recordRefs(r).some((ref) => ref.book === book));
    const pinned = all.filter((r) => r.pinned).sort(sortFn);
    const rest = all.filter((r) => !r.pinned).sort(sortFn);
    return [...pinned, ...rest];
  }, [records, book, sortMode]);
  const counts = useMemo(() => chapterCountsByBook(records)[book] || {}, [records, book]);
  const [closing, close] = useClosing(onClose);
  const { stripRef, screenRef } = useEdgeSwipeBack(close);

  return (
    <OverlayScreen from="right" closing={closing}>
      <div ref={stripRef} data-ft-edge="" className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div ref={screenRef} className="absolute inset-0 bg-white flex flex-col">
      <div className="ft-hdr flex items-center gap-2 px-5 pb-4 border-b border-neutral-200 shrink-0 max-w-2xl mx-auto w-full" style={SAFE_TOP(16)}>
        <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-th-800 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
        <h2 className="font-display text-[20px] text-neutral-900 flex-1 min-w-0 truncate tracking-wide">{book}</h2>
        <MenuButton />
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full">
        <ChapterTiles book={book} counts={counts} />
        <div className="flex items-center gap-2 mb-3">
          <p className="text-[12.5px] font-bold tracking-wider text-th-800/70 uppercase">{list.length}件の記録</p>
          <SortToggle value={sortMode} onChange={setSortMode} />
        </div>
        <div className="space-y-2.5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-2.5">
          {list.length === 0 && (
            <div className="flex flex-col items-center py-6 lg:col-span-2">
              <Mascot seed="book-empty" size={142} />
              <p className="text-[14.5px] text-neutral-500 mt-1">この書を含む記録はまだありません</p>
            </div>
          )}
          {list.map((r) => <RecordCard key={r.id} r={r} onClick={() => onOpenDetail(r)} />)}
        </div>
              </div>
      </div>
    </OverlayScreen>
  );
}

/* ============================================================
   記録の詳細画面（検索結果タップ時に表示。右上の「編集」で編集画面へ）
   ============================================================ */
/* いま開いている記録と、同じ聖書箇所を含む他の記録を集める。
   **書と章だけで見ないこと。** 以前はそうしていたため、
   ヨハネ3:13-24 の記録に、重なっていない 3:1-12 の記録まで出ていた。
   ・重なりの判定は refsOverlap（節の範囲まで見る）
   ・どこを扱っている記録かは recordScopeRefs
     （メモの中の「3章の前半について」のような章だけの言い及びは、
      同じ章に節つきの箇所があれば落とす） */
function relatedRecords(records, target) {
  const refs = recordScopeRefs(target).filter((x) => x.book);
  if (!refs.length) return [];
  const hit = (r) => recordScopeRefs(r).some((x) => refs.some((t) => refsOverlap(x, t)));
  return records
    .filter((r) => r.id !== target.id && hit(r))
    .sort((a, b) => (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || ""))
    .slice(0, 20);
}
/* from ＝ どちらから出てくるか。ふつうは右から。
   ちょっと見る小窓から「この記録を開く」で来たときだけ、下からせり上がる。
   小窓が下から出ているので、そのまま続けて上がってくるほうが自然なため */
/* zIndex は既定（50）より大きくすること。
   ブックマークやタグの整理など、ほかの重なる画面から開くことがあり、
   同じ高さだと、あとに書かれた画面の下に隠れてしまう（実際そうなっていた） */
/* 写真を大きく見る画面（姉妹アプリ My手帳 2.20.3 の PhotoViewer と同じ動き。2.7.0〜）。
   **地は黒く、上下の余白まで覆うこと。** 写真の色に引きずられないようにする。

   ・横に払うと、となりの写真へ（**端で先頭に戻らないこと**。端では重くして、それ以上ないことを指に返す）
   ・上から下へ払うと、下へ滑り出て閉じる。払ったぶんだけ地がうすくなり、どこまで引けば閉じるかが指で分かる。
     上へは少しだけしか動かさない（閉じる向きが分からなくなるため）
   ・二本指でつまむと拡大・縮小（1〜5倍）。二度たたき（マウスなら二度クリック）でも拡大し、もういちどで、もとの大きさ
   ・一度たたきは閉じる。**すぐ閉じないこと。** 二度目が来るかを、指なら280ms・マウスなら450ms待つ。
     拡大しているあいだの一度たたきでは閉じない（見ている途中で消えると困る）
   ・拡大中は「もとの大きさ」のボタンを出す。拡大中に指で動かすと、写真の中をずらして見られる
   ・**ブラウザの dblclick を足さないこと。** 下の二度たたきと二重に働き、拡大してすぐ戻る
   ・**位置の計算を React の状態でやらないこと。** 一こまごとに描き直しが入って指に追いつかない。
     覚え書き（ref）に持って、要素へ直に当てている */
const ZOOM_MAX = 5;
const ZOOM_TAP = 2.5;
function PhotoViewer({ images, index, onClose }) {
  const list = images || [];
  const last = Math.max(0, list.length - 1);
  const [i, setI] = useState(Math.min(Math.max(0, index || 0), last));
  const [zoomed, setZoomed] = useState(false); // 「もとの大きさ」を出すため
  useLockBackground();
  const rootRef = useRef(null);   // 外わく（うしろへ指を通さない見張りを付ける）
  const wrapRef = useRef(null);   // 指を受ける箱（下へ払うとここが動く）
  const backRef = useRef(null);   // 黒い地
  const chromeRef = useRef(null); // 上下の✕・枚数・点（払うと薄くなる）
  const trackRef = useRef(null);  // 横に並んだ帯
  const pageRefs = useRef({});    // 写真を入れた枠（拡大はここに掛ける）
  const gone = useRef(false);     // 二重に閉じないための札
  const tapRef = useRef({ at: 0, timer: null });
  const st = useRef({
    i: Math.min(Math.max(0, index || 0), last),
    scale: 1, tx: 0, ty: 0,
    dx: 0, dy: 0,
    mode: null, moved: false,
    pts: new Map(),
    startX: 0, startY: 0, baseTx: 0, baseTy: 0,
    startDist: 1, startScale: 1, focal: { x: 0, y: 0 },
  });
  const width = () => (wrapRef.current ? wrapRef.current.clientWidth : 1);
  /* 画面に当てる。anim を真にすると、するりと動く */
  const apply = (anim) => {
    const s = st.current;
    const w = width();
    const ease = "cubic-bezier(0.22,1,0.36,1)";
    if (trackRef.current) {
      trackRef.current.style.transition = anim ? `transform .28s ${ease}` : "none";
      trackRef.current.style.transform = `translate3d(${-s.i * w + s.dx}px,0,0)`;
    }
    if (wrapRef.current) {
      wrapRef.current.style.transition = anim ? `transform .28s ${ease}` : "none";
      wrapRef.current.style.transform = `translate3d(0,${s.dy}px,0)`;
    }
    const k = Math.max(0, 1 - Math.abs(s.dy) / 420);
    if (backRef.current) {
      backRef.current.style.transition = anim ? "opacity .28s ease" : "none";
      backRef.current.style.opacity = String(0.3 + 0.7 * k);
    }
    if (chromeRef.current) {
      chromeRef.current.style.transition = anim ? "opacity .28s ease" : "none";
      chromeRef.current.style.opacity = String(k);
    }
    const el = pageRefs.current[s.i];
    if (el) {
      el.style.transition = anim ? `transform .24s ${ease}` : "none";
      el.style.transform = `translate3d(${s.tx}px,${s.ty}px,0) scale(${s.scale})`;
    }
  };
  /* 拡大したとき、写真が枠の外へ行きすぎないように押さえる */
  const clampPan = () => {
    const s = st.current;
    const page = pageRefs.current[s.i];
    const img = page && page.querySelector("img");
    const box = wrapRef.current;
    if (!img || !box) return;
    const mx = Math.max(0, (img.clientWidth * s.scale - box.clientWidth) / 2);
    const my = Math.max(0, (img.clientHeight * s.scale - box.clientHeight) / 2);
    s.tx = Math.max(-mx, Math.min(mx, s.tx));
    s.ty = Math.max(-my, Math.min(my, s.ty));
  };
  /* 拡大しているかを画面の側へ伝える。**一こまごとに setState しないこと。** 変わったときだけ */
  const zoomedRef = useRef(false);
  const syncZoom = () => {
    const on = st.current.scale > 1.05;
    if (zoomedRef.current !== on) { zoomedRef.current = on; setZoomed(on); }
  };
  const resetZoom = () => {
    const s = st.current;
    s.scale = 1; s.tx = 0; s.ty = 0;
    syncZoom();
  };
  /* 閉じる。**そのまま消さないこと。** 下へ滑り出てから消える */
  const dismiss = () => {
    if (gone.current) return;
    gone.current = true;
    if (tapRef.current.timer) clearTimeout(tapRef.current.timer);
    const out = "cubic-bezier(0.55,0,0.68,0.53)";
    if (wrapRef.current) {
      wrapRef.current.style.transition = `transform .26s ${out}, opacity .26s ease`;
      wrapRef.current.style.transform = `translate3d(0,${Math.max(600, window.innerHeight)}px,0)`;
      wrapRef.current.style.opacity = "0";
    }
    if (backRef.current) { backRef.current.style.transition = "opacity .26s ease"; backRef.current.style.opacity = "0"; }
    if (chromeRef.current) { chromeRef.current.style.transition = "opacity .2s ease"; chromeRef.current.style.opacity = "0"; }
    setTimeout(onClose, 250);
  };
  const toggleZoom = (x, y) => {
    const s = st.current;
    if (s.scale > 1.05) {
      resetZoom();
    } else {
      const r = wrapRef.current.getBoundingClientRect();
      const fx = x - (r.left + r.width / 2);
      const fy = y - (r.top + r.height / 2);
      s.scale = ZOOM_TAP;
      s.tx = -fx * (ZOOM_TAP - 1);
      s.ty = -fy * (ZOOM_TAP - 1);
      clampPan();
      syncZoom();
    }
    apply(true);
  };
  const onTap = (x, y, pointerType) => {
    const win = pointerType === "mouse" ? 450 : 280;
    const now = Date.now();
    if (now - tapRef.current.at < win) {
      tapRef.current.at = 0;
      if (tapRef.current.timer) clearTimeout(tapRef.current.timer);
      toggleZoom(x, y);
      return;
    }
    tapRef.current.at = now;
    if (st.current.scale > 1.05) return;
    tapRef.current.timer = setTimeout(() => { dismiss(); }, win);
  };
  const onDown = (e) => {
    /* **ボタン（✕・点・もとの大きさ）の上から始まった指は、ここで受けないこと。**
       下で setPointerCapture を呼ぶと、離したときの click がボタンではなく箱へ届き、
       ボタンが動かなくなる（My手帳 2.11.23 で実際に起きた） */
    if (e.target && e.target.closest && e.target.closest("button")) return;
    if (e.pointerType === "mouse" && e.button !== 0) return; // 右クリックを「たたき」に数えない
    const s = st.current;
    s.pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (wrapRef.current && wrapRef.current.setPointerCapture) {
      try { wrapRef.current.setPointerCapture(e.pointerId); } catch (x) { /* 使えない端末は素通り */ }
    }
    if (s.pts.size === 1) {
      s.startX = e.clientX; s.startY = e.clientY;
      s.baseTx = s.tx; s.baseTy = s.ty;
      s.mode = s.scale > 1 ? "pan" : null; // null ＝ 縦か横か、まだ決めていない
      s.moved = false;
    } else if (s.pts.size === 2) {
      const p = [...s.pts.values()];
      s.startDist = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) || 1;
      s.startScale = s.scale;
      const r = wrapRef.current.getBoundingClientRect();
      s.focal = { x: (p[0].x + p[1].x) / 2 - (r.left + r.width / 2), y: (p[0].y + p[1].y) / 2 - (r.top + r.height / 2) };
      s.baseTx = s.tx; s.baseTy = s.ty;
      s.mode = "pinch";
      s.moved = true;
      s.dx = 0; s.dy = 0; // つまみ始めたら、払いかけを戻す
    }
  };
  const onMove = (e) => {
    const s = st.current;
    if (!s.pts.has(e.pointerId)) return;
    s.pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
    /* 二本指 ＝ つまんで拡大・縮小。指のあいだの点を動かさないようにずらす */
    if (s.mode === "pinch" && s.pts.size >= 2) {
      const p = [...s.pts.values()];
      const d = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) || 1;
      const ns = Math.max(1, Math.min(ZOOM_MAX, s.startScale * (d / s.startDist)));
      const r = wrapRef.current.getBoundingClientRect();
      const fx = (p[0].x + p[1].x) / 2 - (r.left + r.width / 2);
      const fy = (p[0].y + p[1].y) / 2 - (r.top + r.height / 2);
      const ux = (s.focal.x - s.baseTx) / s.startScale;
      const uy = (s.focal.y - s.baseTy) / s.startScale;
      s.scale = ns;
      s.tx = fx - ux * ns;
      s.ty = fy - uy * ns;
      clampPan(); syncZoom(); apply(false);
      return;
    }
    const dx = e.clientX - s.startX, dy = e.clientY - s.startY;
    if (!s.mode) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      s.mode = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      s.moved = true;
    }
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) s.moved = true;
    if (s.mode === "x") {
      const edge = (s.i === 0 && dx > 0) || (s.i === last && dx < 0);
      s.dx = edge ? dx * 0.3 : dx;
      apply(false);
    } else if (s.mode === "y") {
      s.dy = dy < 0 ? dy * 0.28 : dy;
      apply(false);
    } else if (s.mode === "pan") {
      s.tx = s.baseTx + dx; s.ty = s.baseTy + dy;
      clampPan(); apply(false);
    }
  };
  const onUp = (e) => {
    const s = st.current;
    /* onDown が受けなかった指（ボタンから始まったもの）は、離しても何もしない。
       これが無いと、前の操作の moved が残って「一度たたき」に数えられ、少し後に閉じてしまう */
    if (!s.pts.has(e.pointerId)) return;
    s.pts.delete(e.pointerId);
    if (s.mode === "pinch") {
      if (s.pts.size >= 1) {
        /* 一本だけ残った → そのまま、ずらす操作へ引き継ぐ */
        const p = [...s.pts.values()][0];
        s.startX = p.x; s.startY = p.y; s.baseTx = s.tx; s.baseTy = s.ty;
        s.mode = s.scale > 1 ? "pan" : null;
        return;
      }
      if (s.scale <= 1.02) resetZoom();
      clampPan(); syncZoom();
      s.mode = null;
      apply(true);
      return;
    }
    if (s.pts.size > 0) return;
    const w = width();
    if (s.mode === "x") {
      const need = Math.min(96, w * 0.22);
      let n = s.i;
      if (s.dx < -need && s.i < last) n = s.i + 1;
      else if (s.dx > need && s.i > 0) n = s.i - 1;
      s.dx = 0;
      if (n !== s.i) { s.i = n; resetZoom(); setI(n); }
      apply(true);
    } else if (s.mode === "y") {
      /* 110px ほど引いたら閉じる。浅ければ、もとの場所へ戻る */
      if (s.dy > 110) { dismiss(); return; }
      s.dy = 0;
      apply(true);
    } else if (s.mode === "pan") {
      clampPan(); syncZoom(); apply(true);
      /* 拡大中に、動かさず離した ＝ たたき（二度たたきで、もとの大きさへ） */
      if (!s.moved) onTap(e.clientX, e.clientY, e.pointerType);
    } else if (!s.moved) {
      onTap(e.clientX, e.clientY, e.pointerType);
    }
    s.mode = null;
  };
  const onCancel = (e) => {
    const s = st.current;
    s.pts.delete(e.pointerId);
    if (s.pts.size === 0) { s.dx = 0; s.dy = 0; s.mode = null; clampPan(); apply(true); }
  };
  /* 開いたときと、画面の向きが変わったとき。**位置を当て直すこと。** 幅が変わると、何枚目かがずれる */
  useEffect(() => {
    apply(false);
    const onResize = () => { st.current.dx = 0; st.current.dy = 0; resetZoom(); apply(false); };
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      if (tapRef.current.timer) clearTimeout(tapRef.current.timer);
    };
  }, []); // eslint-disable-line
  /* 指の受け取りは React まかせにせず、この要素へ直に付ける。
     React は画面のいちばん外でまとめて受けるので、途中にある「左端から払って戻る」などの仕掛けが先に動いてしまう */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const wrap = (fn) => (e) => { e.stopPropagation(); fn(e); };
    const d = wrap(onDown), m = wrap(onMove), u = wrap(onUp), c = wrap(onCancel);
    el.addEventListener("pointerdown", d);
    el.addEventListener("pointermove", m, { passive: false });
    el.addEventListener("pointerup", u);
    el.addEventListener("pointercancel", c);
    return () => {
      el.removeEventListener("pointerdown", d);
      el.removeEventListener("pointermove", m);
      el.removeEventListener("pointerup", u);
      el.removeEventListener("pointercancel", c);
    };
  }, []); // eslint-disable-line
  /* うしろの画面へ、指を通さない。
     この窓は記録の詳細画面の中に作られているので、touch / wheel はそのまま外へ上がり、
     詳細画面の「左端から払って戻る」やうしろの巻き物に届いてしまう。
     touchmove / wheel は既定の動きも止める（ボタンの上から始まった指は止めない。click が届かなくなるため） */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;
    const stop = (e) => { e.stopPropagation(); };
    const lock = (e) => {
      e.stopPropagation();
      const t = e.target;
      if (e.cancelable && !(t && t.closest && t.closest("button"))) e.preventDefault();
    };
    const stopTypes = ["touchstart", "touchend", "touchcancel", "mousedown", "mouseup", "dblclick", "contextmenu", "pointerdown", "pointerup", "pointermove", "pointercancel"];
    const lockTypes = ["touchmove", "wheel"];
    stopTypes.forEach((t) => el.addEventListener(t, stop, { passive: true }));
    lockTypes.forEach((t) => el.addEventListener(t, lock, { passive: false }));
    return () => {
      stopTypes.forEach((t) => el.removeEventListener(t, stop));
      lockTypes.forEach((t) => el.removeEventListener(t, lock));
    };
  }, []); // eslint-disable-line
  const goto = (n) => {
    const s = st.current;
    s.i = Math.max(0, Math.min(last, n));
    s.dx = 0;
    resetZoom();
    setI(s.i);
    apply(true);
  };

  return (
    <div ref={rootRef} data-ft-overlay="" className="fixed inset-0 anim-fade" style={{ zIndex: 2147483200 }}
      onClick={(e) => e.stopPropagation()}>
      <div ref={backRef} className="absolute inset-0" style={{ background: "#000", opacity: 1 }} />
      <div ref={wrapRef} className="absolute inset-0 overflow-hidden" style={{ touchAction: "none" }}>
        <div ref={trackRef} className="absolute inset-0 flex" style={{ willChange: "transform" }}>
          {list.map((src, k) => (
            <div key={k} className="relative w-full h-full shrink-0">
              <div ref={(el) => { pageRefs.current[k] = el; }} className="absolute inset-0 flex items-center justify-center px-2"
                style={{ willChange: "transform" }}>
                <Photo src={src} className="max-w-full max-h-full" style={{ objectFit: "contain", WebkitTouchCallout: "none", userSelect: "none" }} />
              </div>
            </div>
          ))}
        </div>
        <div ref={chromeRef} className="absolute inset-0 pointer-events-none">
          <div className="flex items-center px-3 pointer-events-auto" style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}>
            <button type="button" onClick={dismiss} aria-label="閉じる"
              className="w-12 h-12 flex items-center justify-center rounded-full text-white ft-tap ft-tap-icon">
              <X size={24} />
            </button>
            <span className="flex-1" />
            {list.length > 1 && (
              <span className="text-[13.5px] text-white/70 tabular-nums pr-3">{i + 1} / {list.length}</span>
            )}
          </div>
          {list.length > 1 && (
            <div className="absolute left-0 right-0 bottom-0 flex items-center justify-center gap-1.5 pointer-events-auto"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 20px)", paddingTop: 12 }}>
              {list.map((_, k) => (
                <button key={k} type="button" aria-label={`${k + 1}枚目`} onClick={() => goto(k)} className="w-6 h-6 flex items-center justify-center">
                  <span className="rounded-full block" style={{ width: 6, height: 6, background: k === i ? "#FFFFFF" : "rgba(255,255,255,.35)" }} />
                </button>
              ))}
            </div>
          )}
          {zoomed && (
            <div className="absolute left-0 right-0 flex justify-center pointer-events-auto"
              style={{ bottom: "calc(env(safe-area-inset-bottom) + 56px)" }}>
              <button type="button" onClick={() => { resetZoom(); apply(true); }}
                className="min-h-[44px] px-4 rounded-full text-[13.5px] font-bold text-white ft-tap"
                style={{ background: "rgba(255,255,255,.18)" }}>もとの大きさ</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RecordDetailScreen({ record, allRecords, onClose, onEdit, onOpenDetail, onToggleMark, from = "right" }) {
  /* 関連する記録を押したときも、右から新しい画面が来るように見せる */
  const [swapping, setSwapping] = useState(false);
  const [relatedOpen, setRelatedOpen] = useState(false);
  const [peek, setPeek] = useState(null);
  const [shareMsg, setShareMsg] = useState(null);
  const shareTimer = useRef(null);
  const tellShare = (text) => {
    clearTimeout(shareTimer.current);
    setShareMsg(text);
    shareTimer.current = setTimeout(() => setShareMsg(null), 2600);
  };
  useEffect(() => () => clearTimeout(shareTimer.current), []);

  /* この記録を文字でコピーする。
     ファイルの行方が分かりにくい端末では、こちらのほうが確かに残せる */
  /* コピーしたことは、知らせの文だけで伝える。
     **ボタンの絵は変えないこと。** 変えると、押したあとに何のボタンだったか
     分かりにくくなる（依頼により取りやめ） */
  const copyOne = async () => {
    const ok = await copyToClipboard(oneRecordJson(record));
    tellShare(ok
      ? "コピーしました。メモやチャットに貼りつけて共有できます。"
      : "コピーできませんでした。長押しして選び、手でコピーしてください。");
  };

  /* この記録だけをファイルにして送る。
     共有シートが使える端末ではそこから、使えない端末では書き出しで受け取れるようにする */
  const shareOne = async () => {
    /* **末尾は .txt にすること。**
       Androidは、中身の種類（text/plain）と名前の末尾（.json）が
       食い違うファイルを受け取ってくれないことがある。
       中身はこれまでどおりなので、取り込むときは今までどおり読める。
       **名前に日付は入れない。** 同じ記録を送り直しても、毎回同じ名前になる */
    const name = "Footprints-record.txt";
    const text = oneRecordJson(record);
    try {
      const file = new File([text], name, { type: "text/plain" });
      if (navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
        /* title は渡さない（余分なテキストが作られるため） */
        await navigator.share({ files: [file] });
        return;
      }
    } catch (e) {
      /* 取り消されたときもここに来る。書き出しには進まず、そのまま終える */
      if (e && e.name === "AbortError") return;
    }
    try {
      const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      tellShare("ファイルを書き出しました");
    } catch (e) {
      tellShare("書き出せませんでした");
    }
  };
  const swapTimer = useRef(null);
  useEffect(() => () => clearTimeout(swapTimer.current), []);
  const goRelated = (r) => {
    if (swapping) return;
    setSwapping(true);
    swapTimer.current = setTimeout(() => { onOpenDetail(r); setSwapping(false); }, 60);
  };
  const chips = chipRefs(recordRefs(record));
  const related = useMemo(() => relatedRecords(allRecords || [], record), [allRecords, record]);
  const [closing, close] = useClosing(onClose);
  const [viewer, setViewer] = useState(null); // 大きく見ている写真の番号
  const { stripRef, screenRef } = useEdgeSwipeBack(close);

  return (
    <OverlayScreen from={from} closing={closing || swapping} zIndex={60}>
      <div ref={stripRef} data-ft-edge="" className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div ref={screenRef} className="absolute inset-0 bg-white flex flex-col">
      <div className="ft-hdr flex items-center gap-2 px-5 pb-4 border-b border-neutral-200 shrink-0 max-w-2xl mx-auto w-full" style={SAFE_TOP(16)}>
        <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-th-800 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
        <h2 className="font-display text-[17px] text-neutral-900 flex-1 min-w-0 truncate">{recordTitle(record)}</h2>
        <MenuButton />
      </div>

      {/* コピーや書き出しの知らせ。
          **本文の下に置かないこと。** 押すボタンは画面の上にあるので、
          下に出しても目に入らず、押せたのか分からない（実際そうなっていた）。
          画面の下から浮かせて、確かに見えるようにする */}
      {viewer !== null && <PhotoViewer images={record.images} index={viewer} onClose={() => setViewer(null)} />}

      {shareMsg && (
        /* **画面の中ほどに出すこと。**
           下のほうに置くと、長い記録では画面の外に回って見えないことがある。
           記録に重なってでも、必ず目に入る場所に出す。
           位置と重なり順は style で直に書く。指定が届かない場では、
           下に流れて隠れてしまうため */
        <div className="anim-fade"
          style={{ position: "fixed", top: "45%", left: 0, right: 0, zIndex: 2147483300,
                   display: "flex", justifyContent: "center", padding: "0 20px",
                   pointerEvents: "none", transform: "translateY(-50%)" }}>
          <p style={{ maxWidth: 448, width: "100%", textAlign: "center", fontWeight: 700,
                      color: "#fff", background: "rgba(23,23,23,0.92)", borderRadius: 14,
                      padding: "14px 16px", boxShadow: "0 10px 30px rgba(0,0,0,.28)", lineHeight: 1.6 }}
            className="text-[13.5px]">{shareMsg}</p>
        </div>
      )}

      <button onClick={onEdit} aria-label="この記録を編集"
        /* 大きさは記録画面の＋ボタンとそろえること（w-14 h-14）。
           別々にしていると、画面を移るたびに大きさが変わって見える */
        className="absolute right-5 z-20 w-14 h-14 rounded-full bg-th-900 text-white shadow-xl flex items-center justify-center hover:bg-th-800 ft-tap ft-fab"
        style={{ bottom: "calc(env(safe-area-inset-bottom) + 20px)" }}>
        <Pencil size={24} />
      </button>

      {/* 鉛筆ボタン（下から 切り欠き＋20px・高さ56px）のぶんの逃げ場。
          これが無いと、いちばん下に置いたものがボタンに隠れて押せなくなる */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 max-w-2xl mx-auto w-full"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 96px)" }}>
        {/* 上から「見出し」「本文」「関連」の3つのかたまり。
            かたまりの間だけを広くとり、中は詰める。
            余白を項目ごとにばらばらに付けると、詰まって見える所と空きすぎる所が混ざる */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <TypeBadge type={record.type} />
          {record.date && <span className="text-[12.5px] font-bold text-neutral-500">{record.date}</span>}
          <span className="ml-auto flex items-center gap-1">
            <MarkButton on={!!record.pinned} onClick={() => onToggleMark(record.id, "pinned")}
              label="ピン留め" icon={<Pin size={18} />} />
            <MarkButton on={!!record.bookmarked} onClick={() => onToggleMark(record.id, "bookmarked")}
              label="ブックマーク" icon={<Bookmark size={18} />} />
            <MarkButton on={false} onClick={shareOne} label="この記録をファイルにして送る" icon={<Upload size={18} />} />
            <MarkButton on={false} onClick={copyOne} label="この記録を文字でコピーする" icon={<Copy size={18} />} />
          </span>
        </div>
        <TagChips tags={record.tags} className="mb-5" />

        {/* ft-text ＝ この本文は字を選んで写せる（画面ぜんたいは選べない決まり。.ft-root を参照） */}
        <div className="space-y-5 ft-text">
          {recordSections(record).map((sc, i) => (
            <div key={i}>
              {sc.label && (
                <span className="block text-[12.5px] font-bold tracking-wider text-th-800/70 uppercase mb-1.5">{sc.label}</span>
              )}
              <HighlightedText text={sc.text} className="text-[15.5px] text-neutral-900 leading-relaxed whitespace-pre-line" />
            </div>
          ))}
        </div>

        {/* 写真。**本文のあと、タグや箇所より前に置くこと**（入力画面と同じ並び）。
            並べ方は My手帳 の記録と同じ（2.7.0〜）。1つの角丸の枠に、すき間3pxで敷きつめる。
            ・1枚 … 横長 4:3 で大きく
            ・2枚 … 左右に並べる（枠は 3:2）
            ・3枚 … 左に縦長の1枚、右に2枚を上下（枠は 3:2）
            ・4枚 … 2×2（枠は 3:2）
            切り抜いて見せているので、全体は押して開く拡大窓で見る。
            **入力画面（ImagesField）の並べ方はこれに合わせないこと。** あちらは✕で外すたびに
            並びが変わると、遅れて届く押し込みが別の✕に当たるので、いつも2列・正方形のまま */}
        {(record.images || []).length > 0 && (() => {
          const imgs = (record.images || []).slice(0, MAX_IMAGES);
          const n = imgs.length;
          return (
            <div className="mt-5 grid gap-[3px] rounded-2xl overflow-hidden bg-neutral-100"
              style={{
                gridTemplateColumns: n === 1 ? "1fr" : "1fr 1fr",
                gridTemplateRows: n > 2 ? "1fr 1fr" : "1fr",
                aspectRatio: n === 1 ? "4 / 3" : "3 / 2",
              }}>
              {imgs.map((src, i) => (
                <button key={i} type="button" onClick={() => setViewer(i)} aria-label={`写真 ${i + 1} を大きく見る`}
                  className="block overflow-hidden min-w-0 min-h-0 ft-tap ft-tap-card"
                  style={n === 3 && i === 0 ? { gridRow: "span 2", WebkitTouchCallout: "none" } : { WebkitTouchCallout: "none" }}>
                  <Photo src={src} className="block w-full h-full" style={{ objectFit: "cover" }} />
                </button>
              ))}
            </div>
          );
        })()}

        {chips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-neutral-200">
            {chips.map((c, i) => <span key={i} className="text-[11.5px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">{c.book}{c.chapter ? ` ${c.chapter}` : ""}</span>)}
          </div>
        )}

        {/* 今月・今年の聖句として登録されていれば、それが分かるようにする。
            入力画面を開かないと分からないのは不親切なため */}
        {record.type === "memorization" && (record.monthYear || record.themeYear) && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {record.monthYear && (
              <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold px-3 py-1.5 rounded-full bg-th-50 text-th-900 border border-th-200">
                <Star size={14} /> {record.monthYear}年{record.monthMonth}月の聖句
              </span>
            )}
            {record.themeYear && (
              <span className="inline-flex items-center gap-1.5 text-[12.5px] font-bold px-3 py-1.5 rounded-full bg-th-800 text-white border-2 border-th-800">
                <Star size={14} /> {record.themeYear}年の聖句
              </span>
            )}
          </div>
        )}

        {/* 入力画面の「この箇所には過去のメモがあります」と同じ、たたんだ見せ方に揃えている。
            開くまでは1行で済むので、本文の下がすっきりする */}
        {related.length > 0 && (<div className="mt-5">
          <div className="rounded-xl border border-amber-200 bg-amber-50/60 overflow-hidden">
            <button type="button" onClick={() => setRelatedOpen((v) => !v)} aria-expanded={relatedOpen}
              className="w-full flex items-center gap-2 px-3.5 py-3 text-left min-h-[48px] ft-tap ft-tap-card">
              <Sparkles size={16} className="text-amber-700 shrink-0" />
              <span className="flex-1 text-[13.5px] font-bold text-amber-900">この箇所を含む記録があります（{related.length}件）</span>
              <ChevronDown size={17} className={"text-amber-700 shrink-0 ft-chev " + (relatedOpen ? "ft-chev-on" : "")} />
            </button>
            {relatedOpen && (
              <div className="px-3 pb-3 space-y-2 ft-open-y">
                {related.map((r) => (
                  <button key={r.id} type="button" onClick={() => setPeek(r)}
                    className="w-full text-left rounded-lg bg-white border border-amber-200 px-3 py-2.5 ft-tap ft-tap-card">
                    <div className="flex items-center gap-2 mb-1">
                      <TypeBadge type={r.type} />
                      <span className="text-[11.5px] font-bold text-neutral-500 ml-auto">{r.date}</span>
                    </div>
                    <p className="text-[13.5px] text-neutral-700 whitespace-pre-line">{clampText(recordFullDisplay(r), 4)}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>)}



        {peek && (
          <RecordPeekDialog record={peek}
            onOpen={(r) => { setPeek(null); onOpenDetail(r, "bottom"); }}
            onClose={() => setPeek(null)} />
        )}
      </div>
      </div>
    </OverlayScreen>
  );
}

/* ============================================================
   バックアップ画面
   ============================================================ */
/* クリップボードへのコピー。新しい方式がだめなら古い方式も試す */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) { /* 次の方法へ */ }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    ta.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return !!ok;
  } catch (e) { return false; }
}

/* ファイルとして保存できなかったときに出す確認ダイアログ */
function SaveFallbackDialog({ onCopy, onCancel }) {
  return (
    <div data-ft-overlay="" className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center px-6">
      <BackgroundLock />
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-neutral-200 shadow-xl anim-pop max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-[17px] text-neutral-900 mb-2">ファイルとして保存できませんでした</h3>
        <p className="text-[13.5px] text-neutral-600 mb-2 leading-relaxed">
          この画面ではファイルに保存できません。コピーして、メモアプリなどに残してください。
        </p>
        <p className="text-[12.5px] text-neutral-500 mb-5 leading-relaxed">
          ホーム画面に追加したアプリからなら、ファイルで保存できます。
        </p>
        <div className="flex gap-2.5">
          <button onClick={onCancel} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>閉じる</button>
          <button onClick={onCopy} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>コピーする</button>
        </div>
      </div>
    </div>
  );
}

/* 書き出すファイルの中身。
   **読める文と復元用データを、1つのファイルにまとめること。**
   2つに分けると、どちらを選べばよいか分からなくなり、
   Androidでは片方しか手元に残らないこともある（実際そうなった）。
   下の目印から後ろが復元用。取り込むときはここを探して読む */
const BACKUP_MARK = "===== ここから下は復元用のデータです。消さないでください =====";
function buildBackupFile(readableText, jsonText) {
  return `${readableText}\n\n${BACKUP_MARK}\n${jsonText}\n`;
}
/* 受け取ったファイルから、復元用データを取り出す。
   目印つきのファイルでも、復元用データだけのファイル（昔の形）でも読めるようにする */
function extractBackupJson(text) {
  const s = String(text == null ? "" : text);
  const i = s.indexOf(BACKUP_MARK);
  if (i !== -1) return s.slice(i + BACKUP_MARK.length).trim();
  return s.trim();
}

function buildBackupText(records) {
  const lines = [];
  /* アプリ名の見出しは入れない。ファイル名で分かるようにしてあるので、
     読むときに邪魔になるだけ（依頼により削除） */
  lines.push(`書き出し日時: ${new Date().toLocaleString("ja-JP")}`);
  lines.push(`件数: ${records.length}件`);
  lines.push("");
  const sorted = [...records].sort((a, b) => (a.date || a.createdAt || "").localeCompare(b.date || b.createdAt || ""));
  sorted.forEach((r) => {
    lines.push("----------------------------------------");
    lines.push(`[${TYPE_LABELS[r.type] || r.type}]` + (r.date ? ` ${r.date}` : ""));
    lines.push(recordTitle(r));
    const body = recordFullDisplay(r);
    if (body) lines.push(body);
    if ((r.tags || []).length) lines.push("タグ: " + r.tags.join(" / "));
    lines.push("");
  });
  return lines.join("\n");
}
/* ============================================================
   イラスト管理画面
   ============================================================ */
/* ============================================================
   ヘッダーの写真の切り抜き（My手帳 2.11.21 の仕組みをそのまま移したもの）
   ============================================================ */
/* 見出しの帯の形（よこ÷たて）。**切り抜きの窓と、帯の形をそろえること。**
   帯は background-size: cover ＋ center で敷いているので、形がそろっていないと
   決めた範囲がそのまま出ない（たとえば 16/9 で切ると上下が切られ、まん中の細い帯しか出ない）。
   帯の高さは文字の大きさや端末の上の余白で変わるので、**決め打ちせず** ScreenHeader が書いた
   --ft-head-h / --ft-head-w を読む。測れないときは 16/5。2〜8 の外には出さない */
function headerBandAspect() {
  try {
    const cs = getComputedStyle(document.documentElement);
    const h = parseFloat(cs.getPropertyValue("--ft-head-h"));
    let w = parseFloat(cs.getPropertyValue("--ft-head-w"));
    if (!(w > 0)) w = (typeof window !== "undefined" && window.innerWidth) || 0;
    if (w > 0 && h > 20) return Math.max(2, Math.min(8, w / h));
  } catch (e) { /* 測れない端末は、おおよその形で */ }
  return 16 / 5;
}
function useHeaderAspect() {
  const [a, setA] = useState(headerBandAspect);
  useEffect(() => {
    const put = () => setA((p) => { const v = headerBandAspect(); return Math.abs(p - v) < 0.01 ? p : v; });
    put();
    /* 画面を回すと帯の形も変わる。**そのとき測り直すこと**（見出しが測り終えるのを少し待つ） */
    const later = () => { put(); setTimeout(put, 200); setTimeout(put, 480); };
    window.addEventListener("resize", later);
    window.addEventListener("orientationchange", later);
    return () => {
      window.removeEventListener("resize", later);
      window.removeEventListener("orientationchange", later);
    };
  }, []);
  return a;
}

/* 写真のどこを使うかを決める紙（下から出る）。
   ・指で動かす／2本指でつまんで大きさを変える（1〜4倍）
   ・**窓を写真からはみ出させないこと。** 動かせるのは、はみ出しているぶんだけ
   ・外へ引いたり、1倍より小さく・4倍より大きくしたりすると、少しだけ外へ出て、指を離すと戻る
   ・**指で引いているあいだは動きを付けないこと。** 絵が指から遅れてついてきて、酔ったような感じになる */
function CropSheet({ file, aspect = 1, round, title = "位置を決める", onCancel, onDone }) {
  const [url, setUrl] = useState("");
  const [nat, setNat] = useState(null); // 元の絵の大きさ
  const [ng, setNg] = useState(false);
  const [box, setBox] = useState({ w: 300, h: 300 });
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 }); // 窓のまん中からのずれ（画面のpx）
  const [busy, setBusy] = useState(false);
  const boxRef = useRef(null);
  const pts = useRef(new Map()); // いま触れている指
  const start = useRef(null);
  /* **元の写真をそのまま見せないこと。** iPhone の写真は大きすぎて、
     絵として読めずにまっ黒になることがある。いちど小さくしてから見せる。
     **画質は落とさないこと（0.92）。** ここを落とすと、切り抜いた絵が二重に荒れる */
  useEffect(() => {
    let alive = true;
    setUrl(""); setNg(false); setNat(null);
    shrinkPhoto(file, 1600, 0.92)
      .then((d) => {
        if (!alive) return;
        const im = new Image();
        im.onload = () => { if (alive) { setNat({ w: im.width, h: im.height }); setUrl(d); } };
        im.onerror = () => { if (alive) setNg(true); };
        im.src = d;
      })
      .catch(() => { if (alive) setNg(true); });
    return () => { alive = false; };
  }, [file]);
  useEffect(() => {
    const el = boxRef.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const put = () => setBox({ w: el.clientWidth, h: el.clientHeight });
    put();
    const ro = new ResizeObserver(put);
    ro.observe(el);
    return () => ro.disconnect();
  }, [url]);
  /* 窓いっぱいに広がる大きさ（＝これ以上小さくしない） */
  const base = nat ? Math.max(box.w / nat.w, box.h / nat.h) : 1;
  const dispW = nat ? nat.w * base * scale : box.w;
  const dispH = nat ? nat.h * base * scale : box.h;
  const limX = Math.max(0, (dispW - box.w) / 2);
  const limY = Math.max(0, (dispH - box.h) / 2);
  const clamp = (v, lim) => Math.max(-lim, Math.min(lim, v));
  /* 指で引いているあいだは、少しだけ外へ出られる（そのあと戻る） */
  const rubber = (v, lim) => (Math.abs(v) <= lim ? v : (v > 0 ? lim : -lim) + (v - (v > 0 ? lim : -lim)) * 0.22);
  /* 大きさも同じ手ざわりにする。**つまむ手をぴたりと止めないこと。**
     止まると「これ以上は無理」が壊れたように感じる */
  const SC_MIN = 1, SC_MAX = 4;
  const rubberScale = (v) => {
    if (v < SC_MIN) return Math.max(0.82, SC_MIN - (SC_MIN - v) * 0.35);
    if (v > SC_MAX) return Math.min(4.7, SC_MAX + (v - SC_MAX) * 0.25);
    return v;
  };
  const dist = () => {
    const a = [...pts.current.values()];
    if (a.length < 2) return 0;
    return Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
  };
  const down = (e) => {
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* 使えない端末は無視 */ }
    start.current = { pos, scale, d: dist(), c: { x: e.clientX, y: e.clientY } };
  };
  const move = (e) => {
    if (!pts.current.has(e.pointerId)) return;
    pts.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const st = start.current;
    if (!st) return;
    if (pts.current.size >= 2) {
      /* つまんで大きさを変える */
      const d = dist();
      if (st.d > 0 && d > 0) setScale(rubberScale(st.scale * (d / st.d)));
      return;
    }
    setPos({
      x: rubber(st.pos.x + (e.clientX - st.c.x), limX),
      y: rubber(st.pos.y + (e.clientY - st.c.y), limY),
    });
  };
  const up = (e) => {
    pts.current.delete(e.pointerId);
    if (pts.current.size === 0) {
      start.current = null;
      /* はみ出したぶんは、するっと戻す（位置も大きさも） */
      setScale((v) => Math.max(SC_MIN, Math.min(SC_MAX, v)));
      setPos((v) => ({ x: clamp(v.x, limX), y: clamp(v.y, limY) }));
    } else {
      /* 2本のうち1本を離したら、残った指で続けて動かせるよう起点を取り直す */
      start.current = { pos, scale, d: dist(), c: { x: e.clientX, y: e.clientY } };
    }
  };
  /* 大きさを変えたあとも、窓が写真の外へ出ないように引き戻す */
  useEffect(() => {
    setPos((v) => ({ x: clamp(v.x, limX), y: clamp(v.y, limY) }));
  }, [scale, box.w, box.h, nat]); // eslint-disable-line react-hooks/exhaustive-deps
  const done = async () => {
    setBusy(true);
    try {
      const outW = aspect === 1 ? 480 : 1200;
      /* 画面での動かしぶんを、出す絵の大きさに直す */
      const k = box.w > 0 ? outW / box.w : 1;
      const out = await cropImage(url || file, {
        aspect, scale: Math.max(SC_MIN, Math.min(SC_MAX, scale)),
        dx: clamp(pos.x, limX) * k, dy: clamp(pos.y, limY) * k, maxSide: outW,
      });
      setBusy(false);
      onDone(out);
      return;
    } catch (e) {
      setBusy(false);
      onCancel();
    }
  };
  const EASE = "cubic-bezier(.22,1,.36,1)";
  return (
    <div data-ft-overlay="" className="ft-sheet-wrap flex items-end justify-center anim-fade" style={{ zIndex: 2147483400 }} onClick={onCancel}>
      <BackgroundLock />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-md bg-white rounded-t-2xl border-2 border-b-0 border-neutral-200 shadow-xl flex flex-col anim-sheet"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-1 px-4 py-3 border-b border-neutral-200 shrink-0">
          <span className="font-display text-[17px] text-neutral-900 tracking-wide flex-1">{title}</span>
          <button type="button" onClick={onCancel} aria-label="閉じる"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 ft-tap ft-tap-icon"><X size={22} /></button>
        </div>
        <div className="px-4 py-4 flex justify-center">
          <div ref={boxRef} className="relative w-full overflow-hidden bg-neutral-900"
            data-lim={`${Math.round(limX)},${Math.round(limY)},${Math.round(dispW)},${Math.round(box.w)},${nat ? 1 : 0}`}
            style={{ aspectRatio: `${aspect}`, maxHeight: "36vh", maxWidth: `calc(36vh * ${aspect})`,
              borderRadius: round ? "50%" : 16, touchAction: "none" }}
            onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
            {!url && !ng && (
              <span className="absolute inset-0 flex items-center justify-center text-white"><Spinner size={26} /></span>
            )}
            {ng && (
              <span className="absolute inset-0 flex items-center justify-center text-[13.5px] text-white px-6 text-center">この写真は読み込めませんでした</span>
            )}
            {url && nat && (
              <img src={url} alt="" draggable={false} style={{
                position: "absolute",
                width: dispW, height: dispH,
                left: (box.w - dispW) / 2 + pos.x,
                top: (box.h - dispH) / 2 + pos.y,
                /* **戻るときだけ動かすこと。** */
                transition: start.current ? "none" : `left .22s ${EASE}, top .22s ${EASE}, width .22s ${EASE}, height .22s ${EASE}`,
                maxWidth: "none", userSelect: "none", WebkitUserSelect: "none", pointerEvents: "none",
              }} />
            )}
          </div>
        </div>
        <div className="pb-3" aria-hidden="true" />
        <div className="shrink-0 flex gap-2.5 px-4 py-3 border-t border-neutral-200"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
          <button type="button" onClick={onCancel} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</button>
          <button type="button" onClick={done} disabled={busy || !url}
            className={BTN_PRIMARY + " flex-[1.6] " + BTN_H + " text-[14.5px]"}>
            <Check size={17} /> {busy ? "作っています" : "決定"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ArtworkScreen({ artworks, onChange, captions, onSaveCaptions, prefs, onSavePrefs, onClose, typeDesc, onSaveTypeDesc, headerBg, onSaveHeaderBg , zIndex}) {
  const [closing, close] = useClosing(onClose, FT_EXIT_RIGHT_MS);
  /* 左端から払って戻るときは待たない（指について動く分で、もう退場している） */
  /* 記録の種類の名前・説明は、この画面では変えられなくした（依頼による）。
     ただし保存されている値はそのまま持ち回り、保存のときも書き戻す。
     捨ててしまうと、以前に名前を変えていた人の設定が消えてしまうため。
     イラストの見出し（mascotGroupLabel）も、この名前から組み立てている */
  const descDraft = (typeDesc && typeDesc.desc) || DEFAULT_TYPE_DESC;
  const nameDraft = (typeDesc && typeDesc.name) || DEFAULT_TYPE_NAME;
  const [draft, setDraft] = useState(artworks);
  const [capDraft, setCapDraft] = useState(captions);
  const [prefDraft, setPrefDraft] = useState(prefs);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingId, setPendingId] = useState(null);
  const [openGroup, setOpenGroup] = useState(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [targetGroup, setTargetGroup] = useState(MASCOT_GROUPS[0].key);
  /* いま選ぼうとしているまとまりに、あと何枚入るか */
  const [pickRoom, setPickRoom] = useState(1);
  const inputRef = useRef(null);
  /* ヘッダの背景に敷く絵。イラストとは別枠なので、入れ物も別にしてある */
  const [hdrDraft, setHdrDraft] = useState(headerBg || null);
  const hdrInputRef = useRef(null);
  const [hdrFile, setHdrFile] = useState(null); // 切り抜きを待っている写真
  const headAspect = useHeaderAspect(); // 見出しの帯と同じ形で切り抜く（見本も同じ形にする）

  const dirty =
    JSON.stringify(draft.map((a) => [a.id, a.group])) !== JSON.stringify(artworks.map((a) => [a.id, a.group])) ||
    JSON.stringify(capDraft) !== JSON.stringify(captions) ||
    JSON.stringify(prefDraft) !== JSON.stringify(prefs) ||
    (hdrDraft || "") !== (headerBg || "");
  const guardCloseRef = useRef(() => true);
  const { stripRef, screenRef } = useEdgeSwipeBack(onClose, () => guardCloseRef.current());

  /* このまとまりに、あと何枚入れられるか。
     場所の数を超えて登録しても、あまった絵は出番がないので受け取らない。
     全体の上限（ART_MAX）とのうち、少ないほうに合わせる */
  const roomFor = (groupKey) => {
    const spots = MASCOT_SPOTS.filter((sp) => sp.group === groupKey).length;
    const mine = draft.filter((a) => a.group === groupKey).length;
    return Math.max(0, Math.min(spots - mine, ART_MAX - draft.length));
  };

  const addFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    const room = roomFor(targetGroup);
    if (room <= 0) { setMsg({ kind: "warn", text: "この場所ぶんはもうそろっています。" }); return; }
    /* 多く選ばれたときは、入るぶんだけ受け取って、そのことを伝える */
    const over = files.length - room;
    setBusy(true);
    const added = [];
    for (const f of files.slice(0, room)) {
      try { added.push({ id: uid(), src: await shrinkImage(f), group: targetGroup }); }
      catch (err) { /* 読み込めない画像は飛ばす */ }
    }
    setBusy(false);
    if (!added.length) { setMsg({ kind: "err", text: "画像を読み込めませんでした。" }); return; }
    setDraft([...draft, ...added]);
    setOpenGroup(targetGroup);
    const gl = mascotGroupLabel(targetGroup, nameDraft);
    setMsg({ kind: "warn", text: `「${gl}」に${added.length}枚を追加しました。`
      + (over > 0 ? `（${over}枚は場所が足りず入りませんでした）` : "")
      + "下の「保存」で反映されます。" });
  };

  /* then ＝ 保存できたあとにやること。ふだんは閉じる（右へ滑って戻る）。
     三本線から「保存してメニューを開く」ときは、閉じずにメニューを開く */
  const save = async (then) => {
    setSaving(true);
    const a = await onChange(draft);
    const c = await onSaveCaptions(capDraft);
    if (onSaveTypeDesc) await onSaveTypeDesc({ desc: descDraft, name: nameDraft });
    const h = onSaveHeaderBg ? await onSaveHeaderBg(hdrDraft) : null;
    const pr = await onSavePrefs(prefDraft);
    setSaving(false);
    const ok = (!a || a.ok) && (!c || c.ok) && (!pr || pr.ok) && (!h || h.ok);
    if (ok) { if (typeof then === "function") then(); else close(); return; }
    setMsg({ kind: "err", text: "保存できませんでした：" + (((a && a.message) || (c && c.message) || (h && h.message) || (pr && pr.message)) || "原因不明") });
  };

  /* ヘッダの背景を選ぶ。**そのまま入れないこと。** 帯と同じ形の窓（CropSheet）で、
     どこを写すかを自分で決めてもらう（My手帳 と同じ流れ）。
     files は先に取り出してから value を空にすること（先に空にすると受け取れない） */
  const pickHeader = (e) => {
    const f = (e.target.files || [])[0];
    e.target.value = "";
    if (!f) return;
    setHdrFile(f);
  };
  /* 切り抜きが決まったら、見本にだけ入れる。置き場へ移すのは「保存」のとき（persistHeaderBg） */
  const doneHeaderCrop = (src) => {
    setHdrFile(null);
    if (!src) { setMsg({ kind: "err", text: "画像を読み込めませんでした。" }); return; }
    setHdrDraft(src);
    setMsg({ kind: "warn", text: "ヘッダーの背景を選びました。下の「保存」で反映されます。" });
  };

  /* 未保存のまま閉じようとしたら確認する（記録画面と同じ動き） */
  const guardClose = () => {
    if (dirty) { setShowExitConfirm(true); return false; }
    return true;
  };
  const handleCloseAttempt = () => { if (guardClose()) close(); };
  /* 三本線（2.10.0〜）。**保存していない変更があるまま、メニューを開かせないこと。**
     メニューから別の画面へ移ると、この画面は閉じられて、変えた内容が黙って消える。
     「戻る」と同じく確かめてから開く。「保存しない」を選んだら、変えた内容は元に戻してから開く */
  const [askMenu, setAskMenu] = useState(null); // 開くときに呼ぶもの
  const menuGuard = (open) => { if (dirty) setAskMenu(() => open); else open(); };
  const revertDrafts = () => {
    setDraft(artworks); setCapDraft(captions); setPrefDraft(prefs); setHdrDraft(headerBg || null);
  };
  guardCloseRef.current = guardClose;

  const msgStyle = msg
    ? msg.kind === "ok" ? "bg-th-50 border-th-200 text-th-900"
      : msg.kind === "warn" ? "bg-amber-50 border-amber-200 text-amber-900"
        : "bg-rose-50 border-rose-200 text-rose-900"
    : "";


  return (
    <OverlayScreen from="right" closing={closing} zIndex={zIndex}>
      <div ref={stripRef} data-ft-edge="" className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div ref={screenRef} className="absolute inset-0 ft-page flex flex-col">
        <div className="ft-hdr flex items-center gap-2 px-4 pb-4 border-b border-neutral-200 shrink-0 bg-white" style={SAFE_TOP(16)}>
          <button onClick={handleCloseAttempt} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-th-800 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</button>
          <h2 className="font-display text-[20px] text-neutral-900 truncate flex-1 tracking-wide">画面のカスタマイズ</h2>
          <MenuButton guard={menuGuard} />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {msg && <div className={"rounded-xl border-2 px-3.5 py-3 mb-4 text-[13.5px] font-bold " + msgStyle}>{msg.text}</div>}

          <h3 className="text-[12.5px] font-bold tracking-wider text-th-800/70 uppercase mb-2">テーマカラー</h3>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {THEMES.map((t) => {
              const on = prefDraft.theme === t.key;
              return (
                <button key={t.key} onClick={() => setPrefDraft({ ...prefDraft, theme: t.key })}
                  className={"rounded-xl border-2 p-2.5 flex flex-col items-center gap-1.5 ft-tap " + (on ? "border-neutral-800 bg-white" : "border-neutral-200 bg-white")}>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: t.swatch }}>
                    {on && <Check size={16} className="text-white ft-check-in" strokeWidth={3} />}
                  </span>
                  <span className={"text-[12.5px] " + (on ? "font-bold text-neutral-900" : "text-neutral-600")}>{t.label}</span>
                </button>
              );
            })}
          </div>

          <h3 className="flex items-center gap-1 text-[12.5px] font-bold tracking-wider text-th-800/70 uppercase mb-2">
            ヘッダーの背景
            <HelpTip label="ヘッダーの背景" text="画面のいちばん上の帯に、好きな写真を敷けます。" />
          </h3>
          <div className="rounded-2xl border border-neutral-200 bg-white p-3 mb-6">
            {/* 実際の見えかたに近づけて、黒い膜をかけた状態で見せる */}
            {/* **高さを決め打ちしないこと。** 帯と同じ形（headAspect）にしておくと、切り抜いた範囲がそのまま見える */}
            <div className="relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 flex items-center justify-center mb-2.5"
              style={{ aspectRatio: `${headAspect}` }}>
              {hdrDraft ? (
                <>
                  {/* **<img src> に photo:番号 をそのまま渡さないこと**（出ない）。Photo を通す */}
                  <Photo src={hdrDraft} className="absolute inset-0 w-full h-full" style={{ objectFit: "cover" }} />
                  <span className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,.34), rgba(0,0,0,.56))" }} />
                  <span className="relative font-display text-[20px] text-white tracking-wide"
                    style={{ textShadow: "0 1px 3px rgba(0,0,0,.45)" }}>ホーム</span>
                </>
              ) : (
                <span className="text-[12.5px] text-neutral-400">背景なし（無地）</span>
              )}
            </div>
            <input ref={hdrInputRef} type="file" accept="image/*" onChange={pickHeader} className="hidden" />
            {hdrFile && (
              <CropSheet file={hdrFile} aspect={headAspect} title="帯にする場所を決める"
                onCancel={() => setHdrFile(null)} onDone={doneHeaderCrop} />
            )}
            <div className="flex gap-2">
              <button type="button" disabled={busy}
                onClick={() => hdrInputRef.current && hdrInputRef.current.click()}
                className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>
                <ImagePlus size={16} /> {hdrDraft ? "画像を選び直す" : "画像を選ぶ"}
              </button>
              {hdrDraft && (
                <button type="button" onClick={() => { setHdrDraft(null); setMsg({ kind: "warn", text: "下の「保存」で反映されます。" }); }}
                  className={BTN_DANGER_SOFT + " " + BTN_H + " px-3.5 text-[14.5px]"}>
                  <X size={15} /> 外す
                </button>
              )}
            </div>
          </div>

          <h3 className="flex items-center gap-1 text-[12.5px] font-bold tracking-wider text-th-800/70 uppercase mb-2">
            並び順のはじめの選び方
            <HelpTip label="並び順" text="「探す」やブックマークを開いたときの並び順です。" />
          </h3>
          <div className="flex gap-1.5 mb-6">
            {SORT_MODES.map((m) => {
              const on = (prefDraft.sortMode || "book") === m.key;
              return (
                <button key={m.key} type="button" onClick={() => setPrefDraft({ ...prefDraft, sortMode: m.key })}
                  aria-pressed={on}
                  className={"flex-1 " + BTN_H + " rounded-xl border-2 text-[13.5px] font-bold ft-tap "
                    + (on ? "border-th-800 bg-th-800 text-white" : "border-neutral-200 bg-white text-neutral-600")}>
                  {m.label}
                </button>
              );
            })}
          </div>

          <h3 className="flex items-center gap-1 text-[12.5px] font-bold tracking-wider text-th-800/70 uppercase mb-2">
            文字の大きさ
            <HelpTip label="文字の大きさ" text="画面の文字をまとめて大きくできます。" />
          </h3>
          <div className="flex gap-1.5 mb-6">
            {FONT_SIZES.map((f) => {
              const on = (prefDraft.fontSize || "s") === f.key;
              return (
                <button key={f.key} type="button" onClick={() => setPrefDraft({ ...prefDraft, fontSize: f.key })}
                  aria-pressed={on}
                  className={"flex-1 " + BTN_H + " rounded-xl border-2 font-bold ft-tap "
                    + (on ? "border-th-800 bg-th-800 text-white" : "border-neutral-200 bg-white text-neutral-600")}>
                  {/* 見本になるよう、それぞれの大きさで書いてある */}
                  <span style={{ fontSize: f.key === "s" ? 14.5 : f.key === "m" ? 16.5 : 19 }}>{f.label}</span>
                </button>
              );
            })}
          </div>

          <h3 className="flex items-center gap-1 text-[12.5px] font-bold tracking-wider text-th-800/70 uppercase mb-2">
            動きの演出
            <HelpTip label="動きの演出" text="切ると、画面が切り替わるときの動きが止まります。" />
          </h3>
          <label className="flex items-center gap-2.5 rounded-2xl border border-neutral-200 bg-white px-3.5 py-3 mb-1.5 cursor-pointer select-none">
            <input type="checkbox" checked={prefDraft.motion !== false}
              onChange={(e) => setPrefDraft({ ...prefDraft, motion: e.target.checked })}
              className="w-5 h-5 accent-th-800" />
            <span className="text-[14.5px] font-bold text-neutral-800 flex-1">押したときの動きをつける</span>
          </label>
          <div className="mb-6" />

          {/* 「記録の種類」の名前と説明を変える欄は、依頼により取り除いた。
              いま保存されている名前（typeDesc）はそのまま持ち続け、
              バックアップにも入れ続ける。消してしまうと、
              以前に名前を変えていた人の設定が黙って初期値に戻るため */}

          <h3 className="flex items-center gap-1 text-[12.5px] font-bold tracking-wider text-th-800/70 uppercase mb-2">
            イラスト
            <HelpTip label="イラスト" text={`画面ごとに絵と「ひとこと」を変えられます（${ART_MAX}枚まで）。`} />
          </h3>
          <label className="flex items-center gap-2.5 rounded-2xl border border-neutral-200 bg-white px-3.5 py-3 mb-3 cursor-pointer select-none">
            <input type="checkbox" checked={prefDraft.showMascots !== false}
              onChange={(e) => setPrefDraft({ ...prefDraft, showMascots: e.target.checked })}
              className="w-5 h-5 accent-th-800" />
            <span className="text-[14.5px] font-bold text-neutral-800 flex-1">イラストを表示する</span>
          </label>


          <div className={"space-y-2.5 mb-6 " + (prefDraft.showMascots === false ? "hidden" : "")}>
            {MASCOT_GROUPS.map((g) => {
              const mine = draft.filter((a) => a.group === g.key);
              const spots = MASCOT_SPOTS.filter((sp) => sp.group === g.key);
              const open = openGroup === g.key;
              return (
                <div key={g.key} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                  <button
                    onClick={() => setOpenGroup(open ? null : g.key)}
                    aria-expanded={open}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-neutral-50 ft-tap ft-tap-card">
                    <div className="w-14 h-14 shrink-0 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-center overflow-hidden">
                      {mine.length > 0
                        ? <img src={mine[0].src} alt="" className="max-w-full max-h-full object-contain" />
                        : <DefaultMascot variant={MASCOT_GROUPS.findIndex((x) => x.key === g.key)} size={52} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14.5px] font-bold text-neutral-900">{mascotGroupLabel(g.key, nameDraft)}</p>
                      <p className="text-[12.5px] text-neutral-500 truncate">
                        {mine.length > 0 ? `自分の絵 ${mine.length}枚` : "はじめからの絵"}
                        <span className="text-neutral-500">・{spots.length}か所</span>
                      </p>
                      {g.key !== "empty" && (capDraft[g.key] || "").trim() && (
                        <p className="text-[12.5px] text-neutral-500 truncate">“{capDraft[g.key]}”</p>
                      )}
                    </div>
                    <span className="w-12 h-12 shrink-0 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600">
                      <ChevronDown size={26} className={"ft-chev " + (open ? "ft-chev-on" : "")} />
                    </span>
                  </button>

                  {open && (
                    <div className="border-t-2 border-neutral-100 px-3 py-3 space-y-3 ft-open-y">
                      {/* 場所の数より多く登録しても、あまった絵は出番がない。
                          それなら初めから足せないようにしておくほうが分かりやすい */}
                      {(() => {
                        const full = mine.length >= spots.length;
                        const over = draft.length >= ART_MAX;
                        return (
                          <>
                            <button
                              onClick={() => {
                                setTargetGroup(g.key);
                                setPickRoom(spots.length - mine.length);
                                /* 複数選べるかどうかを描き直してから開く */
                                setTimeout(() => inputRef.current && inputRef.current.click(), 0);
                              }}
                              disabled={busy || full || over}
                              className={((full || over) ? BTN_BASE + " bg-neutral-100 border border-neutral-200 text-neutral-400" : BTN_SECONDARY)
                                + " w-full " + BTN_H + " text-[14.5px]"}>
                              <Plus size={16} /> ここに絵を追加
                            </button>
                            {(full || over) && (
                              <p className="text-[11.5px] text-neutral-500 -mt-1">
                                {full
                                  ? `この${spots.length}か所ぶんはそろいました。差し替えるときは、いらない絵を消してから足してください。`
                                  : `登録できるのは全部で${ART_MAX}枚までです。`}
                              </p>
                            )}
                          </>
                        );
                      })()}
                      <div>
                        <p className="text-[11.5px] text-neutral-400 mb-1">出てくる場所</p>
                        <div className="flex flex-wrap gap-1">
                          {spots.map((sp, i) => {
                            /* その場所に実際に出る絵に合わせて色を付ける。
                               絵が1枚しかないときは、どの場所にも同じ絵が出るので同じ色になる。
                               **pairColor(i) にしないこと。** 場所の順番で色を決めると、
                               1枚しか無いのに2つ目だけ違う色になり、対応が読み取れない */
                            const c = mine.length ? pairColor(i % mine.length) : null;
                            return (
                              <span key={sp.seed} className="text-[11.5px] px-2 py-0.5 rounded-full border"
                                style={c
                                  ? { borderColor: c.ring, background: c.bg, color: "#525252" }
                                  : { borderColor: "#E5E5E5", background: "#FAFAFA", color: "#A3A3A3" }}>
                                {mascotSpotLabel(sp, nameDraft)}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      {mine.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {mine.map((a, i) => (
                            <div key={a.id} className="relative w-20 h-20 rounded-lg border-2 flex items-center justify-center"
                              style={{ borderColor: pairColor(i).ring, background: pairColor(i).bg }}>
                              <img src={a.src} alt="" className="max-w-full max-h-full object-contain p-1" />
                              <button onClick={() => setPendingId(a.id)} aria-label="削除"
                                className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 hover:text-rose-700 hover:bg-rose-50">
                                <X size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {g.key !== "empty" && (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-[11.5px] font-bold text-neutral-500 flex items-center gap-2">ひとこと
                              <button type="button" onClick={() => setCapDraft({ ...capDraft, [g.key]: DEFAULT_CAPTIONS[g.key] || "" })}
                                className="text-[11.5px] font-bold text-th-800 underline">初期表示に戻す</button>
                            </p>
                          </div>
                          <TextArea value={capDraft[g.key] || ""} onChange={(e) => setCapDraft({ ...capDraft, [g.key]: e.target.value })} className="ft-h-field" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* あと1枚しか入らないときは複数選べないようにする。
              端末の写真選択では枚数の上限を細かく指定できないため、
              せめて「1枚だけ」と「何枚でも」は選び分けておく。
              多く選ばれたぶんは addFiles 側で受け取らずに知らせる */}
          <input ref={inputRef} type="file" accept="image/*" {...(pickRoom > 1 ? { multiple: true } : {})}
            onChange={addFiles} className="hidden" />

        </div>

        <div className="shrink-0 flex gap-2.5 border-t border-neutral-200 bg-white px-5 py-4" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}>
          <TapButton onClick={handleCloseAttempt} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</TapButton>
          <button onClick={() => save()} disabled={saving} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>
            {saving ? "保存中…" : "保存"}
          </button>
        </div>
      </div>
      {showExitConfirm && (
        <ExitConfirmDialog
          onSave={() => { setShowExitConfirm(false); save(); }}
          onDiscard={() => { setShowExitConfirm(false); close(); }}
          onStay={() => setShowExitConfirm(false)}
        />
      )}
      {askMenu && (
        <ExitConfirmDialog
          onSave={() => { const open = askMenu; setAskMenu(null); save(open); }}
          onDiscard={() => { const open = askMenu; setAskMenu(null); revertDrafts(); setMsg(null); open(); }}
          onStay={() => setAskMenu(null)}
        />
      )}
      {pendingId && (
        <ConfirmItemDeleteDialog label="イラスト"
          onConfirm={() => { setDraft(draft.filter((a) => a.id !== pendingId)); setPendingId(null); setMsg({ kind: "warn", text: "下の「保存」で反映されます。" }); }}
          onCancel={() => setPendingId(null)} />
      )}
    </OverlayScreen>
  );
}

/* ============================================================
   バックアップ画面
   ============================================================ */
/* ブックマークした記録の一覧。三本線メニューから開く */
function BookmarkScreen({ records, onClose, onOpenDetail, defaultSort , zIndex}) {
  const [closing, close] = useClosing(onClose, FT_EXIT_RIGHT_MS);
  /* 左端から払って戻るときは待たない（指について動く分で、もう退場している） */
  const [, closeInstant] = useClosing(onClose);
  const { stripRef, screenRef } = useEdgeSwipeBack(closeInstant);
  /* はじめの並び順は、カスタマイズで決めたもの。指定が無ければ目次順 */
  const [sortMode, setSortMode] = useState(() => defaultSort || "book");
  const list = useMemo(() => {
    const marked = (records || []).filter((r) => r.bookmarked);
    return marked.sort((a, b) => {
      if (sortMode === "dateDesc") return (b.date || b.createdAt || "").localeCompare(a.date || a.createdAt || "");
      if (sortMode === "dateAsc") return (a.date || a.createdAt || "").localeCompare(b.date || b.createdAt || "");
      return compareForSearch(a, b);
    });
  }, [records, sortMode]);

  return (
    <OverlayScreen from="right" closing={closing} zIndex={zIndex}>
    <div ref={screenRef} className="absolute inset-0 ft-page flex flex-col">
      <div ref={stripRef} data-ft-edge="" className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div className="ft-hdr bg-white border-b border-neutral-200 px-4 pb-3 flex items-center gap-2 shrink-0" style={SAFE_TOP(12)}>
        <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-th-800 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
        <h2 className="font-display text-[20px] text-neutral-900 truncate flex-1 tracking-wide">ブックマーク</h2>
        <MenuButton />
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-[12.5px] font-bold tracking-wider text-th-800/70 uppercase">{list.length}件</p>
          <SortToggle value={sortMode} onChange={setSortMode} />
        </div>
        {list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-6 flex flex-col items-center">
            <Mascot seed="records-empty" size={142} />
            <p className="text-[13.5px] text-neutral-500 mt-2 text-center">ブックマークした記録はありません</p>
          </div>
        ) : (
          <div className="space-y-2.5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-2.5">
            {list.map((r) => <RecordCard key={r.id} r={r} onClick={() => onOpenDetail(r)} />)}
          </div>
        )}
      </div>
    </div>
    </OverlayScreen>
  );
}

/* 収穫した実の記録。三本線メニューから開く */
/* ============================================================
   タグの整理
   増えすぎたタグや、書き間違えたタグを直す場所。
   名前を変えたり消したりすると、記録に付いているタグにも同じことをする。
   一覧だけ直して記録を放っておくと、名前が食い違ってしまうため
   ============================================================ */
/* つまんで並べ替える。
   **指の位置は、いま並んでいる札の実際の位置とくらべること。**
   「1枚ぶんの高さ」を見積もって割り算する作りだと、札の高さがそろっていないときや
   画面を送ったときに1つずれる。
   動かしている最中にその場で入れ替えるので、どこへ入るのかが目で分かる。
   よけるためのずれ（translateY）も要らなくなり、指を離したときに跳ねない */
function useReorder(ids, onChange) {
  const [dragId, setDragId] = useState(null);
  const rowsRef = useRef({});
  const setRow = (id) => (el) => { rowsRef.current[id] = el; };
  const moveTo = (id, clientY) => {
    const from = ids.indexOf(id);
    if (from < 0) return;
    let to = from;
    ids.forEach((x, k) => {
      const el = rowsRef.current[x];
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (clientY > r.top && clientY < r.bottom) to = k;
    });
    if (to === from) return;
    const next = ids.slice();
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };
  /* **取っ手にだけ付けること。** 札ぜんたいに付けると、指で画面を送れなくなる */
  const handleProps = (id) => ({
    onPointerDown: (e) => {
      e.preventDefault();
      setDragId(id);
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* 使えない端末は無視 */ }
    },
    onPointerMove: (e) => { if (dragId) moveTo(dragId, e.clientY); },
    onPointerUp: () => setDragId(null),
    onPointerCancel: () => setDragId(null),
    style: { touchAction: "none", cursor: "grab" },
  });
  return { dragId, setRow, handleProps };
}

function TagManageScreen({ tags, records, onAdd, onRename, onDelete, onReorder, onClose , zIndex}) {
  const [closing, close] = useClosing(onClose, FT_EXIT_RIGHT_MS);
  /* 左端から払って戻るときは待たない（指について動く分で、もう退場している） */
  const [, closeInstant] = useClosing(onClose);
  const { stripRef, screenRef } = useEdgeSwipeBack(closeInstant);
  const [draft, setDraft] = useState("");
  const [renaming, setRenaming] = useState(null);   // { from, to }
  const [deleting, setDeleting] = useState(null);

  const list = normalizeTags(tags);

  const { dragId, setRow, handleProps } = useReorder(list, onReorder || (() => {}));

  /* 一覧が「順に現れる」動きは、画面を開いたときの一度だけにする。
     並び替えのあとも掛かるままにすると、札が一斉に出直して点滅して見える */
  const [seq, setSeq] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setSeq(false), 800);
    return () => clearTimeout(t);
  }, []);

  const countOf = (t) => (records || []).filter((r) => (r.tags || []).some((x) => x === t)).length;
  const canAdd = !!draft.trim() && !list.some((t) => t.toLowerCase() === draft.trim().toLowerCase());
  const renameOk = renaming && !!renaming.to.trim() && renaming.to.trim() !== renaming.from
    && !list.some((t) => t.toLowerCase() === renaming.to.trim().toLowerCase());

  return (
    <OverlayScreen from="right" closing={closing} zIndex={zIndex}>
    <div ref={screenRef} className="absolute inset-0 ft-page flex flex-col">
      <div ref={stripRef} data-ft-edge="" className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div className="ft-hdr bg-white border-b border-neutral-200 px-4 pb-3 flex items-center gap-2 shrink-0" style={SAFE_TOP(12)}>
        <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-th-800 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
        <h2 className="font-display text-[20px] text-neutral-900 truncate flex-1 tracking-wide">タグの整理</h2>
        <MenuButton />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full">
        <div className="flex gap-2 mb-5">
          <div className="flex-1 min-w-0">
            <TextInput value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="新しいタグ"
              onKeyDown={(e) => { if (e.key === "Enter" && canAdd) { e.preventDefault(); onAdd(draft.trim()); setDraft(""); } }} />
          </div>
          <button type="button" disabled={!canAdd}
            onClick={() => { onAdd(draft.trim()); setDraft(""); }}
            className={(canAdd ? BTN_PRIMARY : BTN_BASE + " bg-neutral-100 border border-neutral-200 text-neutral-400")
              + " " + BTN_H + " px-3.5 text-[14.5px] shrink-0"}><Plus size={15} /> 追加</button>
        </div>

        {list.length === 0 ? (
          <div className="flex flex-col items-center py-8">
            <Mascot seed="tags-empty" size={142} />
            <p className="text-[14.5px] text-neutral-500 mt-1">まだタグがありません</p>
          </div>
        ) : (
          <div className={"space-y-2 " + (seq && !dragId ? "ft-seq" : "")}>
            {list.map((t) => {
              const n = countOf(t);
              const held = dragId === t;
              return (
                <div key={t} ref={setRow(t)}
                  className={"flex items-center gap-2 rounded-xl border px-3.5 py-2.5 "
                    + (held ? "border-th-700 bg-th-50" : "border-neutral-200 bg-white")}>
                  <span className="flex-1 min-w-0">
                    <span className="block text-[15.5px] font-bold text-neutral-900 truncate">{t}</span>
                    <span className="block text-[12.5px] text-neutral-500">{n > 0 ? `${n}件の記録で使用中` : "まだ使われていません"}</span>
                  </span>
                  <button type="button" onClick={() => setRenaming({ from: t, to: t })} aria-label={`${t} の名前を変える`}
                    className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border border-neutral-200 text-neutral-600 hover:bg-neutral-50 ft-tap ft-tap-icon"><Pencil size={16} /></button>
                  <button type="button" onClick={() => setDeleting({ tag: t, n })} aria-label={`${t} を削除`}
                    className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 ft-tap ft-tap-icon"><Trash2 size={16} /></button>
                  {list.length > 1 && (
                    <span role="button" tabIndex={0} aria-label={`${t} の並びを変える`} {...handleProps(t)}
                      className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl text-neutral-300 hover:text-neutral-500">
                      <GripVertical size={18} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {renaming && (
        <div data-ft-overlay="" className="ft-sheet-wrap bg-black/50 flex items-center justify-center px-6" style={{ zIndex: 2147483400 }}>
      <BackgroundLock />
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-neutral-200 shadow-xl anim-pop">
            <h3 className="font-display text-[17px] text-neutral-900 mb-3">タグの名前を変える</h3>
            <TextInput value={renaming.to} onChange={(e) => setRenaming({ ...renaming, to: e.target.value })} />
            <p className="text-[12.5px] text-neutral-500 mt-2 mb-5 leading-relaxed">
              このタグが付いている記録も、まとめて新しい名前に変わります。
            </p>
            <div className="flex gap-2.5">
              <button onClick={() => setRenaming(null)} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>やめる</button>
              <button disabled={!renameOk} onClick={() => { onRename(renaming.from, renaming.to.trim()); setRenaming(null); }}
                className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>変える</button>
            </div>
          </div>
        </div>
      )}

      {deleting && (
        <div data-ft-overlay="" className="fixed inset-0 bg-black/50 flex items-center justify-center px-6" style={{ zIndex: 2147483400 }}>
      <BackgroundLock />
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-neutral-200 shadow-xl anim-pop">
            <h3 className="font-display text-[17px] text-neutral-900 mb-2">「{deleting.tag}」を削除しますか</h3>
            <p className="text-[13.5px] text-neutral-600 mb-5 leading-relaxed">
              {deleting.n > 0
                ? `${deleting.n}件の記録から、このタグが外れます。記録そのものは消えません。`
                : "この一覧から消えます。記録には使われていません。"}
            </p>
            <div className="flex gap-2.5">
              <button onClick={() => setDeleting(null)} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>やめる</button>
              <button onClick={() => { onDelete(deleting.tag); setDeleting(null); }}
                className={BTN_DANGER + " flex-1 " + BTN_H + " text-[14.5px]"}>削除する</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </OverlayScreen>
  );
}

/* ============================================================
   ヘルプ画面
   使い方は、ここと「？」の吹き出しの2か所にまとめている。
   画面に説明文を常に出しておくと、慣れた人には邪魔になるため
   ============================================================ */
const HELP_SECTIONS = [
  /* **画面を見れば分かる操作は書かないこと**（「右下の＋から」など）。
     書くのは、見ただけでは分からない決まりと、知っておくと得なことだけ。1項目1〜2文にとどめる（2.8.6〜） */
  {
    title: "記録をつける",
    items: [
      ["種類は4つ", "「通読」「学び」「聖句」「その他」から選んで書き始めます。"],
      ["書きかけでも消えない", "入力の途中でも下書きが自動で残ります。"],
      ["聖書箇所を挿入", "正しい書き方で本文に足せます。章をまたぐ範囲も選べます。"],
    ],
  },
  {
    title: "タグ",
    items: [
      ["自由なラベル", "どの記録にも何個でも付けられます。「祈り」「家族」など、自由に作れます。"],
      ["整理する", "メニューの「タグの整理」で、名前の変更・並べ替え・削除ができます。"],
    ],
  },
  {
    title: "探す",
    items: [
      ["言葉で探す", "本文・タグ・聖書箇所から探します。空白で区切ると、すべての言葉を含む記録が出ます。"],
      ["絞り込み", "種類は「どれか」、タグは「すべて」に当てはまる記録が残ります。"],
    ],
  },
  {
    title: "フォルダ",
    items: [
      ["自動で集める", "種類・タグ・書・期間を決めると、当てはまる記録がひとりでに集まります。あとから書いた記録も入ります。"],
      ["手動で入れる", "探して選んだ記録を入れます。フォルダの中で長押しすると外せます。"],
      ["記録は消えない", "フォルダを消しても、中の記録はそのまま残ります。"],
    ],
  },
  {
    title: "実績と実り",
    items: [
      ["読んだところが色づく", "通読の記録から、66巻それぞれの読んだ回数が色で分かります。"],
      ["続けるほど実る", "ホームの木は、記録を重ねるほど育ちます。"],
    ],
  },
  {
    title: "バックアップ",
    items: [
      ["保存しておく理由", "記録はこの端末の中だけにあります。機種変更やアプリを消したときは、保存したデータから戻せます。"],
      ["ファイルか文字で", "「データを保存」でファイルに、「文字でコピー」でメモアプリなどに残せます。記録・設定・タグ・写真がまとめて入ります。"],
      ["1件だけ渡す", "記録を見る画面の右上から、その1件をファイルか文字で渡せます。受け取った側の記録は消えません。"],
    ],
  },
  {
    title: "見た目を変える",
    items: [
      ["カスタマイズ", "メニューの「画面のカスタマイズ」で、色・文字の大きさ・ヘッダーの写真・イラスト・ひとことを変えられます。"],
    ],
  },
];

function HelpScreen({ onClose , zIndex}) {
  const [closing, close] = useClosing(onClose, FT_EXIT_RIGHT_MS);
  /* 左端から払って戻るときは待たない（指について動く分で、もう退場している） */
  const [, closeInstant] = useClosing(onClose);
  const { stripRef, screenRef } = useEdgeSwipeBack(closeInstant);
  const [open, setOpen] = useState(HELP_SECTIONS[0].title);

  return (
    <OverlayScreen from="right" closing={closing} zIndex={zIndex}>
    <div ref={screenRef} className="absolute inset-0 ft-page flex flex-col">
      <div ref={stripRef} data-ft-edge="" className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div className="ft-hdr bg-white border-b border-neutral-200 px-4 pb-3 flex items-center gap-2 shrink-0" style={SAFE_TOP(12)}>
        <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-th-800 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
        <h2 className="font-display text-[20px] text-neutral-900 truncate flex-1 tracking-wide">ヘルプ</h2>
        <MenuButton />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full">
        <div className="space-y-2.5 ft-seq">
          {HELP_SECTIONS.map((sec) => {
            const on = open === sec.title;
            return (
              <div key={sec.title} className="rounded-2xl border border-neutral-200 bg-white overflow-hidden">
                <button onClick={() => setOpen(on ? null : sec.title)}
                  className="w-full flex items-center gap-2 px-4 py-3 min-h-[56px] text-left ft-tap ft-tap-card">
                  <span className="flex-1 font-display text-[15.5px] text-neutral-900">{sec.title}</span>
                  <ChevronDown size={18} className={"text-neutral-400 shrink-0 ft-chev " + (on ? "ft-chev-on" : "")} />
                </button>
                {on && (
                  <div className="border-t-2 border-neutral-100 px-4 py-3 space-y-3.5 ft-open-y">
                    {sec.items.map(([h, body]) => (
                      <div key={h}>
                        <p className="text-[14.5px] font-bold text-th-900 mb-0.5">{h}</p>
                        <p className="text-[13.5px] text-neutral-600 leading-relaxed">{body}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col items-center pt-6 pb-2">
          <div className="opacity-70"><Mascot seed="help" size={126} /></div>
          <p className="text-[11.5px] text-neutral-400 mt-3">Footprints v{APP_VERSION}</p>
        </div>
      </div>
    </div>
    </OverlayScreen>
  );
}

function GardenScreen({ garden, records, onClose, onChangeFruit , zIndex}) {
  const [closing, close] = useClosing(onClose, FT_EXIT_RIGHT_MS);
  /* 左端から払って戻るときは待たない（指について動く分で、もう退場している） */
  const [, closeInstant] = useClosing(onClose);
  const { stripRef, screenRef } = useEdgeSwipeBack(closeInstant);
  const [pick, setPick] = useState(false);
  const [pending, setPending] = useState(null); // 植え直しの確認待ち
  const harvests = [...(garden.harvests || [])].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const tally = FRUITS.map((f) => ({ f, n: harvests.filter((h) => h.fruit === f.key).length }));
  const cycle = garden.cycle;
  const cc = cycle ? cycleCounts(records, cycle.startedAt) : null;
  const cur = cc ? stageOf(cc.days, cc.count, paceOf(cycle)) : null;

  return (
    <OverlayScreen from="right" closing={closing} zIndex={zIndex}>
    <div ref={screenRef} className="absolute inset-0 ft-page flex flex-col">
      <div ref={stripRef} data-ft-edge="" className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div className="ft-hdr bg-white border-b border-neutral-200 px-4 pb-3 flex items-center gap-2 shrink-0" style={SAFE_TOP(12)}>
        <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-th-800 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
        <h2 className="font-display text-[20px] text-neutral-900 truncate flex-1 tracking-wide">収穫した実</h2>
        <MenuButton />
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full">
        {cycle && (
          <div className="rounded-2xl border border-th-700/25 bg-white p-4 mb-4 flex items-center gap-4">
            <FruitTree stage={cur.n} fruit={cycle.fruit} size={86} />
            <div className="flex-1 min-w-0">
              <p className="text-[11.5px] font-bold tracking-wider text-th-800/70">育てている木</p>
              <p className="text-[14.5px] font-bold text-neutral-900">{fruitByKey(cycle.fruit).label}・{cur.name}</p>
              <button onClick={() => setPick(true)} className={BTN_SECONDARY + " mt-2 " + BTN_H + " px-3 text-[13.5px]"}>育てる実を変える</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-5 gap-2 mb-5">
          {tally.map(({ f, n }) => (
            <div key={f.key} className={"rounded-xl border-2 py-2.5 text-center " + (n > 0 ? "border-th-700/25 bg-white" : "border-neutral-200 bg-neutral-100/60")}>
              <span className="flex justify-center mb-1">
                <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
                  <circle cx="12" cy="14" r="8" fill={n > 0 ? f.ripe : "#D6D3D1"} />
                  <path d="M12 6 L12 3" stroke={n > 0 ? "#8A6B4F" : "#D6D3D1"} strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span className="block text-[11.5px] font-bold text-neutral-700 leading-tight">{f.label}</span>
              <span className={"block text-[12.5px] font-bold " + (n > 0 ? "text-th-900" : "text-neutral-500")}>{n}</span>
            </div>
          ))}
        </div>

        {harvests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-300 p-6 flex flex-col items-center">
            <FruitTree stage={1} fruit="apple" size={120} />
            <p className="text-[12.5px] text-neutral-500 mt-2 text-center">まだ収穫した実はありません</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {harvests.map((h, i) => (
              <div key={h.id || i} className="rounded-2xl border border-neutral-200 bg-white p-3 flex items-center gap-3">
                <FruitTree stage={10} fruit={h.fruit} size={64} />
                <div className="flex-1 min-w-0">
                  <p className="text-[14.5px] font-bold text-neutral-900">{fruitByKey(h.fruit).label}</p>
                  <p className="text-[12.5px] text-neutral-500">{h.date} に収穫</p>
                </div>
                <span className="text-[11.5px] font-bold px-2 py-0.5 rounded-full bg-th-100 text-th-900 shrink-0">{harvests.length - i}個目</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {pick && (
        <FruitPickDialog
          title="育てる実を変える"
          note="選ぶと、育ってきた日数と件数は0から数え直しになります。"
          current={cycle ? cycle.fruit : FRUITS[0].key}
          onPick={(k) => { setPick(false); setPending(k); }}
          onCancel={() => setPick(false)}
        />
      )}

      {pending && (
        <ConfirmReplantDialog
          fruit={pending}
          onConfirm={() => { const k = pending; setPending(null); onChangeFruit(k); }}
          onCancel={() => { setPending(null); setPick(true); }}
        />
      )}
    </div>
    </OverlayScreen>
  );
}

/* ============================================================
   バックアップ画面
   ============================================================ */
function BackupScreen({ records, folders, artworks, garden, tagMaster, prefs, captions, typeDesc, headerBg, onClose, onRestore, onBackedUp, onImportOne , zIndex}) {
  const [closing, close] = useClosing(onClose, FT_EXIT_RIGHT_MS);
  /* 左端から払って戻るときは待たない（指について動く分で、もう退場している） */
  const [, closeInstant] = useClosing(onClose);
  const readableText = useMemo(() => buildBackupText(records), [records]);
  /* 写真の中身は置き場（IndexedDB）にあり、記録には「photo:番号」しか入っていない。
     **書き出すときは、絵の中身も一緒に入れること。** 入れないと、機種を変えたときに写真だけが失われる。
     読み出しは非同期なので、ここで集めて photos に持っておく（集め終わるまでは写真ぬきの内容になる） */
  const [photos, setPhotos] = useState(null);
  const photoIds = useMemo(() => Array.from(collectPhotoRefs({ records, headerBg, folders })), [records, headerBg, folders]);
  useEffect(() => {
    let alive = true;
    if (!photoIds.length) { setPhotos({}); return undefined; }
    setPhotos(null);
    (async () => {
      const map = {};
      for (const id of photoIds) {
        const v = await photoGet(id);
        if (!alive) return;
        if (typeof v === "string" && v) map[id] = v;
      }
      if (alive) setPhotos(map);
    })();
    return () => { alive = false; };
  }, [photoIds]);
  const photosReady = photos !== null;
  const jsonText = useMemo(() => JSON.stringify({
    app: "bible-tracker", version: 8, exportedAt: new Date().toISOString(),
    records, artworks: artworks || [], garden: garden || DEFAULT_GARDEN,
    /* フォルダ（version 8 から）。絵は photos に入る */
    folders: folders || [],
    /* タグの一覧も一緒に書き出す。これが無いと、機種を変えたときに
       まだ使っていないタグが消え、また作り直すことになる */
    tags: tagMaster || [],
    /* 画面の設定も一緒に書き出す（version 5 から）。
       テーマ色・文字の大きさ・ひとこと・ヘッダーの背景など、
       せっかく整えたものが機種を変えるたびに消えてしまわないように。
       最終バックアップ日（lastBackup）は入れない。
       それは「この端末でいつ書き出したか」であって、持ち運ぶものではないため */
    prefs: prefs ? { ...prefs, lastBackup: undefined, folderDeletes: undefined } : undefined,
    captions: captions || undefined,
    typeDesc: typeDesc || undefined,
    /* ヘッダの背景も一緒に書き出す（version 6 から）。
       新しく設定を増やしたら、ここにも足すこと。足し忘れると機種変更で消える */
    headerBg: headerBg || undefined,
    /* 記録に付けた写真と、ヘッダーの絵の中身（version 7 から）。{ 番号: 絵 } の形 */
    photos: photos && Object.keys(photos).length ? photos : undefined,
  }, null, 2), [records, folders, artworks, garden, tagMaster, prefs, captions, typeDesc, headerBg, photos]);
  const [msg, setMsg] = useState(null); // {kind:'ok'|'warn'|'err', text}
  const [fallbackOpen, setFallbackOpen] = useState(false); // 保存に失敗したときのダイアログ
  const fileInputRef = useRef(null);

  const sizeKb = Math.max(1, Math.round(new Blob([jsonText]).size / 1024));
  const embedded = typeof window !== "undefined" && window.self !== window.top;

  const saveData = async () => {
    /* ファイルの名前だけ見て「Footprintsのデータ」と分かるようにする。
       **名前に日付は入れない。** 書き出すたびに同じ名前になるので、
       同じ場所に保存し直すと前のバックアップに上書きされ、何個も増えていかない。
       いつのバックアップかは、中身の「書き出し日時」の1行目で分かる。
       記号は半角のハイフンだけにすること。空白や日本語を混ぜると、
       共有や送信の途中で文字が化けることがある */
    /* 書き出すのは1つだけ。読める文と復元用データを1つにまとめてある。
       末尾は .txt。どの端末でも受け取れて、そのまま読める */
    const filename = "Footprints-backup.txt";
    const fileText = buildBackupFile(readableText, jsonText);
    // 1) 共有シート（iPhoneはここから「ファイルに保存」で任意の場所に保存できる）
    //    ※ await を挟むと iOS が「ユーザー操作による呼び出し」と認識しなくなるため、最初に試す
    try {
      /* **種類は text/plain にすること。**
         application/json は、Androidの共有先の多くが受け取ってくれない。
         名前の末尾（.json）はそのままなので、戻すときは今までどおり読める */
      const file = new File([fileText], filename, { type: "text/plain" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        /* **title を渡さないこと。**
           iPhoneはこれを「共有する文章」と見なし、
           その文字だけを書いた余分なテキストまで作ってしまう */
        await navigator.share({ files: [file] });
        onBackedUp && onBackedUp();
        setMsg(null);
        return;
      }
    } catch (e) {
      if (e && e.name === "AbortError") return; // キャンセルされた場合は何もしない
    }

    // 2) 保存先のフォルダを直接選べる方法（対応環境: 主にPCのChrome/Edgeなど）
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          /* パソコンで保存先を選ぶとき。.txt でも保存できるようにしておく */
          types: [{ description: "Footprints のバックアップ", accept: { "text/plain": [".json", ".txt"] } }],
        });
        const writable = await handle.createWritable();
        await writable.write(fileText);
        await writable.close();
        onBackedUp && onBackedUp();
        setMsg({ kind: "ok", text: "指定した場所に保存しました。" });
        return;
      } catch (e) {
        if (e && e.name === "AbortError") return;
      }
    }

    // 3) ダウンロード
    //    ※ 埋め込み表示ではダウンロード指定が無視され、この画面自体がJSONに移動して
    //      戻れなくなってしまうため、埋め込みのときは行わない
    if (!embedded) {
      try {
        const blob = new Blob([fileText], { type: "text/plain;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 20000);
        onBackedUp && onBackedUp();
        setMsg({ kind: "ok", text: `「${filename}」を保存しました。` });
        return;
      } catch (e) { /* 次の方法へ */ }
    }

    // 4) どの方法でも保存できなかったときは、ダイアログで知らせてコピーを促す
    setMsg(null);
    setFallbackOpen(true);
  };

  /* ダイアログの「コピーする」を押したとき */
  const copyFromFallback = async () => {
    const ok = await copyToClipboard(jsonText);
    setFallbackOpen(false);
    if (ok) {
      onBackedUp && onBackedUp();
      setMsg({ kind: "warn", text: "コピーしました。メモアプリなどに貼りつけて残してください。" });
    } else {
      setMsg({ kind: "err", text: "コピーできませんでした。もう一度お試しください。" });
    }
  };

  /* まるごと文字でコピーする。
     **コピーも「書き出した」として数えること。**
     貼り付け先に残しておけば、そこから戻せるため。
     ただし貼り忘れると失われるので、そのことも伝える */
  const [pasteOpen, setPasteOpen] = useState(false);
  const copyWholeBackup = async () => {
    const ok = await copyToClipboard(buildBackupFile(readableText, jsonText));
    if (ok) {
      onBackedUp && onBackedUp();
      setMsg({ kind: "ok", text: "コピーしました。メモアプリなどに貼りつけて残してください。" });
    } else {
      setMsg({ kind: "err", text: "コピーできませんでした。もう一度お試しください。" });
    }
  };
  /* 貼りつけた文字から戻す。ファイルを選んだときと同じ道すじを通す */
  const restoreFromText = async (text) => {
    setPasteOpen(false);
    await readBackupText(text);
  };

  /* 画面の左端から払って戻る仕組み。切り出しの折に落とさないこと */
  const { stripRef, screenRef } = useEdgeSwipeBack(closeInstant);

  /* 読み込みの中身。ファイルからでも、貼りつけた文字からでも同じ道すじを通す。
     **2つに分けて書かないこと。** 片方だけ直すと食い違う */
  const readBackupText = async (text) => {
      try {
        /* 読める文が前に付いていても、そこは飛ばして復元用データだけを読む */
        const data = JSON.parse(extractBackupJson(text));
        let recs, arts = null, gard = null, tgs = null, setting = null;
        if (Array.isArray(data)) recs = data;                       // 旧形式（記録のみ）
        else if (data && Array.isArray(data.records)) {             // 新形式
          recs = data.records;
          if (Array.isArray(data.artworks)) arts = data.artworks;
          if (data.garden && typeof data.garden === "object") gard = data.garden;
          if (Array.isArray(data.tags)) tgs = data.tags;            // タグの一覧（version 4 から）
          /* 写真の中身（version 7 から）。**記録を戻すより先に置き場へ入れること。**
             あとから入れると、記録を描いたときに絵が見つからず、白いままになる */
          if (data.photos && typeof data.photos === "object") {
            for (const id in data.photos) {
              if (!Object.prototype.hasOwnProperty.call(data.photos, id)) continue;
              const src = data.photos[id];
              if (typeof src === "string" && src) await photoPut(id, src);
            }
          }
          /* 画面の設定（version 5 から）。古いファイルには入っていないので、
             そのときは今の設定をそのまま残す */
          setting = {
            prefs: data.prefs && typeof data.prefs === "object" ? data.prefs : null,
            captions: data.captions && typeof data.captions === "object" ? data.captions : null,
            typeDesc: data.typeDesc && typeof data.typeDesc === "object" ? data.typeDesc : null,
            headerBg: typeof data.headerBg === "string" && data.headerBg ? data.headerBg : null,
            folders: Array.isArray(data.folders) ? data.folders : null,
          };
        } else if (data && data.record && typeof data.record === "object") {
          /* 1件だけの受け渡しファイル。
             ここで受け取らないと「正しいファイルを選んでください」と突き返してしまう。
             送られた側は違いを知らないので、どちらの形でも受け取れるようにしておく。
             **いまの記録は消さず、足すだけにすること** */
          onImportOne && onImportOne(text);
          setMsg(null);
          return;
        } else throw new Error("invalid");
        await onRestore(recs, arts, gard, tgs, setting);
        setMsg({
          kind: "ok",
          text: `${recs.length}件の記録` + (arts && arts.length ? `と${arts.length}枚のイラスト` : "") + "を読み込みました。",
        });
      } catch (err) {
        /* 何が悪かったのかを、選んだファイルの中身から見て伝える。
           「.json を選んで」とは書かない。末尾が .txt のものも正しいため */
        const head = String(text || "").trim().slice(0, 40);
        const looksReadable = /^書き出し日時/.test(head);
        setMsg({ kind: "err", text: looksReadable
          ? "このファイルには復元用のデータが入っていません。古い形のファイルのようです。新しく書き出したファイル（Footprints-backup.txt）を選んでください。"
          : "このファイルからは記録が見つかりませんでした。Footprints で書き出したファイルを選んでください。" });
      }
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { readBackupText(reader.result); };
    reader.onerror = () => setMsg({ kind: "err", text: "ファイルを読めませんでした。" });
    reader.readAsText(file);
    e.target.value = "";
  };

  const msgStyle = msg
    ? msg.kind === "ok" ? "bg-th-50 border-th-200 text-th-900"
      : msg.kind === "warn" ? "bg-amber-50 border-amber-200 text-amber-900"
        : "bg-rose-50 border-rose-200 text-rose-900"
    : "";

  const unsaved = React.useContext(UnsavedContext);

  return (
    <OverlayScreen from="right" closing={closing} zIndex={zIndex}>
      <div ref={stripRef} data-ft-edge="" className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
      <div ref={screenRef} className="absolute inset-0 ft-page flex flex-col">
        <div className="ft-hdr flex items-center gap-2 px-4 pb-4 border-b border-neutral-200 shrink-0 bg-white" style={SAFE_TOP(16)}>
          <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-th-800 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
          <h2 className="font-display text-[20px] text-neutral-900 truncate flex-1 tracking-wide">バックアップ</h2>
          <MenuButton />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 mb-4 shadow-sm">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[26px] text-neutral-900">{records.length}</span>
              <span className="text-[13.5px] font-bold text-neutral-600">件の記録</span>
              {(artworks || []).length > 0 && (
                <span className="text-[13.5px] font-bold text-neutral-500">＋ イラスト{artworks.length}枚</span>
              )}
              {photoIds.length > 0 && (
                <span className="text-[13.5px] font-bold text-neutral-500">＋ 写真{photoIds.length}枚</span>
              )}
              <span className="text-[12.5px] text-neutral-500 ml-auto">{photosReady ? `約${sizeKb}KB` : "写真を読み込み中"}</span>
            </div>
            {prefs && prefs.lastBackup && (
              <div className="mt-2">
                <p className="text-[12.5px] text-neutral-400">前回 {fmtJpDate(prefs.lastBackup)}</p>
              </div>
            )}
          </div>

          {/* **控えを取っていない書きかえがあることは、ここで一度だけ知らせること。**
              あちこちに出すと、ただの飾りになって読み飛ばされる */}
          {unsaved > 0 && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 px-4 py-3 mb-4">
              <p className="text-[13.5px] font-bold text-amber-800">
                {prefs && prefs.lastBackup ? `前回の書き出しのあとに、${unsaved}件の書きかえがあります` : "まだ一度も書き出していません"}
              </p>
            </div>
          )}

          <div className="space-y-2.5 mb-4">
            <div className="flex justify-end">
              <HelpTip label="バックアップ" text="記録と設定をまとめて保存します。「データ復元」で元に戻せます。" />
            </div>
            <button onClick={saveData} className={BTN_PRIMARY + " w-full " + BTN_H + " text-[15.5px]"}>
              <Download size={18} /> データを保存
            </button>
            <button onClick={() => fileInputRef.current && fileInputRef.current.click()} className={BTN_SECONDARY + " w-full " + BTN_H + " text-[15.5px]"}>
              <Upload size={18} /> データ復元
            </button>
            {/* 種類で絞り込まない（Androidで選べなくなるため） */}
            <input ref={fileInputRef} type="file" onChange={handleFile} className="hidden" />

            {/* ファイルの行方が分かりにくい端末のために、文字でのやりとりも用意する。
                メモ帳やチャットに貼っておけば、そこから戻せる */}
            <div className="flex gap-2.5">
              <button onClick={copyWholeBackup} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>
                <Copy size={16} /> 文字でコピー
              </button>
              <button onClick={() => setPasteOpen(true)} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>
                <ClipboardPaste size={16} /> 文字から復元
              </button>
            </div>
          </div>

          {msg && (
            <div className={"rounded-xl border-2 px-3.5 py-3 mb-4 text-[13.5px] font-bold " + msgStyle}>{msg.text}</div>
          )}

          {/* いちばん下の逃げ場。無いと帯や一覧が画面の端すれすれになる */}
          <div className="h-16" />
        </div>
      </div>

      {fallbackOpen && (
        <SaveFallbackDialog onCopy={copyFromFallback} onCancel={() => setFallbackOpen(false)} />
      )}
      {pasteOpen && (
        <PasteDialog title="文字から復元する"
          hint="コピーしておいたバックアップの文字を貼りつけてください。"
          actionLabel="復元する"
          onCancel={() => setPasteOpen(false)} onSubmit={restoreFromText} />
      )}
    </OverlayScreen>
  );
}

/* ============================================================
   ボトムナビゲーション
   ============================================================ */
/* ============================================================
   長押しで選ぶモード（探す・フォルダの中で共通。2.8.5〜）
   **下の帯には「消す（外す）」と「完了」の2つだけを置くこと。** My手帳 と同じく、
   「すべて選ぶ」と選んだ数は、一覧の頭（SelectModeHead）へ移す。
   **「完了」を広く、「削除」は狭く・左に離して置くこと。** 以前は4つが同じくらいの幅で並び、
   削除の赤いボタンがいちばん押しやすい位置・大きさにあって、押しまちがえる心配があった（依頼による）
   ============================================================ */
function SelectModeHead({ count, allOn, onToggleAll }) {
  return (
    <div className="flex items-center gap-2 pt-1">
      <p className="text-[14.5px] font-bold text-neutral-700 tabular-nums flex-1 min-w-0 truncate">{count}件を選択中</p>
      <TapOnceButton onTap={onToggleAll} className="h-9 px-2 -mr-2 rounded-lg text-[14.5px] font-bold text-th-900 shrink-0 ft-tap">
        {allOn ? "すべて外す" : "すべて選ぶ"}
      </TapOnceButton>
    </div>
  );
}
function SelectModeBar({ dangerLabel, dangerIcon, onDanger, disabled, onDone, absolute }) {
  return (
    <div className={(absolute ? "absolute z-30" : "fixed z-40") + " left-0 right-0 bottom-0 bg-white border-t border-neutral-200"}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="max-w-lg lg:max-w-2xl mx-auto flex items-center gap-3 px-4 py-2.5">
        <button type="button" disabled={disabled} onClick={onDanger}
          className={BTN_DANGER_SOFT + " px-3.5 " + BTN_H + " text-[13.5px] shrink-0"}>{dangerIcon}{dangerLabel}</button>
        <button type="button" onClick={onDone} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>
          <Check size={17} /> 完了
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   絞り込みの欄（探す・フォルダで共通）
   **探すとフォルダで別々に書かないこと。** 見た目と中身がずれる。
   q を渡さなければ、ことばの欄は出さない（フォルダの「自動で集める」）
   ============================================================ */
function RecordFilterFields({ q, onQ, onEnter, types, onToggleType, tags, onOpenTags, onRemoveTag, book, onBook, from, to, onFrom, onTo, extra }) {
  const typeNames = useTypeName();
  return (
    <>
      {q !== undefined && (
        <TextInput value={q} onChange={(e) => onQ(e.target.value)} placeholder="ことばで探す" enterKeyHint="search"
          onKeyDown={(e) => { if (e.key === "Enter" && onEnter) { e.preventDefault(); onEnter(); } }} />
      )}
      {/* **項目名と「？」は置かないこと。** 部品を見れば何を選ぶ欄か分かる。名前を付けるのは「期間」だけ */}
      <div className="flex flex-wrap gap-1.5">
        {SEARCH_TYPES.map((t) => (
          <FilterPill key={t} on={types.includes(t)} onClick={() => onToggleType(t)}>
            {typeNames[t] || TYPE_LABELS[t]}
          </FilterPill>
        ))}
        {extra}
      </div>
      <div>
        <button type="button" onClick={onOpenTags} className={BTN_SECONDARY + " " + BTN_H + " px-3.5 text-[14.5px]"}>
          <Plus size={15} /> {tags.length ? "タグを選び直す" : "タグを選ぶ"}
        </button>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {tags.map((t) => (
              <span key={t} className="ft-chip inline-flex items-center gap-0.5 rounded-full bg-th-50 border border-th-200 pl-2.5 pr-0.5 py-0.5">
                <span className="text-[12.5px] font-bold text-th-900">{t}</span>
                <TapOnceButton onTap={() => onRemoveTag(t)} aria-label={`${t} を外す`}
                  className="w-5 h-5 flex items-center justify-center rounded-full text-th-800/60 hover:text-red-700 ft-tap ft-tap-icon"><X size={12} /></TapOnceButton>
              </span>
            ))}
          </div>
        )}
      </div>
      <BookSelect compact value={book} onChange={onBook} />
      <div className="flex items-center gap-1">
        <span className="text-[12.5px] font-bold text-neutral-600 shrink-0 w-9">期間</span>
        <DateInput className="flex-1 min-w-0" value={from} onChange={(e) => onFrom(e.target.value)} />
        {/* 日付を選ぶ画面には取り消しが無いので、外す手だてをここに置いておく */}
        {from && <button type="button" onClick={() => onFrom("")} aria-label="開始日を外す"
          className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg text-neutral-500 hover:bg-red-50 hover:text-red-700 ft-tap ft-tap-icon"><X size={15} /></button>}
        <span className="text-neutral-400 font-bold shrink-0">〜</span>
        <DateInput className="flex-1 min-w-0" value={to} onChange={(e) => onTo(e.target.value)} />
        {to && <button type="button" onClick={() => onTo("")} aria-label="終了日を外す"
          className="w-7 h-7 shrink-0 flex items-center justify-center rounded-lg text-neutral-500 hover:bg-red-50 hover:text-red-700 ft-tap ft-tap-icon"><X size={15} /></button>}
      </div>
    </>
  );
}

/* 条件の帯（探す・フォルダの「手動で入れる」）。押すと条件の欄が開け閉めする。
   **閉じても帯はいつも上に残すこと。** 下まで見ていった先で、検索に戻る道が無くなるのがいちばん困る。
   指で触った時点で開く（click を待たない）。キーボードや読み上げからの click も拾い、二重には動かさない */
function CriteriaBar({ open, onToggle, active, summary }) {
  /* **onClick だけで受けること**（ボタンの押し方のルール）。pointerdown で開くと、遅れて来る click と二重に動く。
     形は、以前の「絞り込み」の帯（min-h-[44px]・rounded-xl・border-neutral-300・px-3.5・14.5px）にそろえる */
  return (
    <button type="button" aria-expanded={open} onClick={onToggle}
      className={"w-full flex items-center gap-2 min-h-[44px] rounded-xl border px-3.5 text-left ft-tap ft-tap-card "
        + (active ? "bg-th-50 border-th-200" : "bg-white border-neutral-300")}>
      <Search size={16} className={active ? "text-th-800 shrink-0" : "text-neutral-500 shrink-0"} />
      <span className="flex-1 min-w-0">
        {active
          ? <span className="block text-[14.5px] font-bold text-th-900 truncate">{summary || "条件で検索中"}</span>
          : <span className="block text-[14.5px] font-bold text-neutral-700 truncate">{open ? "条件をえらんで検索" : "検索する"}</span>}
      </span>
      <ChevronDown size={18} className={"text-neutral-500 shrink-0 ft-chev " + (open ? "ft-chev-on" : "")} />
    </button>
  );
}

/* 条件の欄のいちばん下に置く「選択解除」「検索する」。
   **「検索する」を上に置かないこと（2.8.0〜）。** 大きな画面のスマホでは、持った手の親指が画面の上まで届かない。
   条件を選び終えた指のすぐ先（欄の下）で押せるようにする（My手帳 と同じ） */
function SearchActions({ canClear, onClear, canSearch, onSearch, busy }) {
  return (
    <div className="flex gap-2 pt-1">
      {canClear && (
        <button type="button" onClick={onClear} className={BTN_SECONDARY + " " + BTN_H + " px-4 text-[14.5px] shrink-0"}>選択解除</button>
      )}
      <button type="button" onClick={onSearch} disabled={busy || !canSearch}
        className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>
        {busy ? <Spinner size={16} /> : <Search size={16} />} 検索する
      </button>
    </div>
  );
}

/* フォルダの絵。決めていなければフォルダの印 */
function FolderIcon({ icon, size = 40 }) {
  if (icon) return <Photo src={icon} className="block w-full h-full" style={{ objectFit: "cover" }} />;
  return <FolderIc size={size} strokeWidth={1.8} />;
}

/* 上に固定する印。押しても札はひらかない（pointerdown を止めている） */
function PinButton({ on, onClick }) {
  return (
    <button type="button" onClick={onClick} onPointerDown={(e) => e.stopPropagation()}
      aria-label={on ? "固定を解除" : "上に固定"} aria-pressed={!!on}
      className={"w-9 h-9 shrink-0 flex items-center justify-center rounded-full ft-tap ft-tap-icon "
        + (on ? "bg-th-100 text-th-900" : "bg-neutral-100 text-neutral-400")}>
      <Pin size={18} fill={on ? "currentColor" : "none"} />
    </button>
  );
}

/* 下から出る、えらぶだけの小窓（フォルダの設定・削除など） */
function ActionSheet({ title, items, onCancel }) {
  const [closing, close] = useClosing(onCancel);
  return (
    <div data-ft-overlay="" className={"ft-sheet-wrap flex items-end justify-center " + (closing ? "anim-fade-out" : "anim-fade")}
      style={{ zIndex: 2147483000 }} onClick={close}>
      <BackgroundLock />
      <div className="absolute inset-0 bg-black/45" />
      <div className={"relative w-full max-w-md bg-white rounded-t-2xl border-2 border-b-0 border-neutral-200 shadow-xl flex flex-col ft-sheet-box " + (closing ? "anim-sheet-out" : "anim-sheet")}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 shrink-0">
          <span className="font-display text-[17px] text-neutral-900 tracking-wide truncate">{title}</span>
          <button type="button" onClick={close} aria-label="閉じる"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 ft-tap ft-tap-icon"><X size={24} /></button>
        </div>
        {/* 行の形は「何を記録しますか」（TypeRow）とそろえる：枠 w-11 h-11・gap-3・px-3 py-3・15.5px */}
        <div className="ft-sheet-body overflow-y-auto px-2 py-2" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
          {items.map((it) => (
            <button key={it.label} type="button" onClick={() => { onCancel(); it.onClick(); }}
              className="w-full flex items-center gap-3 px-3 py-3 min-h-[64px] rounded-xl text-left hover:bg-neutral-50 ft-tap ft-tap-card">
              <span className={"w-11 h-11 rounded-xl flex items-center justify-center shrink-0 "
                + (it.danger ? "bg-red-50 border border-red-200 text-red-700" : "bg-th-50 border border-th-200 text-th-800")}>{it.icon}</span>
              <span className={"flex-1 min-w-0 text-[15.5px] font-bold " + (it.danger ? "text-red-700" : "text-neutral-900")}>{it.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* まん中に出す、確かめるだけの小窓 */
function ConfirmBox({ title, body, confirmLabel = "削除する", danger = true, onConfirm, onCancel }) {
  return (
    /* 形はほかの確かめる小窓（ConfirmDeleteDialog など）と同じ。暗がりを押しても閉じない */
    <div data-ft-overlay="" className="fixed inset-0 bg-black/50 flex items-center justify-center px-6" style={{ zIndex: 2147483300 }}>
      <BackgroundLock />
      <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-neutral-200 shadow-xl anim-pop max-h-[88vh] overflow-y-auto">
        <h3 className="font-display text-[17px] text-neutral-900 mb-2">{title}</h3>
        {body && <p className="text-[13.5px] text-neutral-600 mb-5 whitespace-pre-line leading-relaxed">{body}</p>}
        <div className="flex gap-2.5">
          <button type="button" onClick={onCancel} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</button>
          <button type="button" onClick={onConfirm} className={(danger ? BTN_DANGER : BTN_PRIMARY) + " flex-1 " + BTN_H + " text-[14.5px]"}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

/* フォルダの名前と絵。新しく作るときも、設定を直すときも同じ紙を使う。
   絵は「フォルダの印」か「自分の写真（正方形に切り抜く）」。写真は置き場に入れて photo:番号 で持つ */
function FolderNameSheet({ title, initialName = "", initialIcon = "", confirmLabel = "保存", onCancel, onSave }) {
  const [name, setName] = useState(initialName);
  const [icon, setIcon] = useState(initialIcon);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [closing, close] = useClosing(onCancel);
  const ok = !!name.trim();
  const save = () => { if (ok) onSave(name.trim(), icon); };
  return (
    <div data-ft-overlay="" className={"ft-sheet-wrap flex items-end justify-center " + (closing ? "anim-fade-out" : "anim-fade")}
      style={{ zIndex: 2147483000 }} onClick={close}>
      <BackgroundLock />
      <div className="absolute inset-0 bg-black/45" />
      <div className={"relative w-full max-w-md bg-white rounded-t-2xl border-2 border-b-0 border-neutral-200 shadow-xl flex flex-col ft-sheet-box " + (closing ? "anim-sheet-out" : "anim-sheet")}
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 shrink-0">
          <span className="font-display text-[17px] text-neutral-900 tracking-wide">{title}</span>
          <button type="button" onClick={close} aria-label="閉じる"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 ft-tap ft-tap-icon"><X size={24} /></button>
        </div>
        <div className="ft-sheet-body overflow-y-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden bg-th-50 border border-th-200 text-th-800">
              <FolderIcon icon={icon} size={28} />
            </span>
            <span className="flex-1 min-w-0">
              <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="フォルダの名前"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); save(); } }} />
            </span>
          </div>
          <p className="text-[12.5px] font-bold text-neutral-500 mb-2">アイコン</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setIcon("")} aria-pressed={!icon} aria-label="フォルダの印"
              className={"w-14 h-14 rounded-2xl border-2 flex items-center justify-center overflow-hidden bg-th-50 text-th-800 ft-tap ft-tap-card " + (!icon ? "border-th-800" : "border-neutral-200")}>
              <FolderIc size={24} strokeWidth={1.8} />
            </button>
            <label className={"w-14 h-14 rounded-2xl border-2 flex items-center justify-center overflow-hidden cursor-pointer ft-tap ft-tap-card "
              + (icon ? "border-th-800" : "border-dashed border-neutral-300")} aria-label="写真をえらぶ">
              <input type="file" accept="image/*" className="hidden" disabled={busy}
                onChange={(e) => { const f = e.target.files && e.target.files[0]; e.target.value = ""; if (f) setFile(f); }} />
              {icon ? <Photo src={icon} className="block w-full h-full" style={{ objectFit: "cover" }} />
                : <span className="flex text-neutral-400">{busy ? <Spinner size={20} /> : <ImageIcon size={22} />}</span>}
            </label>
            {icon && (
              <button type="button" onClick={() => setIcon("")} aria-label="写真をやめる"
                className="w-14 h-14 rounded-2xl border border-neutral-200 flex items-center justify-center text-neutral-400 ft-tap ft-tap-card"><X size={20} /></button>
            )}
          </div>
        </div>
        <div className="shrink-0 flex gap-2.5 px-4 py-3 border-t border-neutral-200" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
          <button type="button" onClick={close} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</button>
          <button type="button" onClick={save} disabled={!ok || busy} className={BTN_PRIMARY + " flex-1 " + BTN_H + " text-[14.5px]"}>{confirmLabel}</button>
        </div>
      </div>
      {file && (
        <CropSheet file={file} aspect={1} title="絵の位置を決める" onCancel={() => setFile(null)}
          onDone={async (src) => {
            setFile(null);
            if (!src) return;
            setBusy(true);
            const id = "ph_" + uid();
            const res = await photoPut(id, src);
            setIcon(res === null ? src : "photo:" + id);
            setBusy(false);
          }} />
      )}
    </div>
  );
}

/* ============================================================
   フォルダに記録を入れる紙
   上のタブで「自動で集める」と「手動で入れる」を行き来する。
   **別々の入口に分けないこと。** どちらもこのフォルダの集め方なので、ひとつの紙で並べて見せる。
   手動のほうは、探す画面と同じ道具（ことば・種類・タグ・書・期間）を使う
   ============================================================ */
const FOLDER_TABS = [{ key: "auto", label: "自動で集める" }, { key: "manual", label: "手動で入れる" }];
const EMPTY_CRITERIA = { q: "", types: [], tags: [], book: "", from: "", to: "", mine: false };
function FolderSetupSheet({ folder, records, knownTags, initialTab, onCancel, onSave }) {
  const [closing, close] = useClosing(onCancel);
  const [tab, setTab] = useState(initialTab || "auto");
  const [leaveAsk, setLeaveAsk] = useState(false);
  const N = useTypeName();
  /* --- 自動の条件 --- */
  const start = useMemo(() => ({
    tags: normalizeTags(folder.tags), types: folder.types || [], book: folder.book || "",
    from: folder.from || "", to: folder.to || "",
  }), [folder]);
  const [cond, setCond] = useState(start);
  const [condTagOpen, setCondTagOpen] = useState(false);
  const setC = (patch) => setCond((d) => ({ ...d, ...patch }));
  const toggleCondType = (t) => setC({ types: cond.types.includes(t) ? cond.types.filter((x) => x !== t) : [...cond.types, t] });
  const condOn = folderHasCond(cond);
  /* --- 手動で入れるぶん --- */
  const [picked, setPicked] = useState(() => new Set(folder.picked || []));
  const [draft, setDraft] = useState(EMPTY_CRITERIA);
  const [applied, setApplied] = useState(null); // 「検索する」を押して決まった条件
  const [fTagOpen, setFTagOpen] = useState(false);
  const setD = (patch) => setDraft((d) => ({ ...d, ...patch }));
  const hasDraft = !!(draft.q.trim() || draft.types.length || draft.tags.length || draft.book || draft.from || draft.to || draft.mine);
  const dirty = useMemo(() => {
    if (JSON.stringify(cond) !== JSON.stringify(start)) return true;
    return Array.from(picked).sort().join(",") !== (folder.picked || []).slice().sort().join(",");
  }, [cond, start, picked, folder.picked]);
  const tryClose = () => { if (dirty) setLeaveAsk(true); else close(); };
  /* 条件だけで入るもの */
  const autoCount = useMemo(() => (condOn ? folderRecords({ ...folder, ...cond, picked: [] }, records).length : 0), [folder, cond, records, condOn]);
  const results = useMemo(() => {
    if (!applied) return [];
    const list = filterRecordsBy(records, applied).filter((r) => !applied.mine || picked.has(r.id));
    return sortRecordsBy(list, "dateDesc");
  }, [records, applied, picked]);
  const toggleDType = (t) => setD({ types: draft.types.includes(t) ? draft.types.filter((x) => x !== t) : [...draft.types, t] });
  const toggle = (id) => setPicked((s0) => { const n = new Set(s0); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const allShown = results.length > 0 && results.every((r) => picked.has(r.id));
  const pickAll = () => setPicked((s0) => {
    const n = new Set(s0);
    results.forEach((r) => (allShown ? n.delete(r.id) : n.add(r.id)));
    return n;
  });
  const [fOpen, setFOpen] = useState(true);
  const bodyRef = useRef(null);
  const toTop = () => { if (bodyRef.current) bodyRef.current.scrollTo({ top: 0, behavior: "smooth" }); };
  const search = () => { if (!hasDraft) return; setApplied({ ...draft }); setFOpen(false); toTop(); };
  const clear = () => { setDraft(EMPTY_CRITERIA); setApplied(null); setFOpen(true); };
  const toggleBar = () => { const next = !fOpen; setFOpen(next); if (next) requestAnimationFrame(() => requestAnimationFrame(toTop)); };
  /* 左右に払ってタブを切り替える */
  const swipe = useRef(null);
  const onDown = (e) => { swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId }; };
  const onUp = (e) => {
    const s0 = swipe.current; swipe.current = null;
    if (!s0 || s0.id !== e.pointerId) return;
    const dx = e.clientX - s0.x, dy = e.clientY - s0.y;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
    setTab(dx < 0 ? "manual" : "auto");
  };
  const save = () => onSave({ ...cond, picked: Array.from(picked) });
  return (
    <>
      <div data-ft-overlay="" className={"ft-sheet-wrap flex items-end justify-center " + (closing ? "anim-fade-out" : "anim-fade")}
        style={{ zIndex: 2147482000 }} onClick={tryClose}>
        <BackgroundLock />
        <div className="absolute inset-0 bg-black/45" />
        <div className={"relative w-full max-w-md bg-white rounded-t-2xl border-2 border-b-0 border-neutral-200 shadow-xl flex flex-col ft-sheet-box ft-sheet-tall " + (closing ? "anim-sheet-out" : "anim-sheet")}
          onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1 px-4 py-3 border-b border-neutral-200 shrink-0">
            <span className="font-display text-[17px] text-neutral-900 tracking-wide flex-1">記録を入れる</span>
            <HelpTip label="記録を入れる" text={"種類・タグは、どれかに合う記録が入ります。書・期間は、その範囲の記録だけになります。\n手動で入れた記録は、フォルダの中で長押しすると外せます。"} />
            <button type="button" onClick={tryClose} aria-label="閉じる"
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 ft-tap ft-tap-icon"><X size={24} /></button>
          </div>
          <div className="px-4 pt-3 pb-1 shrink-0">
            <div className="flex rounded-full bg-th-50 p-1">
              {FOLDER_TABS.map((t) => (
                <button key={t.key} type="button" onClick={() => setTab(t.key)} aria-pressed={tab === t.key} style={{ minHeight: 42 }}
                  className={"flex-1 rounded-full text-[14.5px] font-bold flex items-center justify-center gap-1.5 ft-tap "
                    + (tab === t.key ? "bg-white text-th-900 shadow-sm" : "text-th-800/60")}>
                  {t.key === "auto" ? <Filter size={14} /> : <Search size={14} />}
                  {t.label}
                  {t.key === "auto" && condOn && <span className="w-1.5 h-1.5 rounded-full bg-th-800" aria-hidden="true" />}
                  {t.key === "manual" && picked.size > 0 && <span className="text-[11.5px] tabular-nums">{picked.size}</span>}
                </button>
              ))}
            </div>
          </div>
          {/* 手動のときの条件の帯。**下の送る箱の中で sticky にしないこと**（iPhone で、下まで送ると消えることがある） */}
          {tab === "manual" && (
            <div className="px-4 pt-3 pb-2 shrink-0 bg-white">
              <CriteriaBar open={fOpen} onToggle={toggleBar} active={!!applied} summary={criteriaSummary(applied, N)} />
            </div>
          )}
          <div ref={bodyRef} className={"ft-sheet-body overflow-y-auto overflow-x-hidden px-4 " + (tab === "manual" ? "pt-2 pb-3" : "py-3")}
            style={{ touchAction: "pan-y" }} onPointerDown={onDown} onPointerUp={onUp}>
            {tab === "auto" ? (
              <>
                <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-2.5 space-y-2.5 mb-4">
                  <RecordFilterFields types={cond.types} onToggleType={toggleCondType}
                    tags={cond.tags} onOpenTags={() => setCondTagOpen(true)} onRemoveTag={(t) => setC({ tags: cond.tags.filter((x) => x !== t) })}
                    book={cond.book} onBook={(v) => setC({ book: v })}
                    from={cond.from} to={cond.to} onFrom={(v) => setC({ from: v })} onTo={(v) => setC({ to: v })} />
                  {condOn && (
                    <div className="pt-1">
                      <button type="button" onClick={() => setCond({ tags: [], types: [], book: "", from: "", to: "" })}
                        className={BTN_SECONDARY + " w-full " + BTN_H + " text-[14.5px]"}>条件をすべて外す</button>
                    </div>
                  )}
                </div>
                <div className="rounded-xl bg-neutral-100 px-3.5 py-2.5 flex items-center gap-2">
                  <span className="text-[13.5px] text-neutral-600 flex-1">この条件で入る記録</span>
                  <span className="text-[17px] font-bold tabular-nums text-neutral-900">{autoCount}件</span>
                </div>
              </>
            ) : (
              <>
                {fOpen && (
                  <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-2.5 space-y-2.5 mb-4 ft-open">
                    <RecordFilterFields q={draft.q} onQ={(v) => setD({ q: v })} onEnter={search}
                      types={draft.types} onToggleType={toggleDType}
                      tags={draft.tags} onOpenTags={() => setFTagOpen(true)} onRemoveTag={(t) => setD({ tags: draft.tags.filter((x) => x !== t) })}
                      book={draft.book} onBook={(v) => setD({ book: v })}
                      from={draft.from} to={draft.to} onFrom={(v) => setD({ from: v })} onTo={(v) => setD({ to: v })}
                      extra={<FilterPill on={draft.mine} onClick={() => setD({ mine: !draft.mine })}><span className="inline-flex items-center gap-1"><Check size={13} strokeWidth={3} />手動</span></FilterPill>} />
                    <SearchActions canClear={hasDraft || !!applied} onClear={clear} canSearch={hasDraft} onSearch={search} />
                  </div>
                )}
                {!applied ? null : results.length === 0 ? (
                  <p className="text-[14.5px] text-neutral-400 py-10 text-center">見つかりません</p>
                ) : (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                      <button type="button" onClick={pickAll} className="h-9 px-2 -ml-2 rounded-lg text-[14.5px] font-bold text-th-900 ft-tap">{allShown ? "選択解除" : "すべて選択"}</button>
                      <span className="flex-1" />
                      <p className="text-[12.5px] font-bold text-neutral-500 tabular-nums">{results.length}件中 {results.filter((r) => picked.has(r.id)).length}件</p>
                    </div>
                    <div className="space-y-2.5 ft-seq">
                      {results.map((r) => (
                        <RecordCard key={r.id} r={r} selectMode selected={picked.has(r.id)} onClick={() => toggle(r.id)} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <div className="shrink-0 flex gap-2.5 px-4 py-3 border-t border-neutral-200" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
            <button type="button" onClick={tryClose} className={BTN_SECONDARY + " flex-1 " + BTN_H + " text-[14.5px]"}>キャンセル</button>
            <button type="button" onClick={save} className={BTN_PRIMARY + " flex-[1.6] " + BTN_H + " text-[14.5px]"}>
              <Check size={17} /> {picked.size ? `${picked.size}件を入れて保存` : "保存"}
            </button>
          </div>
        </div>
      </div>
      {condTagOpen && (
        <TagPickDialog title="タグを選ぶ" selected={cond.tags} known={knownTags}
          onApply={(v) => { setC({ tags: v }); setCondTagOpen(false); }} onCancel={() => setCondTagOpen(false)} />
      )}
      {fTagOpen && (
        <TagPickDialog title="タグを選ぶ" selected={draft.tags} known={knownTags}
          onApply={(v) => { setD({ tags: v }); setFTagOpen(false); }} onCancel={() => setFTagOpen(false)} />
      )}
      {leaveAsk && (
        <ConfirmBox title="保存せずに閉じますか" body="変えた内容は残りません。" danger={false} confirmLabel="閉じる"
          onCancel={() => setLeaveAsk(false)} onConfirm={() => { setLeaveAsk(false); close(); }} />
      )}
    </>
  );
}

/* ============================================================
   フォルダの中（右から出る画面）
   ・上の2枚の札 …「自動で集める」「手動で入れる」。押すと記録を入れる紙が開く
   ・右下の＋ … 手動で記録をさがして入れる
   ・長押しで選ぶ … **手動で入れたぶんだけ**「フォルダから外す」ができる。
     条件で入っているものは、条件を変えないかぎり残る（手動で入れたものが条件にも当てはまれば、自動あつかい）
   ・**ここで記録そのものを消せるようにしないこと。** ここはフォルダの出し入れをする場所
   ============================================================ */
function FolderDetail({ folder, records, knownTags, defaultSort, onClose, onChange, onDelete, onOpenDetail }) {
  const [closing, close] = useClosing(onClose);
  const { stripRef, screenRef } = useEdgeSwipeBack(close);
  const N = useTypeName();
  const [setup, setSetup] = useState(null); // "auto" / "manual"
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [sortMode, setSortMode] = useState(() => defaultSort || "book");
  const list = useMemo(() => sortRecordsBy(folderRecords(folder, records), sortMode), [folder, records, sortMode]);
  const hasCond = folderHasCond(folder);
  const condText = folderCondText(folder, N);
  const autoSet = useMemo(() => new Set(folderRecords({ ...folder, picked: [] }, records).map((r) => r.id)), [folder, records]);
  const canPick = (r) => (folder.picked || []).includes(r.id) && !(hasCond && autoSet.has(r.id));
  const pickedCount = useMemo(() => list.filter((r) => (folder.picked || []).includes(r.id)).length, [list, folder.picked]);
  const pickable = useMemo(() => list.filter(canPick), [list, folder.picked, autoSet]); // eslint-disable-line
  /* 選ぶモード */
  const [selecting, setSelecting] = useState(false);
  const [selIds, setSelIds] = useState([]);
  const stopSelect = () => { setSelecting(false); setSelIds([]); };
  const toggleSel = (id) => setSelIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const removeFromFolder = () => {
    const gone = new Set(selIds);
    onChange({ ...folder, picked: (folder.picked || []).filter((x) => !gone.has(x)) });
    stopSelect();
  };
  const cardStyle = (on) => (on
    ? "bg-th-50 border-th-200"
    : "bg-white border-dashed border-neutral-300");
  return (
    <OverlayScreen from="right" closing={closing}>
      <div ref={screenRef} className="absolute inset-0 ft-page flex flex-col">
        <div ref={stripRef} data-ft-edge="" className="absolute left-0 top-0 bottom-0 w-9 z-10" style={{ touchAction: "none" }} />
        <div className="ft-hdr bg-white border-b border-neutral-200 px-4 pb-3 flex items-center gap-2 shrink-0" style={SAFE_TOP(12)}>
          <TapButton onClick={close} className="min-h-[52px] pl-2 pr-3.5 flex items-center gap-1 rounded-xl text-th-800 font-bold text-[15.5px] hover:bg-neutral-100 shrink-0"><ChevronLeft size={22} />戻る</TapButton>
          <h2 className="font-display text-[20px] text-neutral-900 truncate flex-1 tracking-wide">{folder.name || "（名前なし）"}</h2>
          <button type="button" onClick={() => setMenuOpen(true)} aria-label="フォルダの設定"
            className="w-11 h-11 flex items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 ft-tap ft-tap-icon shrink-0"><Settings size={21} /></button>
          {/* 三本線は、ほかの重なる画面と同じく右端に置く（MENU_BTN の大きさ） */}
          <MenuButton />
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 max-w-2xl mx-auto w-full" style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 96px)" }}>
          <div className="flex gap-2 mb-4">
            <button type="button" onClick={() => setSetup("auto")}
              className={"flex-1 min-w-0 rounded-2xl px-3 py-2.5 text-left border ft-tap ft-tap-card " + cardStyle(hasCond)}>
              <span className={"flex items-center gap-1.5 mb-0.5 " + (hasCond ? "text-th-900" : "text-neutral-500")}>
                <Filter size={14} /><span className="text-[12.5px] font-bold">自動で集める</span>
              </span>
              <span className="block text-[12.5px] text-neutral-500 truncate">{hasCond ? condText : "条件なし"}</span>
            </button>
            <button type="button" onClick={() => setSetup("manual")}
              className={"flex-1 min-w-0 rounded-2xl px-3 py-2.5 text-left border ft-tap ft-tap-card " + cardStyle(pickedCount > 0)}>
              <span className={"flex items-center gap-1.5 mb-0.5 " + (pickedCount ? "text-th-900" : "text-neutral-500")}>
                <Search size={14} /><span className="text-[12.5px] font-bold">手動で入れる</span>
              </span>
              <span className="block text-[12.5px] text-neutral-500 truncate tabular-nums">{pickedCount ? `${pickedCount}件` : "指定なし"}</span>
            </button>
          </div>
          {list.length > 0 && selecting && (
            <div className="mb-3">
              <SelectModeHead count={selIds.length} allOn={selIds.length === pickable.length}
                onToggleAll={() => setSelIds(selIds.length === pickable.length ? [] : pickable.map((r) => r.id))} />
            </div>
          )}
          {list.length > 0 && !selecting && (
            <div className="flex items-center gap-2 mb-3">
              <p className="text-[12.5px] font-bold tracking-wider text-th-800/70 uppercase tabular-nums">{list.length}件</p>
              <SortToggle value={sortMode} onChange={setSortMode} />
            </div>
          )}
          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-6 flex flex-col items-center ft-noresult">
              <Mascot seed="folder-empty" size={142} />
              <p className="text-[13.5px] text-neutral-500 mt-2 text-center">まだ記録が入っていません</p>
            </div>
          ) : (
            <div className="space-y-2.5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-2.5 lg:items-start ft-seq">
              {list.map((r) => {
                const can = canPick(r);
                return (
                  <div key={r.id} className={selecting && !can ? "opacity-45 pointer-events-none" : ""}>
                    <RecordCard r={r} selectMode={selecting && can} selected={selIds.includes(r.id)}
                      onLongPress={!selecting && can ? () => { setSelecting(true); setSelIds([r.id]); } : undefined}
                      onClick={() => (selecting ? (can && toggleSel(r.id)) : onOpenDetail(r))} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {!selecting && (
          /* 虫めがね（記録をさがして入れる）。**＋にしないこと。** 新しい記録を書くボタンと取り違える */
          /* 位置と大きさは、記録の閲覧画面の鉛筆ボタンとそろえる（右5・下は切り欠き＋20px・w-14 h-14） */
          <button type="button" onClick={() => setSetup("manual")} aria-label="記録をさがして入れる"
            className="absolute right-5 z-20 w-14 h-14 rounded-full bg-th-900 text-white shadow-xl flex items-center justify-center hover:bg-th-800 ft-tap ft-fab"
            style={{ bottom: "calc(env(safe-area-inset-bottom) + 20px)" }}>
            <Search size={25} strokeWidth={2.4} />
          </button>
        )}
        {selecting && (
          <SelectModeBar absolute dangerLabel="フォルダから外す" disabled={selIds.length === 0}
            onDanger={removeFromFolder} onDone={stopSelect} />
        )}
      </div>
      {menuOpen && (
        <ActionSheet title="フォルダの設定" onCancel={() => setMenuOpen(false)} items={[
          { label: "名前とアイコン", icon: <Pencil size={22} />, onClick: () => setEditOpen(true) },
          { label: "このフォルダを削除", icon: <Trash2 size={22} />, danger: true, onClick: () => setDelOpen(true) },
        ]} />
      )}
      {setup && (
        <FolderSetupSheet folder={folder} records={records} knownTags={knownTags} initialTab={setup}
          onCancel={() => setSetup(null)} onSave={(next) => { onChange({ ...folder, ...next }); setSetup(null); }} />
      )}
      {editOpen && (
        <FolderNameSheet title="名前とアイコン" initialName={folder.name} initialIcon={folder.icon}
          onCancel={() => setEditOpen(false)} onSave={(n, ic) => { onChange({ ...folder, name: n, icon: ic }); setEditOpen(false); }} />
      )}
      {delOpen && (
        <ConfirmBox title="このフォルダを削除しますか" body={"中の記録は消えません。\nフォルダだけがなくなります。"}
          onCancel={() => setDelOpen(false)} onConfirm={() => { setDelOpen(false); onDelete(folder.id); }} />
      )}
    </OverlayScreen>
  );
}

/* ============================================================
   ④ フォルダ（下のタブ）
   2列のカード。絵を主役にして、文字は下にまとめる。
   長押しで「名前とアイコン」「削除」。**ひらかないと直せない、をなくすこと**
   ============================================================ */
function FolderScreen({ folders, records, sort, onSort, onOpen, onPin, onChange, onDelete, resetSig = 0 }) {
  const N = useTypeName();
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState(null);
  const [edit, setEdit] = useState(null);
  const [del, setDel] = useState(null);
  useEffect(() => { if (resetSig) setQ(""); }, [resetSig]);
  /* **くり返しの中でフックを呼ばないこと。** 札ごとに使えるよう、素の handler を作る */
  const press = useRef({ t: null, from: null, fired: false });
  const stopPress = () => { if (press.current.t) { clearTimeout(press.current.t); press.current.t = null; } };
  useEffect(() => () => stopPress(), []);
  const longPressProps = (item) => ({
    onPointerDown: (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      press.current.fired = false;
      press.current.from = { x: e.clientX, y: e.clientY };
      stopPress();
      press.current.t = setTimeout(() => {
        press.current.fired = true;
        try { if (navigator.vibrate) navigator.vibrate(8); } catch (err) { /* 使えなくても構わない */ }
        setMenu(item);
      }, 480);
    },
    onPointerMove: (e) => {
      const f = press.current.from;
      if (f && (Math.abs(e.clientX - f.x) > 10 || Math.abs(e.clientY - f.y) > 10)) stopPress();
    },
    onPointerUp: stopPress,
    onPointerCancel: stopPress,
    onContextMenu: (e) => e.preventDefault(),
    onClickCapture: (e) => { if (press.current.fired) { e.preventDefault(); e.stopPropagation(); press.current.fired = false; } },
  });
  /* 件数はカードの表示と「件数順」の両方に使うので、ここで一度だけ数える */
  const counts = useMemo(() => {
    const m = new Map();
    for (const f of folders) m.set(f.id, folderRecords(f, records).length);
    return m;
  }, [folders, records]);
  const shown = useMemo(() => {
    const w = q.trim().toLowerCase();
    return sortFolders(w ? folders.filter((f) => String(f.name || "").toLowerCase().includes(w)) : folders, sort, counts);
  }, [folders, q, sort, counts]);
  const cur = FOLDER_SORT_OPTIONS.find((o) => o.key === sort) || FOLDER_SORT_OPTIONS[0];
  const nextSort = FOLDER_SORT_OPTIONS[(FOLDER_SORT_OPTIONS.indexOf(cur) + 1) % FOLDER_SORT_OPTIONS.length];
  return (
    <div className="ft-pad-fab">
      <TopChrome>
        <ScreenHeader title="フォルダ" />
        <div className="px-5 pt-4 pb-3 flex items-center gap-2 ft-page">
          <div className="flex-1 min-w-0">
            <TextInput value={q} onChange={(e) => setQ(e.target.value)} placeholder="フォルダをさがす" />
          </div>
          <TapOnceButton onTap={() => onSort(nextSort.key)} aria-label={`並べ替え：いま${cur.label}。押すと${nextSort.label}`}
            className="h-9 pl-2.5 pr-3 flex items-center gap-1 rounded-full text-[12.5px] font-bold text-neutral-500 hover:bg-neutral-100 shrink-0 ft-tap ft-tap-icon">
            <ArrowUpDown size={14} /> {cur.label}
          </TapOnceButton>
        </div>
      </TopChrome>
      <div className="px-5 pt-1 ft-fgrid ft-seq">
        {folders.length === 0 && (
          /* **文だけにすること。** 絵や説明を足さない（依頼により 2.8.1 でこの形にした） */
          <div className="py-14 text-center ft-noresult"><p className="text-[14.5px] text-neutral-400">まだフォルダはありません</p></div>
        )}
        {folders.length > 0 && shown.length === 0 && (
          <div className="py-14 text-center ft-noresult"><p className="text-[14.5px] text-neutral-400">見つかりません</p></div>
        )}
        {shown.map((f) => {
          const n = counts.get(f.id) || 0;
          const auto = folderHasCond(f);
          const picked = (f.picked || []).length;
          const tagText = normalizeTags(f.tags).map((t) => "#" + t).join(" ");
          const sub = tagText || (auto ? folderCondText(f, N) : "");
          return (
            <div key={f.id} role="button" tabIndex={0} onClick={() => onOpen(f)} {...longPressProps(f)}
              onKeyDown={(e) => { if (e.key === "Enter") onOpen(f); }}
              aria-label={`${f.name || "（名前なし）"}、${n}件`}
              style={{ WebkitTouchCallout: "none" }}
              className="ft-fcard bg-white border border-neutral-200 text-left ft-tap ft-tap-card cursor-pointer select-none">
              <span className="ft-fthumb bg-th-50 border border-th-200 text-th-800">
                <FolderIcon icon={f.icon} size={40} />
                <span className="ft-fpin"><PinButton on={f.pinned} onClick={(e) => { e.stopPropagation(); onPin(f); }} /></span>
              </span>
              <span className="ft-fbody">
                <span className="ft-fname font-display text-[15.5px] text-neutral-900">{f.name || "（名前なし）"}</span>
                <span className="ft-fmeta">
                  <span className="text-[12.5px] font-bold text-neutral-500 tabular-nums">{n}件</span>
                  {auto && <span className="inline-flex items-center gap-1 text-[11.5px] font-bold rounded-md px-1.5 py-[2px] bg-th-50 text-th-900"><Filter size={10} />自動</span>}
                  {picked > 0 && <span className="inline-flex items-center gap-1 text-[11.5px] font-bold rounded-md px-1.5 py-[2px] bg-neutral-100 text-neutral-600"><Check size={10} strokeWidth={3} />手動{picked}</span>}
                  {!auto && picked === 0 && <span className="text-[12.5px] text-neutral-400">まだ空です</span>}
                </span>
                {sub && <span className="ft-fsub text-[12.5px] text-neutral-400">{sub}</span>}
              </span>
            </div>
          );
        })}
      </div>
      {menu && (
        <ActionSheet title={menu.name || "フォルダ"} onCancel={() => setMenu(null)} items={[
          { label: "名前とアイコン", icon: <Pencil size={22} />, onClick: () => setEdit(menu) },
          { label: "このフォルダを削除", icon: <Trash2 size={22} />, danger: true, onClick: () => setDel(menu) },
        ]} />
      )}
      {edit && (
        <FolderNameSheet title="名前とアイコン" initialName={edit.name} initialIcon={edit.icon}
          onCancel={() => setEdit(null)} onSave={(n, ic) => { onChange({ ...edit, name: n, icon: ic }); setEdit(null); }} />
      )}
      {del && (
        <ConfirmBox title="このフォルダを削除しますか" body={"中の記録は消えません。\nフォルダだけがなくなります。"}
          onCancel={() => setDel(null)} onConfirm={() => { const f = del; setDel(null); onDelete(f.id); }} />
      )}
    </div>
  );
}

const TABS = [
  { key: "home", label: "ホーム", icon: Home },
  { key: "record", label: "記録", icon: BookOpen },
  { key: "search", label: "探す", icon: Search },
  /* フォルダは「探す」と「実績」のあいだ（2.8.0〜） */
  { key: "folder", label: "フォルダ", icon: FolderIc },
  { key: "progress", label: "実績", icon: TrendingUp },
];
/* 下の帯（タブ）。
   **厚みは `--ft-nav-h`（56px ＋ 切り欠きのぶん）で決め打ちにすること。**
   JSで測ったり、外側を dvh や fixed で留めたりする作りは、端末によって
   下のはしが画面と食い違い、部品が上へ寄ったり帯が浮いたりする。
   姉妹アプリ（My手帳）でも同じ道をたどって、この形に落ち着いている */
function BottomNav({ active, onChange }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-200 ft-tabbar-wrap">
      <div className="max-w-lg lg:max-w-5xl mx-auto flex">
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            /* **TapOnceButton で受けること。**（値が変わるだけのボタン。中身は click。素早く続けて押しても取りこぼさないよう、touch-action: manipulation と組み合わせている） */
            <TapOnceButton key={key} onTap={() => onChange(key)} className="flex-1 flex flex-col items-center gap-1 py-2.5 min-h-[56px] relative ft-tap ft-tabbtn">
              {isActive && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] bg-th-800 rounded-full ft-tabbar" />}
              {/* 選ばれた瞬間だけ弾ませたいので、key を変えて描き直させている */}
              <Icon key={isActive ? "on" : "off"} size={21}
                className={(isActive ? "text-th-800 ft-tabpop" : "text-neutral-500")} strokeWidth={isActive ? 2.5 : 2} />
              <span className={"text-[11.5px] tracking-tight whitespace-nowrap " + (isActive ? "text-th-800 font-bold" : "text-neutral-500 font-medium")}>{label}</span>
            </TapOnceButton>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   App
   ============================================================ */
/* 何かの拍子に画面が真っ白になっても、記録を取り出せるようにするための最後の砦。
   テーマ色のCSSはApp内にあるため、ここでは見た目を直接指定している
   （CSSが一切読めていない状態でも、必ず読めるようにするため） */
const EB_BOX = { minHeight: "100vh", background: "#FAFAF9", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", fontFamily: "sans-serif" };
const EB_BTN = { width: "100%", minHeight: "40px", borderRadius: "12px", fontSize: "14.5px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" };

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { failed: false, copied: null }; }
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error) { try { console.error("画面の表示に失敗しました", error); } catch (e) { /* noop */ } }

  async rescue() {
    try {
      const raw = await storageGet(STORAGE_KEY);
      if (!raw) { this.setState({ copied: "empty" }); return; }
      const ok = await copyToClipboard(raw);
      this.setState({ copied: ok ? "ok" : "ng" });
    } catch (e) { this.setState({ copied: "ng" }); }
  }

  render() {
    if (!this.state.failed) return this.props.children;
    const { copied } = this.state;
    return (
      <div style={EB_BOX}>
        <div style={{ maxWidth: "384px", width: "100%" }}>
          <h1 style={{ fontSize: "20px", fontWeight: 900, color: "#1C1917", margin: "0 0 8px" }}>画面を表示できませんでした</h1>
          <p style={{ fontSize: "13.5px", color: "#57534E", lineHeight: 1.7, margin: "0 0 8px" }}>
            記録は消えていません。この端末の中にそのまま残っています。
          </p>
          <p style={{ fontSize: "13.5px", color: "#57534E", lineHeight: 1.7, margin: "0 0 20px" }}>
            まず「もう一度開く」をお試しください。それでも直らないときは、下のボタンで記録を取り出し、メモアプリなどに貼り付けて保管してください。
          </p>
          <button onClick={() => { try { window.location.reload(); } catch (e) { /* noop */ } }}
            style={{ ...EB_BTN, background: "#134E4A", color: "#fff", border: "0", marginBottom: "10px" }}>もう一度開く</button>
          <button onClick={() => this.rescue()}
            style={{ ...EB_BTN, background: "#fff", color: "#44403C", border: "2px solid #D6D3D1" }}>記録をコピーして取り出す</button>
          {copied === "ok" && <p style={{ fontSize: "13px", fontWeight: 700, color: "#134E4A", marginTop: "12px" }}>コピーしました。メモアプリなどに貼り付けて保管してください。</p>}
          {copied === "ng" && <p style={{ fontSize: "13px", fontWeight: 700, color: "#9F1239", marginTop: "12px" }}>コピーできませんでした。</p>}
          {copied === "empty" && <p style={{ fontSize: "13px", fontWeight: 700, color: "#57534E", marginTop: "12px" }}>取り出せる記録が見つかりませんでした。</p>}
        </div>
      </div>
    );
  }
}

export default function App() {
  return <ErrorBoundary><AppMain /></ErrorBoundary>;
}

function AppMain() {
  const [records, setRecordsState] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState("home");
  /* 下のタブをもう一度押したときの戻り方（全タブ共通の決まり）。
     1回め … いま見ている表示のまま、いちばん上へ戻すだけ。
     2回め（もう上にいるときは1回めから）… その画面のはじめの状態へ戻す（いまは「探す」だけ）。
     別のタブへ移ったら数え直す。押した回数の偶数・奇数で決めないこと */
  const [searchReset, setSearchReset] = useState(0);
  const [folderReset, setFolderReset] = useState(0);
  const topArmed = useRef(null);
  const pressTab = (k) => {
    if (k !== tab) { topArmed.current = null; setTab(k); return; }
    const atTop = window.scrollY < 4;
    if (!atTop && topArmed.current !== k) { topArmed.current = k; scrollPageTop(); return; }
    topArmed.current = null;
    if (k === "search") setSearchReset((n) => n + 1);
    if (k === "folder") setFolderReset((n) => n + 1);
    scrollPageTop();
  };
  const [editing, setEditing] = useState(null);
  const [isNew, setIsNew] = useState(false);
  const [draftSaved, setDraftSaved] = useState(null); // 書きかけの記録（前回アプリを閉じたときの控え）
  const [typePick, setTypePick] = useState(false);   // ＋を押したあとの種類選び
  const [typeLocked, setTypeLocked] = useState(false); // 種類を選んでから入る流れかどうか
  const [viewing, setViewing] = useState(null);
  const [viewingBook, setViewingBook] = useState(null);
  const [viewingDay, setViewingDay] = useState(null);
  const [dupState, setDupState] = useState(null);
  const [backupOpen, setBackupOpen] = useState(false);
  const [artOpen, setArtOpen] = useState(false);
  const [gardenOpen, setGardenOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [bookmarkOpen, setBookmarkOpen] = useState(false);
  /* フォルダ（2.8.0〜）。openFolderId ＝ 中をひらいているフォルダ。
     **フォルダそのものを持たないこと。** 持つと、中で条件を変えたときに古いフォルダのまま描かれる */
  const [folders, setFoldersState] = useState([]);
  const [openFolderId, setOpenFolderId] = useState(null);
  const [newFolder, setNewFolder] = useState(false);
  const foldersRef = useRef([]);
  foldersRef.current = folders;
  const [typeDesc, setTypeDesc] = useState({ desc: { ...DEFAULT_TYPE_DESC }, name: { ...DEFAULT_TYPE_NAME } });
  const [garden, setGarden] = useState({ ...DEFAULT_GARDEN });
  const [pickFruit, setPickFruit] = useState(false);
  const [harvestOf, setHarvestOf] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuInstant, setMenuInstant] = useState(false);
  /* メニューから画面へ移るあいだ（2.10.0〜。姉妹アプリ My手帳 2.20.6 と同じ）。
     menuUnder＝板を移った先の画面の下へ沈めている。
     menuLift＝右から入ってくる画面（"art" など）。入りきるまで、ほかの全画面より上（MENU_LIFT_Z）に出す */
  const [menuUnder, setMenuUnder] = useState(false);
  const [menuLift, setMenuLift] = useState(null);
  const menuGoTimer = useRef(null);
  useEffect(() => () => clearTimeout(menuGoTimer.current), []);
  /* 開き直し待ちの画面（2.11.2〜）。選んだ画面が、いま見ている画面の下にもう開いていたとき、
     いったん閉じて、その描き直しが済んでから（この useEffect で）goFromMenu をやり直す。
     **同じ描き直しの中で閉じて開き直さないこと。** React がまとめてしまい、閉じたことにならない。
     goFromMenu は下のほう（起動を待つ return のあと）で作るので、覚え（ref）から呼ぶ */
  const [menuRelaunch, setMenuRelaunch] = useState(null);
  const goFromMenuRef = useRef(null);
  useEffect(() => {
    if (!menuRelaunch) return;
    setMenuRelaunch(null);
    menuGoTimer.current = null;
    if (goFromMenuRef.current) goFromMenuRef.current(menuRelaunch);
  }, [menuRelaunch]);
  const [artworks, setArtworks] = useState([]);
  const [headerBg, setHeaderBg] = useState(null); // ヘッダの背景に敷く絵（1枚だけ。「photo:番号」）
  /* 片づけ（sweepPhotos）は、記録を消した流れの中から呼ぶ。そのときの headerBg を
     描き直しの値から拾うと古いことがあるので、覚え（ref）から取る */
  const headerBgRef = useRef(null);
  headerBgRef.current = headerBg;
  /* 実際に敷ける形（data URL）。置き場が開くまでは空なので、そのあいだは地の色のまま */
  const headerBgUrl = usePhotoSrc(headerBg);
  const [tagMaster, setTagMaster] = useState([]);
  const [captions, setCaptions] = useState({ ...DEFAULT_CAPTIONS });
  const [prefs, setPrefs] = useState({ ...DEFAULT_PREFS });

  useEffect(() => {
    loadRecords()
      .then((r) => { setRecordsState((Array.isArray(r) ? r : []).map(migrateRecord).filter(Boolean)); })
      .catch(() => { setRecordsState([]); })
      .finally(() => { setLoaded(true); });
  }, []);
  useEffect(() => { askPersist(); }, []);
  useEffect(() => { loadArtworks().then(setArtworks); }, []);
  /* 読み込んだヘッダーの絵を、控え（decoRefs）にも知らせておく。
     知らせないと、フォルダの絵の控えを作るときに、ヘッダーの控えを消してよいか分からない */
  useEffect(() => { loadHeaderBg().then((h) => { decoRefs.header = h || null; setHeaderBg(h); }); }, []);
  useEffect(() => { loadFolders().then((list) => { setFoldersState(list); syncFolderDeco(list); }); }, []);
  useEffect(() => { loadCaptions().then(setCaptions); }, []);
  useEffect(() => { loadTagMaster().then(setTagMaster); }, []);
  /* 読み込みが終わったら、起動中の覆いをふわっと外す。
     覆いは index.html 側にあるので、そこが用意した手だてを呼ぶだけ。
     アーティファクト版には覆いが無いので、無いときは何もしない */
  useEffect(() => {
    if (!loaded) return;
    if (typeof window !== "undefined" && typeof window.__ftHideSplash === "function") window.__ftHideSplash();
  }, [loaded]);
  useEffect(() => { loadPrefs().then(setPrefs); }, []);
  useEffect(() => { loadGarden().then(setGarden); }, []);
  useEffect(() => { loadTypeDesc().then(setTypeDesc); }, []);
  const saveTypeDesc = useCallback(async (d) => { setTypeDesc(d); return await persistTypeDesc(d); }, []);
  useEffect(() => { loadDraft().then((d) => { if (d && hasContent(d.rec)) setDraftSaved(d); }); }, []);

  /* 入力中の内容を控える。空っぽなら控えない */
  const handleAutoDraft = useCallback((rec) => {
    if (!rec || !hasContent(rec)) { clearDraft(); return; }
    persistDraft({ rec, savedAt: new Date().toISOString() });
  }, []);

  /* 書きかけの続きを開く */
  const resumeDraft = () => {
    if (!draftSaved) return;
    const rec = draftSaved.rec;
    const exists = records.some((r) => r.id === rec.id);
    setIsNew(!exists);
    setTypeLocked(!exists);
    setEditing(rec);
    setDraftSaved(null);
  };
  const discardDraft = () => { clearDraft(); setDraftSaved(null); };

  const saveHeaderBg = useCallback(async (src) => {
    const res = await persistHeaderBg(src || null);
    /* 画面には、置き場に入れたあとの姿（photo:番号）を持たせる。
       **元の data URL を持ち続けないこと。** 持ち続けると、書き出しや片づけで「使用中」と数えられず、
       いま出ている絵と置き場の中身が食い違う */
    if (!res || res.ok) setHeaderBg((res && res.src !== undefined ? res.src : src) || null);
    return res;
  }, []);

  const saveGarden = useCallback((g) => { setGarden(g); persistGarden(g); }, []);

  /* 種を植える（初回・植え替え・収穫後の新しいサイクル） */
  const plantFruit = useCallback((fruit) => {
    setGarden((g) => {
      const next = { ...g, cycle: { fruit, startedAt: todayStr(), harvested: false, pace: CURRENT_PACE } };
      persistGarden(next);
      return next;
    });
    setPickFruit(false);
  }, []);

  /* 熟した実をとる。図鑑に残してから、次の種のダイアログへ */
  const harvestFruit = useCallback(() => {
    setGarden((g) => {
      if (!g.cycle || g.cycle.harvested) return g;
      const rec = { id: uid(), fruit: g.cycle.fruit, date: todayStr(), startedAt: g.cycle.startedAt };
      const next = { cycle: { ...g.cycle, harvested: true }, harvests: [...(g.harvests || []), rec] };
      persistGarden(next);
      setHarvestOf(g.cycle.fruit);
      return next;
    });
  }, []);

  const unsavedNow = unsavedCount(records, prefs, folders);

  const markBackedUp = useCallback(() => {
    setPrefs((prev) => {
      const next = { ...prev, lastBackup: new Date().toISOString(), folderDeletes: [] };
      persistPrefs(next);
      return next;
    });
  }, []);

  const savePrefs = useCallback(async (next) => {
    const res = await persistPrefs(next);
    if (res.ok) setPrefs(next);
    return res;
  }, []);

  /* テーマカラーを画面全体へ反映する */
  useEffect(() => {
    const theme = THEMES.find((t) => t.key === prefs.theme) || THEMES[0];
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(`--th-${k}`, v));
  }, [prefs]);

  /* 選べるタグの一覧。
     一覧に登録した分と、記録に実際に付いている分を合わせて出す。
     こうしておけば、前の版から引き継いだ記録のタグも最初から選べる */
  const knownTags = useMemo(() => normalizeTags([...tagMaster, ...allTagsOf(records)]), [tagMaster, records]);
  /* 新しく作られたタグは一覧に控える。記録を消してもタグは選べるまま残る */
  /* タグの並び順を入れ替える。
     **画面に出ている全部を保存すること。**
     一覧（tagMaster）に無いタグ（記録から拾ったもの）を落とすと、
     せっかく並べ替えても、そのタグだけ最後尾に戻ってしまう */
  const reorderTags = useCallback((next) => {
    const list = normalizeTags(next);
    setTagMaster(list);
    persistTagMaster(list);
  }, []);

  const addTagToMaster = useCallback((t) => {
    setTagMaster((prev) => {
      const next = normalizeTags([...prev, t]);
      if (next.length !== prev.length) persistTagMaster(next);
      return next;
    });
  }, []);

  /* タグの名前を変える。一覧と記録の両方に同じことをすること。
     片方だけ直すと、記録に古い名前が残って食い違う */
  const renameTag = useCallback((from, to) => {
    setTagMaster((prev) => {
      const next = normalizeTags(prev.map((t) => (t === from ? to : t)));
      persistTagMaster(next);
      return next;
    });
    setRecords((prev) => prev.map((r) => ((r.tags || []).includes(from)
      ? { ...r, tags: normalizeTags(r.tags.map((t) => (t === from ? to : t))) } : r)));
    /* フォルダの「自動で集める」のタグも、同じ名前に付け替える。忘れると、そのフォルダが空になる */
    setFolders((prev) => (prev.some((f) => (f.tags || []).includes(from))
      ? prev.map((f) => ((f.tags || []).includes(from) ? { ...f, tags: normalizeTags(f.tags.map((t) => (t === from ? to : t))) } : f))
      : prev));
  }, []); // eslint-disable-line
  /* タグを消す。記録からも外すが、記録そのものは消さない */
  const deleteTag = useCallback((tag) => {
    setTagMaster((prev) => {
      const next = prev.filter((t) => t !== tag);
      persistTagMaster(next);
      return next;
    });
    setRecords((prev) => prev.map((r) => ((r.tags || []).includes(tag)
      ? { ...r, tags: r.tags.filter((t) => t !== tag) } : r)));
    setFolders((prev) => (prev.some((f) => (f.tags || []).includes(tag))
      ? prev.map((f) => ((f.tags || []).includes(tag) ? { ...f, tags: f.tags.filter((t) => t !== tag) } : f))
      : prev));
  }, []); // eslint-disable-line

  /* --- フォルダ --- */
  /* **フォルダを残す道は、かならずここを通すこと。** 保存と絵の控え（syncFolderDeco）をいっしょにする */
  const setFolders = useCallback((updater) => {
    setFoldersState((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persistFolders(next);
      return next;
    });
  }, []);
  const addFolder = (name, icon) => {
    const f = { ...emptyFolder(name), icon: icon || "", updatedAt: new Date().toISOString() };
    setFolders((prev) => [...prev, f]);
    return f;
  };
  /* 直した時刻（updatedAt）を書く。並び順の「更新順」と、バックアップを促す数に使う */
  const changeFolder = useCallback((f) => {
    const next = { ...f, updatedAt: new Date().toISOString() };
    setFolders((prev) => prev.map((x) => (x.id === f.id ? next : x)));
  }, [setFolders]);
  /* 固定の切り替えは「直した」に数えない（並びを変えるだけなので、更新順の先頭に来ないように） */
  const pinFolder = useCallback((f) => {
    setFolders((prev) => prev.map((x) => (x.id === f.id ? { ...x, pinned: !x.pinned } : x)));
  }, [setFolders]);
  const deleteFolder = useCallback((id) => {
    setFolders((prev) => prev.filter((x) => x.id !== id));
    setOpenFolderId((cur) => (cur === id ? null : cur));
    /* 消したことも「まだ書き出していない変更」に数える（消えたフォルダは一覧に無いので、時刻を見られない） */
    setPrefs((prev) => {
      const next = { ...prev, folderDeletes: [...(prev.folderDeletes || []), new Date().toISOString()].slice(-50) };
      persistPrefs(next);
      return next;
    });
  }, [setFolders]);
  const openFolder = openFolderId ? folders.find((f) => f.id === openFolderId) : null;

  const saveCaptions = useCallback(async (map) => {
    const res = await persistCaptions(map);
    if (res.ok) setCaptions(map);
    return res;
  }, []);

  const saveArtworks = useCallback(async (list) => {
    const res = await persistArtworks(list);
    if (res.ok) setArtworks(list);
    return res;
  }, []);

  useEffect(() => {
    try {
      let meta = document.querySelector('meta[name="robots"]');
      if (!meta) { meta = document.createElement("meta"); meta.setAttribute("name", "robots"); document.head.appendChild(meta); }
      meta.setAttribute("content", "noindex, nofollow");
    } catch (e) { /* noop */ }
  }, []);

  const setRecords = useCallback((updater) => {
    setRecordsState((prev) => { const next = typeof updater === "function" ? updater(prev) : updater; persistRecords(next); return next; });
  }, []);

  const openEdit = (r) => { setIsNew(false); setTypeLocked(false); setEditing(r); };
  const openNew = () => setTypePick(true);
  const startNewOfType = (t) => {
    setTypePick(false);
    setIsNew(true);
    setTypeLocked(true);
    setEditing(emptyRecord(t));
  };
  const closeForm = () => { setEditing(null); setIsNew(false); setTypeLocked(false); clearDraft(); setDraftSaved(null); };
  const [pasteRecord, setPasteRecord] = useState(false);
  const [importMsg, setImportMsg] = useState(null);
  /* 知らせを出すときは、前の消しタイマーを必ず止めること。
     止めないと、続けて操作したときに前のタイマーが新しい知らせを消してしまう */
  const importTimer = useRef(null);
  const tellImport = (text, ms = 4200) => {
    clearTimeout(importTimer.current);
    setImportMsg(text);
    importTimer.current = setTimeout(() => setImportMsg(null), ms);
  };
  useEffect(() => () => clearTimeout(importTimer.current), []);

  /* 最新バージョンに更新（2.12.0〜。上の fetchLatestVersion / installVersion）。
     updating ＝ null（何もしていない）／ "check"（確かめている）／ 版数の文字（その版へ入れ替えている）。
     **メニューは閉じないこと。** 行の下の字で、いまどこまで進んだかを見せる。
     結果の知らせは、取り込みの知らせ（tellImport）と同じ場所・同じ形で出す（メニューより上に出る） */
  const [updating, setUpdating] = useState(null);
  const updatingRef = useRef(false);
  const checkUpdate = async () => {
    if (updatingRef.current) return;
    updatingRef.current = true;
    setUpdating("check");
    let latest;
    try { latest = await fetchLatestVersion(); }
    catch (e) {
      updatingRef.current = false;
      setUpdating(null);
      tellImport("確認できませんでした。通信状態を確かめてください", 2600);
      return;
    }
    if (latest === APP_VERSION) {
      updatingRef.current = false;
      setUpdating(null);
      tellImport(`最新のバージョンです（v${APP_VERSION}）`, 2200);
      return;
    }
    setUpdating(latest);
    await installVersion(latest);
    /* **updatingRef を戻さないこと。** 読み込み直すまでのあいだに、もう一度押されても受けない */
    window.location.reload();
  };
  /* 人から受け取ったファイルを取り込む。
     **いまある記録は消さないこと。** 受け取った分を新しい記録として足すだけにする。
     idは必ず振り直す。送り手のidをそのまま使うと、
     たまたま同じidの記録を持っていた場合に上書きしてしまう */
  /* 人から受け取ったファイルを取り込む。
     ファイルそのものでも、読み終えた文字列でも受け取れるようにしてある。
     バックアップ画面からも同じ処理を使うため */
  const importOneFile = async (fileOrText) => {
    setTypePick(false);
    try {
      const text = typeof fileOrText === "string" ? fileOrText : await fileOrText.text();
      const incoming = recordsFromFile(text);
      /* **数え上げを setRecords の中でやらないこと。**
         あの中の処理は2回呼ばれることがあり、数がずれる（実際ずれた）。
         足すものを先に決めてから、まとめて渡す */
      const sameKey = (r) => [r.type, r.date || "", recordAllText(r)].join("\u0000");
      const known = new Set(records.map(sameKey));
      const add = [];
      let skipped = 0;
      incoming.forEach((raw) => {
        const rec = migrateRecord({ ...raw, id: uid() });
        delete rec.pinned; delete rec.bookmarked;
        rec.createdAt = rec.createdAt || new Date().toISOString();
        /* 更新日時は「取り込んだ時点」にする。これにより、最近の記録の並びで
           取り込んだ記録が一番上に来る（並び替えは updatedAt||createdAt を見ている） */
        rec.updatedAt = new Date().toISOString();
        /* 中身がそっくり同じものは足さない。同じファイルを二度取り込んだときのため */
        if (known.has(sameKey(rec))) { skipped += 1; return; }
        known.add(sameKey(rec));
        add.push(rec);
      });
      const added = add.length;
      /* 取り込んだ記録の写真も、置き場へ移してから足す（書き出したファイルには絵が中身のまま入っている） */
      if (added) Promise.all(add.map(stashPhotos)).then((list) => setRecords((prev) => [...list, ...prev]));
      /* 受け取った記録に付いていたタグも、選べるように控えておく */
      incoming.forEach((raw) => normalizeTags(raw.tags).forEach((t) => addTagToMaster(t)));
      tellImport(added > 0
        ? `${added}件の記録を取り込みました` + (skipped ? `（${skipped}件は同じ内容のため見送りました）` : "")
        : "同じ内容の記録がすでにあるため、取り込みませんでした");
      setTab("record");
    } catch (e) {
      tellImport("取り込めませんでした：" + (e && e.message ? e.message : "原因不明"));
    }
  };

  const openNewReading = (patch) => { setIsNew(true); setTypeLocked(true); setEditing({ ...emptyRecord("reading"), ...patch }); setTab("record"); };
  /* from を指定すると、その向きから画面が出てくる。
     指定しなければ、これまでどおり右から */
  const [viewingFrom, setViewingFrom] = useState("right");
  const openDetail = (r, from) => { setViewing(r); setViewingFrom(from === "bottom" ? "bottom" : "right"); };
  /* ピン留め・ブックマークの切り替え */
  const toggleMark = useCallback((id, key) => {
    setRecords((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: !r[key] } : r)));
    setViewing((prev) => (prev && prev.id === id ? { ...prev, [key]: !prev[key] } : prev));
  }, []);
  const closeDetail = () => setViewing(null);
  const editFromDetail = () => { openEdit(viewing); };
  const openBook = (book) => setViewingBook(book);
  const closeBook = () => setViewingBook(null);
  const closeDay = () => setViewingDay(null);
  /* 書ごとの記録一覧は閉じずに重ねる。戻ったとき、元の一覧に戻れるようにするため */
  const openDetailFromBook = (r) => openDetail(r);

  /* **記録を残す道は、かならずここを通すこと。**
     写真は先に置き場（IndexedDB）へ移し、記録には「photo:番号」だけを残す（stashPhotos）。
     通さずに setRecords すると、絵の中身が記録に入ったまま保存され、容量を使い切って記録ごと保存できなくなる */
  const commitSaveOrAdd = (rec) => {
    stashPhotos(rec).then((stashed) => {
      setRecords((prev) => { const exists = prev.some((p) => p.id === stashed.id); return exists ? prev.map((p) => (p.id === stashed.id ? stashed : p)) : [...prev, stashed]; });
      setViewing((prev) => (prev && prev.id === stashed.id ? stashed : prev));
    });
  };


  const handleSave = (rec, opts) => {
    /* 「今月・今年の聖句」を付け替えたとき、元の記録から外す。
       外すのは保存のときだけ。チェックした時点で外すと、
       そのあとキャンセルされたときに元の記録だけ印が消えてしまう */
    const steal = opts && opts.steal;
    if (steal && (steal.month || steal.year)) {
      setRecords((prev) => prev.map((r) => {
        let out = r;
        if (steal.month && r.id === steal.month) out = { ...out, monthYear: null, monthMonth: null };
        if (steal.year && r.id === steal.year) out = { ...out, themeYear: null };
        return out;
      }));
    }
    /* 途中保存：記録を残すだけで画面は閉じない。
       新規だった場合はここで実在の記録になるので、以後は同じ記録を上書きしていく */
    if (opts && opts.keepOpen) {
      const clean = rec.type === "memorization" ? { ...rec, text: truncateAtCitation(rec.text) } : rec;
      /* 同じ記録を上書きしていくので、何度押しても増えない。
         画面の状態（新規か編集か）はあえて変えない。
         ここで切り替えると入力欄が作り直され、打っている途中の
         カーソルが外れてしまうため */
      commitSaveOrAdd(clean);
      setViewing((prev) => (prev && prev.id === clean.id ? clean : prev));
      clearDraft();
      return;
    }
    if (rec.type === "memorization") {
      const cleanText = truncateAtCitation(rec.text);
      const cleanRec = { ...rec, text: cleanText };
      const ref = primaryRef(cleanText);
      const dup = ref && records.find((m) => m.type === "memorization" && m.id !== rec.id && sameRef(primaryRef(m.text), ref));
      if (dup) { setDupState({ pending: cleanRec, existing: dup, fromForm: true }); return; }
      commitSaveOrAdd(cleanRec); closeForm();
      setViewing((prev) => (prev && prev.id === cleanRec.id ? cleanRec : prev));
        return;
    }
    commitSaveOrAdd(rec); closeForm();
    setViewing((prev) => (prev && prev.id === rec.id ? rec : prev));
  };
  /* まとめて削除（探す画面の選ぶモード）。写真の片づけもここを通す */
  const handleDeleteMany = (ids) => {
    const gone = new Set(ids);
    setRecords((prev) => {
      const next = prev.filter((p) => !gone.has(p.id));
      sweepPhotos({ records: next, headerBg: headerBgRef.current, folders: foldersRef.current });
      return next;
    });
    setViewing((prev) => (prev && gone.has(prev.id) ? null : prev));
  };
  const handleDelete = (id) => {
    setRecords((prev) => {
      const next = prev.filter((p) => p.id !== id);
      /* 消した記録に付いていた写真を、置き場からも片づける。
         **いま描かれている records を渡さないこと**（消す前の一覧なので、何も片づかない） */
      sweepPhotos({ records: next, headerBg: headerBgRef.current, folders: foldersRef.current });
      return next;
    });
    closeForm();
    setViewing((prev) => (prev && prev.id === id ? null : prev));
  };

  const handleRestore = async (importedRecords, importedArtworks, importedGarden, importedTags, importedSetting) => {
    /* 読み込んだ記録は、もう書き出し済みのもの。
       そのままだと「まだ書き出していない記録が…」と促してしまい、
       同じ内容をもう一度書き出すことになる。
       読み込んだ時刻を「最後に書き出した日」として控えておく */
    const restoredAt = new Date().toISOString();
    /* 画面の設定を戻す。入っていない項目は今のまま残すこと */
    if (importedSetting) {
      if (importedSetting.prefs) {
        await savePrefs({ ...prefs, ...importedSetting.prefs, lastBackup: restoredAt, folderDeletes: [] });
      } else {
        await savePrefs({ ...prefs, lastBackup: restoredAt, folderDeletes: [] });
      }
      if (importedSetting.captions) await saveCaptions({ ...captions, ...importedSetting.captions });
      if (importedSetting.headerBg) await saveHeaderBg(importedSetting.headerBg);
      /* フォルダは足し合わせる（同じ番号のものだけ差し替える）。今あるフォルダを消さないこと */
      if (Array.isArray(importedSetting.folders) && importedSetting.folders.length) {
        const incoming = importedSetting.folders.map(migrateFolder).filter(Boolean);
        setFolders((prev) => {
          const map = new Map(prev.map((f) => [f.id, f]));
          incoming.forEach((f) => map.set(f.id, f));
          return Array.from(map.values());
        });
      }
      if (importedSetting.typeDesc) {
        await saveTypeDesc({
          name: { ...typeDesc.name, ...(importedSetting.typeDesc.name || {}) },
          desc: { ...typeDesc.desc, ...(importedSetting.typeDesc.desc || {}) },
        });
      }
    } else {
      await savePrefs({ ...prefs, lastBackup: restoredAt, folderDeletes: [] });
    }
    /* タグの一覧は足し合わせる。今ある分を消さないこと */
    if (Array.isArray(importedTags) && importedTags.length) {
      setTagMaster((prev) => {
        const next = normalizeTags([...prev, ...importedTags]);
        if (next.length !== prev.length) persistTagMaster(next);
        return next;
      });
    }
    const stashed = await Promise.all(importedRecords.map(async (r) => (r && r.id ? await stashPhotos(migrateRecord(r)) : null)));
    setRecords((prev) => {
      const map = new Map(prev.map((r) => [r.id, r]));
      stashed.forEach((m) => { if (m) map.set(m.id, m); });
      return Array.from(map.values());
    });
    if (Array.isArray(importedArtworks) && importedArtworks.length) {
      const map = new Map(artworks.map((a) => [a.id, a]));
      importedArtworks.forEach((a) => { if (a && a.id && a.src) map.set(a.id, a); });
      await saveArtworks(Array.from(map.values()).slice(0, ART_MAX));
    }
    /* 果樹の記録。古い形式のファイルには入っていないので、その時は今のまま残す */
    if (importedGarden && typeof importedGarden === "object") {
      const cyc = importedGarden.cycle;
      const next = {
        cycle: cyc && cyc.fruit && cyc.startedAt ? cyc : garden.cycle,
        harvests: Array.isArray(importedGarden.harvests)
          ? Array.from(new Map([...(garden.harvests || []), ...importedGarden.harvests]
              .filter((h) => h && h.fruit && h.date).map((h) => [h.id || h.date + h.fruit, h])).values())
          : (garden.harvests || []),
      };
      saveGarden(next);
    }
  };

  if (!loaded) {
    /* ここは起動中の覆い（index.html の #splash）に隠れているので、
       中身は見えない。覆いと同じ色にしておき、外れる瞬間に色が変わらないようにする */
    return <div className="min-h-screen" style={{ background: "#F2FAFE" }} />;
  }

  /* メニューから画面へ移る（2.10.0〜。姉妹アプリ My手帳 2.20.6 と同じ動き）。
     1. 板はその場に残し、移った先の画面の下へ沈める（menuUnder）
     2. 移った先の画面を、ほかの全画面より上（menuLift）に、右から入れる。板と、いま出ている画面にかぶさっていく
     3. 入りきったら（data-ft-entered が付いたら）、隠れた板と、下に残った画面を閉じる
     **いま出ている画面を先に閉じないこと。** 入ってくる途中の左側に、ひとつ下の画面（ホームなど）がのぞく。
     **板をその場で消さないこと**（2.9.1 まで）。板がパッと消えてから画面が入ってきて、ぎこちない。
     **板を右へ滑らせないこと。** 入ってくる画面と逆向きにすれ違う。
     **画面を増やしたら、MENU_SCREENS と finish の閉じる行の両方に足し、
     その画面の OverlayScreen に zIndex を渡すこと**（zIndex={menuLift === "…" ? MENU_LIFT_Z : undefined}）。
     閉じ忘れると、その画面が下に残ったままになり、戻ったときに前の画面が出てくる */
  const MENU_SCREENS = {
    art: { isOpen: artOpen, open: () => setArtOpen(true), close: () => setArtOpen(false) },
    bookmark: { isOpen: bookmarkOpen, open: () => setBookmarkOpen(true), close: () => setBookmarkOpen(false) },
    garden: { isOpen: gardenOpen, open: () => setGardenOpen(true), close: () => setGardenOpen(false) },
    tags: { isOpen: tagsOpen, open: () => setTagsOpen(true), close: () => setTagsOpen(false) },
    backup: { isOpen: backupOpen, open: () => setBackupOpen(true), close: () => setBackupOpen(false) },
    help: { isOpen: helpOpen, open: () => setHelpOpen(true), close: () => setHelpOpen(false) },
  };
  const goFromMenu = (key) => {
    /* 移っている途中に、もう一度押されたぶんは受けない */
    if (menuGoTimer.current) return;
    const target = MENU_SCREENS[key];
    /* いま見ている画面を選んだ → 移らない。板をふつうに閉じる（右へ滑る） */
    if (target.isOpen && !viewing) {
      setMenuInstant(false);
      setMenuOpen(false);
      return;
    }
    /* 選んだ画面が、いま見ている画面（記録の閲覧）の下にもう開いている（2.11.2〜）。
       例：ブックマーク → 記録を開く → 三本線 → ブックマーク。
       そのまま持ち上げると、すでに入りきった画面がいきなりいちばん上に出て、
       右から入ってこずにパッと切り替わっていた。
       下の画面はいったん閉じ（閲覧画面に隠れているので見えない）、開き直して、ほかの画面と同じく右から入れる。
       開き直すまでのあいだの二度押し・三本線は受けない（menuGoTimer に印を置く） */
    if (target.isOpen) {
      menuGoTimer.current = "relaunch";
      target.close();
      setMenuRelaunch(key);
      return;
    }
    setMenuUnder(true);
    setMenuLift(key);
    target.open();
    /* **時間を決め打ちで待たないこと。** iPhone が重いと動きの始まりが遅れ、
       入りきる前に下の板と画面が消えて、ホームがのぞく。
       入りきった印（data-ft-entered）が付くまで待つ。付かない端末のために上限（1.5秒）も置く */
    const started = Date.now();
    const entered = () => !!document.querySelector("[data-ft-lift] > .anim-right[data-ft-entered]");
    const finish = () => {
      menuGoTimer.current = null;
      setMenuOpen(false);
      if (key !== "art") setArtOpen(false);
      if (key !== "bookmark") setBookmarkOpen(false);
      if (key !== "garden") setGardenOpen(false);
      if (key !== "tags") setTagsOpen(false);
      if (key !== "backup") setBackupOpen(false);
      if (key !== "help") setHelpOpen(false);
      setViewing(null);
      setViewingBook(null);
      setViewingDay(null);
      setOpenFolderId(null);
      setMenuLift(null);
    };
    const wait = () => {
      if (motionIsOff() || entered() || Date.now() - started > 1500) { finish(); return; }
      menuGoTimer.current = setTimeout(wait, 50);
    };
    menuGoTimer.current = setTimeout(wait, motionIsOff() ? 0 : FT_EXIT_RIGHT_MS);
  };
  goFromMenuRef.current = goFromMenu;
  /* 三本線を押したとき。**instant と under を戻すのは、ここ（次に開くとき）。移る途中で戻さないこと。**
     戻すと、板が一瞬いちばん上に戻って、移った先の画面の上にちらつく */
  const openMenu = () => {
    /* 画面へ移っている途中は開かない（すぐ閉じられてしまう） */
    if (menuGoTimer.current) return;
    setMenuInstant(false);
    setMenuUnder(false);
    setMenuOpen(true);
  };

  return (
    <ArtworkContext.Provider value={artworks}>
    <PrefsContext.Provider value={prefs}>
    <UnsavedContext.Provider value={unsavedNow}>
    <TypeNameContext.Provider value={typeDesc.name}>
    <MenuContext.Provider value={openMenu}>
    {/* ft-root ＝ 動きの効き先。「動きの演出」を切ると ft-still が付いて、すべて止まる */}
    <div className={"ft-shell ft-page font-sans text-neutral-900 ft-root "
      + (headerBgUrl ? "ft-hasbg " : "")
      + (prefs.motion === false ? "ft-still " : "")
      + ("ft-font-" + (prefs.fontSize || "s"))}
      /* **headerBg（photo:番号）をそのまま url() に入れないこと。** 絵は置き場にあるので出ない。
         usePhotoSrc で中身に直してから敷く */
      style={headerBgUrl ? { "--ft-hdrbg": `url(${JSON.stringify(headerBgUrl).slice(1, -1)})` } : undefined}>
      <style>{`
        /* **@import は、この塊のいちばん先頭に置くこと。**
           前に別の指定があると、ブラウザはこの行を読み飛ばし、
           文字が用意した書体にならない */
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap');
        /* **画面ぜんたいを「高さの決まった箱」にしないこと。**
           dvh で高さを決める作りも、position:fixed の inset:0 で留める作りも、
           JSで実測して当てる作りも試した。どれも端末によって下のはしが画面と
           食い違い、見出しが時計に重なったり、下に別の色の帯が出たりした。
           姉妹アプリ（My手帳）も同じ道をたどって、この形に戻している。
           ふつうに縦へ伸びる箱にして、画面ごと送ること */
        .ft-shell { min-height: 100vh; }

        /* **body の色は、下の帯と同じ白にすること。**
           ホーム画面に追加したアプリでは、いちばん下の細い帯（ホームバーのところ）を
           iPhone が body の色で塗る。起動中の覆いに合わせた水色のままだと、
           そこだけ水色の帯が出たままになる（実際そうなっていた）。
           ここは覆いが外れたあとに効くので、起動時に白く光ることはない */
        html, body { background: #FFFFFF; }

        /* 下の帯の厚み。**右下のボタンや逃げ場は、必ずこれを見て決めること。**
           数字を書き写すと、帯の厚みを変えたときに置いていかれて、
           ボタンだけ高い場所に浮いたままになる */
        :root { --ft-nav-h: calc(57px + env(safe-area-inset-bottom)); } /* 中身56 ＋ 上の線1 */
        .ft-tabbar-wrap { padding-bottom: env(safe-area-inset-bottom); }
        /* **タブの高さは min-height ではなく height で留めること。**
           min-height だと中身しだいで数pxふくらみ、--ft-nav-h と食い違う。
           食い違うと、メニューの下の段だけ高さがずれて見える */
        .ft-tabbar-wrap .ft-tabbtn { height: 56px; min-height: 56px; padding-top: 6px; padding-bottom: 6px; }
        /* **下の帯だけは、文字の大きさの設定でふくらませないこと。**
           ここが厚くなると、記録を見せる場所がそのぶん減るうえ、
           右下のボタンが帯に重なる（実際そうなっていた）。
           字も行の高さも、いつも同じにしておく */
        .ft-tabbar-wrap .ft-tabbtn span { font-size: 11.5px !important; line-height: 1.35; }
        /* 下の帯に隠れないための逃げ場。**画面ごとに数字を書かないこと** */
        .ft-pad-nav { padding-bottom: calc(env(safe-area-inset-bottom) + 76px); }
        /* 下の帯と、その上に浮く丸ボタンのぶんまで空ける */
        .ft-pad-fab { padding-bottom: calc(env(safe-area-inset-bottom) + 152px); }

        /* ヘッダの背景に置いた絵。
           **絵の上には黒い膜をかけ、文字は白にすること。**
           絵をそのまま敷くと、写真の濃いところで見出しや三本線が沈む。
           白い膜＋黒文字も試したが、写真の明るいところで同じことが起きた。
           黒い膜のほうが、どんな写真でも白い文字が浮いて見える
           （姉妹アプリ My手帳 の写真ヘッダと同じ考えかた）。
           膜は下へ行くほど濃くして、見出しの並ぶあたりを確実に暗く保つ */
        /* 上に留める見出しと帯（TopChrome）。重なり順は、下の帯（z-30）より下、重なる画面（z-50）より下 */
        .ft-topchrome { position: fixed; top: 0; left: 0; right: 0; z-index: 20; }
        .ft-hdr { position: relative; }
        .ft-hdr > * { position: relative; z-index: 1; }
        .ft-hasbg .ft-hdr::before {
          content: ""; position: absolute; inset: 0; z-index: 0;
          background-image: linear-gradient(180deg, rgba(0,0,0,.34), rgba(0,0,0,.56)), var(--ft-hdrbg);
          background-size: cover, cover; background-position: center, center; background-repeat: no-repeat, no-repeat;
        }
        /* 文字も印も白くする。
           **自前の下地を持つボタンには ft-onbg-keep を付けて、ここから外すこと。**
           外さないと、明るい下地の上に白い字が乗って読めなくなる */
        .ft-hasbg .ft-hdr h1,
        .ft-hasbg .ft-hdr h2,
        .ft-hasbg .ft-hdr [class*="text-neutral-"]:not(.ft-onbg-keep),
        .ft-hasbg .ft-hdr [class*="text-th-"]:not(.ft-onbg-keep) {
          color: #FFFFFF;
        }
        /* 見出しと印は、写真の明るいところでも沈まないよう、うっすら影を落とす */
        .ft-hasbg .ft-hdr h1, .ft-hasbg .ft-hdr h2, .ft-hasbg .ft-hdr .ft-hdr-title {
          text-shadow: 0 1px 3px rgba(0,0,0,.45);
        }
        .ft-hasbg .ft-hdr svg { filter: drop-shadow(0 1px 2px rgba(0,0,0,.45)); }
        .ft-hasbg .ft-hdr .ft-onbg-keep svg { filter: none; }
        /* 下の区切り線と、押したときの下地も白側にそろえる */
        .ft-hasbg .ft-hdr { border-color: rgba(255,255,255,.28); }
        /* :hover はマウスのある端末だけ（タッチ端末では、押したあとも色が残り続けるため） */
        @media (hover: hover) and (pointer: fine) {
          .ft-hasbg .ft-hdr button:not(.ft-onbg-keep):hover { background-color: rgba(255,255,255,.14); }
        }

        /* 太字は600まで。見出しも Tailwind の font-bold（700）も、ここでゆるめる。
           重い字が並ぶと、それだけで画面が固く見える */
        .font-display { font-family: 'Noto Sans JP', sans-serif; font-weight: 600; letter-spacing: .01em; }
        .font-bold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        .font-semibold { font-weight: 600; }
        .font-sans, body { font-family: 'Noto Sans JP', sans-serif; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .btn-h { min-height: 40px; }
        /* 1行ぶんの入力欄の高さ。ひと組で並ぶ「名前」と「説明」のように、
           1行の入力欄（input）と書き足せる欄（textarea）の高さをそろえるために使う */
        .ft-h-field { min-height: 48px; }

        /* タップの質を上げるための共通設定。
           - 押したときの青い枠や灰色の膜（端末が勝手に出すもの）を消す
           - 押した瞬間に反応するよう、待ち時間をなくす
           - 文字が選択されてしまい、押した感じが濁るのを防ぐ */
        button, [role="button"], [role="switch"], [role="tab"], summary, label, a {
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        /* フォーカスの枠は「キーボードで動かしているとき」だけ出す（:focus-visible）。
           指やマウスで押したときに枠や色が残らないよう、:focus だけでは何も出さない。
           押したあとにフォーカスそのものを外す処理は installTapBlur（JS）にある。
           **ボタンに focus: の色（Tailwind の focus:bg-… など）を付けないこと。** 付けるなら focus-visible: にする */
        button:focus, [role="button"]:focus, [role="switch"]:focus, [role="tab"]:focus, summary:focus, a:focus { outline: none; }
        button:focus-visible, [role="button"]:focus-visible, [role="switch"]:focus-visible,
        [role="tab"]:focus-visible, summary:focus-visible, a:focus-visible {
          outline: 2px solid var(--th-700, #0F766E); outline-offset: 2px;
        }
        button { -webkit-user-select: none; user-select: none; }
        /* **画面ぜんたいで、字を選べないようにしておくこと（2.8.3〜。My手帳 と同じ決まり）。**
           長押しで動く部品（フォルダの札・探す結果の札など）だけを「選べない」にしても、
           iPhone は長押しのときに、その外側の選べるところ（＝画面ぜんたい）を選んでしまい、まっ青に反転する。
           また、押さえたまま字を選び始めると指を取り上げられ（pointercancel）、長押しそのものが届かないことがある。
           ・-webkit- 付きも必ず書くこと。iPhone の Safari は user-select だけでは効かない
             （Tailwind の select-none は、組み立てで -webkit- を付けていないので効いていなかった）
           ・長押しで出る「コピー／調べる」の吹き出し（touch-callout）も止める */
        .ft-root { -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; }
        /* **書くところと、読ませる本文は、選べるように戻すこと。** 打った字を直せなくなるし、聖句や学びを写せなくなる。
           本文の入れ物には ft-text を付ける（記録の閲覧画面・ちょっと見る小窓）。新しく「読ませる本文」を置いたら付けること */
        .ft-root input, .ft-root textarea, .ft-root [contenteditable="true"], .ft-root .ft-text {
          -webkit-user-select: text; user-select: text; -webkit-touch-callout: default;
        }
        /* 本文の中でも、押して動くもの（ボタン）は選べないまま */
        .ft-root .ft-text button { -webkit-user-select: none; user-select: none; }
        /* 絵は、つまんで運んだり「写真を保存」の吹き出しを出したりしない（送ろうとして固まるのを防ぐ） */
        .ft-root img { -webkit-user-drag: none; -webkit-touch-callout: none; }
        /* **入力欄にも既定のタップハイライトを消しておくこと。** 上の一覧に input / textarea が無いと、
           文章の途中にカーソルを動かそうとタップするたびに、iOS 既定の半透明の黒い膜が欄いっぱいに一瞬乗る。
           フォーカスの枠は focus:ring-…（inputCls）で出しているので、消しても見た目は変わらない */
        input, textarea { -webkit-tap-highlight-color: transparent; }
        /* 押している間は、離した後より速く反応させる（沈むのは速く、戻りはゆっくり） */
        button:active { transition-duration: 60ms; }

        /* 画面の切り替わりを、さりげなく伝えるための動き。
           大きく動かすと画面が揺れて煩わしいので、10px前後・0.2秒に抑えている。
           端末側で「視差効果を減らす」設定になっている場合は動かさない */
        @keyframes ft-fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes ft-fade-out { from { opacity: 1; } to { opacity: 0; } }
        /* 重なって出る画面：右から出て、右へ戻る */
        @keyframes ft-right-in  { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes ft-right-out { from { transform: translateX(0); } to { transform: translateX(100%); } }
        /* 記録の入力画面：下から出て、下へ消える */
        @keyframes ft-up-in    { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes ft-down-out { from { transform: translateY(0); } to { transform: translateY(100%); } }
        @keyframes ft-sheet-down { from { transform: translateY(0); } to { transform: translateY(100%); } }
        @keyframes ft-spin { to { transform: rotate(360deg); } }
        /* 今日の記録が入った日の、木のきらめき。ゆっくり瞬く */
        @keyframes ft-twinkle {
          0%, 100% { opacity: 0.30; transform: scale(0.78); }
          45%      { opacity: 1;    transform: scale(1.12); }
          70%      { opacity: 0.72; transform: scale(0.95); }
        }
        .ft-sparkle { animation: ft-twinkle 2.6s ease-in-out infinite;
                      transform-origin: center; transform-box: fill-box; }
        @keyframes ft-pop { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        /* 下から出るシート：いったん少し行き過ぎて、定位置に戻る */
        @keyframes ft-sheet-up {
          0%   { transform: translateY(100%); }
          72%  { transform: translateY(-8px); }
          88%  { transform: translateY(2px); }
          100% { transform: translateY(0); }
        }

        /* fill-mode は backwards にすること。both だと終わったあとも transform が残り、
           中にある position:fixed の要素（ダイアログなど）の位置の基準がずれてしまう */
        /* 右から入る画面と、右へ戻る画面（2.10.0〜。姉妹アプリ My手帳 と同じ長さ・ゆるめ方）。
           **退場は登場と対にすること。** 長さは FT_EXIT_RIGHT_MS（300）と必ず同じにする。
           暗がり（anim-scrim-out-push）も同じ長さで薄れさせる。短いと、画面が出きる前に暗がりだけ消える */
        .anim-right     { animation: ft-right-in 0.3s cubic-bezier(0.22,1,0.36,1) backwards; }
        .anim-right-out { animation: ft-right-out 0.3s cubic-bezier(0.55,0,0.68,0.53) forwards; }
        .anim-scrim-out-push { animation: ft-fade-out 0.3s cubic-bezier(0.55,0,0.68,0.53) forwards; }
        .anim-up        { animation: ft-up-in 0.28s cubic-bezier(0.22,1,0.36,1) backwards; }
        .anim-down-out  { animation: ft-down-out 0.24s cubic-bezier(0.55,0,0.68,0.53) forwards; }
        .anim-sheet     { animation: ft-sheet-up 0.36s cubic-bezier(0.33,1,0.5,1) backwards; }
        .anim-sheet-out { animation: ft-sheet-down 0.24s cubic-bezier(0.55,0,0.68,0.53) forwards; }
        .anim-fade      { animation: ft-fade-in 0.2s ease-out backwards; }
        .anim-fade-out  { animation: ft-fade-out 0.2s ease-out forwards; }
        .anim-pop       { animation: ft-pop 0.26s cubic-bezier(0.34,1.4,0.5,1) backwards; }
        .spin           { animation: ft-spin 0.75s linear infinite; }
        .no-anim, .no-anim * { animation: none !important; }

        /* ============================================================
           手ざわりの演出
           押したときの沈み、現れるときのひと呼吸、開いた合図など。
           どれも「数px・0.2〜0.4秒」に収めてある。大きく動かすと
           画面が揺れて煩わしくなるため、この範囲を超えないこと。
           ・fill-mode は必ず backwards（both だと終了後も transform が残り、
             中にある position:fixed の要素の位置の基準がずれる）
           ・動く入れ物の中に position:fixed の要素を置かないこと
           ============================================================ */

        /* --- 押した手ごたえ（全ボタン共通の土台） ---
           沈むのは速く（70ms）、戻りはゆっくり。これだけで指に返る感じが出る。
           ボタンごとに書かず、必ずこのクラスを使うこと */
        .ft-tap { transition: transform 0.24s cubic-bezier(0.22,1,0.36,1), filter 0.22s ease-out; }
        .ft-tap:active { transform: scale(0.955); filter: brightness(0.95); transition-duration: 70ms; }
        /* 大きなカードは沈みを控えめに、小さなアイコンは深めにすると同じ強さに感じる */
        /* **カードには transform も filter も当てないこと。** 押した瞬間に札と中の写真が別の層に
           持ち上げられ、iPhone では、その上に置いた指の動きが送る箱に届かず、画面が送れなくなる。
           手ごたえは ::after の薄い膜だけで返す（濃さを変えるときは opacity のこの1か所だけ）。
           ::after に mix-blend-mode を付けないこと（同じ理由） */
        .ft-tap.ft-tap-card:active { transform: none; filter: none; }
        .ft-tap-card:not(.absolute):not(.fixed):not(.sticky) { position: relative; }
        .ft-tap-card::after { content: ""; position: absolute; inset: 0; border-radius: inherit; background: #000; opacity: 0; pointer-events: none; transition: opacity 0.2s ease-out; }
        .ft-tap-card:active::after, .ft-tap-card.ft-tap-pressed::after { opacity: 0.045; transition-duration: 60ms; }
        /* 押せる部品の中の絵や、本文のリンクを「つかめる」ままにしない。
           iPhoneは、絵やリンクの上で指を少し止めると「つまんで運ぶ」を始め、指の動きを取られて画面が送れなくなる */
        .ft-root button img, .ft-root a img { pointer-events: none; }
        .ft-root img { -webkit-user-drag: none; }
        .ft-link { -webkit-user-drag: none; -webkit-touch-callout: none; }
        /* 言葉で探したときの、当たった語の塗り。地はテーマ色の淡い一段 */
        .ft-hit { background: var(--th-200); color: inherit; border-radius: 3px; padding: 0 1px; }
        .ft-tap.ft-tap-icon:active { transform: scale(0.88); }
        .ft-tap:disabled { transform: none; filter: none; }
        /* 押されてから画面が変わるまでの、ひと呼吸のあいだ沈めておく状態。
           ここは素早く暗くする。既定の0.24秒のままだと、
           暗くなりきる前に画面が切り替わってしまい、押した手ごたえが見えない */
        .ft-tap-pressed { transform: scale(0.96); filter: brightness(0.9); transition-duration: 45ms; }
        .ft-tap-card.ft-tap-pressed { transform: none; filter: none; }

        /* --- ぽん、と現れる（チップ・チェックなど小さな部品） --- */
        @keyframes ft-bloom { 0% { opacity: 0; transform: scale(0.7); } 100% { opacity: 1; transform: scale(1); } }
        .ft-chip { animation: ft-bloom 0.26s cubic-bezier(0.34,1.45,0.5,1) backwards; }

        /* --- そっと立ち上がる（各タブの中身） --- */
        @keyframes ft-rise { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }
        .ft-rise { animation: ft-rise 0.28s cubic-bezier(0.22,1,0.36,1) backwards; }
        /* タブの入れ物そのものは、透明度だけで切り替える。
           ここで位置を動かすと、中の sticky なヘッダがぶれてしまう */
        .ft-tabswap { animation: ft-fade-in 0.2s ease-out backwards; }

        /* --- ホームの聖句を「今月／今年」で入れ替えるとき ---
           押した側から中身がすっと入ってくる。
           下のタブの切り替え（ft-tabswap）と同じ調子にし、
           動く量は控えめにしてある。カードの中だけの入れ替えなので、
           大きく動かすと落ち着かない */
        @keyframes ft-swap-r { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: none; } }
        @keyframes ft-swap-l { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: none; } }
        .ft-swap-r { animation: ft-swap-r 0.26s cubic-bezier(0.22,1,0.36,1) backwards; }
        .ft-swap-l { animation: ft-swap-l 0.26s cubic-bezier(0.22,1,0.36,1) backwards; }

        /* --- 下のタブ：選んだアイコンが軽く弾み、下線が伸びる --- */
        @keyframes ft-tabpop { 0% { transform: scale(1); } 34% { transform: scale(1.24); } 100% { transform: scale(1); } }
        .ft-tabpop { animation: ft-tabpop 0.38s cubic-bezier(0.34,1.3,0.5,1) backwards; }
        /* 下線は左右中央に寄せる指定（translateX(-50%)）が既に入っている。
           それを書き足しておかないと、伸びている間だけ左へずれてしまう */
        @keyframes ft-tabbar {
          from { transform: translateX(-50%) scaleX(0.1); opacity: 0.3; }
          to   { transform: translateX(-50%) scaleX(1);   opacity: 1; }
        }
        .ft-tabbar { animation: ft-tabbar 0.32s cubic-bezier(0.22,1,0.36,1) backwards; }

        /* --- ＋ボタン：記録タブに来たとき、くるりと出てくる --- */
        @keyframes ft-fab-in {
          0%   { opacity: 0; transform: scale(0.5) rotate(-90deg); }
          62%  { opacity: 1; transform: scale(1.09) rotate(8deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        .ft-fab { animation: ft-fab-in 0.44s cubic-bezier(0.3,1.2,0.4,1) backwards; }

        /* --- 保存できたときの、ひと粒の波紋 --- */
        @keyframes ft-ring { 0% { opacity: 0.5; transform: scale(0.72); } 100% { opacity: 0; transform: scale(2.2); } }
        .ft-ring { animation: ft-ring 0.62s cubic-bezier(0.22,1,0.36,1) forwards; }

        /* --- 目印（ピン・ブックマーク）を付けた瞬間 --- */
        @keyframes ft-mark {
          0% { transform: scale(1); } 28% { transform: scale(0.82); }
          64% { transform: scale(1.18); } 100% { transform: scale(1); }
        }
        .ft-mark { animation: ft-mark 0.44s cubic-bezier(0.34,1.2,0.5,1) backwards; }

        /* --- 折りたたみを開いたとき ---
           ft-open は透明度だけ。中にドラム（position:fixed のシート）がある場所で使う。
           ft-open-y はわずかに上から降りてくる。中に fixed が無い場所だけで使うこと */
        .ft-open   { animation: ft-fade-in 0.22s ease-out backwards; }
        @keyframes ft-open-y { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: none; } }
        .ft-open-y { animation: ft-open-y 0.24s cubic-bezier(0.22,1,0.36,1) backwards; }

        /* --- ▽印の回転。ばね気味にすると開閉が楽しくなる --- */
        .ft-chev { transition: transform 0.34s cubic-bezier(0.34,1.45,0.5,1); }
        .ft-chev-on { transform: rotate(180deg); }

        /* --- 順にひょいひょい現れる（シートの行・メニューの行・検索結果） --- */
        @keyframes ft-stagger { from { opacity: 0; transform: translateY(9px); } to { opacity: 1; transform: none; } }
        .ft-seq > * { animation: ft-stagger 0.32s cubic-bezier(0.22,1,0.36,1) backwards; }
        .ft-seq > *:nth-child(1) { animation-delay: 0.02s; }
        .ft-seq > *:nth-child(2) { animation-delay: 0.05s; }
        .ft-seq > *:nth-child(3) { animation-delay: 0.08s; }
        .ft-seq > *:nth-child(4) { animation-delay: 0.11s; }
        .ft-seq > *:nth-child(5) { animation-delay: 0.14s; }
        .ft-seq > *:nth-child(6) { animation-delay: 0.17s; }
        .ft-seq > *:nth-child(7) { animation-delay: 0.20s; }
        .ft-seq > *:nth-child(n+8) { animation-delay: 0.22s; }

        /* --- カレンダーの日めくり。押した向きへ紙が送られるように --- */
        @keyframes ft-page-l { from { opacity: 0; transform: translateX(16px); } to { opacity: 1; transform: none; } }
        @keyframes ft-page-r { from { opacity: 0; transform: translateX(-16px); } to { opacity: 1; transform: none; } }
        .ft-page-l { animation: ft-page-l 0.26s cubic-bezier(0.22,1,0.36,1) backwards; }
        .ft-page-r { animation: ft-page-r 0.26s cubic-bezier(0.22,1,0.36,1) backwards; }
        /* 選んだ日にちが、ぽんと前に出る */
        @keyframes ft-daypop { 0% { transform: scale(0.72); } 58% { transform: scale(1.1); } 100% { transform: scale(1); } }
        .ft-daypop { animation: ft-daypop 0.34s cubic-bezier(0.34,1.3,0.5,1) backwards; }

        /* --- 果樹 --- */
        /* 画面に出るとき、根から立ち上がるように */
        @keyframes ft-grow { from { opacity: 0; transform: scale(0.94) translateY(8px); } to { opacity: 1; transform: none; } }
        .ft-grow { animation: ft-grow 0.55s cubic-bezier(0.22,1,0.36,1) backwards; }
        /* 収穫できるときだけ、木がゆっくり息をして「押せる」ことを伝える */
        @keyframes ft-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.035); } }
        .ft-breathe { animation: ft-breathe 3.4s ease-in-out infinite; transform-origin: 50% 90%; }

        /* ============================================================
           文字の大きさ（小・中・大）
           クラス名ごとに大きさを上書きする形にしている。
           画面のあちこちに書かれた text-[…] を全部書き換えるのは現実的でなく、
           ここ1か所で切り替えられるほうが取り違えが起きない。
           **入力欄（.ft-input）は対象にしない。**
           16pxより小さいとiPhoneが勝手に画面を拡大してしまうため、常に16pxに固定する
           ============================================================ */
        .ft-input { font-size: 16px; }

        /* 文字の大きさ「中」。小さい字はしっかり、もともと大きい見出しは控えめに増やす。
           全部を同じ倍率で拡げると、見出しが画面の幅に収まらなくなる */
        .ft-font-m .text-\\[11\\.5px\\] { font-size: 13px; }
        .ft-font-m .text-\\[12\\.5px\\] { font-size: 14px; }
        .ft-font-m .text-\\[13\\.5px\\] { font-size: 15.5px; }
        .ft-font-m .text-\\[14\\.5px\\] { font-size: 16.5px; }
        .ft-font-m .text-\\[15\\.5px\\] { font-size: 17.5px; }
        .ft-font-m .text-\\[16px\\] { font-size: 17px; }
        .ft-font-m .text-\\[17px\\] { font-size: 18.5px; }
        .ft-font-m .text-\\[18px\\] { font-size: 19.5px; }
        .ft-font-m .text-\\[20px\\] { font-size: 22px; }
        .ft-font-m .text-\\[24px\\] { font-size: 26px; }
        .ft-font-m .text-\\[26px\\] { font-size: 28px; }
        .ft-font-m .text-\\[27px\\] { font-size: 29px; }
        .ft-font-m .text-\\[28px\\] { font-size: 30px; }

        /* 文字の大きさ「大」。小さい字はしっかり、もともと大きい見出しは控えめに増やす。
           全部を同じ倍率で拡げると、見出しが画面の幅に収まらなくなる */
        .ft-font-l .text-\\[11\\.5px\\] { font-size: 15px; }
        .ft-font-l .text-\\[12\\.5px\\] { font-size: 16px; }
        .ft-font-l .text-\\[13\\.5px\\] { font-size: 17.5px; }
        .ft-font-l .text-\\[14\\.5px\\] { font-size: 19px; }
        .ft-font-l .text-\\[15\\.5px\\] { font-size: 20px; }
        .ft-font-l .text-\\[16px\\] { font-size: 18.5px; }
        .ft-font-l .text-\\[17px\\] { font-size: 20px; }
        .ft-font-l .text-\\[18px\\] { font-size: 21px; }
        .ft-font-l .text-\\[20px\\] { font-size: 24px; }
        .ft-font-l .text-\\[24px\\] { font-size: 28px; }
        .ft-font-l .text-\\[26px\\] { font-size: 30.5px; }
        .ft-font-l .text-\\[27px\\] { font-size: 31.5px; }
        .ft-font-l .text-\\[28px\\] { font-size: 32.5px; }

        /* --- 下からせり上がる小窓 ---
           高さは dvh（いま実際に見えている高さ）で決めること。
           vh は iPhone だとブラウザの帯を含んだ高さになるため、
           画面より下に伸びてしまい、いちばん下のボタンが見えなくなる */
        /* margin: 0 は必ず付けること。
           小窓を「縦に間隔をあける入れ物（space-y-*）」の中に置くと、
           位置を決める指定とは別に外側の余白が足され、画面ぶんだけ下へずれる。
           探すの絞り込みで、いちばん下のボタンが隠れる原因になっていた */
        /* **高さを vh や dvh で決めないこと。** iPhone の「アプリ内ブラウザ」では、どちらも見えている高さと
           食い違うことがあり、紙の足もと（決定のボタン）が画面の外へ押し出される。上下を 0 で留めれば、
           いつでも見えている高さぴったりになる（姉妹アプリ My手帳 と同じ） */
        .ft-sheet-wrap { position: fixed; left: 0; right: 0; top: 0; bottom: 0; margin: 0; overflow: hidden; }
        /* **外わくは「切り取るだけで、送れない」形にすること（2.6.0〜）。**
           overflow: hidden の箱は、指では送れなくても、入力欄を見せるためにブラウザが送ることがある。
           紙の下の白（::after）が外わくの下へはみ出しているので、そこが送る余地になり、
           入力欄に触れた瞬間に紙と暗がりがまとめて上へずれたまま戻らない。
           overflow: clip は送る余地を作らない。使えない古い iPhone では installKeyboardInset が送られた外わくを 0 へ戻す */
        @supports (overflow: clip) { .ft-sheet-wrap { overflow: clip; } }
        /* 紙の外わくの外がわも白で埋める（[data-ft-overlay] と同じ）。影は外がわだけなので、中の見た目は変わらない */
        .ft-sheet-wrap { box-shadow: 0 0 0 100vmax #FFFFFF; }
        /* 入力欄に本物のフォーカスが入るまでのフォーカス枠（installKeyboardInset の showRing）。
           入力欄が持ち上がるあいだだけ付く。**カーソルの絵は描かないこと** */
        .ft-kb-pending-ring { border-color: var(--th-800) !important; box-shadow: 0 0 0 4px color-mix(in srgb, var(--th-800) 20%, transparent) !important; }
        /* 紙の下に白を伸ばしておく。**消さないこと。**
           紙がキーボードより先に上がりきったとき・遅れて下りるとき・見込みの高さが本当のキーボードより大きかったときに、
           紙の下とキーボードのあいだから暗がりと一覧がのぞく。
           ・紙の箱（下寄せの .relative.rounded-t-2xl）の真下に、画面の高さぶんの白を足す。紙が画面の下に
             ついているときは外わくの外なので見えない
           ・紙の箱に overflow: hidden を付けないこと（白が切れる）
           ・押しても何も起きない（pointer-events: none） */
        .ft-sheet-wrap.items-end > .relative.rounded-t-2xl::after { content: ""; position: absolute; left: 0; right: 0; top: calc(100% - 1px); height: 100vh; background: #FFFFFF; pointer-events: none; }
        /* 重なる画面。**overflow: hidden を消さないこと。** 入ってくる途中の画面が外へはみ出し、
           うしろが横や下へ送れてしまう。box-shadow は外わくの「外がわだけ」を白で埋める念のための備え
           （内がわは変えない。左端から払って戻るとき、うしろが見えるのはこれまでどおり） */
        [data-ft-overlay] { overflow: hidden; box-shadow: 0 0 0 100vmax #FFFFFF; }
        /* ---- 全画面・ページとキーボード（2.6.0〜。姉妹アプリ My手帳 2.16.4〜 と同じ作り） ----
           ・送れる余地：入力欄をこちらでキーボードの上へ持ち上げるあいだ、送り場の最後にキーボードの高さぶんの
             空きを足しておく（見た目は動かない）。::after にしているのは、画面ごとに違う pb-* / py-* を上書きしないため
           ・キーボードが出きったら（data-ft-kbfix）、送り場の箱をキーボードの上端で終わらせる。打っていくうちに
             カーソルが下へ進んでも、iPhone が送り場の中だけを送り、画面ぜんたい（ヘッダーごと）を押し上げない
           ・**下のボタンの帯（送り場のあとの .shrink-0）は持ち上げない。** 外わくの下に置いたまま、キーボードの裏に残す。
             抜けた高さぶんは送り場の最後に残す（--ft-kbfoot）ので、送っている位置はずれない
           ・**送り場は flex-1 overflow-y-auto の形にそろえること。** ほかの形だと余地が足されない
           ・**重なって出るものの外わくには data-ft-overlay を付けること**
           ・❌ padding / 位置に transition を付けないこと。動きは installKeyboardInset の transform だけ */
        html[data-ft-kb] [data-ft-overlay] .flex-1.overflow-y-auto::after { content: ""; display: block; flex: 0 0 auto; height: var(--ft-kb, 0px); pointer-events: none; }
        /* 下タブの画面など、ページそのものの入力欄：ページの最後にキーボードぶんの送れる余地を足す（見た目は動かない） */
        html[data-ft-kb][data-ft-kbctx="page"] body { padding-bottom: var(--ft-kb, 0px); }
        html[data-ft-kbfix][data-ft-kbctx="overlay"] [data-ft-overlay] > div:last-child > .absolute.inset-0.flex-col { padding-bottom: var(--ft-kb, 0px); }
        html[data-ft-kbfix][data-ft-kbctx="overlay"] [data-ft-overlay] > div:last-child > .absolute.inset-0.flex-col > .flex-1.overflow-y-auto ~ .shrink-0 { position: absolute; left: 0; right: 0; bottom: 0; }
        html[data-ft-kbfix][data-ft-kbctx="overlay"] [data-ft-overlay] > div:last-child > .absolute.inset-0.flex-col > .flex-1.overflow-y-auto::after { height: var(--ft-kbfoot, 0px); }
        /* 重なる層の外わくも「切り取るだけで、送れない」形にする（.ft-sheet-wrap と同じ理由。上の説明を見ること）。
           overflow: hidden の箱は、入力欄を見せるためにブラウザが送ることがあり、送られると見出しごとずれる */
        @supports (overflow: clip) { [data-ft-overlay] { overflow: clip; } }
        /* 重なる層の中の送り場は、端まで送っても指の動きをページへ渡さない。
           渡すとページが送られ、useLockBackground が引き戻す（その往復がちらつきになる） */
        [data-ft-overlay] .overflow-y-auto, .ft-sheet-wrap .overflow-y-auto { overscroll-behavior: contain; }
        .ft-sheet-box  { max-height: 82%; }
        /* フォルダの「記録を入れる」紙。中身が入れ替わっても高さが変わらないよう、決まった高さにする */
        .ft-sheet-tall { height: 82%; } /* 高さは ft-sheet-box の上限（82%）と同じ。ほかの紙より背を高くしない */
        /* --- フォルダの2列カード（My手帳 2.11.25 と同じ形） ---
           **space-y-* を付けないこと。** グリッドの中では子の上に余白が付いて、段がずれる。
           **絵の窓は 1/1 のまま。** フォルダの絵は正方形に切り抜いているので、形を変えると見切れる */
        .ft-fgrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; align-items: stretch; }
        .ft-fgrid > .ft-noresult { grid-column: 1 / -1; }
        @media (min-width: 1024px) { .ft-fgrid { grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; } }
        .ft-fcard { display: flex; flex-direction: column; min-width: 0; padding: 8px; border-radius: 16px; }
        .ft-fthumb { position: relative; display: flex; align-items: center; justify-content: center; aspect-ratio: 1 / 1; border-radius: 12px; overflow: hidden; }
        .ft-fpin { position: absolute; top: 4px; right: 4px; }
        .ft-fpin > button { box-shadow: 0 0 0 2px rgba(255,255,255,.9); }
        .ft-fbody { display: flex; flex-direction: column; min-width: 0; padding: 10px 4px 4px; }
        .ft-fname { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.35; word-break: break-word; }
        .ft-fmeta { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
        .ft-fsub { display: block; margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        /* --- 見つからなかったときの現れ方 ---
           ぱっと切り替わると「本当に探したのか」が分かりにくい。
           絵がふわりと出て、少し遅れて文が続くようにする */
        @keyframes ft-noresult {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to   { opacity: 1; transform: none; }
        }
        .ft-noresult > * { animation: ft-noresult 0.42s cubic-bezier(0.22,1,0.36,1) backwards; }
        .ft-noresult > *:nth-child(1) { animation-delay: 0.04s; }
        .ft-noresult > *:nth-child(2) { animation-delay: 0.18s; }

        /* 本文の中のリンク。**下線は引かない**（色だけで押せることを示す）。
           クラスを外すだけでは消えない。<a> はブラウザが既定で下線を引くため、
           こちらで打ち消しておくこと */
        .ft-link { text-decoration: none; }

        /* 引用ブロックの左の縦線。
           **太さ・線種・色をこの1か所で決めること。**
           Tailwind の border-l-[…] は「太さ」しか決めず、線種は土台の指定に頼る。
           そのため環境によっては線種が none のままになり、線が出ない。
           実際、色は当たっているのに太さ0・線種noneで見えない状態になっていた。
           色はテーマ色を白と混ぜた淡いトーン。透かし（/30など）ではなく
           混ぜた色にするのは、背景が変わっても濃さが変わらないようにするため。
           color-mix が使えない場合に備えて、先に単色を置いてある */
        .ft-quote {
          border-left: 3px solid var(--th-600);
          border-left-color: color-mix(in srgb, var(--th-700) 55%, #FFFFFF);
          padding-left: 14px;
        }


        /* 中の「一覧」の場所。**flex-1 を使わないこと。**
           flex-1 は基準の高さが0なので、まわりに余りが無いと高さ0までつぶれ、
           タグの札が途中で切れて見える。基準を中身ぶんにしたうえで、
           はみ出すときだけ縮んでスクロールするようにしている */
        .ft-sheet-body { flex: 1 1 auto; min-height: 0; }

        /* --- 「？」の吹き出し --- */
        @keyframes ft-tip { from { opacity: 0; transform: translateY(-4px) scale(0.96); } to { opacity: 1; transform: none; } }
        .ft-tip { animation: ft-tip 0.16s cubic-bezier(0.22,1,0.36,1) backwards; }
        @keyframes ft-tip-out { from { opacity: 1; } to { opacity: 0; transform: translateY(-3px); } }
        .ft-tip-out { animation: ft-tip-out 0.2s ease-in forwards; }

        /* --- テーマ色を選んだときのチェック --- */
        @keyframes ft-check-in { 0% { opacity: 0; transform: scale(0) rotate(-45deg); } 100% { opacity: 1; transform: none; } }
        .ft-check-in { animation: ft-check-in 0.3s cubic-bezier(0.34,1.5,0.5,1) backwards; }

        /* ============================================================
           動きを止めるとき
           ・端末側の「視差効果を減らす」設定
           ・カスタマイズ画面の「動きの演出」を切ったとき（.ft-still）
           止めるのは動きだけ。読み込み中のくるくる（.spin）は残す
           ============================================================ */
        .ft-still *:not(.spin), .ft-still *:not(.spin)::before, .ft-still *:not(.spin)::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        .ft-still .ft-sparkle { animation: none !important; opacity: 1; transform: none; }
        @media (prefers-reduced-motion: reduce) {
          .ft-root *:not(.spin), .ft-root *:not(.spin)::before, .ft-root *:not(.spin)::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .ft-root .ft-sparkle { animation: none !important; opacity: 1; transform: none; }
        }

        :root{
          --th-50:#F0FDFA; --th-100:#CCFBF1; --th-200:#99F6E4; --th-300:#5EEAD4;
          --th-600:#0D9488; --th-700:#0F766E; --th-800:#115E59; --th-900:#134E4A;
        }

        /* テーマカラー。--th-* を差し替えると配色が一括で変わる */
        /* 画面の下地。**ここはテーマ色にしないこと。**
           いちばん淡い調子を敷いてみたが、画面ぜんたいが色づいて主張が強すぎた。
           テーマ色は、小見出し・細い線・印など、小さな場所だけに置く */
        .ft-page{background-color:#FAFAFA}
        /* 文字を選んだときの色と、入力中の縦棒も、選んだ色でそろえる */
        .ft-root ::selection{background-color:var(--th-200)}
        .ft-root .ft-input{caret-color:var(--th-800)}
        .bg-th-50{background-color:var(--th-50)} .bg-th-100{background-color:var(--th-100)}
        .bg-th-600{background-color:var(--th-600)} .bg-th-700{background-color:var(--th-700)}
        .bg-th-800{background-color:var(--th-800)} .bg-th-900{background-color:var(--th-900)}
        .bg-th-50\\/40{background-color:color-mix(in srgb, var(--th-50) 40%, transparent)}
        /* hover: はマウスのある端末だけ。Tailwind 側（app.css）も同じ条件で書き出している
           （tailwind.config.js の future.hoverOnlyWhenSupported）。**ここだけ条件を外さないこと。**
           タッチ端末で :hover が効くと、1回目のタップが「hoverにするだけ」で終わって2回押しが要ったり、
           押したあとも色が残り続けたりする */
        @media (hover: hover) and (pointer: fine) {
          .hover\\:bg-th-50:hover{background-color:var(--th-50)} .hover\\:bg-th-100:hover{background-color:var(--th-100)}
          .hover\\:bg-th-800:hover{background-color:var(--th-800)} .hover\\:bg-th-900:hover{background-color:var(--th-900)}
          .hover\\:text-th-900:hover{color:var(--th-900)}
        }
        .text-th-700{color:var(--th-700)} .text-th-800{color:var(--th-800)} .text-th-900{color:var(--th-900)}
        .text-th-800\\/70{color:color-mix(in srgb, var(--th-800) 70%, transparent)}
        /* **薄さ付きの色は、使う前にここへ足すこと。**
           足し忘れると色が付かず、線や字が見えないまま消える（実際そうなった） */
        .text-th-800\\/80{color:color-mix(in srgb, var(--th-800) 80%, transparent)}
        .text-th-800\\/60{color:color-mix(in srgb, var(--th-800) 60%, transparent)}
        .bg-th-700\\/60{background-color:color-mix(in srgb, var(--th-700) 60%, transparent)}
        .focus\\:ring-th-800\\/20:focus{--tw-ring-color:color-mix(in srgb, var(--th-800) 20%, transparent)}
        .border-th-200{border-color:var(--th-200)} .border-th-300{border-color:var(--th-300)}
        .border-th-700{border-color:var(--th-700)} .border-th-800{border-color:var(--th-800)} .border-th-900{border-color:var(--th-900)}
        .border-th-700\\/25{border-color:color-mix(in srgb, var(--th-700) 25%, transparent)}
        .border-th-700\\/30{border-color:color-mix(in srgb, var(--th-700) 30%, transparent)}
        .border-th-700\\/35{border-color:color-mix(in srgb, var(--th-700) 35%, transparent)}
        .border-th-700\\/40{border-color:color-mix(in srgb, var(--th-700) 40%, transparent)}
        .focus\\:border-th-800:focus{border-color:var(--th-800)}
        .focus\\:ring-th-800\\/20:focus{box-shadow:0 0 0 4px color-mix(in srgb, var(--th-800) 20%, transparent)}
        .focus-within\\:border-th-800:focus-within{border-color:var(--th-800)}
        .focus-within\\:ring-th-800\\/20:focus-within{box-shadow:0 0 0 4px color-mix(in srgb, var(--th-800) 20%, transparent)}
        .accent-th-700{accent-color:var(--th-700)} .accent-th-800{accent-color:var(--th-800)}
        .from-th-700{--tw-gradient-from:var(--th-700);--tw-gradient-stops:var(--tw-gradient-from),var(--tw-gradient-to)}
        .to-th-900{--tw-gradient-to:var(--th-900)}
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>

      <div className="max-w-lg lg:max-w-5xl mx-auto min-h-screen relative ft-page">
        {/* 入れ物は透明度だけで切り替える。ここで位置を動かすと、中の sticky なヘッダがぶれる */}
        <div key={tab} className="ft-tabswap">
        {tab === "home" && <HomeScreen records={records} prefs={prefs} onOpenBackup={() => setBackupOpen(true)} garden={garden} onStartCycle={() => setPickFruit(true)} onHarvest={harvestFruit} />}
        {tab === "record" && <RecordScreen records={records} onOpenDetail={openDetail} onStartReading={openNewReading} />}
        {tab === "search" && <SearchScreen records={records} setRecords={setRecords} onDeleteMany={handleDeleteMany} openDetail={openDetail} allKnownTags={knownTags} defaultSort={prefs.sortMode} resetSig={searchReset} />}
        {tab === "folder" && <FolderScreen folders={folders} records={records} sort={prefs.folderSortOrder || "name"}
          onSort={(v) => savePrefs({ ...prefs, folderSortOrder: v })} onOpen={(f) => setOpenFolderId(f.id)}
          onPin={pinFolder} onChange={changeFolder} onDelete={deleteFolder} resetSig={folderReset} />}
        {tab === "progress" && <ProgressScreen records={records} onOpenDetail={openDetail} onOpenBook={openBook} onOpenDay={setViewingDay} />}
        </div>
      </div>

        {/* ＋は動く入れ物の外に置く。中に入れると、切り替えの動きの間だけ
            位置の基準がその入れ物になり、上から落ちてくるように見えてしまう。
            **下からの高さは切り欠きのぶんを足して決めること。**
            帯は 56px ＋ 切り欠き、ボタンは 56px 角なので、
            96px 浮かせると帯との間が 40px あく。
            帯の厚みは文字の大きさで変わらないので、重なることはない */}
        {tab === "record" && (
          <button onClick={openNew} aria-label="新しい記録を追加"
            /* z-40 にすること。下の帯（z-30）より小さいと、帯の下に潜って欠けて見える */
            className="fixed right-5 z-40 w-14 h-14 rounded-full bg-th-900 text-white shadow-xl flex items-center justify-center hover:bg-th-800 ft-tap ft-fab"
            style={{ bottom: "calc(env(safe-area-inset-bottom) + 96px)" }}>
            <Plus size={26} />
          </button>
        )}

        {/* フォルダを作る＋。位置と大きさは記録画面の＋とそろえる */}
        {tab === "folder" && (
          <button onClick={() => setNewFolder(true)} aria-label="新しいフォルダを作る"
            className="fixed right-5 z-40 w-14 h-14 rounded-full bg-th-900 text-white shadow-xl flex items-center justify-center hover:bg-th-800 ft-tap ft-fab"
            style={{ bottom: "calc(env(safe-area-inset-bottom) + 96px)" }}>
            {/* **＋にしないこと。** 記録画面の＋（記録を足す）と同じ見た目だと、どちらか分からなくなる */}
            <FolderPlus size={26} />
          </button>
        )}

        <BottomNav active={tab} onChange={pressTab} />

        {/* フォルダの中。記録の閲覧（viewing）より前に置くこと。あとに置くと、開いた記録の上にかぶさる */}
        {openFolder && (
          <FolderDetail folder={openFolder} records={records} knownTags={knownTags} defaultSort={prefs.sortMode}
            onClose={() => setOpenFolderId(null)} onChange={changeFolder} onDelete={deleteFolder} onOpenDetail={openDetail} />
        )}
        {newFolder && (
          /* 作ったら、そのまま中をひらく（すぐ記録を入れられるように） */
          <FolderNameSheet title="新しいフォルダ" confirmLabel="作る" onCancel={() => setNewFolder(false)}
            onSave={(n, ic) => { const f = addFolder(n, ic); setNewFolder(false); setOpenFolderId(f.id); }} />
        )}

        {viewingDay && (
          <DayRecordsScreen date={viewingDay} records={records} onClose={closeDay} onOpenDetail={openDetailFromBook} />
        )}
        {viewingBook && (
          <BookRecordsScreen book={viewingBook} records={records} onClose={closeBook} onOpenDetail={openDetailFromBook} defaultSort={prefs.sortMode} />
        )}

        {viewing && (
          /* **ここに key を付けないこと。**
             一度 key={viewing.id} を付けたところ、保存したあとに閲覧画面が
             二重に残り、戻るたびに同じ画面が出てくる不具合になった。
             （並んだきょうだいの中で、ひとつだけ key を持たせると起きる）
             出てくる向きの動きは from の切り替えでやり直されるので、key は要らない */
          <RecordDetailScreen record={viewing} allRecords={records} onClose={closeDetail} onEdit={editFromDetail}
            onOpenDetail={openDetail} onToggleMark={toggleMark} from={viewingFrom} />
        )}

        {importMsg && (
          /* 知らせの出し方は、記録のコピーと同じにそろえる（画面の中ほど） */
          <div className="anim-fade"
            style={{ position: "fixed", top: "45%", left: 0, right: 0, zIndex: 2147483300,
                     display: "flex", justifyContent: "center", padding: "0 20px",
                     pointerEvents: "none", transform: "translateY(-50%)" }}>
            <p style={{ maxWidth: 448, width: "100%", textAlign: "center", fontWeight: 700,
                        color: "#fff", background: "rgba(23,23,23,0.92)", borderRadius: 14,
                        padding: "14px 16px", boxShadow: "0 10px 30px rgba(0,0,0,.28)", lineHeight: 1.6 }}
              className="text-[13.5px]">{importMsg}</p>
          </div>
        )}

        {draftSaved && <DraftDialog draft={draftSaved} onResume={resumeDraft} onDiscard={discardDraft} names={typeDesc.name} />}

        {typePick && <TypePickSheet onPick={startNewOfType} onCancel={() => setTypePick(false)} descs={typeDesc.desc} names={typeDesc.name}
          onImportFile={importOneFile} onPasteImport={() => { setTypePick(false); setPasteRecord(true); }} />}

        {/* 文字から記録を取り込む */}
        {pasteRecord && (
          <PasteDialog title="文字から取り込む"
            hint="受け取った記録の文字を貼りつけてください。今ある記録は消えません。"
            actionLabel="取り込む"
            onCancel={() => setPasteRecord(false)}
            onSubmit={async (t) => { setPasteRecord(false); await importOneFile(t); }} />
        )}

        {editing && (
          <RecordForm key={editing.id} initial={isNew ? null : editing} draft={isNew ? editing : null}
            onSave={handleSave} onCancel={closeForm} onDelete={handleDelete}
            allRecords={records} captions={captions}
            onAutoDraft={handleAutoDraft} typeLocked={typeLocked}
            knownTags={knownTags} onCreateTag={addTagToMaster} />
        )}

        {dupState && (
          <DuplicateDialog existing={dupState.existing}
            onRegister={() => { const p = dupState.pending; const from = dupState.fromForm; setDupState(null); commitSaveOrAdd(p); if (from) closeForm(); }}
            onViewExisting={() => { const ex = dupState.existing; setDupState(null); setIsNew(false); setEditing(ex); }}
            onCancel={() => setDupState(null)} />
        )}

        {backupOpen && <BackupScreen zIndex={menuLift === "backup" ? MENU_LIFT_Z : undefined} records={records} folders={folders} artworks={artworks} garden={garden} tagMaster={tagMaster}
          prefs={prefs} captions={captions} typeDesc={typeDesc} headerBg={headerBg} onClose={() => setBackupOpen(false)} onRestore={handleRestore} onBackedUp={markBackedUp}
          onImportOne={importOneFile} />}

        {artOpen && <ArtworkScreen zIndex={menuLift === "art" ? MENU_LIFT_Z : undefined} artworks={artworks} onChange={saveArtworks} captions={captions} onSaveCaptions={saveCaptions} prefs={prefs} onSavePrefs={savePrefs} onClose={() => setArtOpen(false)} typeDesc={typeDesc} onSaveTypeDesc={saveTypeDesc} headerBg={headerBg} onSaveHeaderBg={saveHeaderBg} />}

        {bookmarkOpen && <BookmarkScreen zIndex={menuLift === "bookmark" ? MENU_LIFT_Z : undefined} records={records} onClose={() => setBookmarkOpen(false)} onOpenDetail={openDetail} defaultSort={prefs.sortMode} />}

        {tagsOpen && <TagManageScreen zIndex={menuLift === "tags" ? MENU_LIFT_Z : undefined} tags={knownTags} records={records}
        onAdd={addTagToMaster} onRename={renameTag} onDelete={deleteTag} onReorder={reorderTags}
        onClose={() => setTagsOpen(false)} />}
      {helpOpen && <HelpScreen zIndex={menuLift === "help" ? MENU_LIFT_Z : undefined} onClose={() => setHelpOpen(false)} />}
      {gardenOpen && <GardenScreen zIndex={menuLift === "garden" ? MENU_LIFT_Z : undefined} garden={garden} records={records} onClose={() => setGardenOpen(false)} onChangeFruit={plantFruit} />}

        {pickFruit && (
          <FruitPickDialog
            title="育てる実を選ぶ"
            note="時間をかけて、ひとつの実を育てます。"
            current={garden.cycle ? garden.cycle.fruit : FRUITS[0].key}
            onPick={plantFruit}
            onCancel={() => setPickFruit(false)}
          />
        )}

        {harvestOf && (
          <HarvestDialog
            fruit={harvestOf}
            onReplant={() => { setHarvestOf(null); setPickFruit(true); }}
            onLater={() => setHarvestOf(null)}
          />
        )}


        <SideMenu
          open={menuOpen}
          instant={menuInstant}
          under={menuUnder}
          onClose={() => { setMenuInstant(false); setMenuOpen(false); }}
          items={[
            {
              label: "画面のカスタマイズ",
              desc: "カラー・イラスト・ひとこと",
              icon: <ImagePlus size={20} />,
              onClick: () => goFromMenu("art"),
            },
            {
              label: "ブックマーク",
              desc: `${records.filter((r) => r.bookmarked).length}件の記録`,
              icon: <Bookmark size={20} />,
              onClick: () => goFromMenu("bookmark"),
            },
            {
              label: "収穫した実",
              desc: garden.cycle
                ? `${fruitByKey(garden.cycle.fruit).label}を育てています・収穫${(garden.harvests || []).length}個`
                : "記録を重ねて実を育てる",
              icon: <Sparkles size={20} />,
              onClick: () => goFromMenu("garden"),
            },
            {
              label: "タグの整理",
              desc: (knownTags.length ? `${knownTags.length}個のタグ` : "追加・名前の変更・削除"),
              icon: <Tag size={20} />,
              onClick: () => goFromMenu("tags"),
            },
            {
              label: "バックアップ",
              /* **いつ書き出したかを、開かなくても分かるようにすること。**
                 「書き出しと復元」とだけ書いてあっても、控えが古いことに気づけない */
              desc: unsavedNow > 0
                ? (prefs.lastBackup ? `前回は ${fmtJpDate(prefs.lastBackup)}・${unsavedNow}件が未書き出し` : "まだ一度も書き出していません")
                : (prefs.lastBackup ? `${fmtJpDate(prefs.lastBackup)} に書き出しました` : "書き出しと復元"),
              icon: <Download size={20} />,
              badge: unsavedNow,
              onClick: () => goFromMenu("backup"),
            },
            /* 画面へは移らない。押した行の下の字が「確認しています…」→「v○ に更新しています…」と変わる */
            ...(CAN_SELF_UPDATE ? [{
              label: "最新バージョンに更新",
              desc: updating === "check" ? "確認しています…"
                : updating ? `v${updating} に更新しています…`
                : `今のバージョン v${APP_VERSION}`,
              busy: !!updating,
              icon: <RefreshCw size={20} />,
              onClick: checkUpdate,
            }] : []),
          ]}
          footer={
            /* さりげなく置きつつ、押す場所は行いっぱいに広げてある。
               気づいたときに指がどこに当たっても開けるように */
            <TapButton onClick={() => goFromMenu("help")}
              className="w-full flex items-center gap-3 -my-1 py-2 rounded-xl text-left hover:bg-neutral-50 ft-tap-card">
              {/* **ここだけは大きくしないこと。**
                  この段の高さは下の帯（--ft-nav-h＝57px）にそろえてある。
                  絵を大きくすると段が高くなり、帯と食い違って見える */}
              <Mascot seed="menu" size={48} className="shrink-0" />
              <span className="flex-1 min-w-0 text-[14.5px] font-bold text-neutral-700">使い方を見る</span>
              <ChevronRight size={18} className="text-neutral-400 shrink-0" />
            </TapButton>
          }
        />
    </div>
    </MenuContext.Provider>
    </TypeNameContext.Provider>
    </UnsavedContext.Provider>
    </PrefsContext.Provider>
    </ArtworkContext.Provider>
  );
}

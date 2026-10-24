/* =============================================================
 * オフラインで使うためのしくみ（サービスワーカー）
 *   はじめて開いたときに、アプリのファイルをすべて端末に保存します。
 *   2回目からは、電波がなくても保存したファイルで起動します。
 *   通信できるときは、画面（index.html）だけは新しいものを取りに行きます。
 *
 *   ※ 版を上げるときは、下の VERSION を index.html の APP_VERSION と同じにし、
 *     .js を足したら FILES にも書き足してください（?v= も index.html とそろえる）。
 * ============================================================= */
const VERSION = '1.22.6';
const CACHE = 'hoikushi-anki-' + VERSION;
const FONT_CACHE = 'hoikushi-anki-fonts';
const JS = ['kyoiku-genri.js', 'kyoiku-hoki.js', 'kyoiku-seido.js', 'hoiku-genri.js', 'hoiku-shinri.js', 'shokuin-haichi.js', 'kodomo-hoken.js',
  'kodomo-hattatsu.js', 'kodomo-yougo.js', 'shakai-yogo.js', 'ruby.js',
  'kaisetsu-kyoiku.js', 'kaisetsu-hoiku.js', 'kaisetsu-shinri.js', 'kaisetsu-hoken.js', 'kaisetsu-shakai.js'];
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'favicon-32.png', 'apple-touch-icon.png',
  'icon-192.png', 'icon-512.png', ...JS.map(f => f + '?v=' + VERSION)];
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&display=swap';

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(FILES.map(u => new Request(u, { cache: 'reload' })));
    /* 文字（フォント）は取れなくても動くので、失敗しても止めない */
    try { const f = await caches.open(FONT_CACHE); if (!(await f.match(FONT_CSS))) await f.add(new Request(FONT_CSS, { mode: 'no-cors' })); } catch (_) {}
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('hoikushi-anki-') && k !== CACHE && k !== FONT_CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

const timeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  /* フォント（Google Fonts）：保存したものを使い、裏で新しくする */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith((async () => {
      const c = await caches.open(FONT_CACHE), hit = await c.match(req);
      const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => null);
      return hit || (await net) || Response.error();
    })());
    return;
  }
  if (url.origin !== location.origin) return;

  /* 画面（index.html）と「最新バージョンに更新」の確認：通信できれば新しいもの、できなければ保存したもの */
  const fresh = req.mode === 'navigate' || req.cache === 'no-store' || req.cache === 'reload';
  if (fresh) {
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      try {
        const r = await timeout(fetch(req), req.mode === 'navigate' ? 4000 : 15000);
        if (r && r.ok) c.put(req.mode === 'navigate' ? 'index.html' : req, r.clone());
        return r;
      } catch (_) {
        return (await c.match(req, { ignoreSearch: req.mode === 'navigate' })) || (await c.match('index.html')) || Response.error();
      }
    })());
    return;
  }

  /* そのほかのファイル（.js・アイコン）：保存したものを使う。なければ取りに行って保存 */
  e.respondWith((async () => {
    const c = await caches.open(CACHE), hit = await c.match(req);
    if (hit) return hit;
    try { const r = await fetch(req); if (r && r.ok) c.put(req, r.clone()); return r; }
    catch (_) { return (await c.match(req, { ignoreSearch: true })) || Response.error(); }
  })());
});

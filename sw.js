/* ============================================================
   sw.js — インターネットが無くてもアプリを開けるようにするための係（Service Worker）

   しくみ（ざっくり）
   - 一度ネットにつながった状態で開くと、アプリの部品（index.html / app.js / app.css /
     アイコン類）を端末の中にしまっておく。
   - 次からは、ネットが無くても、しまっておいた部品でアプリを開く。
   - 記録そのもの（localStorage）には一切さわらない。

   **版数はここに書かないこと。** index.html の window.__FT_VERSION が本物。
   index.html が「./sw.js?v=版数」という名前でこの係を登録するので、
   ここでは自分の名前（?v=…）から版数を読む。版数が上がると名前が変わり、
   端末は新しい係として入れ直す（＝新しい部品をしまい直す）。
   ============================================================ */

var VERSION = new URL(self.location.href).searchParams.get("v") || "0";
var CORE_CACHE = "footprints-core-" + VERSION;
/* Googleの書体は版数と関係なく使い回す（毎回取り直すと、ネットが無いときに書体が戻ってしまう） */
var FONT_CACHE = "footprints-fonts";

/* 端末にしまう部品。app.js と app.css は、index.html と同じく「?v=版数」付きの名前で読む。
   こうすると、新しい index.html が古い app.js と組み合わさることがない */
var CORE_FILES = [
  "./",
  "./app.js?v=" + VERSION,
  "./app.css?v=" + VERSION,
  "./manifest-v4.json",
  "./icon-192-v4.png",
  "./icon-512-v4.png",
  "./apple-touch-icon-v4.png"
];

/* ネットが遅いときに、index.html を待つ上限（ミリ秒）。
   これを過ぎたら、しまっておいた index.html で開く（裏では新しいものを取りに行き続ける） */
var NAV_TIMEOUT_MS = 3000;

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CORE_CACHE).then(function (cache) {
      /* cache: "reload" … ブラウザの一時保管ではなく、必ずGitHubから最新を取る */
      return Promise.all(CORE_FILES.map(function (url) {
        return fetch(new Request(url, { cache: "reload" })).then(function (res) {
          if (!res.ok) throw new Error("取得できませんでした: " + url);
          return cache.put(url, res);
        });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      /* 古い版の部品を片づける（書体のしまい場所は残す） */
      return Promise.all(keys.map(function (key) {
        if (key.indexOf("footprints-core-") === 0 && key !== CORE_CACHE) return caches.delete(key);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;
  /* メニューの「最新バージョンに更新」（2.12.0〜）が版数を確かめるための取りに行き。
     cache: "no-store" で来たものは、しまってあるものを使わず、しまいもしない（そのままGitHubへ）。
     **ここを外さないこと。** 外すと古い index.html が返り、いつまでも「最新です」になる */
  if (req.cache === "no-store") return;
  var url = new URL(req.url);

  /* Googleの書体（文字の形）。一度取れたら端末にしまい、ネットが無いときはそれを使う */
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    event.respondWith(fontStrategy(req, url.hostname === "fonts.gstatic.com"));
    return;
  }

  /* ほかのサイトへの通信には手を出さない */
  if (url.origin !== self.location.origin) return;

  /* アプリを開くとき（index.html） */
  if (req.mode === "navigate") {
    event.respondWith(navigationStrategy(event, req));
    return;
  }

  /* app.js / app.css / アイコンなど。しまってあればそれを使い、無ければ取りに行く */
  event.respondWith(
    caches.match(req, { cacheName: CORE_CACHE }).then(function (hit) {
      if (hit) return hit;
      return caches.match(req).then(function (anyHit) {
        if (anyHit) return anyHit;
        return fetch(req).then(function (res) {
          if (res && res.ok && res.type === "basic") {
            var copy = res.clone();
            caches.open(CORE_CACHE).then(function (c) { c.put(req, copy); });
          }
          return res;
        });
      });
    })
  );
});

/* index.html は「まずネットに聞く。だめなら（または遅ければ）しまってあるもの」。
   こうしておくと、GitHubに新しい版を上げたとき、ネットがあればすぐ新しい版になる */
function navigationStrategy(event, req) {
  var fromNetwork = fetch(req).then(function (res) {
    if (res && res.ok) {
      var copy = res.clone();
      event.waitUntil(caches.open(CORE_CACHE).then(function (c) { return c.put("./", copy); }));
    }
    return res;
  });

  var fromCache = function () {
    return caches.match("./", { cacheName: CORE_CACHE }).then(function (hit) {
      return hit || caches.match("./");
    }).then(function (hit) {
      return hit || caches.match(req, { ignoreSearch: true });
    });
  };

  return new Promise(function (resolve) {
    var done = false;
    var finish = function (res) { if (!done && res) { done = true; resolve(res); } };

    var timer = setTimeout(function () {
      fromCache().then(finish);
    }, NAV_TIMEOUT_MS);

    fromNetwork.then(function (res) {
      clearTimeout(timer);
      if (res.ok) { finish(res); return; }
      /* 404 などのときも、しまってあれば そちらで開く */
      fromCache().then(function (hit) { finish(hit || res); });
    }).catch(function () {
      clearTimeout(timer);
      fromCache().then(function (hit) {
        finish(hit || new Response(
          "<!doctype html><meta charset=utf-8><meta name=viewport content='width=device-width'>" +
          "<p style='font-family:system-ui;padding:24px;line-height:1.8'>インターネットにつながっていません。<br>" +
          "一度つながった状態で開くと、次からはつながっていなくても使えるようになります。</p>",
          { headers: { "Content-Type": "text/html; charset=utf-8" } }
        ));
      });
    });
  });
}

/* 書体：文字の形のファイル（gstatic）は中身が変わらないので「しまってあればそれ」。
   書体の指定（googleapis）は「しまってあるものをすぐ使い、裏で取り直す」 */
function fontStrategy(req, immutable) {
  return caches.open(FONT_CACHE).then(function (cache) {
    return cache.match(req).then(function (hit) {
      var refresh = function () {
        return fetch(req).then(function (res) {
          if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
          return res;
        });
      };
      if (hit) {
        if (!immutable) refresh().catch(function () {});
        return hit;
      }
      return refresh().catch(function () {
        /* ネットが無く、まだしまってもいない。端末の書体で表示される（アプリは問題なく動く） */
        return new Response("", { status: 503 });
      });
    });
  });
}

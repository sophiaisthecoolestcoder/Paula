#!/usr/bin/env node
/*
 * check-prose-consistency.js
 * --------------------------------------------------------------------------
 * Guards the promise that body prose looks identical everywhere it appears.
 *
 * It has been broken twice by later, well-meant changes — most recently by
 * bumping the legal pages to 1rem/1.65 to buy back line length after widening
 * their measure. Assurances did not catch it; this does.
 *
 * INVARIANT (compared, must match everywhere): font-family, size, weight,
 * style, line-height, colour, letter-spacing, text-align, hyphens, paragraph
 * spacing.
 * CONTEXT-FLEXIBLE (reported, never compared): the column width.
 * See docs/DESIGN-SYSTEM.md §4 and §17.
 *
 * Usage:   node tools/check-prose-consistency.js
 * Exit:    0 = every prose block matches, 1 = a difference was found
 *
 * No dependencies: a tiny static server plus headless Chrome. Each page is
 * served with a probe script injected, so there are no iframes and no
 * cross-document access. Set CHROME=/path/to/chrome if Chrome is elsewhere.
 */

"use strict";

const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");

const INVARIANT = [
  "fontFamily", "fontSize", "fontWeight", "fontStyle", "lineHeight",
  "color", "letterSpacing", "textAlign", "hyphens", "paragraphMarginBottom"
];

const TARGETS = [
  { name: "About (index)", page: "index.html", sel: ".about__text p" },
  { name: "Artwork modal (index)", page: "index.html", sel: ".wmodal .work__prose p", open: true },
  { name: "Imprint", page: "impressum.html", sel: ".legal__body p:not(.legal__address):not(.legal__caps)" },
  { name: "Privacy", page: "datenschutz.html", sel: ".legal__body p:not(.legal__address):not(.legal__caps)" }
];

const LANGS = ["en", "de"];

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  for (const c of [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"
  ]) if (fs.existsSync(c)) return c;
  console.error("Could not find Chrome. Set CHROME=/path/to/chrome and retry.");
  process.exit(2);
}

const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".otf": "font/otf", ".jpg": "image/jpeg", ".png": "image/png",
  ".webp": "image/webp", ".svg": "image/svg+xml"
};

function probe(target, lang) {
  return '\n<pre id="prose-probe">PENDING</pre>\n<script>\n(function () {\n' +
'  function report(o) { var el = document.getElementById("prose-probe");\n' +
'    if (el) el.textContent = JSON.stringify(o); }\n' +
'  function visible(nodes) { for (var i = 0; i < nodes.length; i++) {\n' +
'      if (nodes[i].offsetParent !== null || nodes[i].getClientRects().length) return nodes[i]; }\n' +
'    return null; }\n' +
'  var done = false;\n' +
'  function measure() {\n' +
'    if (done) return; done = true;\n' +
'    try {\n' +
'      document.documentElement.setAttribute("data-lang", ' + JSON.stringify(lang) + ');\n' +
'      document.documentElement.setAttribute("lang", ' + JSON.stringify(lang) + ');\n' +
(target.open ? '      var b = document.querySelectorAll(".worklist__title"); if (b[1]) b[1].click();\n' : '') +
'      setTimeout(function () {\n' +
'        var el = visible(document.querySelectorAll(' + JSON.stringify(target.sel) + '));\n' +
'        if (!el) { report({ error: "NO PROSE FOUND" }); return; }\n' +
'        var c = getComputedStyle(el);\n' +
'        report({ fontFamily: c.fontFamily, fontSize: c.fontSize, fontWeight: c.fontWeight,\n' +
'          fontStyle: c.fontStyle, lineHeight: c.lineHeight, color: c.color,\n' +
'          letterSpacing: c.letterSpacing, textAlign: c.textAlign,\n' +
'          hyphens: c.hyphens || c.webkitHyphens,\n' +
'          paragraphMarginBottom: (el.nextElementSibling && el.nextElementSibling.tagName === "P")\n' +
'            ? c.marginBottom : null,\n' +
'          width: Math.round(el.getBoundingClientRect().width) });\n' +
'      }, 120);\n' +
'    } catch (e) { report({ error: String(e) }); }\n' +
'  }\n' +
'  if (document.fonts && document.fonts.ready) {\n' +
'    document.fonts.ready.then(function () { setTimeout(measure, 80); });\n' +
'    setTimeout(measure, 2000);\n' +
'  } else { setTimeout(measure, 200); }\n' +
'})();\n</script>';
}

let CURRENT = null;

function serve() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      res.setHeader("Connection", "close");
      const rel = decodeURIComponent(req.url.split("?")[0]).replace(/^\/+/, "");
      const file = path.join(ROOT, rel);
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404).end("not found");
        return;
      }
      if (path.extname(file) === ".html" && CURRENT) {
        /* The cover video keeps Chrome's virtual clock from ever settling, so
           the page under test is served without it. Typography is untouched. */
        const body = fs.readFileSync(file, "utf8")
          .replace(/<video[\s\S]*?<\/video>/gi, "")
          .replace(/<script[^>]*paula-wallpaper[^>]*><\/script>/gi, "")
          .replace(/<\/body>/i, probe(CURRENT.target, CURRENT.lang) + "</body>");
        res.writeHead(200, { "Content-Type": "text/html", "Cache-Control": "no-store" });
        res.end(body);
        return;
      }
      res.writeHead(200, {
        "Content-Type": MIME[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store"
      });
      res.end(fs.readFileSync(file));
    });
    server.keepAliveTimeout = 1;
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

/* Asynchronous, deliberately. The pages are served by THIS process, so a
   synchronous exec (the first version used execFileSync) blocks the event loop
   and the server can never answer Chrome's request: every run timed out and
   nothing was ever measured. And since Chrome 152, headless --dump-dom prints
   the DOM and then does not exit — so Chrome is stopped as soon as the complete
   dump has arrived, with a timeout only as a backstop. */
function measure(chrome, origin, target, lang) {
  CURRENT = { target, lang };
  return new Promise((resolve) => {
    const child = spawn(chrome, [
      "--headless=new", "--disable-gpu", "--mute-audio",
      "--force-prefers-reduced-motion", "--virtual-time-budget=8000",
      "--window-size=1440,900", "--dump-dom", origin + "/" + target.page
    ], { stdio: ["ignore", "pipe", "ignore"] });
    let out = "";
    let done = false;
    const finish = (error) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      child.kill("SIGKILL");
      const m = out.match(/<pre id="prose-probe">([\s\S]*?)<\/pre>/);
      if (!m) return resolve({ error: error || "probe did not report" });
      const txt = m[1].replace(/&quot;/g, '"').replace(/&amp;/g, "&")
                      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&#39;/g, "'");
      if (txt.trim() === "PENDING") return resolve({ error: "probe timed out" });
      try { resolve(JSON.parse(txt)); } catch (e) { resolve({ error: "unparseable probe output" }); }
    };
    const timer = setTimeout(() => finish("chrome did not return (timeout)"), 30000);
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => {
      out += chunk;
      if (/<\/html>\s*$/i.test(out)) finish();
    });
    child.on("close", () => finish());
    child.on("error", (e) => finish("chrome did not start (" + e.message + ")"));
  });
}

(async function main() {
  const chrome = findChrome();
  const server = await serve();
  const origin = "http://127.0.0.1:" + server.address().port;
  let failed = false;
  let errored = false;

  try {
    for (const lang of LANGS) {
      console.log("\n  " + lang.toUpperCase());
      const results = [];
      for (const t of TARGETS) {
        const r = await measure(chrome, origin, t, lang);
        if (r.error) {
          console.log("    " + t.name.padEnd(24) + " ERROR: " + r.error);
          failed = true;
          errored = true;
          continue;
        }
        results.push({ name: t.name, style: r });
        console.log("    " + t.name.padEnd(24) +
          String(r.fontSize).padStart(7) + " / " + String(r.lineHeight).padStart(7) +
          " / " + r.color + " / " + r.textAlign +
          "   [width " + String(r.width).padStart(4) + "px]");
      }
      const base = results[0];
      for (const r of results.slice(1)) {
        for (const p of INVARIANT) {
          /* null = not measurable here (a single-paragraph block, where
             :last-child legitimately zeroes the spacing). Skip it rather
             than report a false mismatch. */
          if (r.style[p] === null || base.style[p] === null) continue;
          if (r.style[p] !== base.style[p]) {
            failed = true;
            console.log("\n    MISMATCH  " + p +
              "\n      " + base.name + ": " + base.style[p] +
              "\n      " + r.name + ": " + r.style[p]);
          }
        }
      }
    }
  } finally {
    server.close();
  }

  console.log("\n  (width is context-flexible by design: reported, never compared)");
  if (errored) {
    console.log("\n  FAIL - not every context could be measured (see ERROR above).");
    console.log("  Nothing was compared for those; this is not a typography verdict.");
    process.exit(1);
  }
  if (failed) {
    console.log("\n  FAIL - prose typography differs between contexts.");
    console.log("  Prose type is defined once, in .prose. Delete the override rather");
    console.log("  than restating shared values elsewhere. See DESIGN-SYSTEM.md §17.");
    process.exit(1);
  }
  console.log("  PASS - prose typography is identical in every context, in both languages.");
  process.exit(0);
})();

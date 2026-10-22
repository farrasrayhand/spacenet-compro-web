#!/usr/bin/env node
/**
 * Smoke test end-to-end tanpa Playwright:
 * menjalankan Brave/Chromium headless lewat CDP, lalu memeriksa alur penting.
 *
 * Pakai: npm run e2e   (server harus sudah jalan di PORT, default 3000)
 * Env: PORT, BRAVE_PATH (default: brave-browser)
 */
import { spawn } from "node:child_process";

const PORT = process.env.PORT ?? "3000";
const BASE = `http://127.0.0.1:${PORT}`;
const BROWSER = process.env.BRAVE_PATH ?? "brave-browser";
const DEBUG_PORT = 9334;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

async function main() {
  const health = await fetch(BASE).catch(() => null);
  if (!health || !health.ok) {
    console.error(`Server belum jalan di ${BASE}. Jalankan "npm run start" dulu.`);
    process.exit(1);
  }

  const browser = spawn(
    BROWSER,
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      `--remote-debugging-port=${DEBUG_PORT}`,
      "--user-data-dir=/tmp/spacenet-e2e-profile",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let ws;
  try {
    let target = null;
    for (let i = 0; i < 40 && !target; i++) {
      await sleep(300);
      try {
        const list = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)).json();
        target = list.find((t) => t.type === "page");
      } catch {
        /* belum siap */
      }
    }
    if (!target) throw new Error("Browser headless tidak siap");

    ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
      ws.onopen = res;
      ws.onerror = rej;
    });

    let id = 0;
    const pending = new Map();
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) {
          reject(new Error(JSON.stringify(msg.error)));
        } else {
          resolve(msg.result);
        }
      }
    };
    const send = (method, params = {}) =>
      new Promise((resolve, reject) => {
        const msgId = ++id;
        pending.set(msgId, { resolve, reject });
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    const evaluate = async (expression) => {
      const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) {
        const detail = result.exceptionDetails.exception?.description ?? result.exceptionDetails.text;
        throw new Error(`Evaluasi gagal: ${detail}`);
      }
      return result.result.value;
    };
    const goto = async (path) => {
      await send("Page.navigate", { url: `${BASE}${path}` });
      await sleep(1200);
    };
    /** Tunggu sampai React selesai hidrasi sebelum menyentuh DOM. */
    const waitHydrated = async (selector = "form") => {
      for (let i = 0; i < 40; i++) {
        const ready = await evaluate(`(() => {
          const el = document.querySelector(${JSON.stringify(selector)});
          return el ? Object.keys(el).some((k) => k.startsWith("__react")) : false;
        })()`);
        if (ready) return;
        await sleep(250);
      }
      throw new Error(`Hidrasi tidak selesai untuk ${selector}`);
    };

    await send("Page.enable");
    await send("Runtime.enable");

    // 1. Semua rute utama membalas dan punya h1
    for (const path of ["/", "/tentang", "/paket", "/layanan", "/jangkauan", "/daftar", "/bantuan", "/kontak", "/privasi"]) {
      await goto(path);
      const info = await evaluate(`({ title: document.title, h1: document.querySelectorAll("h1").length })`);
      if (!info.h1) fail(`${path} tidak punya h1`);
      if (!info.title) fail(`${path} tidak punya title`);
    }
    console.log("OK  semua rute punya title dan h1");

    // 2. Validasi form: submit kosong menampilkan ringkasan galat
    await goto("/daftar");
    await waitHydrated();
    await evaluate(`document.querySelector("form").requestSubmit()`);
    await sleep(700);
    const errorState = await evaluate(`({
      summary: Boolean(document.getElementById("ringkasan-galat")),
      focused: document.activeElement ? document.activeElement.id : null,
      count: document.querySelectorAll('[aria-invalid="true"]').length,
    })`);
    if (!errorState.summary) fail("ringkasan galat tidak muncul");
    if (errorState.focused !== "ringkasan-galat") fail(`fokus tidak di ringkasan (di ${errorState.focused})`);
    if (errorState.count < 3) fail("galat inline kurang dari 3");
    console.log("OK  validasi form + fokus ringkasan");

    // 3. Cek jangkauan menampilkan hasil
    await goto("/jangkauan");
    await waitHydrated();
    await evaluate(`(() => {
      const set = (field, value) => {
        const el = document.getElementById(field);
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set.call(el, value);
        el.dispatchEvent(new Event("input", { bubbles: true }));
      };
      set("kelurahan", "Sidomulyo");
      set("kecamatan", "Samarinda Ilir");
      document.querySelector("form").requestSubmit();
    })()`);
    await sleep(1000);
    const coverage = await evaluate(
      `document.querySelector('[role="status"]')?.innerText ?? ""`,
    );
    if (!coverage.includes("terjangkau")) fail(`hasil cek jangkauan tidak sesuai: ${coverage}`);
    console.log("OK  cek jangkauan menampilkan hasil");

    // 4. Tidak ada scroll horizontal di 390px
    await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    for (const path of ["/", "/paket", "/jangkauan"]) {
      await goto(path);
      const overflow = await evaluate(`document.documentElement.scrollWidth - window.innerWidth`);
      if (overflow > 0) fail(`${path} overflow horizontal ${overflow}px`);
    }
    console.log("OK  tidak ada scroll horizontal di 390px");
  } finally {
    try {
      ws?.close();
    } catch {
      /* ignore */
    }
    browser.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

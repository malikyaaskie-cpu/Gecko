/* =========================================================
   KONFIGURASI — edit bagian ini saja untuk personalisasi
   ========================================================= */
const CONFIG = {
  senderName: "Namamu",
  receiverName: "Namanya",

  relationshipLabel: "orang spesial buat aku",

  welcomeMessage:
    "Hehe, ada sesuatu spesial nih buat kamu. Coba buka, deh! 🤭💗",

  bouquetMessage:
    "Bunganya mungkin cuma virtual, tapi niat bikinnya beneran buat kamu. 🌷",

  flowerType: "rose",
  primaryColor: "#E11D48",

  musicEnabled: true,
  musicFile: "assets/music.mp3",
  photoFile: "assets/photo.jpg",

  photoCaption:
    "Satu momen kecil yang bakal selalu aku inget. 💗",

  coverFile: "assets/cover.jpg",
  songTitle: "Glue Song",
  songArtist: "beabadoobee",

  loveLetter:
`Hai, kamu! 💗

Hehe, akhirnya kamu sampai juga di bagian ini.

Sebenernya aku bingung mau ngomong apa, tapi aku cuma mau bilang kalau aku seneng bisa kenal sama kamu.

Makasih ya, udah jadi bagian dari cerita aku. Makasih buat obrolan random, tawa kecil, dan semua momen yang mungkin kelihatannya biasa aja, tapi ternyata berarti banget.

Aku nggak berharap semuanya harus selalu sempurna. Yang penting kita bisa saling ngerti, saling dukung, dan tetap jadi diri sendiri.

Kalau suatu hari kamu lagi capek, jangan lupa istirahat, ya. Kamu juga berhak punya waktu buat diri sendiri dan menikmati hal-hal kecil yang bikin kamu bahagia. 🥹

Oh iya, semoga hadiah kecil ini bisa bikin kamu senyum, walaupun cuma sebentar. Aku bikinnya sederhana, tapi aku harap kamu suka.

Udah deh, segitu aja. Kalau aku lanjut terus, nanti suratnya malah jadi novel, wkwk. 🤭

Pokoknya, jangan lupa bahagia, ya!

Dari aku, yang berharap kamu selalu punya alasan buat tersenyum. 💕`
};

/* ========================= Helpers ========================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.style.setProperty("--rose", CONFIG.primaryColor);

// Isi semua teks personal dari CONFIG
$$("[data-bind]").forEach(el => (el.textContent = CONFIG[el.dataset.bind]));
const letterText = CONFIG.loveLetter.replace("{relationshipLabel}", CONFIG.relationshipLabel);

/* ========================= Navigasi ========================= */
let current = 1;
function go(n) {
  const from = $("#p" + current), to = $("#p" + n);
  if (!to || n === current) return;
  from.classList.add("leaving");
  setTimeout(() => {
    from.classList.remove("active", "leaving");
    to.classList.add("active");
    current = n;
    if (n === 2) initGauge();
    if (n === 6) initMemory();
    if (n === 4) buildBouquet();
    if (n === 5) openLetter();
    window.scrollTo(0, 0);
  }, reduced ? 0 : 400);
}
document.addEventListener("click", e => {
  const b = e.target.closest("[data-go]");
  if (!b) return;
  if (b.dataset.go === "2") startMusic();
  go(+b.dataset.go);
});

/* ========================= Hati & sparkle ========================= */
(function ambient() {
  if (reduced) return;
  const fx = $("#fx"), icons = ["💗", "💕", "✨", "🌸", "🤍"];
  for (let i = 0; i < 14; i++) {
    const s = document.createElement("span");
    s.className = "fx";
    s.textContent = icons[i % icons.length];
    s.style.cssText = `left:${Math.random() * 100}%;font-size:${12 + Math.random() * 16}px;` +
      `--t:${12 + Math.random() * 10}s;--d:${-Math.random() * 20}s;--x:${(Math.random() - .5) * 80}px`;
    fx.appendChild(s);
  }
})();

function burst(x, y, items = ["🌸", "💗", "🌷", "✨"]) {
  if (reduced) return;
  for (let i = 0; i < 18; i++) {
    const p = document.createElement("span");
    p.className = "petal";
    p.textContent = items[i % items.length];
    p.style.cssText = `left:${x}px;top:${y}px;--dx:${(Math.random() - .5) * 340}px;--dy:${-60 - Math.random() * 260}px`;
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1700);
  }
}

/* ========================= Musik & SFX ========================= */
let audio = null, playing = false;
const musicBtn = $("#musicBtn");
if (CONFIG.musicEnabled) {
  musicBtn.hidden = false;
  try { audio = new Audio(CONFIG.musicFile); audio.loop = true; audio.volume = .90; audio.onerror = () => (audio = null); } catch (_) {}
}
function setMusic(on) {
  if (!audio) { playing = false; }
  else if (on) audio.play().then(() => (playing = true)).catch(() => (playing = false)).finally(sync);
  else { audio.pause(); playing = false; }
  sync();
}
function sync() { musicBtn.setAttribute("aria-pressed", playing); musicBtn.textContent = playing ? "♪" : "♪̸";
  const pb = $("#playBtn"); if (pb) pb.textContent = playing ? "❚❚" : "▶"; }
function startMusic() { if (audio && !playing && !musicBtn.dataset.off) setMusic(true); }
musicBtn.addEventListener("click", () => {
  musicBtn.dataset.off = playing ? "1" : "";
  setMusic(!playing);
});
function chime() { // efek suara sederhana via WebAudio, tanpa file
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [659, 880, 1175].forEach((f, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = f; o.type = "sine";
      g.gain.setValueAtTime(.001, ctx.currentTime + i * .12);
      g.gain.exponentialRampToValueAtTime(.15, ctx.currentTime + i * .12 + .03);
      g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + i * .12 + .6);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * .12); o.stop(ctx.currentTime + i * .12 + .7);
    });
  } catch (_) {}
}

/* ========================= Love Test: meteran ========================= */
const SAYS = [[0,"rada geli sihh tapi how much do you love me?","🐱"],[1,"Noooooo","😿"],[25,"Sakit nih...","😾"],
  [50,"Setengah? rial or fake","😼"],[75,"duh saltink dikit","😻"],[100,"Alhamdulillah","😹"]];
(function drawGauge() {
  const cols = ["#FBD5E0","#F6A9BD","#EE7C99","#DB4A6F","#B8244F","#7F1535"];
  const p = (a, r) => `${100 + r * Math.cos(a)} ${100 - r * Math.sin(a)}`;
  $("#gaugeArcs").innerHTML = cols.map((c, i) => {
    const a0 = Math.PI * (1 - i / 6), a1 = Math.PI * (1 - (i + 1) / 6);
    return `<path d="M${p(a0,90)}A90 90 0 0 1 ${p(a1,90)}L${p(a1,52)}A52 52 0 0 0 ${p(a0,52)}Z" fill="${c}"/>`;
  }).join("");
})();
const love = $("#love");
function setGauge(v) {
  const st = [...SAYS].reverse().find(s => v >= s[0]);
  $("#say").textContent = st[1]; $("#cat").textContent = st[2];
  $("#pct").textContent = v + "%";
  $("#needle").style.transform = `rotate(${v * 1.8 - 90}deg)`;
}
function initGauge() { love.disabled = false; love.value = 0; $("#nextGauge").hidden = true; setGauge(0); }
love.addEventListener("input", () => { const v = +love.value; setGauge(v); if (v === 100) finale(); });
function finale() { // 100% -> 500% -> tak terhingga
  love.disabled = true; chime();
  let v = 100; const pct = $("#pct");
  const t = setInterval(() => {
    v += reduced ? 400 : 20;
    if (v >= 500) { clearInterval(t); pct.textContent = "∞"; $("#nextGauge").hidden = false; }
    else pct.textContent = v + "%";
  }, 40);
}

/* ========================= Tiga hadiah ========================= */
$$(".gbox").forEach(b => b.addEventListener("click", () => {
  if (b.classList.contains("opening")) return;
  b.classList.add("opening");
  const r = b.getBoundingClientRect();
  burst(r.left + r.width / 2, r.top + r.height / 3); chime();
  setTimeout(() => { go(+b.dataset.open); b.classList.remove("opening"); b.classList.add("seen"); }, reduced ? 0 : 750);
}));
function initMemory() {
  const img = $("#photo");
  img.onload = () => { img.hidden = false; $("#phFallback").hidden = true; };
  img.onerror = () => { img.hidden = true; $("#phFallback").hidden = false; };
  img.src = CONFIG.photoFile;
  $("#photoCap").textContent = CONFIG.photoCaption;
  $("#cover").onerror = e => (e.target.hidden = true);
  $("#cover").src = CONFIG.coverFile;
  $("#songT").textContent = CONFIG.songTitle; $("#songA").textContent = CONFIG.songArtist;
  $("#player").hidden = !(CONFIG.musicEnabled && audio);
  sync();
}
$("#playBtn").addEventListener("click", () => { musicBtn.dataset.off = playing ? "1" : ""; setMusic(!playing); });

/* ========================= Bouquet (SVG) ========================= */
function flower(cx, cy, size, color, type) {
  const petals = type === "daisy" ? 12 : type === "tulip" ? 5 : 8;
  let s = "";
  for (let i = 0; i < petals; i++) {
    const a = (360 / petals) * i;
    const rx = type === "daisy" ? size * .22 : size * .42, ry = type === "tulip" ? size * .62 : size * .5;
    s += `<ellipse cx="${cx}" cy="${cy - ry * .8}" rx="${rx}" ry="${ry}" fill="${color}" opacity=".92" transform="rotate(${a} ${cx} ${cy})"/>`;
  }
  const core = type === "rose" ? `<circle cx="${cx}" cy="${cy}" r="${size * .3}" fill="#fff" opacity=".45"/>` : "";
  return s + core + `<circle cx="${cx}" cy="${cy}" r="${size * .16}" fill="${type === "daisy" ? "#fbbf24" : "#9f1239"}"/>`;
}
function buildBouquet() {
  const colors = [CONFIG.primaryColor, "#FBCFE8", "#F9A8D4", "#fff", "#FB7185", "#FBCFE8", "#F472B6"];
  const pos = [[150, 80, 62], [90, 120, 52], [210, 120, 52], [55, 190, 44], [245, 190, 44], [120, 175, 46], [182, 172, 46]];
  let svg = `<path d="M150 330L95 250h110z" fill="#FBCFE8"/><path d="M150 330L128 250h44z" fill="#F9A8D4"/>`;
  pos.forEach(([x, y], i) => {
    svg += `<path class="stem" style="--d:${i * .2}s" d="M150 262C${150 + (x - 150) * .2} ${y + 90} ${x} ${y + 80} ${x} ${y}"/>`;
  });
  pos.forEach(([x, y, s], i) => {
    svg += `<g class="bloom" style="--d:${1 + i * .22}s">${flower(x, y, s, colors[i], CONFIG.flowerType)}</g>`;
  });
  svg += `<path d="M118 262c32 14 32 14 64 0l-8 22h-48z" fill="var(--rose)"/>`; // pita
  $("#bouquet").innerHTML = svg;
}

/* ========================= Surat ========================= */
let typer = null;
function openLetter() {
  $("#envelope").classList.remove("closed");
  $("#toggleLetter").textContent = "Tutup Surat";
  const out = $("#letterBody"); clearInterval(typer);
  if (reduced) { out.textContent = letterText; return; }
  out.textContent = ""; let i = 0;
  typer = setInterval(() => {
    out.textContent = letterText.slice(0, ++i);
    if (i >= letterText.length) clearInterval(typer);
  }, 32);
}
$("#toggleLetter").addEventListener("click", () => {
  const env = $("#envelope");
  if (env.classList.contains("closed")) openLetter();
  else { clearInterval(typer); env.classList.add("closed"); $("#toggleLetter").textContent = "Buka Surat Lagi"; }
});
$("#replay").addEventListener("click", () => { clearInterval(typer); go(1); });

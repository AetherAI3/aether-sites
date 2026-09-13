/* ============================================================
   MACH//DETAIL — BOOKING ENGINE (front-end wireframe)
   Slot logic is isolated in CONFIG so the production ledger
   (Nano script + Aether Cloud) can consume the same shape.
   Hours: Mon–Fri 08:00–17:00 · Sat 09:00–14:00 · Sun closed
   ============================================================ */

const CONFIG = {
  // day index (0 = Sun) → [openHour, closeHour] or null
  hours: { 0: null, 1: [8, 17], 2: [8, 17], 3: [8, 17], 4: [8, 17], 5: [8, 17], 6: [9, 14] },
  slotMinutes: 60,
  services: [
    { id: "standard",  name: "Standard Package",  tag: "INT + EXT DEEP CLEAN" },
    { id: "correction", name: "Paint Correction", tag: "MULTI-STAGE · SWIRL REMOVAL" },
    { id: "ceramic",   name: "Ceramic Coating",   tag: "LONG-TERM PROTECTION" },
  ],
};

const state = { day: null, slot: null, service: "standard" };

/* ---------- helpers ---------- */
const $ = (s, c = document) => c.querySelector(s);
const fmtHour = (h) => {
  const ap = h >= 12 ? "PM" : "AM";
  const hr = ((h + 11) % 12) + 1;
  return `${hr}:00 ${ap}`;
};

/* ---------- live OPEN / CLOSED pill in the nav ---------- */
(() => {
  const pill = $(".status-pill");
  if (!pill) return;
  const now = new Date();
  const span = CONFIG.hours[now.getDay()];
  const open = span && now.getHours() >= span[0] && now.getHours() < span[1];
  pill.classList.toggle("is-closed", !open);
  pill.querySelector(".label").textContent = open ? "SHOP STATUS: OPEN" : "SHOP STATUS: CLOSED";
})();

/* ---------- day chips (next 7 days, Sun disabled) ---------- */
const dayChips = $("#dayChips");
if (dayChips) {
  const names = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const btn = document.createElement("button");
    btn.className = "chip";
    btn.type = "button";
    btn.innerHTML = `${names[d.getDay()]} <b style="font-weight:400;opacity:.6">${d.getMonth() + 1}/${d.getDate()}</b>`;
    if (!CONFIG.hours[d.getDay()]) btn.disabled = true;           // Sundays locked out
    btn.addEventListener("click", () => {
      state.day = d; state.slot = null;
      dayChips.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderSlots(d);
      renderSummary();
    });
    dayChips.appendChild(btn);
  }
}

/* ---------- time slots for the selected day ---------- */
function renderSlots(day) {
  const grid = $("#slotGrid");
  grid.innerHTML = "";
  const [open, close] = CONFIG.hours[day.getDay()];
  for (let h = open; h < close; h += CONFIG.slotMinutes / 60) {
    const b = document.createElement("button");
    b.className = "slot";
    b.type = "button";
    b.textContent = fmtHour(h);
    b.addEventListener("click", () => {
      state.slot = fmtHour(h);
      grid.querySelectorAll(".slot").forEach((s) => s.classList.remove("is-active"));
      b.classList.add("is-active");
      renderSummary();
    });
    grid.appendChild(b);
  }
}

/* ---------- service selector ---------- */
const svcWrap = $("#svcSelect");
if (svcWrap) {
  CONFIG.services.forEach((s, i) => {
    const el = document.createElement("button");
    el.className = "svc-opt" + (i === 0 ? " is-active" : "");
    el.type = "button";
    el.innerHTML = `${s.name}<span>${s.tag}</span>`;
    el.addEventListener("click", () => {
      state.service = s.id;
      svcWrap.querySelectorAll(".svc-opt").forEach((o) => o.classList.remove("is-active"));
      el.classList.add("is-active");
      renderSummary();
    });
    svcWrap.appendChild(el);
  });
}

/* ---------- live summary ledger ---------- */
function renderSummary() {
  const out = $("#bookSummary");
  if (!out) return;
  const svc = CONFIG.services.find((s) => s.id === state.service);
  const day = state.day
    ? state.day.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
    : "—";
  out.innerHTML =
    `&gt; SERVICE&nbsp;&nbsp;: <b>${svc.name.toUpperCase()}</b><br>` +
    `&gt; DATE&nbsp;&nbsp;&nbsp;&nbsp;: <b>${day}</b><br>` +
    `&gt; ARRIVAL&nbsp;: <b>${state.slot || "—"}</b><br>` +
    `&gt; STATUS&nbsp;&nbsp;: <b>${state.day && state.slot ? "READY TO CONFIRM" : "AWAITING INPUT"}</b>`;
}
renderSummary();

/* ---------- confirm → writes a line into the terminal feed ----------
   INTEGRATION POINT: replace `pushLine` with a POST to the Nano
   endpoint that writes the appointment ledger on Aether Cloud and
   fires the SMS confirmation + reminder schedule. */
const term = $(".terminal__body");
function pushLine(html, cls = "") {
  if (!term) return;
  const cursor = term.querySelector(".cursor");
  const ln = document.createElement("span");
  ln.className = `ln is-on ${cls}`;
  ln.innerHTML = html;
  term.insertBefore(ln, cursor?.parentElement || null);
}

const confirmBtn = $("#confirmBtn");
if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    if (!state.day || !state.slot) {
      pushLine(`&gt; ERR 422 — pick a day and a slot first`, "dim");
      return;
    }
    const svc = CONFIG.services.find((s) => s.id === state.service);
    pushLine(
      `&gt; BOOK ${state.day.toLocaleDateString(undefined, { month: "2-digit", day: "2-digit" })} ${state.slot} — ${svc.name.toUpperCase()} <span class="ok">✓ QUEUED</span>`
    );
    pushLine(`&gt; SMS confirmation + 24h reminder scheduled`, "ok");
    confirmBtn.textContent = "SLOT RESERVED ✓";
    setTimeout(() => (confirmBtn.textContent = "CONFIRM BOOKING"), 2600);
  });
}

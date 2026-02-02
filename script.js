const $ = (sel) => document.querySelector(sel);

const year = $("#year");
if (year) year.textContent = new Date().getFullYear();

/** Mobile menu */
const burger = $("#burger");
const mobileNav = $("#mobileNav");
if (burger && mobileNav) {
  burger.addEventListener("click", () => {
    mobileNav.classList.toggle("isOpen");
    mobileNav.setAttribute("aria-hidden", mobileNav.classList.contains("isOpen") ? "false" : "true");
  });
}

/** Launchpad modal (Ctrl/Cmd + K) */
const palette = $("#palette");
const openPaletteBtn = $("#openPalette");
const closePaletteBtn = $("#closePalette");
const paletteBackdrop = $("#paletteBackdrop");
const paletteInput = $("#paletteInput");
const paletteList = $("#paletteList");

function openPalette() {
  if (!palette) return;
  palette.classList.add("isOpen");
  palette.setAttribute("aria-hidden", "false");
  setTimeout(() => paletteInput?.focus(), 0);
}

function closePalette() {
  if (!palette) return;
  palette.classList.remove("isOpen");
  palette.setAttribute("aria-hidden", "true");
  paletteInput && (paletteInput.value = "");
  filterPalette("");
}

function goTo(hash) {
  closePalette();
  const el = document.querySelector(hash);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function filterPalette(q) {
  if (!paletteList) return;
  const query = (q || "").trim().toLowerCase();
  paletteList.querySelectorAll("button[data-go]").forEach((btn) => {
    const txt = btn.textContent.toLowerCase();
    btn.style.display = txt.includes(query) ? "" : "none";
  });
}

openPaletteBtn?.addEventListener("click", openPalette);
closePaletteBtn?.addEventListener("click", closePalette);
paletteBackdrop?.addEventListener("click", closePalette);

document.addEventListener("keydown", (e) => {
  const key = e.key.toLowerCase();
  const meta = e.metaKey || e.ctrlKey;

  if (meta && key === "k") {
    e.preventDefault();
    if (palette?.classList.contains("isOpen")) closePalette();
    else openPalette();
  }
  if (key === "escape") closePalette();
});

paletteInput?.addEventListener("input", (e) => filterPalette(e.target.value));
paletteList?.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-go]");
  if (!btn) return;
  goTo(btn.getAttribute("data-go"));
});

/** Mini “AI outline” (local, no API) */
const projectForm = $("#projectForm");
const projectInput = $("#projectInput");
const outlineBox = $("#outlineBox");
const outlineText = $("#outlineText");

function buildOutline(text) {
  const t = (text || "").trim();
  const short = t.length > 90 ? t.slice(0, 90) + "…" : t;

  return [
    `Project: ${short || "—"}`,
    ``,
    `1) Clarify goals & constraints`,
    `   - Define success metrics (latency, cost, release frequency, reliability).`,
    `   - Identify constraints (deadlines, compliance, stack, team capacity).`,
    ``,
    `2) Current-state assessment`,
    `   - Architecture map + data flows`,
    `   - Performance hotspots + reliability risks`,
    `   - Security posture & access boundaries`,
    ``,
    `3) Target design`,
    `   - Service boundaries + API contracts`,
    `   - Observability baseline (logs/metrics/traces)`,
    `   - CI/CD strategy and rollout plan`,
    ``,
    `4) Delivery plan (phased)`,
    `   - Quick wins (1–2 weeks)`,
    `   - Core platform changes (2–6 weeks)`,
    `   - Hardening + scale (ongoing)`,
    ``,
    `5) AI automation opportunities`,
    `   - Safe automation candidates`,
    `   - Guardrails: auditing, evals, fallback modes`,
  ].join("\n");
}

projectForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const v = projectInput?.value || "";
  const out = buildOutline(v);
  if (outlineText) outlineText.textContent = out;
  if (outlineBox) outlineBox.hidden = false;
});

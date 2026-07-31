// ─────────────────────────────────────────
// ZOÖNOMIC ANNUAL PLAN — app.js
// ─────────────────────────────────────────

let isBird = true;
let activeIdx = 0;

// ── CONTENT (Supabase-backed, admin.html edits it) ──
// `goals` starts as the offline fallback from data.js and gets replaced by
// live Supabase content in init(), if available. Goal icons are intentionally
// not admin-editable — they stay a code/git change. Add an entry here when a
// new goal is created in admin; until then it falls back to GOAL_ICON_FALLBACK.
const GOAL_ICONS = {
  "01": "assets/icons/goal1.png",
  "02": "assets/icons/goal2.png",
  "03": "assets/icons/goal3.png",
  "04": "assets/icons/goal4.png",
  "05": "assets/icons/goal5.png"
};
const GOAL_ICON_FALLBACK = "•";
function getGoalIcon(number) {
  return GOAL_ICONS[number] || GOAL_ICON_FALLBACK;
}

// Icons are either an image path (assets/icons/*.png) or a plain-text
// fallback ("•"). Render accordingly so undefined goals still show a bullet.
function renderGoalIcon(icon, cls) {
  return /\.(png|jpe?g|svg|webp)$/i.test(icon)
    ? `<img class="${cls}" src="${icon}" alt="">`
    : icon;
}

let goals = defaultGoals;

// ── THEME ──

function toggleTheme() {
  isBird = !isBird;
  document.body.classList.toggle('rat', !isBird);
}

// ── INTRO ──

let introHeroDismissed = false;

function triggerIntroRipple(e) {
  if (introHeroDismissed) return;
  introHeroDismissed = true;

  const x = e && e.clientX ? e.clientX : window.innerWidth / 2;
  const y = e && e.clientY ? e.clientY : window.innerHeight / 2;
  spawnRipple(x, y);

  const hero = document.getElementById('introHero');
  const model = document.getElementById('titleModel');

  hero.classList.add('hidden');
  model.classList.remove('title-model-hero');
  model.classList.add('title-model-float');

  setTimeout(() => hero.remove(), 900);
}

function spawnRipple(x, y) {
  const ripple = document.createElement('div');
  ripple.className = 'intro-ripple';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  document.body.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

function enterSite() {
  const overlay = document.getElementById('introOverlay');
  overlay.classList.add('hidden');
  setTimeout(() => overlay.remove(), 700);
}

// ── CLOCK ──
// Weather: wire up to Open-Meteo (free, no API key needed) when ready.
// Example endpoint: https://api.open-meteo.com/v1/forecast?latitude=52.37&longitude=4.90&current_weather=true

function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  document.getElementById('clockDisplay').textContent = h + ':' + m;
}

async function fetchWeather() {
  try {
    const res = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=52.3782&longitude=4.9003&current_weather=true'
    );
    const data = await res.json();
    const temp = Math.round(data.current_weather.temperature);
    document.getElementById('weatherDisplay').textContent = `☁ ${temp}°C`;
  } catch {
    // silently fail — placeholder stays
  }
}

// ── LOAD CONTENT FROM SUPABASE (falls back to data.js / hardcoded HTML) ──

async function loadSiteContent() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient.from('site_content').select('*');
  if (error || !data) {
    if (error) console.error('Failed to load site content', error);
    return;
  }
  const content = {};
  data.forEach(row => { content[row.key] = row.value; });
  applySiteContent(content);
}

function applySiteContent(content) {
  const setText = (id, value) => {
    if (value == null) return;
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };
  setText('heroWordmark', content.hero_wordmark);
  setText('heroHint', content.hero_hint);
  setText('introEyebrow', content.intro_eyebrow);
  setText('introBody', content.intro_body);
  setText('introEnterBtn', content.intro_enter_label);

  if (content.intro_title != null) {
    const el = document.getElementById('introTitle');
    if (el) el.innerHTML = escapeHtml(content.intro_title).replace(/\n/g, '<br>');
  }
}

async function loadGoalsFromSupabase() {
  if (!supabaseClient) return null;

  const [{ data: goalRows, error: goalErr }, { data: ivRows, error: ivErr }] = await Promise.all([
    supabaseClient.from('goals').select('*').order('number', { ascending: true }),
    supabaseClient.from('interventions').select('*').order('sort_order', { ascending: true })
  ]);

  if (goalErr) console.error('Failed to load goals', goalErr);
  if (ivErr) console.error('Failed to load interventions', ivErr);
  if (goalErr || ivErr || !goalRows || !goalRows.length) return null;

  return goalRows.map(g => ({
    number: g.number,
    icon: getGoalIcon(g.number),
    name: g.name,
    shortName: g.short_name,
    desc: g.description,
    interventions: (ivRows || [])
      .filter(iv => iv.goal_id === g.id)
      .map(iv => ({
        id: iv.id,
        name: iv.name,
        progress: iv.progress,
        period: iv.period,
        body: iv.body,
        indicators: iv.indicators || []
      }))
  }));
}

// ── BROWSE VIEW ──

function renderBrowse() {
  document.getElementById('goalsGrid').innerHTML = goals.map((g, i) => `
    <div class="goal-thumb"
      onmouseenter="showHover('${g.shortName}')"
      onmouseleave="hideHover()"
      onclick="openDetail(${i})">
      <div class="br"></div>
      <div class="goal-icon">${renderGoalIcon(g.icon, 'goal-icon-img')}</div>
      <div class="goal-num">${g.number}</div>
    </div>
  `).join('');
}

function showHover(name) {
  const el = document.getElementById('hoverTitle');
  el.textContent = name;
  el.style.opacity = '1';
}

function hideHover() {
  document.getElementById('hoverTitle').style.opacity = '0';
}

// ── DETAIL VIEW ──

function openDetail(idx) {
  activeIdx = idx;
  const g = goals[idx];

  document.getElementById('detailIcon').innerHTML = renderGoalIcon(g.icon, 'detail-icon-img');
  document.getElementById('detailGoalLabel').textContent = `goal ${g.number}`;
  document.getElementById('detailGoalNum').textContent = `goal ${g.number}`;
  document.getElementById('detailTitle').textContent = g.name;
  document.getElementById('detailDesc').textContent = g.desc;

  // Goal strip (center column)
  document.getElementById('goalsStrip').innerHTML = goals.map((sg, si) => `
    <div class="strip-item ${si === idx ? 'active' : ''}"
      onclick="openDetail(${si})"
      title="${sg.shortName}">
      ${renderGoalIcon(sg.icon, 'strip-icon-img')}
    </div>
  `).join('');

  // Intervention rows
  document.getElementById('ivStack').innerHTML = g.interventions.map((iv, i) => `
    <div class="iv-row" onclick="openDrawer(${idx}, ${i})">
      <div class="iv-name">${iv.name}</div>
      <div class="iv-track">
        <div class="iv-fill" data-target="${iv.progress}" style="width: 0%"></div>
      </div>
      <div class="iv-arrow">→</div>
    </div>
  `).join('');

  hideHover();
  document.getElementById('browseView').style.display = 'none';
  document.getElementById('detailView').classList.add('active');
  closeDrawer();

  // Animate bars in
  setTimeout(() => {
    document.querySelectorAll('.iv-fill').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  }, 80);
}

function closeDetail() {
  document.getElementById('detailView').classList.remove('active');
  document.getElementById('browseView').style.display = '';
  closeDrawer();
}

// ── INTERVENTION DRAWER ──

function openDrawer(gIdx, ivIdx) {
  const g = goals[gIdx];
  const iv = g.interventions[ivIdx];

  document.getElementById('dEyebrow').textContent = `Goal ${g.number} · Intervention ${ivIdx + 1}`;
  document.getElementById('dTitle').textContent = iv.name;
  document.getElementById('dPeriod').textContent = iv.period;
  document.getElementById('dBody').textContent = iv.body;
  document.getElementById('dIndicators').innerHTML = iv.indicators.map(ind => `
    <div class="drawer-ind">
      <div class="ind-dot"></div>
      <span>${ind}</span>
    </div>
  `).join('');

  document.getElementById('drawer').classList.add('open');
  document.getElementById('drawerOverlay').classList.add('open');
}

function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
  document.getElementById('drawerOverlay').classList.remove('open');
}

// ── DESKTOP WINDOWS ──

const YOUTUBE_PLAYLIST_URL = 'https://www.youtube.com/embed/videoseries?list=PLQLm_wUa7lVu8ZrPgih2_fjP4y_-2PT-w';

let windowZCounter = 60;
const windowOffsets = {
  annualReport: { x: 140, y: 110 },
  wildlifeCams: { x: 200, y: 140 },
  logbook:      { x: 100, y: 90 }
};

function openDeskWindow(id) {
  if (id === 'ecoLexicon') { openEcoLexicon(); return; }

  const win = document.getElementById('win-' + id);
  if (win.classList.contains('open')) {
    bringToFront(win);
    return;
  }

  const offset = windowOffsets[id] || { x: 150, y: 120 };
  win.style.left = offset.x + 'px';
  win.style.top = offset.y + 'px';

  win.classList.add('open');
  bringToFront(win);

  if (id === 'wildlifeCams') {
    const embed = document.getElementById('videoEmbed');
    if (!embed.querySelector('iframe')) {
      embed.innerHTML = `<iframe src="${YOUTUBE_PLAYLIST_URL}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    }
  }

  if (id === 'annualReport') populateReport();
  if (id === 'logbook') {
    showLogbookFeed();
  }
}

function closeDeskWindow(id) {
  const win = document.getElementById('win-' + id);
  win.classList.remove('open');
  if (win.classList.contains('maximized')) restoreWindow(win, id);

  if (id === 'wildlifeCams') {
    document.getElementById('videoEmbed').innerHTML = '<p class="video-hint">Loading playlist…</p>';
  }
}

function bringToFront(win) {
  windowZCounter++;
  win.style.zIndex = windowZCounter;
}

// ── ECO-LEXICON WORD CLOUD ──

// rough scatter, percentages within the panel — tweak freely
// (kept clear of the 50/50 hub so nothing sits on top of it)
// keyed by term id (not array order) so re-ordering ecoLexiconData never reshuffles the layout
const ecoLexiconPositions = {
  "anthroponic-system":        { x: 18, y: 22 },
  "biomimicry":                { x: 40, y: 14 },
  "biotope":                   { x: 63, y: 15 },
  "chthulucene":                { x: 84, y: 24 },
  "deep-ecology":               { x: 12, y: 48 },
  "eco-emotions":               { x: 30, y: 68 },
  "eco-sexuality":              { x: 50, y: 76 },
  "eco-somatics":               { x: 71, y: 70 },
  "ecocentrism":                 { x: 88, y: 50 },
  "other-than-human-lifeform":  { x: 22, y: 84 },
  "speaker-for-the-living":     { x: 78, y: 86 },
  "zoonomic-institute":          { x: 50, y: 8 }
};

let ecoLexiconBuilt = false;
let ecoExpandedItem = null;
let ecoMouse = { x: -9999, y: -9999 };
let ecoRafId = null;

function buildEcoLexicon() {
  if (ecoLexiconBuilt) return;
  const cloud = document.getElementById('ecoLexiconCloud');

  ecoLexiconData.forEach((term, i) => {
    const pos = ecoLexiconPositions[term.id] || { x: 50, y: 50 };

    const item = document.createElement('div');
    item.className = 'wc-item';
    item.style.left = pos.x + '%';
    item.style.top = pos.y + '%';

    const float = document.createElement('div');
    float.className = 'wc-float';
    float.style.setProperty('--dur', (6 + Math.random() * 4).toFixed(2) + 's');
    float.style.setProperty('--delay', (Math.random() * 4).toFixed(2) + 's');
    float.style.setProperty('--dx', (Math.random() * 26 - 13).toFixed(1) + 'px');
    float.style.setProperty('--dy', (Math.random() * 26 - 13).toFixed(1) + 'px');

    const scale = document.createElement('div');
    scale.className = 'wc-scale';

    const card = document.createElement('div');
    card.className = 'wc-card';

    const flip = document.createElement('div');
    flip.className = 'wc-flip';

    const front = document.createElement('div');
    front.className = 'wc-face wc-front';
    front.innerHTML = `<div class="wc-face-clip"><img src="${term.img}" alt="${term.label}"></div>`;

    const back = document.createElement('div');
    back.className = 'wc-face wc-back';
    back.innerHTML = `
      <div class="wc-face-clip">
        <img src="${term.backImg}" alt="${term.label} — back">
        <div class="wc-back-content">
          <div class="wc-back-header">${term.label}</div>
          <div class="wc-back-sub">${term.subtitle}</div>
          <div class="wc-back-body">${term.body}</div>
        </div>
      </div>
      <button class="wc-back-close" onclick="event.stopPropagation(); collapseEcoItem();">← back to word cloud</button>
    `;

    flip.appendChild(front);
    flip.appendChild(back);
    card.appendChild(flip);
    scale.appendChild(card);
    float.appendChild(scale);

    const label = document.createElement('div');
    label.className = 'wc-label';
    label.textContent = term.label;
    float.appendChild(label);

    item.appendChild(float);
    cloud.appendChild(item);

    card.addEventListener('click', e => {
      e.stopPropagation();
      toggleEcoItem(item);
    });
  });

  ecoLexiconBuilt = true;
}

function toggleEcoItem(item) {
  if (item.classList.contains('expanded')) {
    collapseEcoItem();
    return;
  }
  if (ecoExpandedItem) collapseEcoItem();

  item.querySelector('.wc-scale').style.transform = 'scale(1)';
  item.classList.add('expanded');
  document.getElementById('ecoLexiconCloud').classList.add('eco-cloud--dimmed');
  ecoExpandedItem = item;
}

function collapseEcoItem() {
  if (!ecoExpandedItem) return;
  ecoExpandedItem.classList.remove('expanded');
  document.getElementById('ecoLexiconCloud').classList.remove('eco-cloud--dimmed');
  ecoExpandedItem = null;
}

function openEcoLexicon() {
  document.getElementById('ecoLexiconOverlay').classList.add('open');
  buildEcoLexicon();
  document.addEventListener('mousemove', trackEcoMouse);
  if (!ecoRafId) ecoRafId = requestAnimationFrame(ecoLoop);
}

function closeEcoLexicon() {
  collapseEcoItem();
  document.getElementById('ecoLexiconPanel').classList.remove('hunt-mode');
  updateEcoHuntBadge();
  document.getElementById('ecoLexiconOverlay').classList.remove('open');
  document.removeEventListener('mousemove', trackEcoMouse);
  if (ecoRafId) { cancelAnimationFrame(ecoRafId); ecoRafId = null; }
}

function closeEcoLexiconOnBackdrop(e) {
  if (e.target === e.currentTarget) closeEcoLexicon();
}

function trackEcoMouse(e) {
  ecoMouse.x = e.clientX;
  ecoMouse.y = e.clientY;
}

function ecoLoop() {
  const cloud = document.getElementById('ecoLexiconCloud');
  const hub = cloud.querySelector('.eco-hub');
  const svg = document.getElementById('ecoLines');
  const cloudRect = cloud.getBoundingClientRect();
  const hubRect = hub.getBoundingClientRect();
  const hubX = hubRect.left + hubRect.width / 2 - cloudRect.left;
  const hubY = hubRect.top + hubRect.height / 2 - cloudRect.top;

  let linesSVG = '';

  cloud.querySelectorAll('.wc-item').forEach(item => {
    if (item.classList.contains('expanded')) return;

    const cardEl = item.querySelector('.wc-card');
    const rect = cardEl.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dist = Math.hypot(ecoMouse.x - cx, ecoMouse.y - cy);
    const proximity = Math.max(0, 1 - dist / 220);
    const scaleVal = 1 + proximity * 0.5;
    item.querySelector('.wc-scale').style.transform = `scale(${scaleVal.toFixed(3)})`;

    linesSVG += `<line x1="${hubX}" y1="${hubY}" x2="${cx - cloudRect.left}" y2="${cy - cloudRect.top}" />`;
  });

  svg.innerHTML = linesSVG;
  ecoRafId = requestAnimationFrame(ecoLoop);
}

// ── ECO-LEXICON HUNT — real-world scavenger hunt map ──

function toggleEcoHuntView() {
  const panel = document.getElementById('ecoLexiconPanel');
  const enteringHunt = !panel.classList.contains('hunt-mode');
  if (enteringHunt) collapseEcoItem();
  panel.classList.toggle('hunt-mode', enteringHunt);
  updateEcoHuntBadge();
}

function updateEcoHuntBadge() {
  const badge = document.getElementById('ecoHuntBadge');
  const inHunt = document.getElementById('ecoLexiconPanel').classList.contains('hunt-mode');
  badge.innerHTML = inHunt
    ? `<span class="eco-hunt-badge-line">← word</span><span class="eco-hunt-badge-line">cloud</span>`
    : `<span class="eco-hunt-badge-line">eco-lexicon</span><span class="eco-hunt-badge-line">hunt</span>`;
}

// clicking the site background (not a window, folder, goal, or theme toggle) closes any open windows
document.addEventListener('click', e => {
  if (e.target.closest('.desk-window')) return;
  if (e.target.closest('.desktop-folder')) return;
  if (e.target.closest('.goal-thumb')) return;
  if (e.target.closest('#themeAnimal')) return;
  if (e.target.closest('#ecoLexiconOverlay')) return;

  document.querySelectorAll('.desk-window.open').forEach(win => {
    closeDeskWindow(win.id.replace('win-', ''));
  });
});

// folder click opens window
document.querySelectorAll('.desktop-folder').forEach(folder => {
  folder.addEventListener('click', () => {
    openDeskWindow(folder.dataset.window);
  });
});

// ── WINDOW DRAGGING ──

(function initWindowDrag() {
  let dragWin = null, startX, startY, startLeft, startTop;

  document.addEventListener('mousedown', e => {
    const titlebar = e.target.closest('.desk-window-titlebar');
    if (!titlebar || e.target.closest('.win-dot')) return;

    const winId = titlebar.dataset.win;
    dragWin = document.getElementById(winId);
    if (dragWin.classList.contains('maximized')) { dragWin = null; return; }
    bringToFront(dragWin);

    const rect = dragWin.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startLeft = rect.left;
    startTop = rect.top;

    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragWin) return;
    dragWin.style.left = (startLeft + e.clientX - startX) + 'px';
    dragWin.style.top = (startTop + e.clientY - startY) + 'px';
  });

  document.addEventListener('mouseup', () => { dragWin = null; });
})();

// ── WINDOW RESIZING (corner drag handle) ──

(function initWindowResize() {
  const MIN_WIDTH = 380;
  const MIN_HEIGHT = 280;
  let resizeWin = null, startX, startY, startWidth, startHeight;

  document.addEventListener('mousedown', e => {
    const handle = e.target.closest('.desk-window-resize-handle');
    if (!handle) return;

    resizeWin = document.getElementById(handle.dataset.resizeWin);
    if (!resizeWin || resizeWin.classList.contains('maximized')) { resizeWin = null; return; }

    bringToFront(resizeWin);
    const rect = resizeWin.getBoundingClientRect();
    startX = e.clientX;
    startY = e.clientY;
    startWidth = rect.width;
    startHeight = rect.height;

    e.preventDefault();
    e.stopPropagation();
  });

  document.addEventListener('mousemove', e => {
    if (!resizeWin) return;
    const maxWidth = window.innerWidth - resizeWin.getBoundingClientRect().left - 12;
    const maxHeight = window.innerHeight - resizeWin.getBoundingClientRect().top - 12;

    const newWidth = Math.min(maxWidth, Math.max(MIN_WIDTH, startWidth + (e.clientX - startX)));
    const newHeight = Math.min(maxHeight, Math.max(MIN_HEIGHT, startHeight + (e.clientY - startY)));

    resizeWin.style.width = newWidth + 'px';
    resizeWin.style.height = newHeight + 'px';
    resizeWin.style.maxHeight = newHeight + 'px';
  });

  document.addEventListener('mouseup', () => { resizeWin = null; });
})();

// ── WINDOW MAXIMIZE / RESTORE (yellow titlebar dot) ──

const windowPreMaximizeState = {};

function toggleMaximize(id) {
  const win = document.getElementById('win-' + id);
  if (!win) return;

  if (win.classList.contains('maximized')) {
    restoreWindow(win, id);
  } else {
    windowPreMaximizeState[id] = {
      top: win.style.top, left: win.style.left,
      width: win.style.width, height: win.style.height,
      maxHeight: win.style.maxHeight
    };

    win.style.top = '4vh';
    win.style.left = '4vw';
    win.style.width = '92vw';
    win.style.height = '92vh';
    win.style.maxHeight = '92vh';
    win.classList.add('maximized');
    bringToFront(win);
  }
}

function restoreWindow(win, id) {
  const prev = windowPreMaximizeState[id];
  win.classList.remove('maximized');
  if (prev) {
    win.style.top = prev.top;
    win.style.left = prev.left;
    win.style.width = prev.width;
    win.style.height = prev.height;
    win.style.maxHeight = prev.maxHeight;
    delete windowPreMaximizeState[id];
  }
}

// Escape always gets you out of a maximized window
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  document.querySelectorAll('.desk-window.maximized').forEach(win => {
    restoreWindow(win, win.id.replace('win-', ''));
  });
});

// ── FOLDER ICON DRAGGING ──

(function initFolderDrag() {
  let dragFolder = null, startX, startY, origX, origY, didDrag = false;
  const DRAG_THRESHOLD = 5;

  document.querySelectorAll('.desktop-folder').forEach(folder => {
    folder.addEventListener('mousedown', e => {
      dragFolder = folder;
      didDrag = false;
      const rect = folder.getBoundingClientRect();
      startX = e.clientX;
      startY = e.clientY;
      origX = rect.left;
      origY = rect.top;

      e.preventDefault();
    });
  });

  document.addEventListener('mousemove', e => {
    if (!dragFolder) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!didDrag && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD) return;

    if (!didDrag) {
      didDrag = true;
      dragFolder.classList.add('drag-active');
      dragFolder.style.position = 'fixed';
      dragFolder.style.left = origX + 'px';
      dragFolder.style.top = origY + 'px';
    }

    dragFolder.style.left = (origX + dx) + 'px';
    dragFolder.style.top = (origY + dy) + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (dragFolder) {
      dragFolder.classList.remove('drag-active');
      dragFolder = null;
    }
  });
})();

// ── ANNUAL REPORT BOOK VIEWER ──

const ANNUAL_PLAN_PAGE_COUNT = 10; // assets/annualplan/0.jpg .. 9.jpg
let annualPlanSpreadIndex = 0;

function renderAnnualPlanSpread() {
  const left = annualPlanSpreadIndex * 2;
  const right = left + 1;
  const hasRight = right < ANNUAL_PLAN_PAGE_COUNT;
  const totalSpreads = Math.ceil(ANNUAL_PLAN_PAGE_COUNT / 2);

  document.getElementById('bookPageLeft').src = `assets/annualplan/${left}.jpg`;
  const rightImg = document.getElementById('bookPageRight');
  rightImg.src = hasRight ? `assets/annualplan/${right}.jpg` : '';
  rightImg.style.visibility = hasRight ? 'visible' : 'hidden';

  const lastPage = hasRight ? right : left;
  document.getElementById('bookPageIndicator').textContent =
    `pages ${left + 1}–${lastPage + 1} of ${ANNUAL_PLAN_PAGE_COUNT}`;

  document.querySelector('.book-nav--prev').disabled = annualPlanSpreadIndex === 0;
  document.querySelector('.book-nav--next').disabled = annualPlanSpreadIndex >= totalSpreads - 1;
}

function nextAnnualPlanSpread() {
  const totalSpreads = Math.ceil(ANNUAL_PLAN_PAGE_COUNT / 2);
  if (annualPlanSpreadIndex < totalSpreads - 1) {
    annualPlanSpreadIndex++;
    renderAnnualPlanSpread();
  }
}

function prevAnnualPlanSpread() {
  if (annualPlanSpreadIndex > 0) {
    annualPlanSpreadIndex--;
    renderAnnualPlanSpread();
  }
}

function populateReport() {
  annualPlanSpreadIndex = 0;
  renderAnnualPlanSpread();
}

// ── ANNUAL REPORT LIGHTBOX ──

let lightboxPageIndex = 0;

function openLightbox(pageIndex) {
  lightboxPageIndex = pageIndex;
  renderLightbox();
  document.getElementById('imageLightbox').classList.add('open');
}

function renderLightbox() {
  document.getElementById('lightboxImg').src = `assets/annualplan/${lightboxPageIndex}.jpg`;
  document.querySelector('.lightbox-nav--prev').disabled = lightboxPageIndex === 0;
  document.querySelector('.lightbox-nav--next').disabled = lightboxPageIndex >= ANNUAL_PLAN_PAGE_COUNT - 1;
}

function lightboxPrev() {
  if (lightboxPageIndex > 0) {
    lightboxPageIndex--;
    renderLightbox();
  }
}

function lightboxNext() {
  if (lightboxPageIndex < ANNUAL_PLAN_PAGE_COUNT - 1) {
    lightboxPageIndex++;
    renderLightbox();
  }
}

function closeLightbox() {
  document.getElementById('imageLightbox').classList.remove('open');
}

function closeLightboxOnBackdrop(e) {
  if (e.target === e.currentTarget) closeLightbox();
}

// ── LOGBOOK (Supabase-backed) ──

const LOGBOOK_TABLE = 'logbook_entries';
const LOGBOOK_BUCKET = 'logbook-media';

const supabaseReady = typeof SUPABASE_URL !== 'undefined' &&
  SUPABASE_URL && SUPABASE_ANON_KEY &&
  !SUPABASE_URL.startsWith('YOUR_');

const supabaseClient = supabaseReady
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

let cachedEntries = [];
let currentLogbookFilter = '';
let editingEntryId = null;
let editingExistingMedia = null;

let currentMediaType = 'image';
let currentMediaData = null;
let audioRecorder = null;
let audioChunks = [];
let isRecording = false;
let drawCtx = null;
let drawHistory = [];
let isDrawing = false;
let isEraser = false;
let drawColor = '#1A1A14';
let drawSize = 3;

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

async function loadLogEntries() {
  if (!supabaseClient) { cachedEntries = []; return cachedEntries; }
  const { data, error } = await supabaseClient
    .from(LOGBOOK_TABLE)
    .select('*')
    .order('entry_date', { ascending: false })
    .order('entry_time', { ascending: false });
  if (error) {
    console.error('Failed to load logbook entries', error);
    cachedEntries = [];
    return cachedEntries;
  }
  cachedEntries = data || [];
  return cachedEntries;
}

async function refreshLogbookView(filter) {
  await loadLogEntries();
  renderLogbookEntries(filter);
  renderTimeline();
}

// Views
async function showLogbookFeed() {
  document.getElementById('logbookFeedView').style.display = '';
  document.getElementById('logbookCreateView').style.display = 'none';
  document.getElementById('logbookWindowTitle').textContent = 'Zoöp Logbook';
  document.getElementById('logbookEntries').innerHTML = '<div class="logbook-empty">loading…</div>';
  currentLogbookFilter = '';
  editingEntryId = null;
  editingExistingMedia = null;
  await refreshLogbookView();
}

function showLogbookCreate() {
  document.getElementById('logbookFeedView').style.display = 'none';
  document.getElementById('logbookCreateView').style.display = '';
  document.getElementById('logbookWindowTitle').textContent = 'New Entry';
  resetCreateForm();
}

function resetCreateForm() {
  editingEntryId = null;
  editingExistingMedia = null;
  document.querySelector('.logbook-submit').textContent = 'Submit Entry';

  const now = new Date();
  document.getElementById('logDate').value = now.toISOString().slice(0, 10);
  document.getElementById('logTime').value = now.toTimeString().slice(0, 5);
  document.getElementById('logObservations').value = '';
  document.getElementById('logText').value = '';
  document.getElementById('logWeather').value = 'overcast';
  currentMediaData = null;
  currentMediaType = 'image';
  switchMediaTab('image');
  clearAllPreviews();
  initDrawCanvas();
}

function editLogEntry(id) {
  const entry = cachedEntries.find(e => e.id === id);
  if (!entry) return;

  editingEntryId = id;
  editingExistingMedia = {
    media_type: entry.media_type || null,
    media_url: entry.media_url || null,
    media_path: entry.media_path || null
  };

  document.getElementById('logbookFeedView').style.display = 'none';
  document.getElementById('logbookCreateView').style.display = '';
  document.getElementById('logbookWindowTitle').textContent = 'Edit Entry';

  document.getElementById('logDate').value = entry.entry_date || '';
  document.getElementById('logTime').value = entry.entry_time || '';
  document.getElementById('logWeather').value = entry.weather || 'overcast';
  document.getElementById('logObservations').value = entry.observations || '';
  document.getElementById('logText').value = entry.notes || '';

  currentMediaData = null;
  clearAllPreviews();
  initDrawCanvas();

  // a saved drawing is just a PNG at this point, so show it (and let it be
  // replaced) under the photo tab rather than needing a separate preview slot
  const tab = entry.media_type === 'audio' ? 'audio' : entry.media_type === 'video' ? 'video' : 'image';
  switchMediaTab(tab);

  if (entry.media_url) {
    const previewId = tab === 'audio' ? 'audioPreview' : tab === 'video' ? 'videoPreview' : 'imagePreview';
    const preview = document.getElementById(previewId);
    if (tab === 'audio') preview.innerHTML = `<audio src="${escapeHtml(entry.media_url)}" controls></audio>`;
    else if (tab === 'video') preview.innerHTML = `<video src="${escapeHtml(entry.media_url)}" controls></video>`;
    else preview.innerHTML = `<img src="${escapeHtml(entry.media_url)}" alt="current attachment">`;
  }

  document.querySelector('.logbook-submit').textContent = 'Save Changes';
}

function clearAllPreviews() {
  ['imagePreview', 'audioPreview', 'videoPreview'].forEach(id => {
    document.getElementById(id).innerHTML = '';
  });
  const photoInput = document.getElementById('logPhoto');
  if (photoInput) photoInput.value = '';
  const audioInput = document.getElementById('logAudio');
  if (audioInput) audioInput.value = '';
  const videoInput = document.getElementById('logVideo');
  if (videoInput) videoInput.value = '';
}

// Media tabs
function switchMediaTab(type) {
  currentMediaType = type;
  document.querySelectorAll('.media-tab').forEach(t => t.classList.toggle('active', t.dataset.type === type));
  document.querySelectorAll('.media-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + type).classList.add('active');
  if (type === 'drawing') initDrawCanvas();
}

// File uploads
function handleFileUpload(inputId, previewId, type) {
  const input = document.getElementById(inputId);
  input.addEventListener('change', function() {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      currentMediaData = { type, data: e.target.result };
      const preview = document.getElementById(previewId);
      if (type === 'image') preview.innerHTML = `<img src="${e.target.result}" alt="preview">`;
      else if (type === 'video') preview.innerHTML = `<video src="${e.target.result}" controls></video>`;
      else if (type === 'audio') preview.innerHTML = `<audio src="${e.target.result}" controls></audio>`;
    };
    reader.readAsDataURL(file);
  });
}

handleFileUpload('logPhoto', 'imagePreview', 'image');
handleFileUpload('logAudio', 'audioPreview', 'audio');
handleFileUpload('logVideo', 'videoPreview', 'video');

// Audio recording
async function toggleAudioRec() {
  const btn = document.getElementById('audioRecBtn');
  const status = document.getElementById('audioRecStatus');

  if (isRecording) {
    audioRecorder.stop();
    btn.classList.remove('recording');
    btn.textContent = 'record';
    status.textContent = 'processing…';
    isRecording = false;
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioRecorder = new MediaRecorder(stream);
    audioChunks = [];
    audioRecorder.ondataavailable = e => audioChunks.push(e.data);
    audioRecorder.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      const blob = new Blob(audioChunks, { type: 'audio/webm' });
      const reader = new FileReader();
      reader.onload = e => {
        currentMediaData = { type: 'audio', data: e.target.result };
        document.getElementById('audioPreview').innerHTML = `<audio src="${e.target.result}" controls></audio>`;
        status.textContent = 'recorded';
      };
      reader.readAsDataURL(blob);
    };
    audioRecorder.start();
    isRecording = true;
    btn.classList.add('recording');
    btn.textContent = 'stop';
    status.textContent = 'recording…';
  } catch {
    status.textContent = 'mic access denied';
  }
}

// Drawing canvas
const DRAW_COLORS = ['#1A1A14','#FFFFFF','#C94848','#D8813B','#4E7A3A','#5B9BD5','#9B59B6','#F5F0DC','#A89880','#DEE8C0'];

function initDrawCanvas() {
  const canvas = document.getElementById('drawCanvas');
  if (!canvas) return;
  drawCtx = canvas.getContext('2d');
  canvas.width = 480;
  canvas.height = 300;
  drawCtx.fillStyle = '#FFFDF5';
  drawCtx.fillRect(0, 0, canvas.width, canvas.height);
  drawHistory = [drawCtx.getImageData(0, 0, canvas.width, canvas.height)];

  const colorsEl = document.getElementById('drawColors');
  colorsEl.innerHTML = DRAW_COLORS.map((c, i) =>
    `<div class="draw-color ${i === 0 ? 'active' : ''}" style="background:${c}" onclick="setDrawColor('${c}',this)"></div>`
  ).join('');

  const pointFromEvent = e => {
    const src = e.touches && e.touches.length ? e.touches[0] : e;
    const r = canvas.getBoundingClientRect();
    const sx = canvas.width / r.width;
    const sy = canvas.height / r.height;
    return { x: (src.clientX - r.left) * sx, y: (src.clientY - r.top) * sy };
  };

  const startDraw = e => {
    isDrawing = true;
    const p = pointFromEvent(e);
    drawCtx.beginPath();
    drawCtx.moveTo(p.x, p.y);
  };
  const moveDraw = e => {
    if (!isDrawing) return;
    if (e.cancelable) e.preventDefault();
    const p = pointFromEvent(e);
    drawCtx.lineWidth = drawSize;
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
    drawCtx.strokeStyle = isEraser ? '#FFFDF5' : drawColor;
    drawCtx.lineTo(p.x, p.y);
    drawCtx.stroke();
  };
  const endDraw = () => {
    if (isDrawing) {
      isDrawing = false;
      drawHistory.push(drawCtx.getImageData(0, 0, canvas.width, canvas.height));
    }
  };

  canvas.onmousedown = startDraw;
  canvas.onmousemove = moveDraw;
  canvas.onmouseup = canvas.onmouseleave = endDraw;

  canvas.addEventListener('touchstart', startDraw, { passive: true });
  canvas.addEventListener('touchmove', moveDraw, { passive: false });
  canvas.addEventListener('touchend', endDraw);
  canvas.addEventListener('touchcancel', endDraw);
}

function setDrawColor(c, el) {
  drawColor = c;
  isEraser = false;
  document.getElementById('eraserBtn').classList.remove('active');
  document.querySelectorAll('.draw-color').forEach(d => d.classList.remove('active'));
  el.classList.add('active');
}

function setDrawSize(s, el) {
  drawSize = s;
  document.querySelectorAll('.draw-size').forEach(d => d.classList.remove('active'));
  el.classList.add('active');
}

function toggleEraser() {
  isEraser = !isEraser;
  document.getElementById('eraserBtn').classList.toggle('active', isEraser);
}

function clearCanvas() {
  const canvas = document.getElementById('drawCanvas');
  drawCtx.fillStyle = '#FFFDF5';
  drawCtx.fillRect(0, 0, canvas.width, canvas.height);
  drawHistory.push(drawCtx.getImageData(0, 0, canvas.width, canvas.height));
}

function undoCanvas() {
  if (drawHistory.length > 1) {
    drawHistory.pop();
    drawCtx.putImageData(drawHistory[drawHistory.length - 1], 0, 0);
  }
}

function getDrawingData() {
  const canvas = document.getElementById('drawCanvas');
  return canvas.toDataURL('image/png');
}

// Render feed
function renderLogbookEntries(filter) {
  const container = document.getElementById('logbookEntries');

  if (!supabaseReady) {
    container.innerHTML = `<div class="logbook-empty">Supabase isn't configured yet — add your project URL and anon key to supabase-config.js to enable the logbook.</div>`;
    return;
  }

  let entries = cachedEntries;
  if (filter) {
    const q = filter.toLowerCase();
    entries = entries.filter(e =>
      (e.observations || '').toLowerCase().includes(q) ||
      (e.notes || '').toLowerCase().includes(q) ||
      (e.entry_date || '').includes(q) ||
      (e.weather || '').toLowerCase().includes(q)
    );
  }

  if (!entries.length) {
    container.innerHTML = `<div class="logbook-empty">${filter ? 'no matching entries' : 'no entries yet — click the button to log your first observation'}</div>`;
    return;
  }

  container.innerHTML = entries.map(e => {
    let heroHtml = '';
    if (e.media_type && e.media_url) {
      if (e.media_type === 'image' || e.media_type === 'drawing') heroHtml = `<div class="logbook-entry-hero"><img src="${escapeHtml(e.media_url)}" alt="observation"></div>`;
      else if (e.media_type === 'video') heroHtml = `<div class="logbook-entry-hero"><video src="${escapeHtml(e.media_url)}" controls></video></div>`;
      else if (e.media_type === 'audio') heroHtml = `<div class="logbook-entry-hero"><audio src="${escapeHtml(e.media_url)}" controls></audio></div>`;
    }
    return `<div class="logbook-entry" data-date="${escapeHtml(e.entry_date)}">
      ${heroHtml}
      <div class="logbook-entry-body">
        <div class="logbook-entry-meta">
          <span>${escapeHtml(e.entry_date)}</span>
          <span>${escapeHtml(e.entry_time)}</span>
          <span>${escapeHtml(e.weather)}</span>
        </div>
        <div class="logbook-entry-observations">${escapeHtml(e.observations)}</div>
        ${e.notes ? `<div class="logbook-entry-text">${escapeHtml(e.notes)}</div>` : ''}
        <div class="logbook-entry-actions">
          <button class="logbook-entry-edit" onclick="editLogEntry('${e.id}')">edit</button>
          <button class="logbook-entry-delete" onclick="deleteLogEntry('${e.id}')">remove</button>
        </div>
      </div>
    </div>`;
  }).join('');
}

async function deleteLogEntry(id) {
  if (!supabaseClient) return;

  const entry = cachedEntries.find(e => e.id === id);
  if (entry && entry.media_path) {
    await supabaseClient.storage.from(LOGBOOK_BUCKET).remove([entry.media_path]);
  }

  const { error } = await supabaseClient.from(LOGBOOK_TABLE).delete().eq('id', id);
  if (error) {
    console.error('Failed to delete logbook entry', error);
    alert('Could not delete entry — check the console for details.');
    return;
  }

  await refreshLogbookView(currentLogbookFilter);
}

function filterLogbook() {
  currentLogbookFilter = document.getElementById('logbookSearch').value;
  renderLogbookEntries(currentLogbookFilter);
}

// Timeline
function renderTimeline() {
  const list = document.getElementById('timelineList');
  const dates = [...new Set(cachedEntries.map(e => e.entry_date))].sort().reverse();

  if (!dates.length) {
    list.innerHTML = '<div class="timeline-empty">no entries</div>';
    return;
  }

  list.innerHTML = dates.map(d => {
    const parts = d.split('-');
    const label = parts.length === 3 ? `${parts[2]}/${parts[1]}` : d;
    return `<div class="timeline-item" onclick="scrollToDate('${d}')" data-date="${d}">${label}</div>`;
  }).join('');
}

function scrollToDate(date) {
  document.querySelectorAll('.timeline-item').forEach(t => t.classList.toggle('active', t.dataset.date === date));
  const entry = document.querySelector(`.logbook-entry[data-date="${date}"]`);
  if (entry) entry.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Form submit
document.getElementById('logbookForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  if (!supabaseClient) {
    alert('Supabase is not configured yet — add your project URL and anon key to supabase-config.js.');
    return;
  }

  const isEditing = !!editingEntryId;
  const submitBtn = document.querySelector('.logbook-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'saving…';

  try {
    let mediaDataUrl = null;
    let mediaType = null;
    let hasNewMedia = false;

    if (currentMediaType === 'drawing') {
      // in edit mode, the canvas starts blank even for an existing drawing —
      // only treat it as new media if the user actually drew something
      if (!isEditing || drawHistory.length > 1) {
        mediaDataUrl = getDrawingData();
        mediaType = 'drawing';
        hasNewMedia = true;
      }
    } else if (currentMediaData) {
      mediaDataUrl = currentMediaData.data;
      mediaType = currentMediaData.type;
      hasNewMedia = true;
    }

    let mediaUrl = null;
    let mediaPath = null;
    if (hasNewMedia) {
      const blob = await (await fetch(mediaDataUrl)).blob();
      const ext = (blob.type.split('/')[1] || 'bin').split('+')[0];
      mediaPath = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabaseClient.storage
        .from(LOGBOOK_BUCKET)
        .upload(mediaPath, blob, { contentType: blob.type });
      if (uploadError) throw uploadError;
      mediaUrl = supabaseClient.storage.from(LOGBOOK_BUCKET).getPublicUrl(mediaPath).data.publicUrl;

      if (isEditing && editingExistingMedia && editingExistingMedia.media_path) {
        await supabaseClient.storage.from(LOGBOOK_BUCKET).remove([editingExistingMedia.media_path]);
      }
    }

    const entry = {
      entry_date: document.getElementById('logDate').value,
      entry_time: document.getElementById('logTime').value,
      weather: document.getElementById('logWeather').value,
      observations: document.getElementById('logObservations').value,
      notes: document.getElementById('logText').value
    };

    if (hasNewMedia) {
      entry.media_type = mediaType;
      entry.media_url = mediaUrl;
      entry.media_path = mediaPath;
    } else if (!isEditing) {
      entry.media_type = null;
      entry.media_url = null;
      entry.media_path = null;
    }
    // else: editing without new media — leave media fields untouched so the existing attachment is preserved

    if (isEditing) {
      const { error: updateError } = await supabaseClient.from(LOGBOOK_TABLE).update(entry).eq('id', editingEntryId);
      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await supabaseClient.from(LOGBOOK_TABLE).insert(entry);
      if (insertError) throw insertError;
    }

    editingEntryId = null;
    editingExistingMedia = null;
    await showLogbookFeed();
  } catch (err) {
    console.error('Failed to save logbook entry', err);
    alert('Could not save entry — check the console for details.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = isEditing ? 'Save Changes' : 'Submit Entry';
  }
});

// ── INIT ──

async function init() {
  if (supabaseClient) {
    await loadSiteContent();
    const remoteGoals = await loadGoalsFromSupabase();
    if (remoteGoals) goals = remoteGoals;
  }
  renderBrowse();
  updateClock();
  setInterval(updateClock, 10000);
  fetchWeather();
}

init();

// ─────────────────────────────────────────
// ZOÖNOMIC ANNUAL PLAN — app.js
// ─────────────────────────────────────────

let isBird = true;
let activeIdx = 0;

// ── THEME ──

function toggleTheme() {
  isBird = !isBird;
  document.body.classList.toggle('rat', !isBird);
  document.getElementById('themeBtn').textContent = isBird ? '🐀 rat mode' : '🐦 bird mode';
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

// ── BROWSE VIEW ──

function renderBrowse() {
  document.getElementById('goalsGrid').innerHTML = goals.map((g, i) => `
    <div class="goal-thumb"
      onmouseenter="showHover('${g.shortName}')"
      onmouseleave="hideHover()"
      onclick="openDetail(${i})">
      <div class="br"></div>
      <div class="goal-icon">${g.icon}</div>
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

  document.getElementById('detailIcon').textContent = g.icon;
  document.getElementById('detailGoalLabel').textContent = `goal ${g.number}`;
  document.getElementById('detailGoalNum').textContent = `goal ${g.number}`;
  document.getElementById('detailTitle').textContent = g.name;
  document.getElementById('detailDesc').textContent = g.desc;

  // Goal strip (center column)
  document.getElementById('goalsStrip').innerHTML = goals.map((sg, si) => `
    <div class="strip-item ${si === idx ? 'active' : ''}"
      onclick="openDetail(${si})"
      title="${sg.shortName}">
      ${sg.icon}
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
}

function closeDrawer() {
  document.getElementById('drawer').classList.remove('open');
}

// ── INIT ──

renderBrowse();
updateClock();
setInterval(updateClock, 10000);
fetchWeather();

// ─────────────────────────────────────────
// ZOÖNOMIC ANNUAL PLAN — app.js
// ─────────────────────────────────────────

let isBird = true;
let activeIdx = 0;

// ── THEME ──

function toggleTheme() {
  isBird = !isBird;
  document.body.classList.toggle('rat', !isBird);
}

// ── INTRO ──

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

  if (id === 'wildlifeCams') {
    document.getElementById('videoEmbed').innerHTML = '<p class="video-hint">Loading playlist…</p>';
  }
}

function bringToFront(win) {
  windowZCounter++;
  win.style.zIndex = windowZCounter;
}

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

// ── ANNUAL REPORT POPULATION ──

function populateReport() {
  const list = document.getElementById('reportGoalsList');
  list.innerHTML = goals.map(g => {
    const avg = Math.round(g.interventions.reduce((s, iv) => s + iv.progress, 0) / g.interventions.length);
    return `<div class="report-goal-item">
      <span class="report-goal-icon">${g.icon}</span>
      <span class="report-goal-name">${g.shortName}</span>
      <span class="report-goal-progress">${avg}%</span>
    </div>`;
  }).join('');
}

// ── LOGBOOK ──

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

function getLogEntries() {
  try { return JSON.parse(localStorage.getItem('zoopLogbook') || '[]'); }
  catch { return []; }
}

function saveLogEntries(entries) {
  localStorage.setItem('zoopLogbook', JSON.stringify(entries));
}

// Views
function showLogbookFeed() {
  document.getElementById('logbookFeedView').style.display = '';
  document.getElementById('logbookCreateView').style.display = 'none';
  document.getElementById('logbookWindowTitle').textContent = 'Logbook — Wildlife Observations';
  renderLogbookEntries();
  renderTimeline();
}

function showLogbookCreate() {
  document.getElementById('logbookFeedView').style.display = 'none';
  document.getElementById('logbookCreateView').style.display = '';
  document.getElementById('logbookWindowTitle').textContent = 'New Entry';
  resetCreateForm();
}

function resetCreateForm() {
  const now = new Date();
  document.getElementById('logDate').value = now.toISOString().slice(0, 10);
  document.getElementById('logTime').value = now.toTimeString().slice(0, 5);
  document.getElementById('logAnimals').value = '';
  document.getElementById('logText').value = '';
  document.getElementById('logWeather').value = 'overcast';
  currentMediaData = null;
  currentMediaType = 'image';
  switchMediaTab('image');
  clearAllPreviews();
  initDrawCanvas();
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

  canvas.onmousedown = e => {
    isDrawing = true;
    const r = canvas.getBoundingClientRect();
    const sx = canvas.width / r.width;
    const sy = canvas.height / r.height;
    drawCtx.beginPath();
    drawCtx.moveTo((e.clientX - r.left) * sx, (e.clientY - r.top) * sy);
  };
  canvas.onmousemove = e => {
    if (!isDrawing) return;
    const r = canvas.getBoundingClientRect();
    const sx = canvas.width / r.width;
    const sy = canvas.height / r.height;
    drawCtx.lineWidth = drawSize;
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
    drawCtx.strokeStyle = isEraser ? '#FFFDF5' : drawColor;
    drawCtx.lineTo((e.clientX - r.left) * sx, (e.clientY - r.top) * sy);
    drawCtx.stroke();
  };
  canvas.onmouseup = canvas.onmouseleave = () => {
    if (isDrawing) {
      isDrawing = false;
      drawHistory.push(drawCtx.getImageData(0, 0, canvas.width, canvas.height));
    }
  };
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
  let entries = getLogEntries();

  if (filter) {
    const q = filter.toLowerCase();
    entries = entries.filter(e =>
      (e.animals || '').toLowerCase().includes(q) ||
      (e.text || '').toLowerCase().includes(q) ||
      (e.date || '').includes(q) ||
      (e.weather || '').toLowerCase().includes(q)
    );
  }

  if (!entries.length) {
    container.innerHTML = `<div class="logbook-empty">${filter ? 'no matching entries' : 'no entries yet — click the button to log your first sighting'}</div>`;
    return;
  }

  container.innerHTML = entries.map((e, i) => {
    let heroHtml = '';
    if (e.media) {
      if (e.media.type === 'image') heroHtml = `<div class="logbook-entry-hero"><img src="${escapeHtml(e.media.data)}" alt="observation"></div>`;
      else if (e.media.type === 'drawing') heroHtml = `<div class="logbook-entry-hero"><img src="${escapeHtml(e.media.data)}" alt="drawing"></div>`;
      else if (e.media.type === 'video') heroHtml = `<div class="logbook-entry-hero"><video src="${escapeHtml(e.media.data)}" controls></video></div>`;
      else if (e.media.type === 'audio') heroHtml = `<div class="logbook-entry-hero"><audio src="${escapeHtml(e.media.data)}" controls></audio></div>`;
    } else if (e.photo) {
      heroHtml = `<div class="logbook-entry-hero"><img src="${escapeHtml(e.photo)}" alt="observation"></div>`;
    }
    const realIdx = getLogEntries().indexOf(e) !== -1 ? getLogEntries().findIndex(x => x.date === e.date && x.time === e.time && x.animals === e.animals) : i;
    return `<div class="logbook-entry" data-date="${escapeHtml(e.date)}">
      ${heroHtml}
      <div class="logbook-entry-body">
        <div class="logbook-entry-meta">
          <span>${escapeHtml(e.date)}</span>
          <span>${escapeHtml(e.time)}</span>
          <span>${escapeHtml(e.weather)}</span>
        </div>
        <div class="logbook-entry-animals">${escapeHtml(e.animals)}</div>
        ${e.text ? `<div class="logbook-entry-text">${escapeHtml(e.text)}</div>` : ''}
        <button class="logbook-entry-delete" onclick="deleteLogEntry(${realIdx})">remove</button>
      </div>
    </div>`;
  }).join('');
}

function deleteLogEntry(idx) {
  const entries = getLogEntries();
  entries.splice(idx, 1);
  saveLogEntries(entries);
  renderLogbookEntries();
  renderTimeline();
}

function filterLogbook() {
  const q = document.getElementById('logbookSearch').value;
  renderLogbookEntries(q);
}

// Timeline
function renderTimeline() {
  const list = document.getElementById('timelineList');
  const entries = getLogEntries();
  const dates = [...new Set(entries.map(e => e.date))].sort().reverse();

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
document.getElementById('logbookForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const entry = {
    date: document.getElementById('logDate').value,
    time: document.getElementById('logTime').value,
    weather: document.getElementById('logWeather').value,
    animals: document.getElementById('logAnimals').value,
    text: document.getElementById('logText').value,
    media: null
  };

  if (currentMediaType === 'drawing') {
    entry.media = { type: 'drawing', data: getDrawingData() };
  } else if (currentMediaData) {
    entry.media = currentMediaData;
  }

  const entries = getLogEntries();
  entries.unshift(entry);
  saveLogEntries(entries);

  showLogbookFeed();
});

// ── INIT ──

renderBrowse();
updateClock();
setInterval(updateClock, 10000);
fetchWeather();

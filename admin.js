// ─────────────────────────────────────────
// Zoöp Site Admin — admin.js
// Edits site_content / goals / interventions in Supabase.
// Same tables app.js reads on the public site.
// ─────────────────────────────────────────

const supabaseReady = typeof SUPABASE_URL !== 'undefined' &&
  SUPABASE_URL && SUPABASE_ANON_KEY &&
  !SUPABASE_URL.startsWith('YOUR_');

const supabaseClient = supabaseReady
  ? supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Defaults used by the "Import starting content" button — mirrors the
// hardcoded text originally in index.html.
const DEFAULT_SITE_CONTENT = {
  hero_wordmark: 'Mediamatic',
  hero_hint: 'tap the biotope to enter',
  intro_eyebrow: 'Zoöp · Mediamatic · Amsterdam · 2026',
  intro_title: 'Zoöp\nSeasonal Report',
  intro_body: "This is a living report of Mediamatic's commitment to the more-than-human world. Five goals. Eleven interventions. One biotope shared with species that were here long before us.",
  intro_enter_label: 'enter the biotope →'
};

let state = {
  content: {},
  goals: [] // { id, number, name, shortName, desc, interventions: [{ id, name, progress, period, body, indicators: [] }] }
};
let deletedGoalIds = [];
let deletedInterventionIds = [];

// ── AUTH ──

async function checkSession() {
  if (!supabaseClient) {
    document.getElementById('loginStatus').textContent =
      'Supabase is not configured yet — add your project URL and anon key to supabase-config.js.';
    document.getElementById('loginStatus').className = 'status-msg err';
    return;
  }
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    showAdmin();
  }
}

document.getElementById('loginBtn').addEventListener('click', async () => {
  const statusEl = document.getElementById('loginStatus');
  if (!supabaseClient) return;

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  statusEl.textContent = 'Logging in…';
  statusEl.className = 'status-msg';

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    statusEl.textContent = error.message;
    statusEl.className = 'status-msg err';
    return;
  }
  statusEl.textContent = '';
  showAdmin();
});

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await supabaseClient.auth.signOut();
  document.getElementById('adminScreen').classList.add('hidden');
  document.getElementById('loginScreen').classList.remove('hidden');
});

async function showAdmin() {
  document.getElementById('loginScreen').classList.add('hidden');
  document.getElementById('adminScreen').classList.remove('hidden');
  await loadAll();
}

// ── LOAD ──

async function loadAll() {
  const { data: contentRows } = await supabaseClient.from('site_content').select('*');
  state.content = {};
  (contentRows || []).forEach(r => { state.content[r.key] = r.value; });

  const { data: goalRows } = await supabaseClient.from('goals').select('*').order('number', { ascending: true });
  const { data: ivRows } = await supabaseClient.from('interventions').select('*').order('sort_order', { ascending: true });

  state.goals = (goalRows || []).map(g => ({
    id: g.id,
    number: g.number,
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
        indicators: Array.isArray(iv.indicators) ? iv.indicators.slice() : []
      }))
  }));
  deletedGoalIds = [];
  deletedInterventionIds = [];

  renderContentForm();
  renderGoals();
}

// ── INTRO TEXT FORM ──

function renderContentForm() {
  document.getElementById('f_hero_wordmark').value = state.content.hero_wordmark || '';
  document.getElementById('f_hero_hint').value = state.content.hero_hint || '';
  document.getElementById('f_intro_eyebrow').value = state.content.intro_eyebrow || '';
  document.getElementById('f_intro_title').value = state.content.intro_title || '';
  document.getElementById('f_intro_body').value = state.content.intro_body || '';
  document.getElementById('f_intro_enter_label').value = state.content.intro_enter_label || '';
}

function readContentForm() {
  state.content.hero_wordmark = document.getElementById('f_hero_wordmark').value;
  state.content.hero_hint = document.getElementById('f_hero_hint').value;
  state.content.intro_eyebrow = document.getElementById('f_intro_eyebrow').value;
  state.content.intro_title = document.getElementById('f_intro_title').value;
  state.content.intro_body = document.getElementById('f_intro_body').value;
  state.content.intro_enter_label = document.getElementById('f_intro_enter_label').value;
}

// ── GOALS / INTERVENTIONS FORM ──

function renderGoals() {
  const container = document.getElementById('goalsContainer');
  container.innerHTML = '';

  state.goals.forEach(g => {
    const node = document.getElementById('goalTemplate').content.cloneNode(true);
    const block = node.querySelector('.goal-block');

    block.querySelector('.goal-number-label').textContent = 'Goal ' + (g.number || '—');
    block.querySelector('.g-number').value = g.number || '';
    block.querySelector('.g-short-name').value = g.shortName || '';
    block.querySelector('.g-name').value = g.name || '';
    block.querySelector('.g-desc').value = g.desc || '';

    block.querySelector('.g-number').addEventListener('input', e => {
      g.number = e.target.value;
      block.querySelector('.goal-number-label').textContent = 'Goal ' + (g.number || '—');
    });
    block.querySelector('.g-short-name').addEventListener('input', e => { g.shortName = e.target.value; });
    block.querySelector('.g-name').addEventListener('input', e => { g.name = e.target.value; });
    block.querySelector('.g-desc').addEventListener('input', e => { g.desc = e.target.value; });

    block.querySelector('.remove-goal-btn').addEventListener('click', () => {
      if (!confirm(`Remove goal ${g.number} — "${g.name}"? This also removes its interventions. Takes effect after Save.`)) return;
      if (g.id) deletedGoalIds.push(g.id);
      state.goals = state.goals.filter(x => x !== g);
      renderGoals();
    });

    const ivList = block.querySelector('.interventions-list');
    g.interventions.forEach(iv => renderIntervention(ivList, g, iv));

    block.querySelector('.add-iv-btn').addEventListener('click', () => {
      g.interventions.push({ id: null, name: '', progress: 0, period: '', body: '', indicators: [] });
      renderGoals();
    });

    container.appendChild(node);
  });
}

function renderIntervention(container, goal, iv) {
  const node = document.getElementById('ivTemplate').content.cloneNode(true);
  const block = node.querySelector('.iv-block');

  block.querySelector('.iv-name').value = iv.name || '';
  block.querySelector('.iv-progress').value = iv.progress ?? 0;
  block.querySelector('.iv-period').value = iv.period || '';
  block.querySelector('.iv-body').value = iv.body || '';

  block.querySelector('.iv-name').addEventListener('input', e => { iv.name = e.target.value; });
  block.querySelector('.iv-progress').addEventListener('input', e => { iv.progress = Number(e.target.value) || 0; });
  block.querySelector('.iv-period').addEventListener('input', e => { iv.period = e.target.value; });
  block.querySelector('.iv-body').addEventListener('input', e => { iv.body = e.target.value; });

  const indList = block.querySelector('.indicators-list');
  function renderIndicators() {
    indList.innerHTML = '';
    iv.indicators.forEach((text, i) => {
      const row = document.createElement('div');
      row.className = 'indicator-row';

      const input = document.createElement('input');
      input.type = 'text';
      input.value = text;
      input.addEventListener('input', e => { iv.indicators[i] = e.target.value; });

      const rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'danger small';
      rm.textContent = '×';
      rm.addEventListener('click', () => { iv.indicators.splice(i, 1); renderIndicators(); });

      row.appendChild(input);
      row.appendChild(rm);
      indList.appendChild(row);
    });
  }
  renderIndicators();

  block.querySelector('.add-indicator-btn').addEventListener('click', () => {
    iv.indicators.push('');
    renderIndicators();
  });

  block.querySelector('.remove-iv-btn').addEventListener('click', () => {
    if (iv.id) deletedInterventionIds.push(iv.id);
    goal.interventions = goal.interventions.filter(x => x !== iv);
    renderGoals();
  });

  block.querySelector('.move-up-btn').addEventListener('click', () => {
    const idx = goal.interventions.indexOf(iv);
    if (idx > 0) {
      const tmp = goal.interventions[idx - 1];
      goal.interventions[idx - 1] = goal.interventions[idx];
      goal.interventions[idx] = tmp;
      renderGoals();
    }
  });
  block.querySelector('.move-down-btn').addEventListener('click', () => {
    const idx = goal.interventions.indexOf(iv);
    if (idx < goal.interventions.length - 1) {
      const tmp = goal.interventions[idx + 1];
      goal.interventions[idx + 1] = goal.interventions[idx];
      goal.interventions[idx] = tmp;
      renderGoals();
    }
  });

  container.appendChild(node);
}

document.getElementById('addGoalBtn').addEventListener('click', () => {
  const nextNum = String(state.goals.length + 1).padStart(2, '0');
  state.goals.push({ id: null, number: nextNum, name: '', shortName: '', desc: '', interventions: [] });
  renderGoals();
});

// ── IMPORT STARTING CONTENT ──

document.getElementById('importBtn').addEventListener('click', () => {
  const msg = 'This fills the form with the intro text and goals currently in data.js (the code defaults). ' +
    'It only takes effect once you click "Save all changes" below. ' +
    "If you've already saved custom interventions for these same goals, saving afterward may duplicate them — " +
    'best used once, on a freshly set-up site. Continue?';
  if (!confirm(msg)) return;

  state.content = Object.assign({}, DEFAULT_SITE_CONTENT);
  state.goals = defaultGoals.map(g => ({
    id: null,
    number: g.number,
    name: g.name,
    shortName: g.shortName,
    desc: g.desc,
    interventions: g.interventions.map(iv => ({
      id: null,
      name: iv.name,
      progress: iv.progress,
      period: iv.period,
      body: iv.body,
      indicators: iv.indicators.slice()
    }))
  }));

  renderContentForm();
  renderGoals();
});

// ── SAVE ──

document.getElementById('saveAllBtn').addEventListener('click', saveAll);

async function saveAll() {
  const statusEl = document.getElementById('saveStatus');
  statusEl.textContent = 'Saving…';
  statusEl.className = 'status-msg';

  readContentForm();

  try {
    const contentRows = Object.keys(state.content).map(key => ({ key, value: state.content[key] ?? '' }));
    if (contentRows.length) {
      const { error } = await supabaseClient.from('site_content').upsert(contentRows, { onConflict: 'key' });
      if (error) throw error;
    }

    if (deletedGoalIds.length) {
      const { error } = await supabaseClient.from('goals').delete().in('id', deletedGoalIds);
      if (error) throw error;
    }
    if (deletedInterventionIds.length) {
      const { error } = await supabaseClient.from('interventions').delete().in('id', deletedInterventionIds);
      if (error) throw error;
    }

    state.goals.forEach(g => { if (!g.id) g.id = crypto.randomUUID(); });
    const goalRows = state.goals.map(g => ({
      id: g.id,
      number: g.number,
      name: g.name,
      short_name: g.shortName,
      description: g.desc
    }));
    if (goalRows.length) {
      const { error } = await supabaseClient.from('goals').upsert(goalRows, { onConflict: 'id' });
      if (error) throw error;
    }

    const ivRows = [];
    state.goals.forEach(g => {
      g.interventions.forEach((iv, idx) => {
        if (!iv.id) iv.id = crypto.randomUUID();
        ivRows.push({
          id: iv.id,
          goal_id: g.id,
          name: iv.name,
          progress: Number(iv.progress) || 0,
          period: iv.period,
          body: iv.body,
          indicators: iv.indicators.filter(t => t.trim() !== ''),
          sort_order: idx
        });
      });
    });
    if (ivRows.length) {
      const { error } = await supabaseClient.from('interventions').upsert(ivRows, { onConflict: 'id' });
      if (error) throw error;
    }

    deletedGoalIds = [];
    deletedInterventionIds = [];

    statusEl.textContent = 'Saved. Refresh the live site to see the changes.';
    statusEl.className = 'status-msg ok';
  } catch (err) {
    console.error('Failed to save', err);
    statusEl.textContent = 'Could not save — ' + (err.message || 'check the console for details.');
    statusEl.className = 'status-msg err';
  }
}

// ── INIT ──

checkSession();

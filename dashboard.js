/* ============================================================
   Planora — ruang kerja
   Satu aksi utama per halaman, satu dialog untuk menambah item.
   Bahasa mengikuti negara/perangkat, bisa diganti di Profil.
   Tab, action plan, dan jadwal yang selesai masuk ke Riwayat.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const I18N = window.PlanoraI18n || {
    lang: 'id',
    mode: 'auto',
    country: '',
    t: (key) => key,
    locale: () => 'id-ID',
    setMode: () => {},
    onChange: () => {},
    languageName: () => 'Indonesia'
  };
  const t = (key, vars) => I18N.t(key, vars);
  const locale = () => I18N.locale();

  const ARROW = '<path d="M9 18l6-6-6-6"/>';
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 13l4 4L19 7"/></svg>';
  const X_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  const NAV = {
    personal: [
      { id: 'today', label: 'nav.today', icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>' },
      { id: 'plan', label: 'nav.plan', icon: '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 5.5l1 1 2-2M4 11.5l1 1 2-2M4 17.5l1 1 2-2"/>' },
      { id: 'calendar', label: 'nav.calendar', icon: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>' },
      { id: 'goals', label: 'nav.goals', icon: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>' }
    ],
    business: [
      { id: 'today', label: 'nav.today', icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>' },
      { id: 'plan', label: 'nav.okr', icon: '<path d="M5 20V10M12 20V4M19 20v-7"/>' },
      { id: 'calendar', label: 'nav.calendar', icon: '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>' },
      { id: 'goals', label: 'nav.roadmap', icon: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h5a3 3 0 0 0 3-3V8"/>' }
    ]
  };

  const PRIMARY = {
    today: { kind: 'task', label: 'action.addBlock' },
    plan: { kind: 'plan', label: 'action.newPlan' },
    calendar: { kind: 'agenda', label: 'action.addAgenda' },
    goals: { kind: 'goal', label: 'action.newGoal' }
  };

  const TAB_TYPES = {
    board: { labelKey: 'type.board', leadKey: 'type.boardLead' },
    checklist: { labelKey: 'type.checklist', leadKey: 'type.checklistLead' },
    notes: { labelKey: 'type.notes', leadKey: 'type.notesLead' }
  };

  const TAB_ICON = {
    board: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="10" rx="1.5"/><rect x="17" y="4" width="4" height="6" rx="1.5"/>',
    checklist: '<path d="M4 6l2 2 3-3"/><path d="M4 13l2 2 3-3"/><path d="M13 7h7M13 14h7M13 20h7"/>',
    notes: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>'
  };

  const PROFILE_ICON = '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/>';
  const HISTORY_ICON = '<path d="M4 4h16v4H4z"/><path d="M5 8v12h14V8M9 12h6"/>';
  const PLAN_ICON = '<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 5.5l1 1 2-2M4 11.5l1 1 2-2M4 17.5l1 1 2-2"/>';
  const DAY_ICON = '<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>';
  const EDIT_ICON = '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L8 18l-4 1 1-4z"/>';
  const TRASH_ICON = '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v5M14 11v5"/>';

  const PRIO = {
    high: { labelKey: 'prio.high', rank: 0 },
    medium: { labelKey: 'prio.medium', rank: 1 },
    low: { labelKey: 'prio.low', rank: 2 },
    none: { labelKey: '', rank: 3 }
  };

  const FILTERS = [
    ['all', 'history.filterAll'],
    ['tab', 'history.filterTabs'],
    ['plan', 'history.filterPlans'],
    ['day', 'history.filterDays']
  ];

  const session = loadSession();
  let board = loadBoard();
  let mode = sessionStorage.getItem('planora-mode') === 'business' ? 'business' : (session.mode === 'business' ? 'business' : 'personal');
  let view = readView();
  let selected = /^\d{4}-\d{2}-\d{2}$/.test(sessionStorage.getItem('planora-day') || '')
    ? sessionStorage.getItem('planora-day')
    : isoDate(new Date());
  let cursor = startOfMonth(parseISO(selected));
  let historyFilter = ['all', 'tab', 'plan', 'day'].includes(sessionStorage.getItem('planora-filter') || '')
    ? sessionStorage.getItem('planora-filter')
    : 'all';
  let toastTimer = 0;
  let toastAction = null;

  const side = document.getElementById('side');
  const sideToggle = document.getElementById('sideToggle');
  const sideBackdrop = document.getElementById('sideBackdrop');
  const sideKicker = document.getElementById('sideKicker');
  const sideNav = document.getElementById('sideNav');
  const modeTag = document.getElementById('modeTag');
  const modeTagBtn = document.querySelector('.mode-tag');
  const avatar = document.getElementById('avatar');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const logoutBtn = document.getElementById('logoutBtn');
  const barDate = document.getElementById('barDate');
  const barView = document.getElementById('barView');
  const primaryBtn = document.getElementById('primaryAction');
  const primaryLabel = document.getElementById('primaryLabel');
  const viewRoot = document.getElementById('viewRoot');
  const resetBtn = document.getElementById('resetBtn');
  const toastEl = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  const toastActionBtn = document.getElementById('toastAction');

  const sheet = document.getElementById('sheet');
  const sheetForm = document.getElementById('sheetForm');
  const sheetClose = document.getElementById('sheetClose');
  const sheetCancel = document.getElementById('sheetCancel');
  const sheetKicker = document.getElementById('sheetKicker');
  const sheetTitle = document.getElementById('sheetTitle');
  const sheetSub = document.getElementById('sheetSub');
  const sheetLabel = document.getElementById('sheetLabel');
  const sheetKind = document.getElementById('sheetKind');
  const sheetRef = document.getElementById('sheetRef');
  const sheetItem = document.getElementById('sheetItem');
  const typeField = document.getElementById('typeField');
  const priorityField = document.getElementById('priorityField');
  const sheetPriority = document.getElementById('sheetPriority');
  const timeField = document.getElementById('timeField');
  const sheetTime = document.getElementById('sheetTime');
  const daysField = document.getElementById('daysField');
  const sheetDays = document.getElementById('sheetDays');
  const detailField = document.getElementById('detailField');
  const sheetDetail = document.getElementById('sheetDetail');
  const durationField = document.getElementById('durationField');
  const sheetDuration = document.getElementById('sheetDuration');
  const sheetDurationUnit = document.getElementById('sheetDurationUnit');
  const titleInput = document.getElementById('sheetTitleInput');
  const sheetError = document.getElementById('sheetError');
  const confirmDialog = document.getElementById('confirmDialog');
  const confirmTitle = document.getElementById('confirmTitle');
  const confirmText = document.getElementById('confirmText');
  const confirmCancel = document.getElementById('confirmCancel');
  const confirmAccept = document.getElementById('confirmAccept');
  let confirmAction = null;

  /* ---------- Render ---------- */

  function render() {
    if ((view.startsWith('tab:') && !findTab(view.slice(4)))
      || (view.startsWith('archive:') && !findHistory(view.slice(8)))) {
      view = 'today';
      sessionStorage.setItem('planora-view', view);
    }

    const pack = current();
    const labels = viewLabels();
    const person = personName();

    document.documentElement.lang = I18N.lang;
    document.title = t('app.title', { view: labels[view] });
    sideKicker.textContent = mode === 'business' ? t('side.teamWorkspace') : t('side.workspace');
    sideNav.innerHTML = navHTML(pack);
    modeTag.textContent = t(mode === 'business' ? 'mode.business' : 'mode.personal');
    modeTagBtn.setAttribute('aria-label', t('user.modeActive', { mode: modeTag.textContent }));
    sideToggle.setAttribute('aria-label', t(side.classList.contains('is-open') ? 'side.closeMenu' : 'side.openMenu'));

    avatar.textContent = person.full.charAt(0).toUpperCase();
    userName.textContent = person.full;
    userEmail.textContent = session.guest ? t('user.notSignedIn') : session.email;
    logoutBtn.textContent = session.guest ? t('user.signIn') : t('user.signOut');

    barDate.textContent = fmt({ weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
    barView.textContent = labels[view];

    const action = primaryFor();
    primaryBtn.hidden = !action;
    if (action) primaryLabel.textContent = t(action.label);

    viewRoot.innerHTML = viewHTML();
    applyStaticI18n(document);
  }

  function readView() {
    const saved = sessionStorage.getItem('planora-view') || 'today';
    if (['today', 'plan', 'calendar', 'goals', 'history', 'profile'].includes(saved)) return saved;
    if (/^(tab|archive):[A-Za-z0-9-]+$/.test(saved)) return saved;
    return 'today';
  }

  function navHTML(pack) {
    const fixed = NAV[mode].map((item) => {
      const count = item.id === 'today'
        ? pack.tasks.filter((task) => !task.done).length
        : item.id === 'plan' ? openStepCount(pack) : 0;
      return navButton(item.id, t(item.label), item.icon, count);
    }).join('');

    const custom = pack.tabs.map((tab) => navTabRow(tab)).join('');

    return `
      ${fixed}
      ${custom ? `<div class="side-divider" aria-hidden="true"></div>${custom}` : ''}
      <div class="side-divider" aria-hidden="true"></div>
      <button type="button" class="side-link side-link-add" data-sheet="tab">
        ${icon('<path d="M12 5v14M5 12h14"/>')}
        <span>${t('nav.newTab')}</span>
      </button>
      ${navButton('history', t('nav.history'), HISTORY_ICON, pack.history.length)}
      ${navButton('profile', t('nav.profile'), PROFILE_ICON, 0)}
    `;
  }

  function navTabRow(tab) {
    const id = `tab:${tab.id}`;
    const active = view === id;
    const open = tab.items.filter((item) => !item.done).length;
    return `
      <div class="side-tab ${active ? 'is-active' : ''}">
        <button type="button" class="side-link ${active ? 'is-active' : ''}" data-nav="${esc(id)}"${active ? ' aria-current="page"' : ''}>
          ${icon(TAB_ICON[tab.type])}
          <span>${esc(tab.name)}</span>
          ${open ? `<span class="nav-count">${open}</span>` : ''}
        </button>
        <button type="button" class="side-tab-del" data-delete-tab="${esc(tab.id)}" aria-label="${esc(t('tab.deleteName', { name: tab.name }))}" title="${esc(t('tab.deleteName', { name: tab.name }))}">${X_ICON}</button>
      </div>
    `;
  }

  function navButton(id, label, iconBody, count) {
    const active = view === id;
    return `
      <button type="button" class="side-link ${active ? 'is-active' : ''}" data-nav="${esc(id)}"${active ? ' aria-current="page"' : ''}>
        ${icon(iconBody)}
        <span>${esc(label)}</span>
        ${count ? `<span class="nav-count">${count}</span>` : ''}
      </button>
    `;
  }

  function viewLabels() {
    const labels = mode === 'business'
      ? { today: t('nav.today'), plan: t('nav.okr'), calendar: t('nav.calendar'), goals: t('nav.roadmap'), history: t('nav.history'), profile: t('nav.profile') }
      : { today: t('nav.today'), plan: t('nav.plan'), calendar: t('nav.calendar'), goals: t('nav.goals'), history: t('nav.history'), profile: t('nav.profile') };
    const tab = view.startsWith('tab:') ? findTab(view.slice(4)) : null;
    const archived = view.startsWith('archive:') ? findHistory(view.slice(8)) : null;
    if (tab) labels[view] = tab.name;
    if (archived) labels[view] = historyTitle(archived);
    return labels;
  }

  function primaryFor() {
    if (view === 'profile' || view === 'history' || view.startsWith('archive:')) return null;
    if (view.startsWith('tab:')) {
      const tab = findTab(view.slice(4));
      if (!tab || tab.type === 'notes') return null;
      return tab.type === 'board'
        ? { kind: 'boarditem', ref: tab.id, label: 'action.addTask' }
        : { kind: 'checkitem', ref: tab.id, label: 'action.addItem' };
    }
    const base = PRIMARY[view];
    return base ? { kind: base.kind, ref: '', label: base.label } : null;
  }

  function viewHTML() {
    if (view === 'profile') return renderProfile();
    if (view === 'history') return renderHistory();
    if (view.startsWith('tab:')) {
      const tab = findTab(view.slice(4));
      if (tab) return renderTab(tab);
    }
    if (view.startsWith('archive:')) {
      const entry = findHistory(view.slice(8));
      if (entry) {
        if (entry.kind === 'plan') return renderArchivedPlan(entry);
        if (entry.kind === 'day') return renderArchivedDay(entry);
        return renderTab(entry, true);
      }
    }
    return renderers[view]();
  }

  const renderers = {
    today: renderToday,
    plan: renderPlan,
    calendar: renderCalendar,
    goals: renderGoals
  };

  function renderToday() {
    const pack = current();
    const tasks = sortedTasks(pack.tasks);
    const total = tasks.length;
    const done = tasks.filter((task) => task.done).length;
    const pct = percent(done, total);
    const remaining = total - done;
    const next = tasks.find((task) => !task.done);
    const person = personName();

    const headline = total === 0
      ? t('today.emptyHeadline')
      : remaining === 0
        ? t('today.allDoneHeadline')
        : t('today.remainingHeadline', { n: remaining });

    return `
      <section class="today-head">
        <div>
          <p class="hello">${greeting()}${person.first ? `, ${esc(person.first)}` : ''}</p>
          <h1>${headline}</h1>
          <p class="today-lead">${total === 0 ? t('today.emptyLead') : t('today.lead')}</p>
        </div>
        <div class="hero-side">
          <div class="ring ring-lg" style="--p:${pct}" role="img" aria-label="${esc(t('today.ringLabel', { pct }))}">
            <span>${pct}%</span>
          </div>
          <span class="streak"><i></i>${t('today.streak', { n: Math.max(0, Number(pack.streak) || 0) })}</span>
        </div>
      </section>

      <div class="today-layout">
        <section class="panel" aria-labelledby="todayTitle">
          <div class="panel-head">
            <h2 id="todayTitle">${t('today.scheduleTitle')}</h2>
            <div class="panel-actions">
              ${total && remaining === 0 ? `<button class="text-btn" type="button" data-save-day>${t('today.saveDay')}</button>` : ''}
              <span class="count-pill">${total ? t('today.countDone', { done, total }) : t('common.empty')}</span>
            </div>
          </div>
          ${total
            ? `<ul class="slots">${tasks.map((item) => slotHTML(item, 'task', item === next)).join('')}</ul>`
            : `<p class="empty">${t('today.emptySchedule')}</p>`}
          <button class="add-row" type="button" data-sheet="task">${t('today.addBlock')}</button>
        </section>

        ${focusCard(pack)}
      </div>

      ${tabsPanel(pack)}
    `;
  }

  function tabsPanel(pack) {
    const tabs = pack.tabs;
    return `
      <section class="panel today-tabs" aria-labelledby="todayTabsTitle">
        <div class="panel-head">
          <div>
            <h2 id="todayTabsTitle">${t('today.tabsTitle')}</h2>
            <p class="panel-lead">${t('today.tabsLead')}</p>
          </div>
          <div class="panel-actions">
            ${pack.history.length ? `<button class="text-btn" type="button" data-nav="history">${t('today.historyButton', { n: pack.history.length })}</button>` : ''}
            <button class="text-btn" type="button" data-nav="profile">${t('today.manage')}</button>
          </div>
        </div>
        ${tabs.length
          ? `<div class="tab-links">${tabs.map((tab) => {
            const open = tab.items.filter((item) => !item.done).length;
            const complete = tab.type !== 'notes' && tab.items.length > 0 && open === 0;
            const meta = tab.type === 'notes'
              ? t('today.tabMetaNotes')
              : complete ? t('today.tabMetaComplete', { type: t(TAB_TYPES[tab.type].labelKey) }) : t('today.tabMetaOpen', { n: open, type: t(TAB_TYPES[tab.type].labelKey) });
            return `
              <div class="tab-link-row">
                <button type="button" class="tab-link ${complete ? 'is-complete' : ''}" data-nav="tab:${esc(tab.id)}">
                  <span class="tab-ico">${icon(TAB_ICON[tab.type])}</span>
                  <span class="tab-link-body">
                    <strong>${esc(tab.name)}</strong>
                    <small>${meta}</small>
                  </span>
                  <span class="tab-link-arrow">${icon(ARROW)}</span>
                </button>
                <button type="button" class="tab-link-del" data-delete-tab="${esc(tab.id)}" aria-label="${esc(t('tab.deleteName', { name: tab.name }))}" title="${esc(t('tab.deleteName', { name: tab.name }))}">${X_ICON}</button>
              </div>
            `;
          }).join('')}</div>`
          : `<p class="empty">${t('today.noTabs')}</p>`}
        <button class="add-row" type="button" data-sheet="tab">${t('today.createTab')}</button>
      </section>
    `;
  }

  function focusCard(pack) {
    const goal = [...pack.goals].sort((a, b) => a.days - b.days)[0];
    if (!goal) {
      return `
        <section class="ink-card focus-card focus-empty" aria-label="${esc(t('today.focus'))}">
          <span class="goal-label">${t('today.focus')}</span>
          <h3>${t('today.noGoalTitle')}</h3>
          <p>${t('today.noGoalText')}</p>
          <button class="add-row" type="button" data-sheet="goal">${t('today.firstGoal')}</button>
        </section>
      `;
    }
    const progress = clamp(Number(goal.progress), 0, 100, 0);
    return `
      <section class="ink-card focus-card" aria-label="${esc(t('today.focus'))}">
        <span class="goal-label">${t('today.focus')}</span>
        <h3>${esc(goal.title)}</h3>
        ${goal.detail ? `<p>${esc(goal.detail)}</p>` : ''}
        <div class="goal-meta">
          <div class="bar"><i style="width:${progress}%"></i></div>
          <span>${progress}% · ${t('goals.daysLeft', { n: clamp(Number(goal.days), 1, 999, 30) })}</span>
        </div>
      </section>
    `;
  }

  function renderPlan() {
    const pack = current();
    const isBusiness = mode === 'business';
    const kicker = isBusiness ? t('okr.kicker') : t('plan.kicker');
    const headline = isBusiness ? t('okr.headline') : t('plan.headline');
    const lead = isBusiness ? t('okr.lead') : t('plan.lead');

    const list = pack.plans.length
      ? `<div class="plan-list">${pack.plans.map(planCard).join('')}</div>`
      : `
        <section class="panel empty-panel">
          <h2>${t('plan.emptyTitle')}</h2>
          <p class="panel-lead">${t('plan.emptyLead')}</p>
          <button class="btn" type="button" data-sheet="plan">${t('plan.emptyCta')}</button>
        </section>
      `;

    return `
      <section class="page-head">
        <p class="kicker">${kicker}</p>
        <h1>${headline}</h1>
        <p class="today-lead">${lead}</p>
      </section>
      ${list}
    `;
  }

  function planInfo(plan) {
    const steps = plan.steps || [];
    const done = steps.filter((step) => step.done).length;
    const total = steps.length;
    const duration = clamp(Number(plan.durationDays), 1, 3650, 30);
    const start = parseDateSafe(plan.startedAt) || startOfToday();
    const due = addDays(start, duration);
    const left = Math.round((due - startOfToday()) / 86400000);
    return { steps, done, total, pct: percent(done, total), duration, due, left };
  }

  function planCard(plan) {
    const info = planInfo(plan);
    const leftText = info.left > 0
      ? t('plan.daysLeft', { n: info.left })
      : info.left === 0 ? t('plan.dueToday') : t('plan.overdue', { n: Math.abs(info.left) });
    return `
      <section class="panel plan-card">
        <div class="plan-head">
          <div class="plan-head-body">
            <h2>${esc(plan.title)}</h2>
            ${plan.detail ? `<p class="panel-lead">${esc(plan.detail)}</p>` : ''}
            <div class="plan-chips">
              <span class="mini-chip">${t('plan.durationChip', { n: info.duration })}</span>
              <span class="mini-chip ${info.left < 0 ? 'is-late' : ''}">${leftText}</span>
              <span class="mini-chip">${t('plan.dueOn', { date: fmt({ day: 'numeric', month: 'short', year: 'numeric' }).format(info.due) })}</span>
            </div>
          </div>
          <div class="plan-head-actions">
            <span class="count-pill">${t('plan.stepsCount', { done: info.done, total: info.total })}</span>
            <button class="row-action" type="button" data-sheet="editplan" data-plan="${esc(plan.id)}" aria-label="${esc(t('plan.edit'))}" title="${esc(t('plan.edit'))}">${icon(EDIT_ICON)}</button>
            <button class="row-action danger" type="button" data-delete-plan="${esc(plan.id)}" aria-label="${esc(t('plan.delete'))}" title="${esc(t('plan.delete'))}">${icon(TRASH_ICON)}</button>
          </div>
        </div>
        <div class="bar plan-bar"><i style="width:${info.pct}%"></i></div>
        ${info.steps.length
          ? `<ul class="slots">${info.steps.map((step) => stepHTML(step, plan.id)).join('')}</ul>`
          : `<p class="empty">${t('plan.noSteps')}</p>`}
        <div class="plan-foot">
          <span class="plan-progress-text">${info.total ? t('plan.progress', { pct: info.pct, done: info.done, total: info.total }) : t('plan.noSteps')}</span>
          <div class="plan-actions">
            <button class="text-btn" type="button" data-finish-plan="${esc(plan.id)}">${t('plan.finish')}</button>
            <button class="add-row" type="button" data-sheet="step" data-plan="${esc(plan.id)}">${t('plan.addStep')}</button>
          </div>
        </div>
      </section>
    `;
  }

  function renderCalendar() {
    const todayIso = isoDate(new Date());
    const year = cursor.getFullYear();
    const month = cursor.getMonth();

    const cells = monthMatrix(year, month).map((day) => {
      if (!day) return '<span class="cal-cell is-empty" aria-hidden="true"></span>';
      const dateIso = isoDate(new Date(year, month, day));
      const count = agendaFor(dateIso).length;
      const classes = ['cal-cell'];
      if (dateIso === todayIso) classes.push('is-today');
      if (dateIso === selected) classes.push('is-selected');
      return `
        <button type="button" class="${classes.join(' ')}" data-day="${dateIso}" aria-label="${esc(fmt({ weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(parseISO(dateIso)))}"${dateIso === selected ? ' aria-current="date"' : ''}>
          <b>${day}</b>
          <span class="cal-dot${count ? '' : ' is-off'}"></span>
        </button>
      `;
    }).join('');

    const agenda = agendaFor(selected);
    const dows = dowLabels()
      .map((dow) => `<span class="cal-dow">${esc(dow)}</span>`).join('');

    return `
      <section class="page-head">
        <p class="kicker">${t('cal.kicker')}</p>
        <h1>${t('cal.headline')}</h1>
        <p class="today-lead">${t('cal.lead')}</p>
      </section>

      <div class="cal-layout">
        <section class="panel" aria-label="${esc(t('cal.monthLabel'))}">
          <div class="panel-head">
            <h2>${fmt({ month: 'long', year: 'numeric' }).format(cursor)}</h2>
            <div class="cal-nav">
              <button class="icon-btn" type="button" data-month="-1" aria-label="${esc(t('cal.prev'))}">${icon('<path d="M15 18l-6-6 6-6"/>')}</button>
              <button class="text-btn" type="button" data-month="0">${t('common.today')}</button>
              <button class="icon-btn" type="button" data-month="1" aria-label="${esc(t('cal.next'))}">${icon(ARROW)}</button>
            </div>
          </div>
          <div class="cal-grid">${dows}${cells}</div>
        </section>

        <section class="panel" aria-labelledby="agendaTitle">
          <div class="panel-head">
            <h2 id="agendaTitle">${fmt({ weekday: 'long', day: 'numeric', month: 'short' }).format(parseISO(selected))}</h2>
            <span class="count-pill">${agenda.length ? t('cal.agendaCount', { n: agenda.length }) : t('common.empty')}</span>
          </div>
          ${agenda.length
            ? `<ul class="slots">${agenda.map((item) => slotHTML(item, item.kind, false)).join('')}</ul>`
            : `<p class="empty">${t('cal.empty')}</p>`}
          <button class="add-row" type="button" data-sheet="agenda">${t('cal.addAgenda')}</button>
        </section>
      </div>
    `;
  }

  function renderGoals() {
    const pack = current();
    const isBusiness = mode === 'business';
    const kicker = isBusiness ? t('goals.roadmapKicker') : t('goals.kicker');
    const headline = isBusiness ? t('goals.roadmapHeadline') : t('goals.headline');
    const lead = t('goals.lead');

    const list = pack.goals.length
      ? `
        <div class="goal-list">
          ${pack.goals.map((goal) => {
            const progress = clamp(Number(goal.progress), 0, 100, 0);
            const days = clamp(Number(goal.days), 1, 999, 30);
            return `
              <article class="panel goal-row">
                <div class="goal-body">
                  <span class="goal-label">${t('goals.daysLeft', { n: days })}</span>
                  <h3>${esc(goal.title)}</h3>
                  ${goal.detail ? `<p>${esc(goal.detail)}</p>` : ''}
                </div>
                <div class="goal-side">
                  <strong>${progress}%</strong>
                  <div class="bar"><i style="width:${progress}%"></i></div>
                  <button class="text-btn goal-del" type="button" data-delete-goal="${esc(goal.id)}">${t('common.delete')}</button>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      `
      : `
        <section class="panel empty-panel">
          <h2>${t('goals.emptyTitle')}</h2>
          <p class="panel-lead">${t('goals.emptyLead')}</p>
          <button class="btn" type="button" data-sheet="goal">${t('goals.emptyCta')}</button>
        </section>
      `;

    return `
      <section class="page-head">
        <p class="kicker">${kicker}</p>
        <h1>${headline}</h1>
        <p class="today-lead">${lead}</p>
      </section>
      ${list}
    `;
  }

  function renderTab(tab, archived = false) {
    const info = TAB_TYPES[tab.type];
    const done = tab.items.filter((item) => item.done).length;
    const complete = tab.type !== 'notes' && tab.items.length > 0 && done === tab.items.length;
    const actions = archived
      ? `
        <button class="btn btn-ghost btn-sm" type="button" data-restore-tab="${esc(tab.id)}">${t('tab.restore')}</button>
        <button class="text-btn danger" type="button" data-delete-history="${esc(tab.id)}">${t('common.deleteForever')}</button>
      `
      : `
        <button class="text-btn" type="button" data-sheet="renametab" data-tab="${esc(tab.id)}">${t('tab.rename')}</button>
        <button class="text-btn" type="button" data-archive-tab="${esc(tab.id)}">${t('tab.archive')}</button>
        <button class="text-btn danger" type="button" data-delete-tab="${esc(tab.id)}">${t('common.delete')}</button>
      `;
    const head = `
      <section class="page-head tab-page-head">
        <div>
          <p class="kicker">${archived ? `${t('tab.archivedKicker')} · ` : ''}${t(info.labelKey)}</p>
          <h1>${esc(tab.name)}</h1>
          <p class="today-lead">${archived
            ? t('tab.archivedAt', { date: archivedDate(tab.archivedAt) })
            : t(info.leadKey)}</p>
        </div>
        <div class="tab-actions">${actions}</div>
      </section>
    `;
    const banner = !archived && complete
      ? `
        <section class="complete-banner">
          ${icon('<path d="M5 13l4 4L19 7"/>')}
          <div><strong>${t('tab.completeTitle')}</strong><p>${t('tab.completeText')}</p></div>
          <button class="btn btn-sm" type="button" data-archive-tab="${esc(tab.id)}">${t('tab.moveToHistory')}</button>
        </section>
      `
      : '';

    if (tab.type === 'notes') {
      return `${head}
        <section class="panel">
          <div class="panel-head">
            <h2>${t('tab.notesTitle')}</h2>
            <span class="count-pill" ${archived ? '' : 'id="notesStatus"'}>${archived ? t('tab.onlyRead') : t('tab.autosave')}</span>
          </div>
          <textarea class="notes-area" ${archived ? 'readonly' : `data-notes="${esc(tab.id)}"`} rows="12" placeholder="${esc(t('tab.notesPlaceholder'))}">${esc(tab.notes || '')}</textarea>
          <div class="notes-foot">
            <span class="empty">${archived ? t('tab.notesArchivedHint') : t('tab.notesHint')}</span>
          </div>
        </section>
      `;
    }

    if (tab.type === 'checklist') {
      return `${head}${banner}
        <section class="panel">
          <div class="panel-head">
            <h2>${t('checklist.title')}</h2>
            <span class="count-pill">${tab.items.length ? t('today.countDone', { done, total: tab.items.length }) : t('common.empty')}</span>
          </div>
          ${tab.items.length
            ? `<ul class="slots">${tab.items.map((item) => checkItemHTML(item, tab.id, archived)).join('')}</ul>`
            : `<p class="empty">${t('checklist.empty')}</p>`}
          ${archived ? '' : `<button class="add-row" type="button" data-sheet="checkitem" data-tab="${esc(tab.id)}">${t('checklist.add')}</button>`}
        </section>
      `;
    }

    const sorted = sortBoardItems(tab.items);
    return `${head}${banner}
      <section class="panel">
        <div class="panel-head">
          <h2>${t('board.title')}</h2>
          <span class="count-pill">${tab.items.length ? t('today.countDone', { done, total: tab.items.length }) : t('common.empty')}</span>
        </div>
        <p class="panel-lead">${t('board.lead')}</p>
        ${sorted.length
          ? `<ul class="item-list">${sorted.map((item) => itemRowHTML(item, tab.id, archived)).join('')}</ul>`
          : `<p class="empty">${t('board.empty')}</p>`}
        ${archived ? '' : `<button class="add-row" type="button" data-sheet="boarditem" data-tab="${esc(tab.id)}">${t('board.add')}</button>`}
      </section>
    `;
  }

  function renderArchivedPlan(plan) {
    const info = planInfo(plan);
    return `
      <section class="page-head tab-page-head">
        <div>
          <p class="kicker">${t('tab.archivedKicker')} · ${mode === 'business' ? t('okr.kicker') : t('plan.kicker')}</p>
          <h1>${esc(plan.title)}</h1>
          <p class="today-lead">${t('tab.archivedAt', { date: archivedDate(plan.archivedAt) })}</p>
        </div>
        <div class="tab-actions">
          <button class="btn btn-ghost btn-sm" type="button" data-restore-tab="${esc(plan.id)}">${t('plan.restore')}</button>
          <button class="text-btn danger" type="button" data-delete-history="${esc(plan.id)}">${t('common.deleteForever')}</button>
        </div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <div>
            <h2>${esc(plan.title)}</h2>
            ${plan.detail ? `<p class="panel-lead">${esc(plan.detail)}</p>` : ''}
          </div>
          <span class="count-pill">${t('plan.stepsCount', { done: info.done, total: info.total })}</span>
        </div>
        <div class="bar plan-bar"><i style="width:${info.pct}%"></i></div>
        <div class="plan-chips">
          <span class="mini-chip">${t('plan.durationChip', { n: info.duration })}</span>
          <span class="mini-chip">${t('plan.dueOn', { date: fmt({ day: 'numeric', month: 'short', year: 'numeric' }).format(info.due) })}</span>
        </div>
        ${info.steps.length
          ? `<ul class="slots">${info.steps.map((step) => `
            <li class="slot step ${step.done ? 'is-done' : ''}">
              <div><strong>${esc(step.title)}</strong></div>
              <span class="check-dot is-static ${step.done ? 'is-done' : ''}" aria-label="${esc(step.done ? t('common.done') : t('common.notDone'))}">${step.done ? CHECK : ''}</span>
            </li>
          `).join('')}</ul>`
          : `<p class="empty">${t('plan.noSteps')}</p>`}
      </section>
    `;
  }

  function renderArchivedDay(entry) {
    const tasks = [...(entry.tasks || [])].sort((a, b) => timeKey(a.time) - timeKey(b.time));
    return `
      <section class="page-head tab-page-head">
        <div>
          <p class="kicker">${t('tab.archivedKicker')} · ${t('history.kindDay')}</p>
          <h1>${esc(historyTitle(entry))}</h1>
          <p class="today-lead">${t('tab.archivedAt', { date: archivedDate(entry.archivedAt) })}</p>
        </div>
        <div class="tab-actions">
          <button class="btn btn-ghost btn-sm" type="button" data-reuse-day="${esc(entry.id)}">${t('history.reuseDay')}</button>
          <button class="text-btn danger" type="button" data-delete-history="${esc(entry.id)}">${t('common.deleteForever')}</button>
        </div>
      </section>
      <section class="panel">
        <div class="panel-head">
          <h2>${t('history.dayPanelTitle')}</h2>
          <span class="count-pill">${t('history.dayCount', { n: tasks.length })}</span>
        </div>
        ${tasks.length
          ? `<ul class="slots">${tasks.map((task) => `
            <li class="slot ${task.done ? 'is-done' : ''}">
              <span class="tl-time">${esc(task.time || '—')}</span>
              <div><strong>${esc(task.title)}</strong>${task.tag ? `<span class="slot-tag">${esc(task.tag)}</span>` : ''}</div>
              <span class="check-dot is-static ${task.done ? 'is-done' : ''}" aria-label="${esc(task.done ? t('common.done') : t('common.notDone'))}">${task.done ? CHECK : ''}</span>
            </li>
          `).join('')}</ul>`
          : `<p class="empty">${t('today.emptySchedule')}</p>`}
      </section>
    `;
  }

  function renderHistory() {
    const entries = historyEntries();
    const counts = { all: entries.length, tab: 0, plan: 0, day: 0 };
    entries.forEach((entry) => { counts[entry.kind || 'tab'] += 1; });
    const shown = historyFilter === 'all' ? entries : entries.filter((entry) => (entry.kind || 'tab') === historyFilter);

    return `
      <section class="page-head">
        <p class="kicker">${t('history.kicker')}</p>
        <h1>${t('history.headline')}</h1>
        <p class="today-lead">${t('history.lead')}</p>
      </section>
      <section class="panel" aria-labelledby="historyTitle">
        <div class="panel-head">
          <h2 id="historyTitle">${t('history.panelTitle')}</h2>
          <span class="count-pill">${t('history.count', { n: entries.length })}</span>
        </div>
        <div class="history-filters" role="group" aria-label="${esc(t('history.filterLabel'))}">
          ${FILTERS.map(([key, label]) => `
            <button type="button" class="filter-chip ${historyFilter === key ? 'is-active' : ''}" data-filter="${key}" aria-pressed="${historyFilter === key}">${t(label)}<span>${counts[key]}</span></button>
          `).join('')}
        </div>
        ${shown.length
          ? `<div class="history-list">${shown.map(historyRow).join('')}</div>`
          : `<div class="history-empty"><p class="empty">${entries.length ? t('history.noneInFilter') : t('history.empty')}</p><button class="text-btn" type="button" data-nav="today">${t('history.backToday')}</button></div>`}
      </section>
    `;
  }

  function historyRow(entry) {
    const kind = entry.kind || 'tab';
    const iconBody = kind === 'plan' ? PLAN_ICON : kind === 'day' ? DAY_ICON : TAB_ICON[entry.type] || TAB_ICON.board;
    let meta = '';
    if (kind === 'tab') {
      meta = `${t(TAB_TYPES[entry.type].labelKey)} · ${t('history.itemCount', { n: entry.items.length })}`;
    } else if (kind === 'plan') {
      const info = planInfo(entry);
      meta = `${t('plan.stepsCount', { done: info.done, total: info.total })} · ${t('plan.durationChip', { n: info.duration })}`;
    } else {
      meta = t('history.dayCount', { n: (entry.tasks || []).length });
    }
    const restore = kind === 'tab'
      ? `<button class="text-btn" type="button" data-restore-tab="${esc(entry.id)}">${t('history.restore')}</button>`
      : kind === 'plan'
        ? `<button class="text-btn" type="button" data-restore-tab="${esc(entry.id)}">${t('history.restore')}</button>`
        : `<button class="text-btn" type="button" data-reuse-day="${esc(entry.id)}">${t('history.reuseDay')}</button>`;
    return `
      <div class="tab-manage-row history-row">
        <span class="tab-ico">${icon(iconBody)}</span>
        <div class="tab-manage-body">
          <strong>${esc(historyTitle(entry))}</strong>
          <span>${meta} · ${archivedDate(entry.archivedAt)}</span>
        </div>
        <div class="tab-manage-actions">
          <button class="btn btn-ghost btn-sm" type="button" data-nav="archive:${esc(entry.id)}">${t('common.open')}</button>
          ${restore}
          <button class="row-action danger" type="button" data-delete-history="${esc(entry.id)}" aria-label="${esc(t('common.deleteForever'))}" title="${esc(t('common.deleteForever'))}">${icon(TRASH_ICON)}</button>
        </div>
      </div>
    `;
  }

  function renderProfile() {
    const pack = current();
    const person = personName();
    const isBusiness = mode === 'business';
    const entries = historyEntries().slice(0, 4);
    const langName = I18N.languageName();
    const countryName = regionName(I18N.country);
    const options = [
      ['auto', t('lang.auto'), countryName ? t('lang.autoDesc', { country: countryName }) : t('lang.autoUnknown')],
      ['id', t('lang.id'), t('lang.idDesc')],
      ['en', t('lang.en'), t('lang.enDesc')],
      ['zh', t('lang.zh'), t('lang.zhDesc')]
    ];

    return `
      <section class="page-head">
        <p class="kicker">${t('profile.kicker')}</p>
        <h1>${t('profile.headline')}</h1>
        <p class="today-lead">${t('profile.lead')}</p>
      </section>

      <div class="profile-layout">
        <section class="panel" aria-label="${esc(t('profile.account'))}">
          <div class="profile-id">
            <span class="avatar avatar-lg" aria-hidden="true">${esc(person.full.charAt(0).toUpperCase())}</span>
            <div>
              <h2>${esc(person.full)}</h2>
              <p>${session.guest ? t('profile.guestNote') : esc(session.email)}</p>
            </div>
          </div>
          <div class="profile-stats">
            <div class="profile-stat"><strong>${pack.tasks.filter((task) => !task.done).length}</strong><span>${t('profile.statBlocks')}</span></div>
            <div class="profile-stat"><strong>${pack.plans.length}</strong><span>${isBusiness ? t('nav.okr') : t('profile.statPlans')}</span></div>
            <div class="profile-stat"><strong>${pack.goals.length}</strong><span>${isBusiness ? t('profile.statMilestones') : t('profile.statGoals')}</span></div>
            <div class="profile-stat"><strong>${pack.tabs.length}</strong><span>${t('profile.statTabs')}</span></div>
            <div class="profile-stat"><strong>${pack.history.length}</strong><span>${t('profile.statHistory')}</span></div>
          </div>
          <button class="btn btn-ghost btn-sm btn-block" type="button" data-logout>${session.guest ? t('profile.signInCta') : t('profile.signOutCta')}</button>
        </section>

        <section class="panel" aria-labelledby="modePanelTitle">
          <div class="panel-head">
            <h2 id="modePanelTitle">${t('profile.modeTitle')}</h2>
            <span class="count-pill">${t(isBusiness ? 'mode.business' : 'mode.personal')}</span>
          </div>
          <p class="panel-lead">${t('profile.modeLead')}</p>
          <div class="mode-options">
            <button type="button" class="mode-option ${isBusiness ? '' : 'is-active'}" data-profile-mode="personal" aria-pressed="${!isBusiness}">
              <span class="mode-option-head">
                <strong>${t('mode.personal')}</strong>
                ${isBusiness ? '' : `<span class="count-pill">${t('common.active')}</span>`}
              </span>
              <small>${t('profile.personalDesc')}</small>
            </button>
            <button type="button" class="mode-option ${isBusiness ? 'is-active' : ''}" data-profile-mode="business" aria-pressed="${isBusiness}">
              <span class="mode-option-head">
                <strong>${t('mode.business')}</strong>
                ${isBusiness ? `<span class="count-pill">${t('common.active')}</span>` : ''}
              </span>
              <small>${t('profile.businessDesc')}</small>
            </button>
          </div>
        </section>
      </div>

      <section class="panel lang-panel" aria-labelledby="langTitle">
        <div class="panel-head">
          <div>
            <h2 id="langTitle">${t('lang.title')}</h2>
            <p class="panel-lead">${t('lang.lead')}</p>
          </div>
          <span class="count-pill">${esc(langName)}</span>
        </div>
        <div class="lang-options">
          ${options.map(([value, label, desc]) => `
            <button type="button" class="lang-option ${I18N.mode === value ? 'is-active' : ''}" data-lang="${value}" aria-pressed="${I18N.mode === value}">
              <span class="lang-option-head">
                <strong>${esc(label)}</strong>
                ${I18N.mode === value ? `<span class="count-pill">${t('common.active')}</span>` : ''}
              </span>
              <small>${esc(desc)}</small>
            </button>
          `).join('')}
        </div>
      </section>

      <section class="panel" aria-labelledby="profileHistoryTitle">
        <div class="panel-head">
          <div>
            <h2 id="profileHistoryTitle">${t('history.title')}</h2>
            <p class="panel-lead">${t('history.profileLead')}</p>
          </div>
          <button class="text-btn" type="button" data-nav="history">${t('history.openAll', { n: pack.history.length })}</button>
        </div>
        ${entries.length
          ? `<div class="history-list">${entries.map((entry) => {
            const kind = entry.kind || 'tab';
            const iconBody = kind === 'plan' ? PLAN_ICON : kind === 'day' ? DAY_ICON : TAB_ICON[entry.type] || TAB_ICON.board;
            return `
              <button class="history-line" type="button" data-nav="archive:${esc(entry.id)}">
                <span class="tab-ico">${icon(iconBody)}</span>
                <span class="history-line-body">
                  <strong>${esc(historyTitle(entry))}</strong>
                  <small>${t(kind === 'plan' ? 'history.kindPlan' : kind === 'day' ? 'history.kindDay' : 'history.kindTab')} · ${archivedDate(entry.archivedAt)}</small>
                </span>
                <span class="tab-link-arrow">${icon(ARROW)}</span>
              </button>
            `;
          }).join('')}</div>`
          : `<p class="empty">${t('history.emptyProfile')}</p>`}
      </section>

      <section class="panel tab-manage-panel" aria-labelledby="tabManageTitle">
        <div class="panel-head">
          <div>
            <h2 id="tabManageTitle">${t('profile.tabsTitle')}</h2>
            <p class="panel-lead">${t('profile.tabsLead')}</p>
          </div>
          <button class="btn btn-sm" type="button" data-sheet="tab">${t('nav.newTab')}</button>
        </div>
        ${pack.tabs.length
          ? `<div class="tab-manage">${pack.tabs.map(tabManageRow).join('')}</div>`
          : `<p class="empty">${t('profile.noTabs')}</p>`}
      </section>
    `;
  }

  function tabManageRow(tab) {
    const open = tab.items.filter((item) => !item.done).length;
    const meta = tab.type === 'notes'
      ? (tab.notes.trim() ? t('today.words', { n: tab.notes.trim().split(/\s+/).length }) : t('today.stillEmpty'))
      : t('profile.tabOpenOf', { open, total: tab.items.length });
    return `
      <div class="tab-manage-row">
        <span class="tab-ico">${icon(TAB_ICON[tab.type])}</span>
        <div class="tab-manage-body">
          <strong>${esc(tab.name)}</strong>
          <span>${t(TAB_TYPES[tab.type].labelKey)} · ${meta}</span>
        </div>
        <div class="tab-manage-actions">
          <button class="btn btn-ghost btn-sm" type="button" data-nav="tab:${esc(tab.id)}">${t('common.open')}</button>
          <button class="text-btn" type="button" data-archive-tab="${esc(tab.id)}">${t('tab.archive')}</button>
          <button class="text-btn danger" type="button" data-delete-tab="${esc(tab.id)}">${t('common.delete')}</button>
        </div>
      </div>
    `;
  }

  function slotHTML(item, kind, isNext) {
    const tag = [item.tag ? esc(item.tag) : '', isNext ? `<em>${t('today.next')}</em>` : '']
      .filter(Boolean).join(' · ');
    const label = t(item.done ? 'common.markPending' : 'common.markDone', { title: item.title });
    return `
      <li class="slot ${item.done ? 'is-done' : ''}${isNext ? ' is-now' : ''}">
        <span class="tl-time">${esc(item.time || '—')}</span>
        <div>
          <strong>${esc(item.title)}</strong>
          ${tag ? `<span class="slot-tag">${tag}</span>` : ''}
        </div>
        <button type="button" class="check-dot" data-check="${kind}" data-id="${esc(item.id)}" aria-pressed="${item.done ? 'true' : 'false'}" aria-label="${esc(label)}">${CHECK}</button>
      </li>
    `;
  }

  function stepHTML(step, planId) {
    const label = t(step.done ? 'common.markPending' : 'common.markDone', { title: step.title });
    return `
      <li class="slot step ${step.done ? 'is-done' : ''}">
        <div><strong>${esc(step.title)}</strong></div>
        <button type="button" class="check-dot" data-check="step" data-plan="${esc(planId)}" data-id="${esc(step.id)}" aria-pressed="${step.done ? 'true' : 'false'}" aria-label="${esc(label)}">${CHECK}</button>
      </li>
    `;
  }

  function checkItemHTML(item, tabId, archived = false) {
    const label = t(item.done ? 'common.markPending' : 'common.markDone', { title: item.title });
    return `
      <li class="slot step ${item.done ? 'is-done' : ''}">
        <div><strong>${esc(item.title)}</strong></div>
        <div class="item-actions">
          ${archived
            ? `<span class="check-dot is-static ${item.done ? 'is-done' : ''}" aria-label="${esc(item.done ? t('common.done') : t('common.notDone'))}">${item.done ? CHECK : ''}</span>`
            : `
              <button type="button" class="check-dot" data-check="item" data-tab="${esc(tabId)}" data-id="${esc(item.id)}" aria-pressed="${item.done ? 'true' : 'false'}" aria-label="${esc(label)}">${CHECK}</button>
              ${itemActionsHTML(tabId, item)}
            `}
        </div>
      </li>
    `;
  }

  function itemRowHTML(item, tabId, archived = false) {
    const prio = PRIO[item.priority] || PRIO.none;
    const label = t(item.done ? 'common.markPending' : 'common.markDone', { title: item.title });
    return `
      <li class="item-row ${item.done ? 'is-done' : ''}">
        ${archived
          ? `<span class="check-dot is-static ${item.done ? 'is-done' : ''}" aria-label="${esc(item.done ? t('common.done') : t('common.notDone'))}">${item.done ? CHECK : ''}</span>`
          : `<button type="button" class="check-dot" data-check="item" data-tab="${esc(tabId)}" data-id="${esc(item.id)}" aria-pressed="${item.done ? 'true' : 'false'}" aria-label="${esc(label)}">${CHECK}</button>`}
        <div class="item-body">
          <strong>${esc(item.title)}</strong>
          ${prio.labelKey ? `<span class="prio prio-${item.priority}">${t(prio.labelKey)}</span>` : ''}
        </div>
        ${archived ? '' : `<div class="item-actions">${itemActionsHTML(tabId, item)}</div>`}
      </li>
    `;
  }

  function itemActionsHTML(tabId, item) {
    return `
      <button class="row-action" type="button" data-sheet="edititem" data-tab="${esc(tabId)}" data-item="${esc(item.id)}" aria-label="${esc(t('common.editName', { title: item.title }))}">${icon(EDIT_ICON)}</button>
      <button class="row-action danger" type="button" data-delete-item="${esc(item.id)}" data-tab="${esc(tabId)}" aria-label="${esc(t('common.deleteName', { title: item.title }))}">${icon(TRASH_ICON)}</button>
    `;
  }

  function sortBoardItems(items) {
    return [...items].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      return (PRIO[a.priority] || PRIO.none).rank - (PRIO[b.priority] || PRIO.none).rank;
    });
  }

  function icon(body) {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }

  /* ---------- Dialog tambah ---------- */

  function openSheet(kind, ref = '', itemId = '') {
    const pack = current();
    let config;

    if (kind === 'goal') {
      config = {
        kicker: mode === 'business' ? t('goals.roadmapKicker') : t('goals.kicker'),
        title: t('sheet.goalTitle'),
        sub: t('sheet.goalSub'),
        label: t('sheet.goalLabel'),
        placeholder: t('sheet.goalPlaceholder'),
        days: true
      };
    } else if (kind === 'plan') {
      config = {
        kicker: mode === 'business' ? t('okr.kicker') : t('plan.kicker'),
        title: t('sheet.planTitle'),
        sub: t('sheet.planSub'),
        label: t('sheet.planLabel'),
        placeholder: t('sheet.planPlaceholder'),
        detail: true,
        duration: true
      };
    } else if (kind === 'editplan') {
      const plan = pack.plans.find((item) => item.id === ref);
      if (!plan) return;
      config = {
        kicker: mode === 'business' ? t('okr.kicker') : t('plan.kicker'),
        title: t('sheet.editPlanTitle'),
        sub: t('sheet.editPlanSub'),
        label: t('sheet.planLabel'),
        placeholder: t('sheet.planPlaceholder'),
        detail: true,
        duration: true,
        value: plan.title,
        detailValue: plan.detail || '',
        durationDays: plan.durationDays
      };
    } else if (kind === 'step') {
      const plan = pack.plans.find((item) => item.id === ref);
      if (!plan) return;
      config = {
        kicker: t('sheet.stepKicker'),
        title: t('sheet.stepTitle'),
        sub: plan.title,
        label: t('sheet.stepLabel'),
        placeholder: t('sheet.stepPlaceholder')
      };
    } else if (kind === 'agenda') {
      const isToday = selected === isoDate(new Date());
      config = {
        kicker: t('cal.kicker'),
        title: t('sheet.agendaTitle'),
        sub: isToday ? t('sheet.agendaSubToday') : t('sheet.agendaSub', { date: fmt({ weekday: 'long', day: 'numeric', month: 'short' }).format(parseISO(selected)) }),
        label: t('sheet.agendaLabel'),
        placeholder: t('sheet.agendaPlaceholder'),
        time: true
      };
    } else if (kind === 'tab') {
      config = {
        kicker: t('sheet.tabKicker'),
        title: t('sheet.tabTitle'),
        sub: t('sheet.tabSub'),
        label: t('sheet.tabLabel'),
        placeholder: t('sheet.tabPlaceholder'),
        tabType: true
      };
    } else if (kind === 'renametab') {
      const tab = pack.tabs.find((item) => item.id === ref);
      if (!tab) return;
      config = {
        kicker: t(TAB_TYPES[tab.type].labelKey),
        title: t('sheet.renameTitle'),
        sub: t('sheet.renameSub'),
        label: t('sheet.tabLabel'),
        placeholder: t('sheet.tabPlaceholder'),
        value: tab.name
      };
    } else if (kind === 'edititem') {
      const tab = pack.tabs.find((item) => item.id === ref);
      const item = tab ? tab.items.find((entry) => entry.id === itemId) : null;
      if (!item) return;
      config = {
        kicker: t(TAB_TYPES[tab.type].labelKey),
        title: tab.type === 'board' ? t('sheet.editTaskTitle') : t('sheet.editItemTitle'),
        sub: tab.name,
        label: tab.type === 'board' ? t('sheet.taskLabel') : t('sheet.itemLabel'),
        placeholder: item.title,
        value: item.title,
        priority: tab.type === 'board'
      };
    } else if (kind === 'boarditem') {
      const tab = pack.tabs.find((item) => item.id === ref);
      if (!tab) return;
      config = {
        kicker: t('board.title'),
        title: t('sheet.taskTitle'),
        sub: tab.name,
        label: t('sheet.taskLabel'),
        placeholder: t('sheet.taskPlaceholder'),
        priority: true
      };
    } else if (kind === 'checkitem') {
      const tab = pack.tabs.find((item) => item.id === ref);
      if (!tab) return;
      config = {
        kicker: t('checklist.title'),
        title: t('sheet.itemTitle'),
        sub: tab.name,
        label: t('sheet.itemLabel'),
        placeholder: t('sheet.itemPlaceholder')
      };
    } else {
      config = {
        kicker: t('today.kicker'),
        title: t('sheet.taskTitleToday'),
        sub: t('sheet.taskSubToday'),
        label: t('sheet.blockLabel'),
        placeholder: t('sheet.blockPlaceholder'),
        time: true
      };
    }

    sheetForm.reset();
    sheetKind.value = kind;
    sheetRef.value = ref;
    sheetItem.value = itemId;
    sheetKicker.textContent = config.kicker;
    sheetTitle.textContent = config.title;
    sheetSub.textContent = config.sub;
    sheetLabel.textContent = config.label;
    titleInput.placeholder = config.placeholder;
    titleInput.value = config.value || '';
    timeField.hidden = !config.time;
    daysField.hidden = !config.days;
    detailField.hidden = !config.detail;
    durationField.hidden = !config.duration;
    typeField.hidden = !config.tabType;
    priorityField.hidden = !config.priority;
    sheetDetail.value = config.detailValue || '';
    if (config.days) sheetDays.value = '30';
    if (config.duration) {
      const total = clamp(Number(config.durationDays), 1, 3650, 60);
      if (total % 30 === 0) {
        sheetDurationUnit.value = 'month';
        sheetDuration.value = String(total / 30);
      } else if (total % 7 === 0) {
        sheetDurationUnit.value = 'week';
        sheetDuration.value = String(total / 7);
      } else {
        sheetDurationUnit.value = 'day';
        sheetDuration.value = String(total);
      }
    }
    if (config.priority) {
      const tab = pack.tabs.find((item) => item.id === ref);
      const item = kind === 'edititem' && tab ? tab.items.find((entry) => entry.id === itemId) : null;
      sheetPriority.value = item && PRIO[item.priority] ? item.priority : 'medium';
    }
    sheetError.hidden = true;
    sheet.showModal();
    titleInput.focus();
  }

  function showError(message) {
    sheetError.textContent = message;
    sheetError.hidden = false;
  }

  sheetForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const kind = sheetKind.value;
    const ref = sheetRef.value;
    const title = titleInput.value.trim().slice(0, 120);

    if (!title) {
      showError(t('error.titleRequired'));
      titleInput.focus();
      return;
    }

    let time = '';
    if (!timeField.hidden && sheetTime.value.trim()) {
      time = normalizeTime(sheetTime.value);
      if (!time) {
        showError(t('error.timeFormat'));
        sheetTime.focus();
        return;
      }
    }

    const pack = current();
    const detail = sheetDetail.value.trim().slice(0, 240);
    let message = '';

    if (kind === 'agenda' && selected === isoDate(new Date())) {
      pack.tasks.push({ id: uid('task'), time, title, tag: t('cal.kicker'), done: false });
      message = t('toast.agendaToday');
    } else if (kind === 'agenda') {
      pack.events.push({ id: uid('event'), date: selected, time, title, tag: t('cal.kicker'), done: false });
      message = t('toast.agendaAdded');
    } else if (kind === 'task') {
      pack.tasks.push({ id: uid('task'), time, title, tag: t('today.blockTag'), done: false });
      message = t('toast.blockAdded');
    } else if (kind === 'step') {
      const plan = pack.plans.find((item) => item.id === ref);
      if (!plan) {
        showError(t('error.planMissing'));
        return;
      }
      plan.steps.push({ id: uid('step'), title, done: false });
      message = t('toast.stepAdded');
    } else if (kind === 'plan') {
      pack.plans.push({
        id: uid('plan'),
        title,
        detail,
        durationDays: readDurationDays(),
        startedAt: isoDate(new Date()),
        steps: []
      });
      message = t('toast.planCreated');
    } else if (kind === 'editplan') {
      const plan = pack.plans.find((item) => item.id === ref);
      if (!plan) {
        showError(t('error.planMissing'));
        return;
      }
      plan.title = title;
      plan.detail = detail;
      plan.durationDays = readDurationDays();
      message = t('toast.planUpdated');
    } else if (kind === 'goal') {
      const days = clamp(Math.round(Number(sheetDays.value)), 1, 999, 30);
      pack.goals.push({ id: uid('goal'), title, detail, days, progress: 0 });
      message = t('toast.goalAdded');
    } else if (kind === 'renametab') {
      const tab = pack.tabs.find((item) => item.id === ref);
      if (!tab) {
        showError(t('error.tabMissing'));
        return;
      }
      tab.name = title.slice(0, 60);
      message = t('toast.tabRenamed');
    } else if (kind === 'edititem') {
      const tab = pack.tabs.find((item) => item.id === ref);
      const item = tab ? tab.items.find((entry) => entry.id === sheetItem.value) : null;
      if (!item) {
        showError(t('error.itemMissing'));
        return;
      }
      item.title = title;
      if (tab.type === 'board') {
        item.priority = ['high', 'medium', 'low'].includes(sheetPriority.value) ? sheetPriority.value : 'medium';
      }
      message = t('toast.itemUpdated');
    } else if (kind === 'tab') {
      const radio = sheetForm.querySelector('input[name="tabType"]:checked');
      const type = radio && TAB_TYPES[radio.value] ? radio.value : 'board';
      const tab = { id: uid('tab'), name: title.slice(0, 60), type, items: [], notes: '' };
      pack.tabs.push(tab);
      saveBoard();
      sheet.close();
      view = `tab:${tab.id}`;
      sessionStorage.setItem('planora-view', view);
      render();
      toast(t('toast.tabCreated'));
      return;
    } else if (kind === 'boarditem') {
      const tab = pack.tabs.find((item) => item.id === ref);
      if (!tab) {
        showError(t('error.tabMissing'));
        return;
      }
      const priority = ['high', 'medium', 'low'].includes(sheetPriority.value) ? sheetPriority.value : 'medium';
      tab.items.push({ id: uid('item'), title, priority, done: false });
      message = t('toast.taskAdded');
    } else if (kind === 'checkitem') {
      const tab = pack.tabs.find((item) => item.id === ref);
      if (!tab) {
        showError(t('error.tabMissing'));
        return;
      }
      tab.items.push({ id: uid('item'), title, done: false });
      message = t('toast.itemAdded');
    } else {
      return;
    }

    saveBoard();
    sheet.close();
    render();
    toast(message);
  });

  sheetClose.addEventListener('click', () => sheet.close());
  sheetCancel.addEventListener('click', () => sheet.close());
  sheet.addEventListener('click', (event) => {
    if (event.target === sheet) sheet.close();
  });
  titleInput.addEventListener('input', () => { sheetError.hidden = true; });
  sheetTime.addEventListener('input', () => { sheetError.hidden = true; });

  /* ---------- Event delegasi ---------- */

  document.addEventListener('click', (event) => {
    const nav = event.target.closest('[data-nav]');
    if (nav) {
      view = nav.dataset.nav;
      sessionStorage.setItem('planora-view', view);
      closeMenu();
      render();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      return;
    }

    const lang = event.target.closest('[data-lang]');
    if (lang) {
      I18N.setMode(lang.dataset.lang);
      render();
      toast(t('toast.langChanged', { lang: I18N.languageName() }));
      return;
    }

    const filter = event.target.closest('[data-filter]');
    if (filter) {
      historyFilter = filter.dataset.filter;
      sessionStorage.setItem('planora-filter', historyFilter);
      render();
      return;
    }

    const profileMode = event.target.closest('[data-profile-mode]');
    if (profileMode) {
      applyMode(profileMode.dataset.profileMode);
      return;
    }

    const check = event.target.closest('[data-check]');
    if (check) {
      toggleCheck(check.dataset.check, check.dataset.id, check.dataset.plan || '', check.dataset.tab || '');
      return;
    }

    if (event.target.closest('[data-save-day]')) {
      syncDayArchive();
      return;
    }

    const archive = event.target.closest('[data-archive-tab]');
    if (archive) {
      archiveTab(archive.dataset.archiveTab);
      return;
    }

    const restore = event.target.closest('[data-restore-tab]');
    if (restore) {
      restoreEntry(restore.dataset.restoreTab);
      return;
    }

    const reuse = event.target.closest('[data-reuse-day]');
    if (reuse) {
      reuseDay(reuse.dataset.reuseDay);
      return;
    }

    const finish = event.target.closest('[data-finish-plan]');
    if (finish) {
      finishPlan(finish.dataset.finishPlan);
      return;
    }

    const del = event.target.closest('[data-delete-tab]');
    if (del) {
      deleteTab(del.dataset.deleteTab);
      return;
    }

    const delPlan = event.target.closest('[data-delete-plan]');
    if (delPlan) {
      deletePlan(delPlan.dataset.deletePlan);
      return;
    }

    const delGoal = event.target.closest('[data-delete-goal]');
    if (delGoal) {
      deleteGoal(delGoal.dataset.deleteGoal);
      return;
    }

    const deleteHistory = event.target.closest('[data-delete-history]');
    if (deleteHistory) {
      deleteHistoryEntry(deleteHistory.dataset.deleteHistory);
      return;
    }

    const deleteItem = event.target.closest('[data-delete-item]');
    if (deleteItem) {
      deleteTabItem(deleteItem.dataset.tab, deleteItem.dataset.deleteItem);
      return;
    }

    const day = event.target.closest('[data-day]');
    if (day) {
      selected = day.dataset.day;
      cursor = startOfMonth(parseISO(selected));
      sessionStorage.setItem('planora-day', selected);
      render();
      return;
    }

    const month = event.target.closest('[data-month]');
    if (month) {
      const delta = Number(month.dataset.month);
      if (delta === 0) {
        selected = isoDate(new Date());
        cursor = startOfMonth(new Date());
      } else {
        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + delta, 1);
        selected = isoDate(cursor);
      }
      sessionStorage.setItem('planora-day', selected);
      render();
      return;
    }

    if (event.target.closest('[data-logout]')) {
      logout();
      return;
    }

    const add = event.target.closest('[data-sheet]');
    if (add) {
      closeMenu();
      openSheet(add.dataset.sheet, add.dataset.plan || add.dataset.tab || '', add.dataset.item || '');
    }
  });

  document.addEventListener('input', (event) => {
    const area = event.target.closest('[data-notes]');
    if (!area) return;
    const tab = findTab(area.dataset.notes);
    if (!tab) return;
    tab.notes = area.value.slice(0, 5000);
    saveBoard();
    const status = document.getElementById('notesStatus');
    if (status) status.textContent = t('tab.notesSaved');
  });

  function applyMode(next) {
    if ((next !== 'personal' && next !== 'business') || next === mode) return;
    mode = next;
    sessionStorage.setItem('planora-mode', mode);
    if (!session.guest) {
      session.mode = mode;
      const storage = localStorage.getItem('planora-session') ? localStorage : sessionStorage;
      storage.setItem('planora-session', JSON.stringify({
        mode,
        email: session.email,
        name: session.name
      }));
    }
    render();
    toast(t('toast.modeChanged', { mode: t(mode === 'business' ? 'mode.business' : 'mode.personal') }));
  }

  /* ---------- Riwayat ---------- */

  function historyEntries() {
    return [...current().history].sort((a, b) => Date.parse(b.archivedAt) - Date.parse(a.archivedAt));
  }

  function historyTitle(entry) {
    if (!entry) return '';
    const kind = entry.kind || 'tab';
    if (kind === 'day') {
      const date = parseDateSafe(entry.date) || new Date(entry.date);
      return t('history.dayTitle', { date: fmt({ weekday: 'long', day: 'numeric', month: 'short' }).format(date) });
    }
    return entry.name || entry.title || '';
  }

  function archiveTab(id) {
    const pack = current();
    const tab = pack.tabs.find((item) => item.id === id);
    if (!tab) return;
    pack.tabs = pack.tabs.filter((item) => item.id !== id);
    pack.history.push({ ...tab, kind: 'tab', archivedAt: new Date().toISOString() });
    saveBoard();
    view = 'history';
    sessionStorage.setItem('planora-view', view);
    render();
    toast(t('toast.tabArchived', { name: tab.name }));
  }

  function maybeArchiveTab(tabId) {
    const pack = current();
    const tab = pack.tabs.find((item) => item.id === tabId);
    if (!tab || tab.type === 'notes' || tab.items.length === 0) return;
    if (!tab.items.every((item) => item.done)) return;
    archiveTabEntry(tab);
    toast(t('toast.tabAutoArchived', { name: tab.name }), {
      label: t('common.undo'),
      onClick: () => restoreEntry(tab.id)
    });
  }

  function archiveTabEntry(tab) {
    const pack = current();
    pack.tabs = pack.tabs.filter((item) => item.id !== tab.id);
    pack.history.push({ ...tab, kind: 'tab', archivedAt: new Date().toISOString() });
    if (view === `tab:${tab.id}`) {
      view = 'today';
      sessionStorage.setItem('planora-view', view);
    }
    saveBoard();
  }

  function finishPlan(id) {
    const pack = current();
    const plan = pack.plans.find((item) => item.id === id);
    if (!plan) return;
    archivePlanEntry(plan);
    render();
    toast(t('toast.planFinished', { name: plan.title }), {
      label: t('common.undo'),
      onClick: () => restoreEntry(plan.id)
    });
  }

  function maybeArchivePlan(planId) {
    const pack = current();
    const plan = pack.plans.find((item) => item.id === planId);
    if (!plan || !plan.steps || plan.steps.length === 0) return;
    if (!plan.steps.every((step) => step.done)) return;
    archivePlanEntry(plan);
    toast(t('toast.planAutoArchived', { name: plan.title }), {
      label: t('common.undo'),
      onClick: () => restoreEntry(plan.id)
    });
  }

  function archivePlanEntry(plan) {
    const pack = current();
    pack.plans = pack.plans.filter((item) => item.id !== plan.id);
    pack.history.push({ ...plan, kind: 'plan', archivedAt: new Date().toISOString() });
    saveBoard();
  }

  function restoreEntry(id) {
    const pack = current();
    const entry = pack.history.find((item) => item.id === id);
    if (!entry) return;
    const kind = entry.kind || 'tab';
    pack.history = pack.history.filter((item) => item.id !== id);
    if (kind === 'plan') {
      const { archivedAt, kind: ignored, ...plan } = entry;
      pack.plans.push({ ...plan, completedAt: null });
      view = 'plan';
      toast(t('toast.planRestored', { name: plan.title }));
    } else if (kind === 'day') {
      pack.history.push(entry);
      toast(t('toast.dayRestoreHint'));
      return;
    } else {
      const { archivedAt, kind: ignored, ...tab } = entry;
      pack.tabs.push(tab);
      view = `tab:${tab.id}`;
      toast(t('toast.tabRestored', { name: tab.name }));
    }
    saveBoard();
    sessionStorage.setItem('planora-view', view);
    render();
  }

  function reuseDay(id) {
    const pack = current();
    const entry = pack.history.find((item) => item.id === id);
    if (!entry) return;
    (entry.tasks || []).forEach((task) => {
      pack.tasks.push({ id: uid('task'), time: task.time || '', title: task.title, tag: task.tag || '', done: false });
    });
    saveBoard();
    view = 'today';
    sessionStorage.setItem('planora-view', view);
    render();
    toast(t('toast.dayReused'));
  }

  function syncDayArchive({ silent = false } = {}) {
    const pack = current();
    const tasks = sortedTasks(pack.tasks);
    if (!tasks.length || tasks.some((task) => !task.done)) return;
    const today = isoDate(new Date());
    const snapshot = tasks.map((task) => ({ time: task.time, title: task.title, tag: task.tag, done: true }));
    const existing = pack.history.find((entry) => (entry.kind || 'tab') === 'day' && entry.date === today);
    let changed = false;
    if (existing) {
      if (JSON.stringify(existing.tasks) !== JSON.stringify(snapshot)) {
        existing.tasks = snapshot;
        existing.archivedAt = new Date().toISOString();
        changed = true;
      }
    } else {
      pack.history.push({
        id: uid('day'),
        kind: 'day',
        date: today,
        tasks: snapshot,
        archivedAt: new Date().toISOString()
      });
      changed = true;
    }
    if (pack.lastCompletedDate !== today) {
      pack.lastCompletedDate = today;
      pack.streak = (Number(pack.streak) || 0) + 1;
      changed = true;
    }
    if (changed) {
      saveBoard();
      if (!silent) {
        render();
        toast(t('toast.daySaved'), { label: t('common.open'), onClick: () => {
          view = 'history';
          sessionStorage.setItem('planora-view', view);
          render();
        } });
      }
    }
  }

  function deleteTab(id) {
    const pack = current();
    const tab = pack.tabs.find((item) => item.id === id);
    if (!tab) return;
    askConfirm({
      title: t('confirm.deleteTabTitle'),
      text: t('confirm.deleteTabText', { name: tab.name }),
      acceptLabel: t('common.deleteForever'),
      onAccept: () => {
        pack.tabs = pack.tabs.filter((item) => item.id !== id);
        saveBoard();
        if (view === `tab:${id}`) {
          view = 'today';
          sessionStorage.setItem('planora-view', view);
        }
        render();
        toast(t('toast.tabDeleted'));
      }
    });
  }

  function deletePlan(id) {
    const pack = current();
    const plan = pack.plans.find((item) => item.id === id);
    if (!plan) return;
    askConfirm({
      title: t('confirm.deletePlanTitle'),
      text: t('confirm.deletePlanText', { name: plan.title }),
      acceptLabel: t('common.delete'),
      onAccept: () => {
        pack.plans = pack.plans.filter((item) => item.id !== id);
        saveBoard();
        render();
        toast(t('toast.planDeleted'));
      }
    });
  }

  function deleteGoal(id) {
    const pack = current();
    const goal = pack.goals.find((item) => item.id === id);
    if (!goal) return;
    askConfirm({
      title: t('confirm.deleteGoalTitle'),
      text: t('confirm.deleteGoalText', { name: goal.title }),
      acceptLabel: t('common.delete'),
      onAccept: () => {
        pack.goals = pack.goals.filter((item) => item.id !== id);
        saveBoard();
        render();
        toast(t('toast.goalDeleted'));
      }
    });
  }

  function deleteHistoryEntry(id) {
    const pack = current();
    const entry = pack.history.find((item) => item.id === id);
    if (!entry) return;
    askConfirm({
      title: t('confirm.deleteHistoryTitle'),
      text: t('confirm.deleteHistoryText', { name: historyTitle(entry) }),
      acceptLabel: t('common.deleteForever'),
      onAccept: () => {
        pack.history = pack.history.filter((item) => item.id !== id);
        saveBoard();
        view = 'history';
        sessionStorage.setItem('planora-view', view);
        render();
        toast(t('toast.historyDeleted'));
      }
    });
  }

  function deleteTabItem(tabId, itemId) {
    const pack = current();
    const tab = pack.tabs.find((item) => item.id === tabId);
    const item = tab ? tab.items.find((entry) => entry.id === itemId) : null;
    if (!item) return;
    askConfirm({
      title: tab.type === 'board' ? t('confirm.deleteTaskTitle') : t('confirm.deleteItemTitle'),
      text: t('confirm.deleteItemText', { name: item.title, tab: tab.name }),
      acceptLabel: t('common.deleteItem'),
      onAccept: () => {
        tab.items = tab.items.filter((entry) => entry.id !== itemId);
        saveBoard();
        render();
        toast(t('toast.itemDeleted'));
      }
    });
  }

  function askConfirm({ title, text, acceptLabel, onAccept }) {
    confirmAction = onAccept;
    confirmTitle.textContent = title;
    confirmText.textContent = text;
    confirmAccept.textContent = acceptLabel;
    confirmDialog.showModal();
    confirmAccept.focus();
  }

  function closeConfirm() {
    confirmAction = null;
    if (confirmDialog.open) confirmDialog.close();
  }

  confirmAccept.addEventListener('click', () => {
    const action = confirmAction;
    closeConfirm();
    if (action) action();
  });
  confirmCancel.addEventListener('click', closeConfirm);
  confirmDialog.addEventListener('cancel', () => { confirmAction = null; });
  confirmDialog.addEventListener('click', (event) => {
    if (event.target === confirmDialog) closeConfirm();
  });

  function toggleCheck(kind, id, planId, tabId) {
    const pack = current();
    let item = null;
    if (kind === 'task' || kind === 'event') {
      const list = kind === 'task' ? pack.tasks : pack.events;
      item = list.find((entry) => entry.id === id);
    } else if (kind === 'step') {
      const plan = pack.plans.find((entry) => entry.id === planId);
      item = plan ? plan.steps.find((entry) => entry.id === id) : null;
    } else if (kind === 'item') {
      const tab = pack.tabs.find((entry) => entry.id === tabId);
      item = tab ? tab.items.find((entry) => entry.id === id) : null;
    }
    if (!item) return;
    item.done = !item.done;
    saveBoard();
    if (kind === 'task') syncDayArchive();
    if (kind === 'item' && tabId) maybeArchiveTab(tabId);
    if (kind === 'step' && planId) maybeArchivePlan(planId);
    render();
  }

  /* ---------- Aksi utama & sisi ---------- */

  primaryBtn.addEventListener('click', () => {
    const action = primaryFor();
    if (action) openSheet(action.kind, action.ref);
  });

  resetBtn.addEventListener('click', () => {
    askConfirm({
      title: t('confirm.resetTitle'),
      text: t('confirm.resetText'),
      acceptLabel: t('confirm.resetAccept'),
      onAccept: () => {
        board[mode] = freshBoard()[mode];
        saveBoard();
        selected = isoDate(new Date());
        cursor = startOfMonth(new Date());
        sessionStorage.setItem('planora-day', selected);
        render();
        toast(t('toast.resetDone'));
      }
    });
  });

  function logout() {
    localStorage.removeItem('planora-session');
    sessionStorage.removeItem('planora-session');
    window.location.href = './login.html';
  }

  logoutBtn.addEventListener('click', logout);

  sideToggle.addEventListener('click', () => {
    setMenu(!side.classList.contains('is-open'));
  });

  function setMenu(open) {
    side.classList.toggle('is-open', open);
    sideBackdrop.classList.toggle('is-on', open);
    sideToggle.classList.toggle('is-active', open);
    sideToggle.setAttribute('aria-expanded', String(open));
    sideToggle.setAttribute('aria-label', t(open ? 'side.closeMenu' : 'side.openMenu'));
    document.body.classList.toggle('menu-open', open);
  }

  function closeMenu() {
    if (side.classList.contains('is-open')) setMenu(false);
  }

  sideBackdrop.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });

  /* ---------- Data ---------- */

  function current() {
    return board[mode];
  }

  function findTab(id) {
    return current().tabs.find((tab) => tab.id === id) || null;
  }

  function findHistory(id) {
    return current().history.find((entry) => entry.id === id) || null;
  }

  function openStepCount(pack) {
    return pack.plans.reduce((sum, plan) => sum + (plan.steps || []).filter((step) => !step.done).length, 0);
  }

  function saveBoard() {
    try {
      localStorage.setItem('planora-board', JSON.stringify(board));
    } catch {
      toast(t('toast.saveFailed'));
    }
  }

  function agendaFor(date) {
    const pack = current();
    const todayIso = isoDate(new Date());
    const items = [];
    if (date === todayIso) {
      pack.tasks.forEach((task) => items.push({ ...task, kind: 'task' }));
    }
    pack.events.filter((event) => event.date === date).forEach((event) => items.push({ ...event, kind: 'event' }));
    return items.sort((a, b) => timeKey(a.time) - timeKey(b.time));
  }

  function sortedTasks(tasks) {
    return [...tasks].sort((a, b) => timeKey(a.time) - timeKey(b.time));
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function fmt(options) {
    try {
      return new Intl.DateTimeFormat(locale(), options);
    } catch {
      return new Intl.DateTimeFormat('id-ID', options);
    }
  }

  function dowLabels() {
    return Array.from({ length: 7 }, (_, index) => fmt({ weekday: 'short' }).format(new Date(2024, 0, 1 + index)));
  }

  function archivedDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return fmt({ day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  }

  function regionName(code) {
    if (!code) return '';
    try {
      return new Intl.DisplayNames([locale()], { type: 'region' }).of(code) || '';
    } catch {
      return code;
    }
  }

  function readDurationDays() {
    const value = clamp(Math.round(Number(sheetDuration.value)), 1, 120, 2);
    const unit = sheetDurationUnit.value;
    const factor = unit === 'day' ? 1 : unit === 'week' ? 7 : 30;
    return clamp(value * factor, 1, 3650, 60);
  }

  function applyStaticI18n(root) {
    root.querySelectorAll('[data-i18n]').forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    root.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    root.querySelectorAll('[data-i18n-aria]').forEach((element) => {
      element.setAttribute('aria-label', t(element.dataset.i18nAria));
    });
  }

  function toast(message, action = null) {
    toastText.textContent = message;
    toastAction = action;
    if (action) {
      toastActionBtn.textContent = action.label;
      toastActionBtn.hidden = false;
    } else {
      toastActionBtn.hidden = true;
    }
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
      toastAction = null;
    }, action ? 7000 : 2800);
  }

  toastActionBtn.addEventListener('click', () => {
    const action = toastAction;
    toastEl.classList.remove('show');
    toastAction = null;
    if (action) action.onClick();
  });

  function personName() {
    let full = '';
    if (session.name && session.name.trim()) full = session.name.trim();
    else if (session.email && session.email.includes('@')) {
      full = session.email.split('@')[0].replace(/[._-]+/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
    }
    if (!full) return { full: t('user.guest'), first: '' };
    return { full, first: full.split(' ')[0] };
  }

  function greeting() {
    const hour = new Date().getHours();
    if (hour < 11) return t('greeting.morning');
    if (hour < 15) return t('greeting.afternoon');
    if (hour < 19) return t('greeting.evening');
    return t('greeting.night');
  }

  I18N.onChange(() => {
    render();
  });

  render();

  /* @@PART3B@@ */
});

/* ---------- Bantuan data ---------- */

function loadSession() {
  const data = readJSON('planora-session', null) || readJSON('planora-session', null, sessionStorage);
  if (!data || (data.mode !== 'personal' && data.mode !== 'business')) {
    return { mode: 'personal', name: '', email: '', guest: true };
  }
  return {
    mode: data.mode,
    name: typeof data.name === 'string' ? data.name : '',
    email: typeof data.email === 'string' ? data.email : '',
    guest: false
  };
}

function loadBoard() {
  const saved = readJSON('planora-board', null);
  const fresh = freshBoard();
  if (!saved || typeof saved !== 'object') return fresh;
  ['personal', 'business'].forEach((key) => {
    saved[key] = normalizePack(saved[key], fresh[key]);
  });
  return saved;
}

function validPack(pack) {
  return Boolean(pack
    && Array.isArray(pack.tasks)
    && Array.isArray(pack.plans)
    && Array.isArray(pack.goals)
    && Array.isArray(pack.events));
}

function normalizePack(pack, fallback) {
  if (!validPack(pack)) return fallback;
  return {
    ...pack,
    streak: typeof pack.streak === 'number' ? pack.streak : fallback.streak,
    lastCompletedDate: typeof pack.lastCompletedDate === 'string' ? pack.lastCompletedDate : '',
    tasks: Array.isArray(pack.tasks) ? pack.tasks.map(normalizeTask).filter(Boolean) : fallback.tasks,
    events: Array.isArray(pack.events) ? pack.events.map(normalizeEvent).filter(Boolean) : fallback.events,
    plans: Array.isArray(pack.plans) ? pack.plans.map(normalizePlan).filter(Boolean) : fallback.plans,
    goals: Array.isArray(pack.goals) ? pack.goals.map(normalizeGoal).filter(Boolean) : fallback.goals,
    tabs: Array.isArray(pack.tabs) ? pack.tabs.map(normalizeTab).filter(Boolean) : fallback.tabs,
    history: Array.isArray(pack.history) ? pack.history.map(normalizeHistoryEntry).filter(Boolean) : []
  };
}

function normalizeTask(task) {
  if (!task || typeof task.title !== 'string' || !task.title.trim()) return null;
  return {
    id: typeof task.id === 'string' && task.id ? task.id : uid('task'),
    time: typeof task.time === 'string' ? task.time : '',
    title: task.title.trim().slice(0, 120),
    tag: typeof task.tag === 'string' ? task.tag.slice(0, 60) : '',
    done: Boolean(task.done)
  };
}

function normalizeEvent(event) {
  if (!event || typeof event.title !== 'string' || !event.title.trim()) return null;
  return {
    id: typeof event.id === 'string' && event.id ? event.id : uid('event'),
    date: /^\d{4}-\d{2}-\d{2}$/.test(event.date || '') ? event.date : isoDate(new Date()),
    time: typeof event.time === 'string' ? event.time : '',
    title: event.title.trim().slice(0, 120),
    tag: typeof event.tag === 'string' ? event.tag.slice(0, 60) : '',
    done: Boolean(event.done)
  };
}

function normalizePlan(plan) {
  if (!plan || typeof plan.title !== 'string' || !plan.title.trim()) return null;
  return {
    id: typeof plan.id === 'string' && plan.id ? plan.id : uid('plan'),
    title: plan.title.trim().slice(0, 120),
    detail: typeof plan.detail === 'string' ? plan.detail.slice(0, 240) : '',
    durationDays: clamp(Number(plan.durationDays), 1, 3650, 60),
    startedAt: parseDateSafe(plan.startedAt) ? plan.startedAt : isoDate(new Date()),
    steps: Array.isArray(plan.steps)
      ? plan.steps
        .filter((step) => step && typeof step.title === 'string' && step.title.trim())
        .map((step) => ({
          id: typeof step.id === 'string' && step.id ? step.id : uid('step'),
          title: step.title.trim().slice(0, 120),
          done: Boolean(step.done)
        }))
      : []
  };
}

function normalizeGoal(goal) {
  if (!goal || typeof goal.title !== 'string' || !goal.title.trim()) return null;
  return {
    id: typeof goal.id === 'string' && goal.id ? goal.id : uid('goal'),
    title: goal.title.trim().slice(0, 120),
    detail: typeof goal.detail === 'string' ? goal.detail.slice(0, 240) : '',
    days: clamp(Number(goal.days), 1, 999, 30),
    progress: clamp(Number(goal.progress), 0, 100, 0)
  };
}

function normalizeTab(tab) {
  if (!tab || typeof tab.name !== 'string' || !tab.name.trim()) return null;
  return {
    id: typeof tab.id === 'string' && tab.id ? tab.id : uid('tab'),
    name: tab.name.trim().slice(0, 60),
    type: ['board', 'checklist', 'notes'].includes(tab.type) ? tab.type : 'board',
    notes: typeof tab.notes === 'string' ? tab.notes.slice(0, 5000) : '',
    items: Array.isArray(tab.items)
      ? tab.items
        .filter((item) => item && typeof item.title === 'string' && item.title.trim())
        .map((item) => ({
          id: typeof item.id === 'string' && item.id ? item.id : uid('item'),
          title: item.title.trim().slice(0, 120),
          done: Boolean(item.done),
          priority: ['high', 'medium', 'low'].includes(item.priority) ? item.priority : ''
        }))
      : []
  };
}

function normalizeHistoryEntry(entry) {
  if (!entry || typeof entry !== 'object') return null;
  const archivedAt = typeof entry.archivedAt === 'string' && Number.isFinite(Date.parse(entry.archivedAt))
    ? entry.archivedAt
    : new Date().toISOString();
  const kind = ['tab', 'plan', 'day'].includes(entry.kind) ? entry.kind : 'tab';
  if (kind === 'plan') {
    const plan = normalizePlan(entry);
    return plan ? { ...plan, kind: 'plan', archivedAt } : null;
  }
  if (kind === 'day') {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(entry.date || '')) return null;
    return {
      id: typeof entry.id === 'string' && entry.id ? entry.id : uid('day'),
      kind: 'day',
      date: entry.date,
      archivedAt,
      tasks: Array.isArray(entry.tasks)
        ? entry.tasks
          .filter((task) => task && typeof task.title === 'string' && task.title.trim())
          .map((task) => ({
            time: typeof task.time === 'string' ? task.time : '',
            title: task.title.trim().slice(0, 120),
            tag: typeof task.tag === 'string' ? task.tag.slice(0, 60) : '',
            done: Boolean(task.done)
          }))
        : []
    };
  }
  const tab = normalizeTab(entry);
  return tab ? { ...tab, kind: 'tab', archivedAt } : null;
}

function freshBoard() {
  const today = isoDate(new Date());
  return {
    personal: {
      streak: 12,
      lastCompletedDate: '',
      tasks: [
        { id: 'p-t1', time: '07.30', title: 'Olahraga pagi', tag: 'Rutinitas · 30 menit', done: true },
        { id: 'p-t2', time: '09.00', title: 'Deep work: proposal klien', tag: 'Fokus · 2 jam', done: true },
        { id: 'p-t3', time: '11.15', title: 'Review catatan kemarin', tag: 'Fokus · 30 menit', done: true },
        { id: 'p-t4', time: '13.00', title: 'Review action plan mingguan', tag: 'Rencana · 45 menit', done: true },
        { id: 'p-t5', time: '16.00', title: 'Kelas bahasa Inggris', tag: 'Personal · 60 menit', done: false },
        { id: 'p-t6', time: '19.30', title: 'Jurnal dan rencana besok', tag: 'Rutinitas · 15 menit', done: false }
      ],
      plans: [
        {
          id: 'p-plan-1',
          title: 'Peluncuran portofolio baru',
          detail: 'Enam studi kasus, satu narasi, siap dibagikan.',
          durationDays: 60,
          startedAt: today,
          steps: [
            { id: 'p-s1', title: 'Kumpulkan 6 studi kasus', done: true },
            { id: 'p-s2', title: 'Tulis narasi halaman utama', done: true },
            { id: 'p-s3', title: 'Siapkan mockup final', done: false },
            { id: 'p-s4', title: 'Minta umpan balik 2 orang', done: false }
          ]
        },
        {
          id: 'p-plan-2',
          title: 'Rutinitas fokus 30 hari',
          detail: 'Pagi yang tenang, lalu satu blok kerja yang dalam.',
          durationDays: 30,
          startedAt: today,
          steps: [
            { id: 'p-s5', title: 'Blok deep work sebelum siang', done: true },
            { id: 'p-s6', title: 'Batasi rapat sebelum jam 11', done: false },
            { id: 'p-s7', title: 'Jurnal 10 menit tiap malam', done: false }
          ]
        }
      ],
      goals: [
        { id: 'p-g1', title: 'Peluncuran portofolio baru', detail: 'Siap dibagikan, tanpa terburu menambah halaman baru.', days: 21, progress: 42 },
        { id: 'p-g2', title: 'Percakapan bahasa Inggris', detail: 'Berani berbicara tanpa menyusun kalimat di kepala.', days: 60, progress: 35 },
        { id: 'p-g3', title: 'Cadangan dana enam bulan', detail: 'Tenang mengambil keputusan, tidak terburu waktu.', days: 180, progress: 18 }
      ],
      events: [
        { id: 'p-e1', date: isoDate(shiftDate(2)), time: '19.00', title: 'Jurnal mingguan', tag: 'Rutinitas', done: false },
        { id: 'p-e2', date: isoDate(shiftDate(4)), time: '16.00', title: 'Kelas bahasa Inggris', tag: 'Personal', done: false },
        { id: 'p-e3', date: isoDate(shiftDate(7)), time: '10.00', title: 'Tenggat draf portofolio', tag: 'Target', done: false },
        { id: 'p-e4', date: isoDate(shiftDate(14)), time: '09.00', title: 'Retrospektif bulan', tag: 'Rencana', done: false }
      ],
      tabs: [
        {
          id: 'p-tab-1',
          name: 'Jadwal projek',
          type: 'board',
          notes: '',
          items: [
            { id: 'p-i1', title: 'Rapikan brief projek portofolio', priority: 'high', done: false },
            { id: 'p-i2', title: 'Kirim draf ke dua klien', priority: 'medium', done: false },
            { id: 'p-i3', title: 'Bereskan arsip aset lama', priority: 'low', done: true }
          ]
        },
        {
          id: 'p-tab-2',
          name: 'Belanja bulanan',
          type: 'checklist',
          notes: '',
          items: [
            { id: 'p-i4', title: 'Beras dan telur', done: false },
            { id: 'p-i5', title: 'Kopi', done: true }
          ]
        }
      ],
      history: []
    },
    business: {
      streak: 8,
      lastCompletedDate: '',
      tasks: [
        { id: 'b-t1', time: '08.30', title: 'Standup tim produk', tag: 'Tim · 25 menit', done: true },
        { id: 'b-t2', time: '10.00', title: 'Deep work: spesifikasi Q4', tag: 'Fokus · 2 jam', done: true },
        { id: 'b-t3', time: '13.00', title: 'Review OKR dengan lead', tag: 'Rencana · 45 menit', done: true },
        { id: 'b-t4', time: '15.30', title: 'Sinkronisasi klien', tag: 'Klien · 40 menit', done: false },
        { id: 'b-t5', time: '17.00', title: 'Catatan keputusan', tag: 'Tim · 20 menit', done: false }
      ],
      plans: [
        {
          id: 'b-plan-1',
          title: 'Menutup kuartal dengan ritme yang jelas',
          detail: 'Pipeline, proposal, dan keputusan yang tidak tercecer.',
          durationDays: 90,
          startedAt: today,
          steps: [
            { id: 'b-s1', title: 'Jaga 12 prospek tetap aktif', done: true },
            { id: 'b-s2', title: 'Kirim 6 proposal retainer', done: true },
            { id: 'b-s3', title: 'Rapat keputusan tiap Kamis', done: false },
            { id: 'b-s4', title: 'Dokumentasikan umpan balik klien', done: false }
          ]
        },
        {
          id: 'b-plan-2',
          title: 'Portal klien siap uji',
          detail: 'Cukup tiga layar untuk klien pilot, bukan seluruh produk.',
          durationDays: 45,
          startedAt: today,
          steps: [
            { id: 'b-s5', title: 'Alur undangan klien', done: true },
            { id: 'b-s6', title: 'Tiga layar utama', done: false },
            { id: 'b-s7', title: 'Umpan balik dari 2 klien pilot', done: false }
          ]
        }
      ],
      goals: [
        { id: 'b-g1', title: 'Sistem desain internal', detail: 'Komponen, nada visual, dan pola yang bisa diulang tim.', days: 18, progress: 80 },
        { id: 'b-g2', title: 'Portal klien siap uji', detail: 'Undangan, tiga layar utama, dua klien pilot.', days: 36, progress: 42 },
        { id: 'b-g3', title: 'Desainer kedua bergabung', detail: 'Peran jelas, portofolio dinilai, tawaran terkirim.', days: 54, progress: 20 }
      ],
      events: [
        { id: 'b-e1', date: isoDate(shiftDate(1)), time: '09.00', title: 'Perencanaan sprint', tag: 'Tim', done: false },
        { id: 'b-e2', date: isoDate(shiftDate(3)), time: '15.30', title: 'Umpan balik klien pilot', tag: 'Klien', done: false },
        { id: 'b-e3', date: isoDate(shiftDate(7)), time: '11.00', title: 'Review OKR kuartal', tag: 'Rencana', done: false },
        { id: 'b-e4', date: isoDate(shiftDate(12)), time: '14.00', title: 'Demo portal klien', tag: 'Proyek', done: false }
      ],
      tabs: [
        {
          id: 'b-tab-1',
          name: 'Jadwal projek',
          type: 'board',
          notes: '',
          items: [
            { id: 'b-i1', title: 'Finalkan lingkup portal klien', priority: 'high', done: false },
            { id: 'b-i2', title: 'Jadwalkan demo ke klien pilot', priority: 'high', done: false },
            { id: 'b-i3', title: 'Perbarui dokumen handoff', priority: 'low', done: true }
          ]
        },
        {
          id: 'b-tab-2',
          name: 'Catatan rapat',
          type: 'notes',
          notes: 'Keputusan minggu ini:\n— Demo portal klien dimajukan.\n— Desainer kedua mulai bulan depan.\n',
          items: []
        }
      ],
      history: []
    }
  };
}

function readJSON(key, fallback, storage = localStorage) {
  try {
    const raw = storage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
}

function percent(done, total) {
  if (!total) return 0;
  return Math.round((done / total) * 100);
}

function clamp(value, min, max, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function timeKey(value) {
  const match = String(value || '').match(/(\d{1,2})[.:](\d{2})/);
  if (!match) return 9999;
  return Number(match[1]) * 60 + Number(match[2]);
}

function normalizeTime(value) {
  const match = String(value).trim().match(/^(\d{1,2})[.:](\d{2})$/);
  if (!match) return '';
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return '';
  return `${String(hour).padStart(2, '0')}.${match[2]}`;
}

function shiftDate(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

function isoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseISO(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
  if (!match) return new Date();
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function parseDateSafe(value) {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return parseISO(value);
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function startOfToday() {
  const date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function monthMatrix(year, month) {
  const first = new Date(year, month, 1).getDay();
  const lead = first === 0 ? 6 : first - 1;
  const total = new Date(year, month + 1, 0).getDate();
  const cells = Array(lead).fill(null);
  for (let day = 1; day <= total; day += 1) cells.push(day);
  while (cells.length % 7) cells.push(null);
  return cells;
}

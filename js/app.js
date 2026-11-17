/* PlacePrep — single-page app (no build step, works from file://) */
(function () {
  'use strict';

  var SUBJECTS = window.SUBJECTS || [];
  var GROUPS = [
    { id: 'core', title: 'Core CS' },
    { id: 'ai', title: 'AI / ML' },
    { id: 'prep', title: 'Aptitude & Interview' }
  ];
  var BOX_DAYS = [0, 1, 3, 7, 16, 35]; // Leitner intervals (box 0..5)
  var app = document.getElementById('app');
  var sidebar = document.getElementById('sidebar');

  /* ------------------------------ state ------------------------------ */
  var state = load();
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem('pp_state')) || {};
    } catch (e) { s = {}; }
    s.done = s.done || {}; s.bookmarks = s.bookmarks || {}; s.cards = s.cards || {};
    s.quiz = s.quiz || {}; s.notes = s.notes || {}; s.plan = s.plan || {};
    return s;
  }
  function save() { localStorage.setItem('pp_state', JSON.stringify(state)); }

  /* ------------------------------ helpers ------------------------------ */
  var subj = {}; SUBJECTS.forEach(function (s) { subj[s.id] = s; });
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(s) { return MD.esc(String(s == null ? '' : s)); }
  function topicKey(s, t) { return s + '/' + t; }
  function findTopic(sid, tid) {
    var s = subj[sid]; if (!s) return null;
    for (var i = 0; i < s.topics.length; i++) if (s.topics[i].id === tid) return { s: s, t: s.topics[i], i: i };
    return null;
  }
  function subjProgress(s) {
    var d = s.topics.filter(function (t) { return state.done[topicKey(s.id, t.id)]; }).length;
    return { done: d, total: s.topics.length, pct: s.topics.length ? Math.round(d * 100 / s.topics.length) : 0 };
  }
  function allProgress() {
    var d = 0, t = 0;
    SUBJECTS.forEach(function (s) { var p = subjProgress(s); d += p.done; t += p.total; });
    return { done: d, total: t, pct: t ? Math.round(d * 100 / t) : 0 };
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; }
    return a;
  }
  function plainText(md) { return md.replace(/~~~[\s\S]*?~~~/g, ' ').replace(/[#*`>|_~-]/g, ' ').replace(/\s+/g, ' '); }
  function readMins(md) { return Math.max(1, Math.round(md.split(/\s+/).length / 200)); }
  function ring(pct, size) {
    size = size || 44; var r = (size - 6) / 2, c = 2 * Math.PI * r;
    return '<svg class="ring" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="ring-bg"/>' +
      '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="ring-fg" stroke-dasharray="' + c +
      '" stroke-dashoffset="' + (c * (1 - pct / 100)) + '" transform="rotate(-90 ' + size / 2 + ' ' + size / 2 + ')"/>' +
      '<text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle">' + pct + '%</text></svg>';
  }
  function bar(pct) { return '<div class="bar"><div style="width:' + pct + '%"></div></div>'; }
  function toast(msg) {
    var t = document.createElement('div'); t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 10);
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 300); }, 1800);
  }

  /* flashcards: every card has key subject#index */
  function allCards(filter) {
    var out = [];
    SUBJECTS.forEach(function (s) {
      if (filter && filter !== 'all' && filter !== 'due' && filter !== s.id) return;
      (s.flashcards || []).forEach(function (c, i) { out.push({ key: s.id + '#' + i, s: s, q: c.q, a: c.a }); });
    });
    return out;
  }
  function isDue(key) {
    var c = state.cards[key]; if (!c) return true;
    return Date.now() >= c.due;
  }
  function dueCount(filter) { return allCards(filter).filter(function (c) { return isDue(c.key); }).length; }
  function masteredCount(filter) { return allCards(filter).filter(function (c) { var x = state.cards[c.key]; return x && x.box >= 3; }).length; }

  /* ------------------------------ sidebar ------------------------------ */
  function renderSidebar(route) {
    var html = '<div class="side-section">' +
      navLink('#/', '🏠', 'Dashboard', route.name === 'home') +
      navLink('#/revise', '⚡', 'Revision Hub', route.name === 'revise') +
      navLink('#/cards/due', '🃏', 'Flashcards (due: ' + dueCount('due') + ')', route.name === 'cards') +
      navLink('#/quiz/all', '📝', 'Mixed Quiz', route.name === 'quiz' && route.sid === 'all') +
      navLink('#/plan', '🗓️', 'Study Plan', route.name === 'plan') +
      navLink('#/bookmarks', '🔖', 'Bookmarks', route.name === 'bookmarks') +
      '</div>';
    GROUPS.forEach(function (g) {
      var list = SUBJECTS.filter(function (s) { return s.group === g.id; });
      if (!list.length) return;
      html += '<div class="side-group-title">' + g.title + '</div>';
      list.forEach(function (s) {
        var open = route.sid === s.id;
        var p = subjProgress(s);
        html += '<details class="side-subject"' + (open ? ' open' : '') + '><summary><span class="side-ico">' + s.icon + '</span><span class="side-name">' +
          esc(s.short || s.title) + '</span><span class="side-pct">' + p.pct + '%</span></summary><div class="side-topics">' +
          '<a class="side-topic' + (route.name === 'subject' && open ? ' active' : '') + '" href="#/s/' + s.id + '">📚 Overview</a>';
        s.topics.forEach(function (t, i) {
          var active = route.tid === t.id && open;
          var done = state.done[topicKey(s.id, t.id)];
          html += '<a class="side-topic' + (active ? ' active' : '') + (done ? ' done' : '') + '" href="#/s/' + s.id + '/' + t.id + '">' +
            '<span class="chk">' + (done ? '✓' : (i + 1)) + '</span>' + esc(t.title) + '</a>';
        });
        html += '<a class="side-topic rev" href="#/cheat/' + s.id + '">⚡ Cheat sheet</a>' +
          '<a class="side-topic rev" href="#/cards/' + s.id + '">🃏 Flashcards</a>' +
          '<a class="side-topic rev" href="#/quiz/' + s.id + '">📝 Quiz</a></div></details>';
      });
    });
    sidebar.innerHTML = html;
    var a = $('.side-topic.active', sidebar);
    if (a && a.scrollIntoView) a.scrollIntoView({ block: 'nearest' });
  }
  function navLink(href, ico, text, active) {
    return '<a class="side-link' + (active ? ' active' : '') + '" href="' + href + '"><span class="side-ico">' + ico + '</span>' + text + '</a>';
  }

  /* ------------------------------ views ------------------------------ */
  function viewHome() {
    var p = allProgress();
    var totalCards = allCards().length, due = dueCount('due'), mastered = masteredCount();
    var last = state.last && findTopic(state.last.s, state.last.t);
    var html = '<section class="hero"><div><h1>Your complete placement prep guide</h1>' +
      '<p>Everything for <b>Software Engineering</b> and <b>AI/ML</b> campus placements — DSA, core CS, system design, machine learning, GenAI, aptitude and HR — with cheat sheets, spaced-repetition flashcards and quizzes for fast revision.</p>' +
      '<div class="hero-actions">' +
      (last ? '<a class="btn primary" href="#/s/' + last.s.id + '/' + last.t.id + '">▶ Continue: ' + esc(last.t.title) + '</a>' : '<a class="btn primary" href="#/plan">🗓️ Start with the study plan</a>') +
      '<a class="btn" href="#/revise">⚡ Quick revision</a></div></div>' +
      '<div class="hero-ring">' + ring(p.pct, 120) + '<div class="muted small">' + p.done + ' / ' + p.total + ' topics done</div></div></section>';

    html += '<div class="stats">' +
      stat('📚', SUBJECTS.length, 'Subjects') +
      stat('📖', p.total, 'Topics') +
      stat('🃏', due, 'Cards due today') +
      stat('🏆', mastered + '/' + totalCards, 'Cards mastered') +
      '</div>';

    GROUPS.forEach(function (g) {
      var list = SUBJECTS.filter(function (s) { return s.group === g.id; });
      if (!list.length) return;
      html += '<h2 class="group-title">' + g.title + '</h2><div class="grid">';
      list.forEach(function (s) {
        var sp = subjProgress(s);
        var qb = state.quiz[s.id];
        html += '<a class="card subject-card" href="#/s/' + s.id + '" style="--accent:' + s.color + '">' +
          '<div class="sc-top"><span class="sc-ico">' + s.icon + '</span>' + ring(sp.pct, 46) + '</div>' +
          '<h3>' + esc(s.title) + '</h3><p>' + esc(s.desc) + '</p>' +
          '<div class="sc-meta"><span>' + s.topics.length + ' topics</span><span>' + (s.flashcards || []).length + ' cards</span><span>' +
          (s.quiz || []).length + ' MCQs</span>' + (qb ? '<span>best ' + qb.best + '%</span>' : '') + '</div></a>';
      });
      html += '</div>';
    });

    html += '<h2 class="group-title">How to use this site</h2><div class="grid three">' +
      tip('1. Learn', 'Read each topic in detail. Mark it done ✓ when finished, and write your own notes at the bottom.') +
      tip('2. Revise', 'Use ⚡ cheat sheets (one page per subject), the 🃏 flashcards with spaced repetition, and 📝 quizzes.') +
      tip('3. Repeat', 'Open “Flashcards due” daily. Cards you know come back later; cards you miss come back tomorrow.') +
      '</div><p class="muted small center">Shortcuts: <kbd>/</kbd> search · <kbd>Space</kbd> flip card · <kbd>1</kbd>/<kbd>2</kbd> grade card · <kbd>←</kbd>/<kbd>→</kbd> prev/next topic. Progress is saved in this browser.</p>';
    app.innerHTML = html;
  }
  function stat(i, n, l) { return '<div class="stat"><span class="stat-ico">' + i + '</span><div><b>' + n + '</b><span>' + l + '</span></div></div>'; }
  function tip(t, d) { return '<div class="card tip-card"><h3>' + t + '</h3><p>' + d + '</p></div>'; }

  function viewSubject(sid) {
    var s = subj[sid]; if (!s) return notFound();
    var p = subjProgress(s);
    var html = crumbs([[s.title]]) +
      '<section class="subject-head" style="--accent:' + s.color + '"><div class="sh-ico">' + s.icon + '</div><div><h1>' + esc(s.title) + '</h1><p>' + esc(s.desc) + '</p>' +
      bar(p.pct) + '<div class="muted small">' + p.done + ' of ' + p.total + ' topics completed</div></div></section>' +
      '<div class="rev-actions">' +
      '<a class="btn" href="#/cheat/' + s.id + '">⚡ Cheat sheet</a>' +
      '<a class="btn" href="#/cards/' + s.id + '">🃏 Flashcards (' + (s.flashcards || []).length + ')</a>' +
      '<a class="btn" href="#/quiz/' + s.id + '">📝 Quiz (' + (s.quiz || []).length + ')</a></div>';
    if (s.intro) html += '<div class="prose">' + MD.render(s.intro).html + '</div>';
    html += '<div class="topic-list">';
    s.topics.forEach(function (t, i) {
      var k = topicKey(s.id, t.id), done = state.done[k];
      html += '<a class="topic-row' + (done ? ' done' : '') + '" href="#/s/' + s.id + '/' + t.id + '"><span class="tr-num">' + (done ? '✓' : i + 1) + '</span>' +
        '<div><b>' + esc(t.title) + '</b><span class="muted small">' + readMins(t.content) + ' min read · ' + (t.keyPoints || []).length + ' key points' +
        (state.bookmarks[k] ? ' · 🔖' : '') + '</span></div><span class="tr-go">→</span></a>';
    });
    html += '</div>';
    app.innerHTML = html;
  }

  function viewTopic(sid, tid) {
    var f = findTopic(sid, tid); if (!f) return notFound();
    var s = f.s, t = f.t, k = topicKey(sid, tid);
    state.last = { s: sid, t: tid }; save();
    var r = MD.render(t.content);
    var prev = s.topics[f.i - 1], next = s.topics[f.i + 1];
    var html = crumbs([[s.title, '#/s/' + s.id], [t.title]]) +
      '<div class="topic-layout"><article class="prose">' +
      '<div class="topic-head"><h1>' + esc(t.title) + '</h1><div class="topic-tools">' +
      '<span class="muted small">⏱ ' + readMins(t.content) + ' min</span>' +
      '<button class="btn sm" id="bmBtn">' + (state.bookmarks[k] ? '🔖 Saved' : '🏷️ Save') + '</button>' +
      '<button class="btn sm ' + (state.done[k] ? 'success' : '') + '" id="doneBtn">' + (state.done[k] ? '✓ Completed' : 'Mark complete') + '</button></div></div>' +
      r.html;
    if (t.keyPoints && t.keyPoints.length) {
      html += '<div class="keypoints" id="quick-revision"><h2>⚡ Quick revision</h2><ul>' +
        t.keyPoints.map(function (x) { return '<li>' + MD.inline(x) + '</li>'; }).join('') + '</ul></div>';
    }
    html += '<div class="notes"><h3>📝 My notes</h3><textarea id="notesBox" placeholder="Write your own notes, mnemonics or doubts for this topic… (auto-saved)">' +
      esc(state.notes[k] || '') + '</textarea></div>';
    html += '<div class="pager">' +
      (prev ? '<a class="btn" href="#/s/' + s.id + '/' + prev.id + '">← ' + esc(prev.title) + '</a>' : '<span></span>') +
      (next ? '<a class="btn primary" href="#/s/' + s.id + '/' + next.id + '">' + esc(next.title) + ' →</a>' :
        '<a class="btn primary" href="#/quiz/' + s.id + '">Take the ' + esc(s.short || s.title) + ' quiz →</a>') + '</div></article>';
    if (r.toc.length > 2) {
      html += '<nav class="toc"><div class="toc-title">On this page</div>' + r.toc.map(function (h) {
        return '<a class="lvl' + h.lvl + '" href="#" data-target="' + h.id + '">' + esc(h.text) + '</a>';
      }).join('') + (t.keyPoints ? '<a class="lvl2" href="#" data-target="quick-revision">⚡ Quick revision</a>' : '') + '</nav>';
    }
    html += '</div>';
    app.innerHTML = html;

    $('#doneBtn').onclick = function () {
      state.done[k] = !state.done[k]; if (!state.done[k]) delete state.done[k]; save();
      this.textContent = state.done[k] ? '✓ Completed' : 'Mark complete';
      this.classList.toggle('success', !!state.done[k]);
      renderSidebar(currentRoute);
      if (state.done[k]) toast('Nice! Topic marked complete 🎉');
    };
    $('#bmBtn').onclick = function () {
      if (state.bookmarks[k]) delete state.bookmarks[k]; else state.bookmarks[k] = Date.now();
      save(); this.textContent = state.bookmarks[k] ? '🔖 Saved' : '🏷️ Save';
      toast(state.bookmarks[k] ? 'Bookmarked' : 'Bookmark removed');
    };
    var timer;
    $('#notesBox').oninput = function () {
      var v = this.value; clearTimeout(timer);
      timer = setTimeout(function () { if (v.trim()) state.notes[k] = v; else delete state.notes[k]; save(); }, 400);
    };
    $all('.toc a').forEach(function (a) {
      a.onclick = function (e) { e.preventDefault(); var el = document.getElementById(a.dataset.target); if (el) el.scrollIntoView({ behavior: 'smooth' }); };
    });
  }

  function viewCheat(sid) {
    var list = sid === 'all' ? SUBJECTS : [subj[sid]];
    if (!list[0]) return notFound();
    var html = crumbs(sid === 'all' ? [['Revision Hub', '#/revise'], ['All cheat sheets']] : [[list[0].title, '#/s/' + sid], ['Cheat sheet']]) +
      '<div class="page-head"><h1>⚡ ' + (sid === 'all' ? 'Master cheat sheet' : esc(list[0].title) + ' — cheat sheet') + '</h1>' +
      '<div><button class="btn sm" id="hideBtn">🙈 Self-test mode</button> <button class="btn sm" onclick="window.print()">🖨️ Print / PDF</button></div></div>' +
      '<p class="muted">All key points on one page. In self-test mode, points are blurred — try to recall each one, then click to reveal.</p><div class="cheat">';
    list.forEach(function (s) {
      if (sid === 'all') html += '<h2 class="cheat-subj">' + s.icon + ' ' + esc(s.title) + '</h2>';
      if (s.cheatsheet) html += '<div class="prose cheat-extra">' + MD.render(s.cheatsheet).html + '</div>';
      html += '<div class="cheat-grid">';
      s.topics.forEach(function (t) {
        if (!t.keyPoints || !t.keyPoints.length) return;
        html += '<div class="cheat-card"><h3><a href="#/s/' + s.id + '/' + t.id + '">' + esc(t.title) + '</a></h3><ul>' +
          t.keyPoints.map(function (x) { return '<li><span class="kp">' + MD.inline(x) + '</span></li>'; }).join('') + '</ul></div>';
      });
      html += '</div>';
    });
    html += '</div>';
    app.innerHTML = html;
    var c = $('.cheat');
    $('#hideBtn').onclick = function () {
      c.classList.toggle('blur'); this.textContent = c.classList.contains('blur') ? '👀 Show all' : '🙈 Self-test mode';
      $all('.kp.revealed', c).forEach(function (x) { x.classList.remove('revealed'); });
    };
    c.addEventListener('click', function (e) { var kp = e.target.closest('.kp'); if (kp && c.classList.contains('blur')) kp.classList.toggle('revealed'); });
  }

  /* ---------------- flashcards (Leitner spaced repetition) ---------------- */
  var cardSession = null;
  function viewCards(filter) {
    var deck = allCards(filter === 'due' ? 'all' : filter);
    if (filter === 'due') deck = deck.filter(function (c) { return isDue(c.key); });
    var title = filter === 'due' ? 'Cards due today' : filter === 'all' ? 'All flashcards' : (subj[filter] ? subj[filter].title : null);
    if (!title) return notFound();
    var mode = (location.hash.split('?')[1] || '');
    if (mode === 'due' && filter !== 'due') deck = deck.filter(function (c) { return isDue(c.key); });
    deck = shuffle(deck);
    cardSession = { deck: deck, i: 0, flipped: false, known: 0, again: 0, filter: filter };
    var head = crumbs([['Revision Hub', '#/revise'], ['Flashcards']]) +
      '<div class="page-head"><h1>🃏 ' + esc(title) + '</h1>' +
      (filter !== 'due' && filter !== 'all' ? '<div><a class="btn sm" href="#/cards/' + filter + '?due">Only due (' + dueCount(filter) + ')</a> <a class="btn sm" href="#/cards/' + filter + '">All (' + allCards(filter).length + ')</a></div>' : '') + '</div>';
    if (!deck.length) {
      app.innerHTML = head + '<div class="empty"><div class="big">🎉</div><h2>All caught up!</h2><p>No cards are due right now. Come back tomorrow, or practise all cards anyway.</p>' +
        '<a class="btn primary" href="#/cards/all">Practise all cards</a></div>';
      return;
    }
    app.innerHTML = head + '<div id="cardArea"></div>';
    drawCard();
  }
  function drawCard() {
    var cs = cardSession, area = $('#cardArea'); if (!area) return;
    if (cs.i >= cs.deck.length) {
      area.innerHTML = '<div class="empty"><div class="big">✅</div><h2>Session complete</h2><p>Knew <b>' + cs.known + '</b> · Need practice <b>' + cs.again + '</b></p>' +
        '<p class="muted">Cards you missed will come back tomorrow; known cards are spaced further apart.</p>' +
        '<button class="btn primary" id="againBtn">Restart deck</button> <a class="btn" href="#/revise">Back to revision hub</a></div>';
      $('#againBtn').onclick = function () { viewCards(cs.filter); };
      return;
    }
    var c = cs.deck[cs.i], st = state.cards[c.key];
    area.innerHTML = '<div class="fc-progress">' + bar(Math.round(cs.i * 100 / cs.deck.length)) + '<span>' + (cs.i + 1) + ' / ' + cs.deck.length + '</span></div>' +
      '<div class="flashcard' + (cs.flipped ? ' flipped' : '') + '" id="fc" tabindex="0"><div class="fc-inner">' +
      '<div class="fc-face fc-front"><span class="fc-tag">' + c.s.icon + ' ' + esc(c.s.short || c.s.title) + (st ? ' · box ' + st.box : ' · new') + '</span><div class="fc-q">' + MD.inline(c.q) + '</div><span class="muted small">Click or press Space to reveal</span></div>' +
      '<div class="fc-face fc-back"><span class="fc-tag">Answer</span><div class="fc-a prose">' + MD.render(c.a).html + '</div></div></div></div>' +
      '<div class="fc-actions"><button class="btn danger" id="fcAgain">✗ Again <kbd>1</kbd></button><button class="btn" id="fcFlip">Flip <kbd>Space</kbd></button><button class="btn success" id="fcGood">✓ Got it <kbd>2</kbd></button></div>';
    $('#fc').onclick = flip; $('#fcFlip').onclick = flip;
    $('#fcAgain').onclick = function () { grade(false); };
    $('#fcGood').onclick = function () { grade(true); };
  }
  function flip() { if (!cardSession) return; cardSession.flipped = !cardSession.flipped; var f = $('#fc'); if (f) f.classList.toggle('flipped', cardSession.flipped); }
  function grade(ok) {
    var cs = cardSession; if (!cs || cs.i >= cs.deck.length) return;
    var c = cs.deck[cs.i], st = state.cards[c.key] || { box: 0 };
    st.box = ok ? Math.min(st.box + 1, BOX_DAYS.length - 1) : 1;
    st.due = Date.now() + (ok ? BOX_DAYS[st.box] : 1) * 864e5 - 36e5; // minus 1h slack
    state.cards[c.key] = st; save();
    ok ? cs.known++ : cs.again++;
    cs.i++; cs.flipped = false; drawCard();
  }

  /* ------------------------------ quiz ------------------------------ */
  var quizSession = null;
  function viewQuiz(sid) {
    var pool = [];
    SUBJECTS.forEach(function (s) {
      if (sid !== 'all' && sid !== s.id) return;
      (s.quiz || []).forEach(function (q) { pool.push({ s: s, q: q }); });
    });
    var title = sid === 'all' ? 'Mixed quiz (all subjects)' : subj[sid] ? subj[sid].title + ' quiz' : null;
    if (!title || !pool.length) return notFound();
    var best = state.quiz[sid];
    app.innerHTML = crumbs([['Revision Hub', '#/revise'], ['Quiz']]) +
      '<div class="page-head"><h1>📝 ' + esc(title) + '</h1></div>' +
      '<div class="card quiz-start"><p>' + pool.length + ' questions available.' + (best ? ' Your best: <b>' + best.best + '%</b>, last: <b>' + best.last + '%</b>.' : '') + '</p>' +
      '<p>How many questions?</p><div class="btn-row">' +
      [10, 20, 30].filter(function (n) { return n < pool.length; }).map(function (n) { return '<button class="btn" data-n="' + n + '">' + n + '</button>'; }).join('') +
      '<button class="btn primary" data-n="' + pool.length + '">All ' + pool.length + '</button></div></div>';
    $all('[data-n]').forEach(function (b) {
      b.onclick = function () {
        var qs = shuffle(pool).slice(0, +b.dataset.n).map(function (x) {
          var order = shuffle(x.q.options.map(function (_, i) { return i; }));
          return { s: x.s, q: x.q, order: order, picked: null };
        });
        quizSession = { sid: sid, qs: qs, i: 0, score: 0 };
        drawQuiz();
      };
    });
  }
  function drawQuiz() {
    var qs = quizSession;
    if (qs.i >= qs.qs.length) return quizResult();
    var it = qs.qs[qs.i], q = it.q;
    var html = '<div class="page-head"><h1>📝 Question ' + (qs.i + 1) + ' / ' + qs.qs.length + '</h1><span class="muted">Score: ' + qs.score + '</span></div>' +
      bar(Math.round(qs.i * 100 / qs.qs.length)) +
      '<div class="card quiz-card"><span class="fc-tag">' + it.s.icon + ' ' + esc(it.s.short || it.s.title) + '</span><div class="quiz-q">' + MD.render(q.q).html + '</div><div class="options">';
    it.order.forEach(function (oi, pos) {
      var cls = '';
      if (it.picked !== null) { if (oi === q.answer) cls = ' correct'; else if (oi === it.picked) cls = ' wrong'; }
      html += '<button class="option' + cls + '" data-o="' + oi + '"' + (it.picked !== null ? ' disabled' : '') + '><span class="opt-l">' + 'ABCD'[pos] + '</span>' + MD.inline(q.options[oi]) + '</button>';
    });
    html += '</div>';
    if (it.picked !== null) {
      html += '<div class="callout ' + (it.picked === q.answer ? 'tip' : 'warn') + '"><p><b>' + (it.picked === q.answer ? '✓ Correct!' : '✗ Not quite.') + '</b> ' + MD.inline(q.explain || '') + '</p></div>' +
        '<div class="btn-row right"><button class="btn primary" id="qNext">' + (qs.i + 1 < qs.qs.length ? 'Next →' : 'See result') + '</button></div>';
    }
    html += '</div>';
    app.innerHTML = html;
    $all('.option').forEach(function (b) {
      b.onclick = function () {
        if (it.picked !== null) return;
        it.picked = +b.dataset.o; if (it.picked === q.answer) qs.score++;
        drawQuiz();
      };
    });
    var n = $('#qNext'); if (n) { n.onclick = function () { qs.i++; drawQuiz(); window.scrollTo(0, 0); }; n.focus(); }
  }
  function quizResult() {
    var qs = quizSession, pct = Math.round(qs.score * 100 / qs.qs.length);
    var prev = state.quiz[qs.sid] || { best: 0 };
    state.quiz[qs.sid] = { best: Math.max(prev.best, pct), last: pct, at: Date.now() }; save();
    var wrong = qs.qs.filter(function (x) { return x.picked !== x.q.answer; });
    var html = '<div class="empty"><div class="big">' + (pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '📚') + '</div><h2>You scored ' + qs.score + ' / ' + qs.qs.length + ' (' + pct + '%)</h2>' +
      '<p class="muted">' + (pct >= 80 ? 'Excellent — interview ready on this!' : pct >= 50 ? 'Good. Revise the misses below.' : 'Keep going — revisit the topics below.') + '</p>' +
      '<button class="btn primary" id="retry">Try another round</button> <a class="btn" href="#/revise">Revision hub</a></div>';
    if (wrong.length) {
      html += '<h2>Review your mistakes</h2>';
      wrong.forEach(function (x) {
        html += '<div class="card review"><div class="quiz-q">' + MD.render(x.q.q).html + '</div><p>✓ <b>' + MD.inline(x.q.options[x.q.answer]) + '</b></p>' +
          '<p class="muted">' + MD.inline(x.q.explain || '') + '</p>' +
          (x.q.topic ? '<a href="#/s/' + x.s.id + '/' + x.q.topic + '">Revise this topic →</a>' : '') + '</div>';
      });
    }
    app.innerHTML = html;
    $('#retry').onclick = function () { viewQuiz(qs.sid); };
  }

  function viewRevise() {
    var html = '<div class="page-head"><h1>⚡ Revision Hub</h1></div>' +
      '<p class="muted">Short on time? Pick a mode. The night before an interview: cheat sheet → flashcards due → one quiz.</p>' +
      '<div class="grid three">' +
      '<a class="card mode-card" href="#/cards/due"><div class="big">🃏</div><h3>Flashcards due</h3><p>' + dueCount('due') + ' cards due · spaced repetition</p></a>' +
      '<a class="card mode-card" href="#/quiz/all"><div class="big">📝</div><h3>Mixed quiz</h3><p>Random MCQs from every subject</p></a>' +
      '<a class="card mode-card" href="#/cheat/all"><div class="big">📄</div><h3>Master cheat sheet</h3><p>Every key point on one page</p></a>' +
      '<a class="card mode-card" href="#/rapid"><div class="big">⏱️</div><h3>5-minute rapid fire</h3><p>10 random flashcards from all subjects</p></a>' +
      '<a class="card mode-card" href="#/bookmarks"><div class="big">🔖</div><h3>Bookmarked topics</h3><p>' + Object.keys(state.bookmarks).length + ' saved for revision</p></a>' +
      '<a class="card mode-card" href="#/notes"><div class="big">🗒️</div><h3>My notes</h3><p>' + Object.keys(state.notes).length + ' topics with notes</p></a>' +
      '</div><h2>By subject</h2><div class="table-wrap"><table class="rev-table"><thead><tr><th>Subject</th><th>Progress</th><th>Cards (mastered / due)</th><th>Quiz best</th><th>Revise</th></tr></thead><tbody>';
    SUBJECTS.forEach(function (s) {
      var p = subjProgress(s), qb = state.quiz[s.id];
      html += '<tr><td><a href="#/s/' + s.id + '">' + s.icon + ' ' + esc(s.title) + '</a></td><td>' + bar(p.pct) + '<span class="small muted">' + p.done + '/' + p.total + '</span></td>' +
        '<td>' + masteredCount(s.id) + '/' + allCards(s.id).length + ' · <b>' + dueCount(s.id) + '</b> due</td><td>' + (qb ? qb.best + '%' : '—') + '</td>' +
        '<td class="nowrap"><a class="btn sm" href="#/cheat/' + s.id + '" title="Cheat sheet">⚡</a> <a class="btn sm" href="#/cards/' + s.id + '?due" title="Flashcards">🃏</a> <a class="btn sm" href="#/quiz/' + s.id + '" title="Quiz">📝</a></td></tr>';
    });
    html += '</tbody></table></div>';
    app.innerHTML = html;
  }

  function viewRapid() {
    var deck = shuffle(allCards()).slice(0, 10);
    cardSession = { deck: deck, i: 0, flipped: false, known: 0, again: 0, filter: 'all' };
    app.innerHTML = crumbs([['Revision Hub', '#/revise'], ['Rapid fire']]) + '<div class="page-head"><h1>⏱️ 5-minute rapid fire</h1><span class="timer" id="timer">5:00</span></div><div id="cardArea"></div>';
    drawCard();
    var end = Date.now() + 300000;
    var iv = setInterval(function () {
      var el = $('#timer'); if (!el) return clearInterval(iv);
      var left = Math.max(0, end - Date.now()); el.textContent = Math.floor(left / 60000) + ':' + ('0' + Math.floor(left / 1000) % 60).slice(-2);
      if (!left) { clearInterval(iv); el.textContent = "Time's up!"; }
    }, 1000);
  }

  function viewBookmarks() {
    var keys = Object.keys(state.bookmarks).sort(function (a, b) { return state.bookmarks[b] - state.bookmarks[a]; });
    var html = '<div class="page-head"><h1>🔖 Bookmarked topics</h1></div>';
    if (!keys.length) html += '<div class="empty"><div class="big">🏷️</div><p>No bookmarks yet. Click “Save” on any topic to collect tricky topics for last-minute revision.</p></div>';
    else html += '<div class="topic-list">' + keys.map(function (k) {
      var p = k.split('/'), f = findTopic(p[0], p[1]); if (!f) return '';
      return '<a class="topic-row" href="#/s/' + p[0] + '/' + p[1] + '"><span class="tr-num">' + f.s.icon + '</span><div><b>' + esc(f.t.title) + '</b><span class="muted small">' + esc(f.s.title) + '</span></div><span class="tr-go">→</span></a>';
    }).join('') + '</div>';
    app.innerHTML = html;
  }

  function viewNotes() {
    var keys = Object.keys(state.notes);
    var html = '<div class="page-head"><h1>🗒️ My notes</h1>' + (keys.length ? '<button class="btn sm" onclick="window.print()">🖨️ Print</button>' : '') + '</div>';
    if (!keys.length) html += '<div class="empty"><div class="big">✍️</div><p>Notes you write at the bottom of any topic appear here.</p></div>';
    keys.forEach(function (k) {
      var p = k.split('/'), f = findTopic(p[0], p[1]); if (!f) return;
      html += '<div class="card review"><h3><a href="#/s/' + p[0] + '/' + p[1] + '">' + f.s.icon + ' ' + esc(f.t.title) + '</a></h3><pre class="note-text">' + esc(state.notes[k]) + '</pre></div>';
    });
    app.innerHTML = html;
  }

  function viewPlan() {
    var plan = window.STUDY_PLAN || [];
    var doneDays = plan.filter(function (d) { return state.plan[d.day]; }).length;
    var html = '<div class="page-head"><h1>🗓️ Study plan</h1><span class="muted">' + doneDays + ' / ' + plan.length + ' days done</span></div>' +
      (window.STUDY_PLAN_INTRO ? '<div class="prose">' + MD.render(window.STUDY_PLAN_INTRO).html + '</div>' : '') +
      bar(plan.length ? Math.round(doneDays * 100 / plan.length) : 0) + '<div class="plan">';
    plan.forEach(function (d) {
      var done = state.plan[d.day];
      html += '<div class="plan-day' + (done ? ' done' : '') + '"><label class="plan-chk"><input type="checkbox" data-day="' + d.day + '"' + (done ? ' checked' : '') + '/> Day ' + d.day + '</label>' +
        '<div><b>' + esc(d.title) + '</b><div class="plan-links">' + (d.links || []).map(function (l) {
          var parts = l.split('/'), f = findTopic(parts[0], parts[1]);
          if (f) return '<a href="#/s/' + parts[0] + '/' + parts[1] + '">' + f.s.icon + ' ' + esc(f.t.title) + '</a>';
          if (l.indexOf('#') === 0) {
            var bits = l.replace(/^#\//, '').split('/');
            var label = { cheat: '⚡ Cheat sheet', quiz: '📝 Quiz', cards: '🃏 Flashcards' }[bits[0]] || bits[0];
            var who = bits[1] === 'all' ? 'all subjects' : bits[1] === 'due' ? 'due today' : (subj[bits[1]] ? subj[bits[1]].short || subj[bits[1]].title : '');
            return '<a href="' + l + '">' + esc(label + (who ? ' — ' + who : '')) + '</a>';
          }
          return '';
        }).join('') + '</div>' + (d.task ? '<div class="muted small">🛠 ' + MD.inline(d.task) + '</div>' : '') + '</div></div>';
    });
    html += '</div>';
    app.innerHTML = html;
    $all('.plan-chk input').forEach(function (c) {
      c.onchange = function () { if (c.checked) state.plan[c.dataset.day] = 1; else delete state.plan[c.dataset.day]; save(); viewPlan(); };
    });
  }

  function crumbs(items) {
    return '<nav class="crumbs"><a href="#/">Home</a>' + items.map(function (x) {
      return ' <span>/</span> ' + (x[1] ? '<a href="' + x[1] + '">' + esc(x[0]) + '</a>' : '<span class="cur">' + esc(x[0]) + '</span>');
    }).join('') + '</nav>';
  }
  function notFound() { app.innerHTML = '<div class="empty"><div class="big">🤔</div><h2>Page not found</h2><a class="btn primary" href="#/">Go home</a></div>'; }

  /* ------------------------------ search ------------------------------ */
  var index = [];
  SUBJECTS.forEach(function (s) {
    s.topics.forEach(function (t) {
      index.push({ type: 'Topic', title: t.title, sub: s.title, href: '#/s/' + s.id + '/' + t.id, text: (t.title + ' ' + plainText(t.content) + ' ' + (t.keyPoints || []).join(' ')).toLowerCase(), titleL: t.title.toLowerCase(), icon: s.icon });
    });
    (s.flashcards || []).forEach(function (c) {
      index.push({ type: 'Flashcard', title: c.q.replace(/[`*]/g, ''), sub: s.title, href: '#/cards/' + s.id, text: (c.q + ' ' + c.a).toLowerCase(), titleL: c.q.toLowerCase(), icon: '🃏', answer: c.a });
    });
  });
  var input = $('#searchInput'), results = $('#searchResults');
  input.addEventListener('input', function () {
    var q = input.value.trim().toLowerCase();
    if (q.length < 2) { results.classList.add('hidden'); return; }
    var words = q.split(/\s+/);
    var hits = index.map(function (it) {
      var score = 0;
      for (var i = 0; i < words.length; i++) {
        if (it.text.indexOf(words[i]) < 0) return null;
        if (it.titleL.indexOf(words[i]) >= 0) score += 10;
        score += Math.min(5, it.text.split(words[i]).length - 1);
      }
      if (it.type === 'Topic') score += 3;
      return { it: it, score: score };
    }).filter(Boolean).sort(function (a, b) { return b.score - a.score; }).slice(0, 12);
    results.innerHTML = hits.length ? hits.map(function (h) {
      var it = h.it, snip = '';
      if (it.type === 'Topic') {
        var pos = it.text.indexOf(words[0]); snip = it.text.slice(Math.max(0, pos - 40), pos + 80);
      } else snip = plainText(it.answer).slice(0, 110).toLowerCase();
      return '<a class="sr" href="' + it.href + '"><span class="sr-ico">' + it.icon + '</span><div><b>' + esc(it.title) + '</b><span class="sr-sub">' + it.type + ' · ' + esc(it.sub) + '</span><span class="sr-snip">…' + esc(snip) + '…</span></div></a>';
    }).join('') : '<div class="sr-empty">No results for “' + esc(q) + '”</div>';
    results.classList.remove('hidden');
  });
  results.addEventListener('click', function () { results.classList.add('hidden'); input.value = ''; input.blur(); });
  document.addEventListener('click', function (e) { if (!e.target.closest('.search-wrap')) results.classList.add('hidden'); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { var a = $('.sr', results); if (a) { location.hash = a.getAttribute('href'); results.classList.add('hidden'); input.value = ''; input.blur(); } }
    if (e.key === 'Escape') { results.classList.add('hidden'); input.blur(); }
  });

  /* ------------------------------ global UI ------------------------------ */
  $('#themeBtn').onclick = function () {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (dark) document.documentElement.removeAttribute('data-theme'); else document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('pp_theme', dark ? 'light' : 'dark');
  };
  function closeMenu() { document.body.classList.remove('menu-open'); }
  $('#menuBtn').onclick = function () { document.body.classList.toggle('menu-open'); };
  $('#overlay').onclick = closeMenu;
  sidebar.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });

  function setCodeLang(lang) {
    if (lang === 'cpp') document.documentElement.setAttribute('data-code', 'cpp');
    else document.documentElement.removeAttribute('data-code');
    localStorage.setItem('pp_code', lang);
  }
  $('#langSwitch').addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang]'); if (b) { setCodeLang(b.dataset.lang); toast('Code examples: ' + b.textContent); }
  });

  app.addEventListener('click', function (e) {
    var tab = e.target.closest('.lang-tab');
    if (tab) {
      // keep the clicked block in place while every block on the page switches language
      var block = tab.closest('.code-block'), top = block.getBoundingClientRect().top;
      setCodeLang(tab.dataset.lang);
      window.scrollBy(0, block.getBoundingClientRect().top - top);
      return;
    }
    var b = e.target.closest('.copy-btn'); if (!b) return;
    var pres = $all('pre', b.closest('.code-block')).filter(function (p) { return p.offsetParent !== null; });
    var code = (pres[0] || b.closest('.code-block').querySelector('pre')).textContent;
    (navigator.clipboard ? navigator.clipboard.writeText(code) : Promise.reject()).then(function () { b.textContent = 'Copied!'; }, function () { b.textContent = 'Select & copy'; });
    setTimeout(function () { b.textContent = 'Copy'; }, 1500);
  });

  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;
    if (e.key === 'Escape') { results.classList.add('hidden'); closeMenu(); return; }
    if (e.key === '/') { e.preventDefault(); input.focus(); return; }
    if ($('#fc')) {
      if (e.key === ' ') { e.preventDefault(); flip(); }
      else if (e.key === '1') grade(false);
      else if (e.key === '2') grade(true);
      return;
    }
    if (currentRoute.name === 'topic' && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      var btns = $all('.pager a'); var target = e.key === 'ArrowLeft' ? btns.filter(function (a) { return !a.classList.contains('primary'); })[0] : btns.filter(function (a) { return a.classList.contains('primary'); })[0];
      if (target) location.hash = target.getAttribute('href');
    }
  });

  /* ------------------------------ router ------------------------------ */
  var currentRoute = {};
  function parse() {
    var h = location.hash.replace(/^#\/?/, '').split('?')[0];
    var p = h.split('/').filter(Boolean);
    switch (p[0]) {
      case undefined: return { name: 'home' };
      case 's': return p[2] ? { name: 'topic', sid: p[1], tid: p[2] } : { name: 'subject', sid: p[1] };
      case 'cheat': return { name: 'cheat', sid: p[1] || 'all' };
      case 'cards': return { name: 'cards', sid: p[1] || 'due' };
      case 'quiz': return { name: 'quiz', sid: p[1] || 'all' };
      default: return { name: p[0] };
    }
  }
  function route() {
    currentRoute = parse();
    var r = currentRoute;
    results.classList.add('hidden'); input.value = '';
    renderSidebar(r);
    switch (r.name) {
      case 'home': viewHome(); break;
      case 'subject': viewSubject(r.sid); break;
      case 'topic': viewTopic(r.sid, r.tid); break;
      case 'cheat': viewCheat(r.sid); break;
      case 'cards': viewCards(r.sid); break;
      case 'quiz': viewQuiz(r.sid); break;
      case 'revise': viewRevise(); break;
      case 'rapid': viewRapid(); break;
      case 'bookmarks': viewBookmarks(); break;
      case 'notes': viewNotes(); break;
      case 'plan': viewPlan(); break;
      default: notFound();
    }
    window.scrollTo(0, 0);
    var t = $('h1', app); document.title = (t ? t.textContent.replace(/^[^\w]+/, '') + ' · ' : '') + 'PlacePrep';
  }
  window.addEventListener('hashchange', route);
  route();
})();

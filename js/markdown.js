/* Tiny markdown renderer for content files.
 * Supports: #/##/### headings, paragraphs, - / * / 1. lists (one level of nesting via 2+ spaces),
 * ~~~lang code fences (or ```), | tables |, > blockquotes, ---, **bold**, *italic*, `code`, [links](url).
 */
(function () {
  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function inline(s) {
    var codes = [];
    s = s.replace(/`([^`]+)`/g, function (_, c) {
      codes.push('<code>' + esc(c) + '</code>');
      return '\u0000' + (codes.length - 1) + '\u0000';
    });
    s = esc(s);
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (_, t, u) {
      var ext = /^https?:/.test(u);
      return '<a href="' + u + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + t + '</a>';
    });
    s = s.replace(/\u0000(\d+)\u0000/g, function (_, i) { return codes[+i]; });
    return s;
  }

  var LANGS = { python: 'Python', cpp: 'C++' };

  function slug(s) {
    return s.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function render(md) {
    var lines = md.replace(/\r/g, '').split('\n');
    // strip common indentation
    var minIndent = Infinity;
    lines.forEach(function (l) {
      if (l.trim()) { var m = l.match(/^ */)[0].length; if (m < minIndent) minIndent = m; }
    });
    if (minIndent && minIndent !== Infinity) lines = lines.map(function (l) { return l.slice(minIndent); });

    var out = [], i = 0, toc = [];
    while (i < lines.length) {
      var line = lines[i];
      if (!line.trim()) { i++; continue; }

      // code fence
      var fence = line.match(/^(~~~|```)\s*(\w*)/);
      if (fence) {
        var group = [readFence()];
        // a python fence followed by a cpp fence (or vice versa) becomes one switchable block
        while (true) {
          var j = i;
          while (j < lines.length && !lines[j].trim()) j++;
          var nf = j < lines.length && lines[j].match(/^(~~~|```)\s*(\w*)/);
          var langs = group.map(function (g) { return g.lang; });
          if (nf && LANGS[nf[2]] && LANGS[group[0].lang] && langs.indexOf(nf[2]) < 0) { i = j; group.push(readFence()); }
          else break;
        }
        if (group.length === 1) {
          var g0 = group[0];
          out.push('<div class="code-block"><div class="code-head"><span>' + (LANGS[g0.lang] || g0.lang || 'code') +
            '</span><button class="copy-btn" type="button">Copy</button></div><pre><code>' +
            esc(g0.code) + '</code></pre></div>');
        } else {
          out.push('<div class="code-block multi"><div class="code-head"><span class="lang-tabs">' +
            group.map(function (g) { return '<button type="button" class="lang-tab" data-lang="' + g.lang + '">' + LANGS[g.lang] + '</button>'; }).join('') +
            '</span><button class="copy-btn" type="button">Copy</button></div>' +
            group.map(function (g) { return '<pre data-lang="' + g.lang + '"><code>' + esc(g.code) + '</code></pre>'; }).join('') + '</div>');
        }
        continue;
      }

      // heading
      var h = line.match(/^(#{1,4})\s+(.*)$/);
      if (h) {
        var lvl = h[1].length + 1; // # -> h2 inside page
        var text = inline(h[2]);
        var id = slug(h[2]);
        if (lvl <= 3) toc.push({ id: id, text: h[2].replace(/[`*]/g, ''), lvl: lvl });
        out.push('<h' + lvl + ' id="' + id + '">' + text + '</h' + lvl + '>');
        i++; continue;
      }

      if (/^---+$/.test(line.trim())) { out.push('<hr/>'); i++; continue; }

      // table
      if (/^\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
        var head = splitRow(line);
        i += 2;
        var rows = [];
        while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) { rows.push(splitRow(lines[i])); i++; }
        out.push('<div class="table-wrap"><table><thead><tr>' + head.map(function (c) { return '<th>' + inline(c) + '</th>'; }).join('') +
          '</tr></thead><tbody>' + rows.map(function (r) {
            return '<tr>' + r.map(function (c) { return '<td>' + inline(c) + '</td>'; }).join('') + '</tr>';
          }).join('') + '</tbody></table></div>');
        continue;
      }

      // blockquote / callout
      if (/^>\s?/.test(line)) {
        var q = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, '')); i++; }
        var cls = 'callout';
        var first = q[0] || '';
        if (/^(💡|tip)/i.test(first)) cls += ' tip';
        else if (/^(⚠️|warning|trap|pitfall)/i.test(first)) cls += ' warn';
        else if (/^(🎯|interview)/i.test(first)) cls += ' interview';
        out.push('<div class="' + cls + '">' + render(q.join('\n')).html + '</div>');
        continue;
      }

      // lists
      if (/^(\s*)([-*]|\d+\.)\s+/.test(line)) {
        out.push(parseList());
        continue;
      }

      // paragraph
      var p = [];
      while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|~~~|```|>|\||(\s*)([-*]|\d+\.)\s+|---+$)/.test(lines[i])) {
        p.push(lines[i].trim()); i++;
      }
      if (!p.length) { p.push(lines[i]); i++; }
      out.push('<p>' + inline(p.join(' ')) + '</p>');
    }

    function readFence() {
      var m = lines[i].match(/^(~~~|```)\s*(\w*)/), buf = [];
      i++;
      while (i < lines.length && !lines[i].startsWith(m[1])) { buf.push(lines[i]); i++; }
      i++;
      return { lang: m[2] || '', code: buf.join('\n') };
    }

    function splitRow(r) {
      return r.trim().replace(/^\||\|$/g, '').replace(/\\\|/g, '\u0001').split('|').map(function (c) { return c.trim().replace(/\u0001/g, '|'); });
    }

    function parseList() {
      var m = lines[i].match(/^(\s*)([-*]|\d+\.)\s+/);
      var baseIndent = m[1].length;
      var ordered = /\d/.test(m[2]);
      var html = ordered ? '<ol>' : '<ul>';
      while (i < lines.length) {
        var l = lines[i];
        if (!l.trim()) {
          // allow blank lines between items of same list
          var nx = lines[i + 1];
          if (nx && /^(\s*)([-*]|\d+\.)\s+/.test(nx) && nx.match(/^\s*/)[0].length >= baseIndent) { i++; continue; }
          break;
        }
        var lm = l.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
        var indent = l.match(/^\s*/)[0].length;
        if (lm && indent === baseIndent) {
          html += '<li>' + inline(lm[3]);
          i++;
          // continuation lines / nested lists
          while (i < lines.length && lines[i].trim()) {
            var ind = lines[i].match(/^\s*/)[0].length;
            if (ind > baseIndent && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) { html += parseList(); }
            else if (ind > baseIndent && !/^\s*([-*]|\d+\.)\s+/.test(lines[i])) { html += ' ' + inline(lines[i].trim()); i++; }
            else break;
          }
          html += '</li>';
        } else if (indent < baseIndent || !lm) {
          break;
        } else {
          html += parseList();
        }
      }
      return html + (ordered ? '</ol>' : '</ul>');
    }

    return { html: out.join('\n'), toc: toc };
  }

  window.MD = { render: render, inline: inline, esc: esc, slug: slug };
})();

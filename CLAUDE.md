# kasunben.github.io

Static HTML site hosted on GitHub Pages. No build system — files are served as-is.

## Structure

```
/
├── index.html          # Site root
├── css/
│   └── theme.css       # Shared design system — link from every page
├── js/
│   └── utils.js        # Shared JS utilities — link from every page
└── docs/
    └── <topic>/
        └── <guide>.html
```

## Starting a new page

Every HTML file must link the shared assets using **relative paths** (works with `file://`, local servers, and GitHub Pages).

The prefix depends on how deep the file sits under the repo root:

| File location | Prefix |
|---|---|
| `index.html` | `./css/theme.css` |
| `docs/<guide>.html` | `../css/theme.css` |
| `docs/<topic>/<guide>.html` | `../../css/theme.css` |

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title</title>
  <link rel="stylesheet" href="../../css/theme.css">
</head>
<body>
  <!-- content -->
  <script src="../../js/utils.js"></script>
</body>
```

## Design system (css/theme.css)

Dark/light mode is automatic via `prefers-color-scheme`. All colours and fonts are CSS custom properties on `:root` — never hardcode hex values in HTML.

Key components and the classes to use:

| Component | Class(es) |
|---|---|
| Page header | `.header`, `.header-eyebrow`, `.header-sub` |
| Section heading | `.section-label` > `.section-num` + `<h2>` |
| Callout box | `.callout.info` / `.warn` / `.good` / `.danger` |
| Code block | `.code-block` > `.code-header` + `<pre>` |
| Copy button | `.copy-btn` with `onclick="copyCode(this)"` |
| Syntax tokens | `.cm` comment · `.ck` keyword · `.cv` value · `.cs` string · `.cw` warning |
| Numbered steps | `.steps` > `.step` > `.step-n` + `.step-body` |
| Container cards | `.container-grid` > `.container-card.c-{color}` |
| Table | `.ub-table` |
| Badges | `.badge.badge-must` / `.badge-rec` / `.badge-skip` |
| TOC / doc links | `.toc` > `.toc-title` + `<ul class="toc-list">` |
| Social links (header) | `.social-links` > `<a>` with inline SVG + text label |
| Footer | `.footer` > `.footer-brand` (left) + `.footer-social` or `.footer-tags` (right) |
| Footer tags | `.footer-tags` > `<span>` — plain text, right-aligned, wraps on mobile |
| Footer date spans | `.footer-date` — `white-space: nowrap` wrapper for label + date |

Container card accent colours: `c-blue`, `c-red`, `c-green`, `c-amber`, `c-purple`, `c-teal`, `c-gray`, `c-pink`.

## JS utilities (js/utils.js)

`copyCode(btn)` — copies the `<pre>` content of the nearest `.code-block` ancestor to the clipboard, then briefly shows "copied!" on the button.

**Auto-populated date elements** (runs on every page via `DOMContentLoaded`):

| Element ID | Behaviour |
|---|---|
| `#date-created` | Reads `data-created="YYYY-MM-DD"` from the element itself; formats as `Mon D, YYYY` |
| `#last-updated` | Always renders today's date as `Mon D, YYYY` |

**Substack feed** — if `#substack-feed` exists, fetches `https://kasunben.substack.com/feed` via the `allorigins.win` CORS proxy, parses RSS 2.0, and renders up to 10 posts as `.toc-list` `<li>` links. Falls back to a plain Substack link on error.

## Conventions

- Section numbers: zero-padded two digits (`01`, `02`, …)
- No inline `<style>` or `<script>` blocks — everything goes through the shared files

### Header eyebrow
Starts with a home icon SVG (linked to `/`), followed by breadcrumb text:
```
[home SVG → /]  Docs · <Topic>
```

### Footer structure
```html
<div class="footer">
  <div class="footer-brand">
    [copyleft SVG]  <a href="/">kasunben</a> · <span class="footer-date">created <span id="date-created" data-created="YYYY-MM-DD"></span></span> · <span class="footer-date">updated <span id="last-updated"></span></span>
  </div>
  <!-- index.html: icon-only social links -->
  <div class="footer-social"> … </div>
  <!-- doc pages: plain text tags -->
  <div class="footer-tags">
    <span>#topic</span> <span>keyword</span>
  </div>
</div>
```

- `#date-created` requires `data-created="YYYY-MM-DD"` — hardcode the actual creation date per page
- `#last-updated` is always today's date (populated by JS)
- Footer collapses to a vertical stack on screens ≤ 540 px

### Copyleft SVG (reuse verbatim)
```html
<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-label="Copyleft"><circle cx="12" cy="12" r="10"/><path d="M8.5 8.5A5 5 0 1 1 8.5 15.5"/></svg>
```

### Home icon SVG (reuse verbatim in header-eyebrow)
```html
<a href="/"><svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-label="Home"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></a>
```

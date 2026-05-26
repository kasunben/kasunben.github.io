document.addEventListener('DOMContentLoaded', function () {
  const fmt = d => d.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });

  const dc = document.getElementById('date-created');
  if (dc && dc.dataset.created) dc.textContent = fmt(new Date(dc.dataset.created));

  const lu = document.getElementById('last-updated');
  if (lu) lu.textContent = fmt(new Date());

  document.querySelectorAll('.step-check').forEach((cb, i) => {
    const key = location.pathname + ':check:' + i;
    if (localStorage.getItem(key)) cb.checked = true;
    cb.addEventListener('change', () => {
      if (cb.checked) localStorage.setItem(key, '1');
      else localStorage.removeItem(key);
    });
  });

  const feedEl = document.getElementById('substack-feed');
  if (!feedEl) return;

  const feedUrl = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://kasunben.substack.com/feed');
  fetch(feedUrl)
    .then(r => r.text())
    .then(xml => {
      const doc = new DOMParser().parseFromString(xml, 'text/xml');
      const items = Array.from(doc.getElementsByTagName('item')).slice(0, 10);
      if (!items.length) {
        feedEl.innerHTML = '<li>No posts yet.</li>';
        return;
      }
      feedEl.innerHTML = items.map(item => {
        const title = item.getElementsByTagName('title')[0]?.textContent ?? '';
        // <link> in RSS 2.0 is a text node sitting after the element — use nextSibling
        const linkEl = item.getElementsByTagName('link')[0];
        const href = linkEl?.nextSibling?.nodeValue?.trim()
          || linkEl?.textContent?.trim()
          || '#';
        return `<li><a href="${href}" target="_blank" rel="noopener">${title}</a></li>`;
      }).join('');
    })
    .catch(() => {
      feedEl.innerHTML = '<li><a href="https://kasunben.substack.com" target="_blank" rel="noopener">kasunben.substack.com</a></li>';
    });
});

function copyCode(btn) {
  const pre = btn.closest('.code-block').querySelector('pre');
  navigator.clipboard.writeText(pre.innerText).then(() => {
    btn.textContent = 'copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'copy';
      btn.classList.remove('copied');
    }, 2000);
  });
}

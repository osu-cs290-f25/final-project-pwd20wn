// ---- Theme toggle (simple) ----
document.addEventListener('click', (e) => {
  if (e.target.id === 'toggleTheme') {
    document.documentElement.classList.toggle('dark');
  }
});

// ---- Watchlist (localStorage) ----
const WL_KEY = 'dealfinder_watchlist';
const getList = () => JSON.parse(localStorage.getItem(WL_KEY) || '[]');
const setList = (v) => localStorage.setItem(WL_KEY, JSON.stringify(v));
const exists = (id) => getList().some((d) => String(d.id) === String(id));

function upsert(deal) {
  const list = getList();
  const i = list.findIndex((d) => String(d.id) === String(deal.id));
  if (i === -1) list.push(deal);
  else list[i] = deal;
  setList(list);
}

function removeItem(id) {
  setList(getList().filter((d) => String(d.id) !== String(id)));
}

// Add button on index/details
document.addEventListener('click', (e) => {
  const addBtn = e.target.closest('[data-add]');
  if (!addBtn) return;

  const deal = {
    id: addBtn.dataset.id,
    title: addBtn.dataset.title,
    store: addBtn.dataset.store,
    category: addBtn.dataset.category,
    price: Number(addBtn.dataset.price || 0),
    orig: Number(addBtn.dataset.orig || 0),
    img: addBtn.dataset.img || '',
  };

  const prev = addBtn.textContent;
  addBtn.disabled = true;
  addBtn.textContent = 'Saving…';
  try {
    upsert(deal);
    addBtn.textContent = 'Added';
  } catch (err) {
    console.error(err);
    addBtn.disabled = false;
    addBtn.textContent = prev || 'Add to Watchlist';
    alert('Could not save to watchlist.');
  }
});

// Heart toggle (pure UI)
document.addEventListener('click', (e) => {
  const heart = e.target.closest('[data-heart]');
  if (!heart) return;
  heart.classList.toggle('active');
});

// ---- Render watchlist page ----
function cardHtml(d) {
  const price = d.price ? `$${d.price}` : '—';
  const orig = d.orig ? `<span class="strike">$${d.orig}</span>` : '';
  const img = d.img || 'https://placehold.co/600x400?text=Deal';
  return `
    <section class="card">
      <div class="thumb"><img src="${img}" alt="${d.title}"/></div>
      <h3 class="title">${d.title}</h3>
      <div class="meta">${d.store} • ${d.category || ''}</div>
      <div class="price"><b>${price}</b> ${orig}</div>
      <div class="actions">
        <a class="btn primary" href="/deals/${d.id}">View</a>
        <button class="btn" data-remove="${d.id}">Remove</button>
      </div>
    </section>`;
}

function renderWatchlist() {
  const grid = document.getElementById('watchlistGrid');
  if (!grid) return;
  const list = getList();
  grid.innerHTML = list.length
    ? list.map(cardHtml).join('')
    : `<p style="padding:16px;color:#6b7280">No items yet. Add some deals from the home page.</p>`;
}

document.addEventListener('click', (e) => {
  const rm = e.target.closest('[data-remove]');
  if (!rm) return;
  const id = rm.getAttribute('data-remove');
  removeItem(id);
  renderWatchlist();
});

document.addEventListener('DOMContentLoaded', renderWatchlist);

// TODO: Add your client-side JavaScript here
// Add to watchlist (works on index and details)
document.addEventListener('click', async (e) => {
  const addBtn = e.target.closest('[data-add-watch]');
  if (!addBtn) return;

  const id = addBtn.getAttribute('data-add-watch');
  addBtn.disabled = true;
  addBtn.textContent = 'Adding...';

  try {
    const res = await fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    if (!res.ok) throw new Error('Add failed');
    addBtn.textContent = 'Added';
  } catch (err) {
    console.error(err);
    addBtn.disabled = false;
    addBtn.textContent = 'Add to Watchlist';
    alert('Could not add to watchlist.');
  }
});

// Remove from watchlist (only on /watchlist)
document.addEventListener('click', async (e) => {
  const rmBtn = e.target.closest('[data-remove]');
  if (!rmBtn) return;

  const id = rmBtn.getAttribute('data-remove');
  rmBtn.disabled = true;
  rmBtn.textContent = 'Removing...';

  try {
    const res = await fetch(`/api/watchlist/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Remove failed');

    // Remove the card from the page for instant feedback
    const card = rmBtn.closest('.card');
    if (card) card.remove();
  } catch (err) {
    console.error(err);
    rmBtn.disabled = false;
    rmBtn.textContent = 'Remove';
    alert('Could not remove from watchlist.');
  }
});

// Add to watchlist (works on index and details)
document.addEventListener('click', async (e) => {
  const addBtn = e.target.closest('[data-add-watch]');
  if (!addBtn) return;

  const id = addBtn.getAttribute('data-add-watch');
  addBtn.disabled = true;
  addBtn.textContent = 'Adding...';

  try {
    const res = await fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });

    if (!res.ok) throw new Error('Add failed');
    addBtn.textContent = 'Added';
  } catch (err) {
    console.error(err);
    addBtn.disabled = false;
    addBtn.textContent = 'Add to Watchlist';
    alert('Could not add to watchlist.');
  }
});

// Remove from watchlist (only on /watchlist)
document.addEventListener('click', async (e) => {
  const rmBtn = e.target.closest('[data-remove]');
  if (!rmBtn) return;

  const id = rmBtn.getAttribute('data-remove');
  rmBtn.disabled = true;
  rmBtn.textContent = 'Removing...';

  try {
    const res = await fetch(`/api/watchlist/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Remove failed');

    // Remove the card from the page for instant feedback
    const card = rmBtn.closest('.card');
    if (card) card.remove();
  } catch (err) {
    console.error(err);
    rmBtn.disabled = false;
    rmBtn.textContent = 'Remove';
    alert('Could not remove from watchlist.');
  }

  // server.js
app.use('/static', express.static(path.join(__dirname, 'static')));

});



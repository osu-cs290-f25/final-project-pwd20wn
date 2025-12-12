// app.js — watchlist toggle byttons
const WL_KEY = "dealfinder_watchlist";

const Watch = {
  read() {
    return JSON.parse(localStorage.getItem(WL_KEY) || "[]");
  },
  write(v) {
    localStorage.setItem(WL_KEY, JSON.stringify(v));
  },
  has(id) {
    return this.read().some((d) => d.id === id);
  },
  upsert(deal) {
    const list = this.read();
    const i = list.findIndex((d) => d.id === deal.id);
    if (i === -1) list.push(deal);
    else list[i] = deal;
    this.write(list);
  },
  remove(id) {
    this.write(this.read().filter((d) => d.id !== id));
  },
};
window.Watch = Watch; // useful on watchlist.html

function updateBadge() {
  const badge = document.getElementById("wl-count");
  if (badge) badge.textContent = Watch.read().length;
}
window.updateBadge = updateBadge;

function setButtonState(btn) {
  const id = btn.dataset.id;
  if (Watch.has(id)) {
    btn.textContent = "Remove";
    btn.dataset.state = "saved";
  } else {
    btn.textContent = "Add to Watchlist";
    btn.dataset.state = "unsaved";
  }
}

function hydrateButtons() {
  document.querySelectorAll("[data-watch]").forEach(setButtonState);
}
window.hydrateButtons = hydrateButtons;

// Toggle 
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-watch]");
  if (!btn) return;

  const id = btn.dataset.id;
  const saved = Watch.has(id);

  if (saved) {
    Watch.remove(id);
    setButtonState(btn);
    updateBadge();

    // If on watchlist page, remove the card
    if (document.body.id === "watchlist") {
      const card = btn.closest(".card");
      if (card) card.remove();

      // empty state + quick redirect to home
      if (!document.querySelectorAll(".card").length) {
        const grid = document.getElementById("wl-grid");
        if (grid)
          grid.innerHTML =
            '<p style="padding:20px">Your watchlist is empty.</p>';
        setTimeout(() => {
          window.location.href = "index.html";
        }, 800);
      }
    }
  } else {
    const deal = {
      id: btn.dataset.id,
      title: btn.dataset.title,
      store: btn.dataset.store,
      category: btn.dataset.category,
      price: Number(btn.dataset.price || 0),
      orig: Number(btn.dataset.orig || 0),
      img: btn.dataset.img || "",
    };
    Watch.upsert(deal);
    setButtonState(btn);
    updateBadge();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  hydrateButtons();
  updateBadge();
});

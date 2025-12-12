const express = require('express');
const morgan = require('morgan');
const path = require('path');
const { readJson } = require('./utils/fileOps');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const DEALS_FILE = path.join(__dirname, 'data/deals.json');

// Home: list all deals
app.get('/', async (req, res, next) => {
  try {
    const deals = await readJson(DEALS_FILE);
    res.render('index', { deals });
  } catch (e) {
    next(e);
  }
});

// Details page: single deal
app.get('/deals/:id', async (req, res, next) => {
  try {
    const deals = await readJson(DEALS_FILE);
    const deal = deals.find((d) => String(d.id) === String(req.params.id));
    if (!deal) return res.status(404).render('details', { deal: null });
    res.render('details', { deal });
  } catch (e) {
    next(e);
  }
});

// Watchlist page (client populates from localStorage)
app.get('/watchlist', (req, res) => {
  res.render('watchlist');
});

// Optional JSON endpoint (handy for debugging)
app.get('/api/deals', async (req, res, next) => {
  try {
    const deals = await readJson(DEALS_FILE);
    res.json(deals);
  } catch (e) {
    next(e);
  }
});

// 404 + error
app.use((req, res) => res.status(404).send('Not found'));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Server error');
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));

// TODO: Add your client-side JavaScript here
console.log('Client-side JS loaded');

// --- 1. Element References ---
let toggleButton;
let body;

// --- Event Listeners and Initial Setup ---

document.addEventListener('DOMContentLoaded', () => {
  // Assign Element References *after* the DOM is ready
  toggleButton = document.querySelector('.light-mode-toggle');
  body = document.body;

  // Check for Saved Preference on Load
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
  }

  // Set initial toggle state (Moon or Sun emoji)
  if (toggleButton) {
    // Set the text content based on the initial class presence
    toggleButton.textContent = body.classList.contains('dark-mode')
      ? '💡'
      : '🌙';
  }

  // Dark Mode Toggle Implementation
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      // Toggle the 'dark-mode' class on the body element
      body.classList.toggle('dark-mode');
      // Save or Remove the setting in localStorage
      if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        toggleButton.textContent = '💡';
      } else {
        localStorage.removeItem('theme'); // Clear the preference for light mode
        toggleButton.textContent = '🌙';
      }
    });
  }
});

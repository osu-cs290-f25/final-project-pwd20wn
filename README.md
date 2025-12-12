# Deal Finder


**Current Status:**
This PR sets up the server structure and data fetching. The views aren't ready yet, so the server just returns JSON data for now so we can see what we're working with.

## How to Run

1. **Install stuff:**

   ```bash
   npm install
   ```

2. **Start the server:**

   ```bash
   npm run dev-start
   ```

   Go to `http://localhost:3000` to see the data.

3. **Get new deals:**
   Run this to update `data/deals.json`:

   ```bash
   npm run fetch-deals
   ```

   Or if you want more deals (like 50):

   ```bash
   node utils/redditFetcher.js 50
   ```

## Development Rules

### Branching Strategy

We want to keep our code organized, so please follow these rules:

- **`main`**: This is the "production" code. Don't push directly here.
- **`dev`**: This is our main working branch. All PRs should go into `dev`.
- **Feature Branches**: Create a new branch for every task (e.g., `feature/add-header`, `fix/broken-link`).
  - Make your changes.
  - Open a Pull Request (PR) to merge your branch into `dev`.

### Linting & Formatting

We use ESLint and Prettier to keep our code looking the same.

- **Check for errors:** `npm run lint`
- **Fix formatting:** `npm run format`

Please run `npm run format` before you push your code!

## API (Temporary)

Since we don't have pages yet, use these URLs to check the data:

- **Home:** `GET http://localhost:3000/` -> Lists all deals
- **Details:** `GET http://localhost:3000/deals/0` -> Shows one deal (change the ID)
- **Watchlist:** `GET http://localhost:3000/watchlist` -> Shows saved items

You can also test adding/removing from the watchlist using Insomnia:

- **Add:** `POST /api/watchlist` (send a JSON body with an `id`)
- **Remove:** `DELETE /api/watchlist/:id`

## Files

- `server.js`: The main server code.
- `utils/`: Scripts for fetching data.
- `data/`: Where the JSON files live.
- `views/`: Empty EJS files for now.
- `static/`: CSS/JS folder.

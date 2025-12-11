const express = require("express");
const morgan = require("morgan");
const path = require("path");
const { readData, writeData } = require("./utils/fileOps");

const app = express();
const PORT = process.env.PORT || 3000;

// morgan is just for logging http requests, like the logger from class code
app.use(morgan("dev"));
app.use(express.static("static"));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const DEALS_FILE = path.join(__dirname, "data/deals.json");
const WATCHLIST_FILE = path.join(__dirname, "data/watchlist.json");

app.get("/", (req, res, next) => {
  try {
    const deals = readData(DEALS_FILE);
    res.json({
      message: "index page data",
      deals: deals,
    });
  } catch (err) {
    next(err);
  }
});

app.get("/deals/:id", (req, res, next) => {
  try {
    const deals = readData(DEALS_FILE);
    const dealId = req.params.id;
    const deal = deals.find((d) => d.id === dealId);

    if (deal) {
      res.json({
        message: "details page data",
        deal: deal,
      });
    } else {
      next(); // Pass to 404 handler
    }
  } catch (err) {
    next(err);
  }
});

app.get("/watchlist", (req, res, next) => {
  try {
    const watchlist = readData(WATCHLIST_FILE);
    res.json({
      message: "watchlist page data",
      watchlist: watchlist,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/api/watchlist", (req, res, next) => {
  try {
    const newDeal = req.body;

    if (!newDeal || !newDeal.id) {
      return res.status(400).json({ error: "Invalid deal data" });
    }

    const watchlist = readData(WATCHLIST_FILE);
    const exists = watchlist.find((item) => item.id === newDeal.id);

    if (!exists) {
      watchlist.push(newDeal);
      writeData(WATCHLIST_FILE, watchlist);
      res.status(201).json({ message: "Added to watchlist" });
    } else {
      res.status(200).json({ message: "Item already in watchlist" });
    }
  } catch (err) {
    next(err);
  }
});

app.delete("/api/watchlist/:id", (req, res, next) => {
  try {
    const dealId = req.params.id;
    let watchlist = readData(WATCHLIST_FILE);
    const initialLength = watchlist.length;

    watchlist = watchlist.filter((item) => item.id !== dealId);

    if (watchlist.length < initialLength) {
      writeData(WATCHLIST_FILE, watchlist);
      res.json({ message: "Removed from watchlist" });
    } else {
      res.status(404).json({ error: "Item not found in watchlist" });
    }
  } catch (err) {
    next(err);
  }
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Page not found" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("== Error caught in middleware:", err);
  res.status(500).json({
    error: "Server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

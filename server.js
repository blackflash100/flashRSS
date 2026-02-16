const express = require('express');
const cors = require('cors');
const Parser = require('rss-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const open = require('open');

const app = express();
const parser = new Parser();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./rss.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run("PRAGMA foreign_keys = ON");
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS feeds (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            url TEXT NOT NULL UNIQUE,
            title TEXT,
            category_id INTEGER,
            FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE CASCADE
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            feed_id INTEGER,
            title TEXT,
            link TEXT UNIQUE,
            pubDate TEXT,
            contentSnippet TEXT,
            is_read INTEGER DEFAULT 0,
            is_starred INTEGER DEFAULT 0,
            FOREIGN KEY(feed_id) REFERENCES feeds(id) ON DELETE CASCADE
        )`);

        db.run(`ALTER TABLE items ADD COLUMN is_starred INTEGER DEFAULT 0`, (err) => {
        });

        db.get("SELECT count(*) as count FROM categories", (err, row) => {
            if (row && row.count === 0) {
                db.run("INSERT INTO categories (name) VALUES ('General')");
            }
        });
    });
}

async function updateFeed(feed) {
    try {
        const feedData = await parser.parseURL(feed.url);
        if (!feed.title && feedData.title) {
            db.run("UPDATE feeds SET title = ? WHERE id = ?", [feedData.title, feed.id]);
        }

        const stmt = db.prepare("INSERT OR IGNORE INTO items (feed_id, title, link, pubDate, contentSnippet) VALUES (?, ?, ?, ?, ?)");
        feedData.items.forEach(item => {
            stmt.run(feed.id, item.title, item.link, item.pubDate || item.isoDate || new Date().toISOString(), item.contentSnippet || item.content || '');
        });
        stmt.finalize();
        console.log(`Updated feed: ${feed.url}`);
    } catch (error) {
        console.error(`Error updating feed ${feed.url}:`, error.message);
    }
}

async function updateAllFeeds() {
    console.log("Starting feed update...");
    db.all("SELECT * FROM feeds", async (err, feeds) => {
        if (err) return;
        for (const feed of feeds) {
            await updateFeed(feed);
        }
        console.log("All feeds updated.");
    });
}

setInterval(updateAllFeeds, 15 * 60 * 1000);

app.get('/api/categories', (req, res) => {
    db.all("SELECT * FROM categories", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/categories', (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });
    db.run("INSERT INTO categories (name) VALUES (?)", [name], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, name });
    });
});

app.get('/api/feeds', (req, res) => {
    db.all(`SELECT feeds.*, categories.name as category_name 
            FROM feeds 
            LEFT JOIN categories ON feeds.category_id = categories.id`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/feeds', async (req, res) => {
    const { url, category_id } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        const feedData = await parser.parseURL(url);
        const title = feedData.title || url;

        db.run("INSERT INTO feeds (url, title, category_id) VALUES (?, ?, ?)", [url, title, category_id || 1], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            const newFeedId = this.lastID;
            updateFeed({ id: newFeedId, url, title }).then(() => {
                res.json({ id: newFeedId, url, title, category_id: category_id || 1 });
            });
        });
    } catch (error) {
        res.status(400).json({ error: "Invalid RSS URL or unable to fetch" });
    }
});

app.delete('/api/feeds/:id', (req, res) => {
    const { id } = req.params;

    db.serialize(() => {
        db.run("DELETE FROM items WHERE feed_id = ?", [id], (err) => {
        });

        db.run("DELETE FROM feeds WHERE id = ?", [id], function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true });
        });
    });
});

app.get('/api/items', (req, res) => {
    let { category_id, feed_id, limit, offset, read_status, starred } = req.query;
    limit = limit || 50;
    offset = offset || 0;

    let query = `SELECT items.*, feeds.title as feed_title, feeds.url as feed_url 
                 FROM items 
                 JOIN feeds ON items.feed_id = feeds.id`;
    let params = [];
    let conditions = [];

    if (category_id) {
        conditions.push("feeds.category_id = ?");
        params.push(category_id);
    }
    if (feed_id) {
        conditions.push("items.feed_id = ?");
        params.push(feed_id);
    }
    if (read_status === 'unread') {
        conditions.push("items.is_read = 0");
    }
    if (starred === 'true') {
        conditions.push("items.is_starred = 1");
    }

    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY pubDate DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);

    db.all(query, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/items/:id/read', (req, res) => {
    const { id } = req.params;
    db.run("UPDATE items SET is_read = 1 WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.post('/api/items/:id/star', (req, res) => {
    const { id } = req.params;
    const { starred } = req.body;
    db.run("UPDATE items SET is_starred = ? WHERE id = ?", [starred ? 1 : 0, id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.post('/api/refresh', async (req, res) => {
    await updateAllFeeds();
    res.json({ success: true });
});

app.use(express.static(path.join(__dirname, 'client/dist')));

app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

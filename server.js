const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

let items = Array.from({ length: 1000000 }, (_, i) => ({ id: i + 1, selected: false }));
let selectedItems = [];
let sortedItems = [];

app.get('/items', (req, res) => {
  const { page = 1, search = '' } = req.query;
  const limit = 20;
  const offset = (page - 1) * limit;

  let filteredItems = items.filter(item => item.id.toString().includes(search));
  if (sortedItems.length > 0) {
    filteredItems = sortedItems;
  }
  const paginatedItems = filteredItems.slice(offset, offset + limit);

  res.json({ items: paginatedItems, total: filteredItems.length });
});

app.post('/select', (req, res) => {
  const { ids } = req.body;
  selectedItems = ids;
  res.json({ success: true });
});

app.get('/select', (req, res) => {
  res.json({ selectedItems });
});

app.post('/sort', (req, res) => {
  const { sorted } = req.body;
  sortedItems = sorted;
  res.json({ success: true });
});

app.get('/sort', (req, res) => {
  res.json({ sortedItems });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
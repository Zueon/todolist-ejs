const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/todolistDB');

const itemsSchema = {
  name: String,
};

const Item = mongoose.model('Item', itemsSchema);
const item1 = new Item({ name: 'todo list using mongoose!' });
const item2 = new Item({ name: 'Hit the + button to add a new item' });
const item3 = new Item({ name: 'Hit the checkbox to delete an item' });

const defaultItems = [item1, item2, item3];
Item.insertMany(defaultItems, (err) => {
  if (err) {
    console.log('Error');
  } else {
    console.log('Success');
  }
});

app.get('/', (req, res) => {
  res.render('list', { listTitle: 'Today', newItems: items });
});

app.post('/', (req, res) => {
  const item = req.body.newItem;
  items.push(item);
  res.redirect('/');
});

app.get('/work', (req, res) => {
  res.render('list', { listTitle: 'Work List', newItems: workItems });
});

app.post('/work', (req, res) => {
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect('/work');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

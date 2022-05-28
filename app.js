const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const items = [];
const workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', (req, res) => {
  const today = new Date();

  const options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  };

  let day = today.toLocaleDateString('en-US', options);

  res.render('list', { listTitle: day, newItems: items });
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

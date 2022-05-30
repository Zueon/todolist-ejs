const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { redirect } = require('express/lib/response');
const _ = require('lodash');
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

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model('List', listSchema);

app.get('/', (req, res) => {
  Item.find({}, (err, docs) => {
    if (docs.length == 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log('Error');
        } else {
          console.log('Success');
        }
      });
      res.redirect('/');
    } else {
      res.render('list', { listTitle: 'Today', newItems: docs });
    }
  });
});

app.get('/:customListName', (req, res) => {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({ name: customListName }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        const list = new List({ name: customListName, items: defaultItems });
        list.save();
      } else {
        res.render('list', {
          listTitle: foundList.name,
          newItems: foundList.items,
        });
      }
    }
  });
});

app.post('/', (req, res) => {
  const input = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({ name: input });

  if (listName === 'Today') {
    item.save();
    res.redirect('/');
  } else {
    List.findOne({ name: listName }, (err, foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect('/' + listName);
    });
  }
});

app.post('/delete', (req, res) => {
  const checkedId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === 'Today') {
    Item.findByIdAndRemove(checkedId, (err) => {
      if (!err) {
        console.log('error!');
        res.redirect('/');
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedId } } },
      (err) => {
        if (!err) res.redirect('/' + listName);
      }
    );
  }
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

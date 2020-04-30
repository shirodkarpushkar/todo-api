var express = require("express");
var bodyparser = require("body-parser");
var _ = require("underscore");
var PORT = process.env.PORT || 3000;
var app = express();
app.use(bodyparser.json());
var todoItemID = 4;
var todoList = [
  {
    id: 1,
    description: "Bring milk as told by mom",
    completed: false,
  },
  {
    id: 2,
    description: "Comb your hair",
    completed: false,
  },
  {
    id: 3,
    description: "Feed the cat",
    completed: true,
  },
  {
    id: 4,
    description: "Bring Dhaniya!!",
    completed: false,
  },
];

app.get("/", (req, res) => {
  res.send("Welcome to TODO LIST");
});
// get all todos
app.get("/todos", (req, res) => {
  res.json(todoList);
});
// get all todos by id
app.get("/todos/:id", (req, res) => {
  var todoId = parseInt(req.params.id, 10);
  var matchedItem = _.findWhere(todoList, { id: todoId });
  if (matchedItem) {
    res.json(matchedItem);
  } else {
    res.status(404).send();
  }
});
//add item to array
app.post("/todos", (req, res) => {
  var body = _.pick(req.body, "description", "completed");
  console.log("body", body);

  if (
    !_.isBoolean(body.completed) ||
    !_.isString(body.description) ||
    body.description.trim().length == 0
  ) {
    return res.status(400).send();
  }
  body.description = body.description.trim();

  todoItemID = todoItemID + 1;
  todoList.push({
    id: todoItemID,
    description: body.description,
    completed: body.completed,
  });

  insertedTodo = todoList.find((el) => el.id === todoItemID);

  res.json(insertedTodo);
});

app.delete("/todos/:id", (req, res) => {
  var todoId = parseInt(req.params.id, 10);
  var matchedItem = _.findWhere(todoList, { id: todoId });
  if (matchedItem) {
    _.without(todoList, matchedItem);
    res.json({
      message: "Item deleted successfully!",
    });
  } else {
    res.status(404).send();
  }
});

app.listen(PORT, () => {
  console.log("listening to PORT:", PORT);
});

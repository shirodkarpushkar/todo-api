var express = require("express");
var bodyparser = require("body-parser");
var _ = require("underscore");
var db = require("./db");

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
  var queryParams = req.query;
  var filteredTodos = todoList;

  if (
    queryParams.hasOwnProperty("completed") &&
    queryParams.completed === "true"
  ) {
    filteredTodos = _.where(todoList, { completed: true });
  } else if (
    queryParams.hasOwnProperty("completed") &&
    queryParams.completed === "false"
  ) {
    filteredTodos = _.where(todoList, { completed: false });
  }

  if (
    queryParams.hasOwnProperty("search") &&
    queryParams.search.trim().length > 0
  ) {
    filteredTodos = _.filter(todoList, (el) => {
      return (
        el.description.toLowerCase().indexOf(queryParams.search.toLowerCase()) >
        -1
      );
    });
  }
  res.json(filteredTodos);
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

// add item to array
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

// add item to array
app.delete("/todos/:id", (req, res) => {
  var todoId = parseInt(req.params.id, 10);
  var matchedItem = _.findWhere(todoList, { id: todoId });
  if (matchedItem) {
    todoList = _.without(todoList, matchedItem);
    res.json({
      message: "Item deleted successfully!",
    });
  } else {
    res.status(404).json({
      error: "No Item to delete",
    });
  }
});

// put item by  id
app.put("/todos/:id", (req, res) => {
  var todoId = parseInt(req.params.id, 10);
  var matchedItem = _.findWhere(todoList, { id: todoId });
  var body = _.pick(req.body, "description", "completed");
  var validAttributes = {};
  if (!matchedItem) {
    return res.status(404).send();
  }
  if (body.hasOwnProperty("completed") && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty("completed")) {
    return res.status(400).send();
  }
  if (
    body.hasOwnProperty("description") &&
    _.isString(body.description) &&
    body.description.trim().length > 0
  ) {
    validAttributes.description = body.description.trim();
  } else if (body.hasOwnProperty("description")) {
    return res.status(400).send();
  }
  // finally update
  _.extend(matchedItem, validAttributes);
  res.json(matchedItem);
});

db.sync().then(() => {
  console.log("DATABASE CONNECTED:" + new Date());
  app.listen(PORT, () => {
    console.log("listening to PORT:", PORT);
  });
});

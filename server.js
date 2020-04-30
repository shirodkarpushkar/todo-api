var express = require("express");
var bodyparser = require("body-parser");
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
  var matchedItem = todoList.find((el) => el.id === todoId);
  if (matchedItem) {
    res.json(matchedItem);
  } else {
    res.status(404).send();
  }
});
app.post("/todos", (req, res) => {
  var body = req.body;
  var nextID = todoItemID++;
  todoList.push({
    id: nextID,
    description: body.description,
    completed: body.completed,
  });

  insertedTodo = todoList.find((el) => el.id === nextID);

  res.json(insertedTodo);
});

app.listen(PORT, () => {
  console.log("listening to PORT:", PORT);
});

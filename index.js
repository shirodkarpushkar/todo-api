var express = require("express");
var PORT = process.env.PORT || 3000;
var app = express();

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
];

app.get("/", (req, res) => {
  res.send("Welcome to TODO LIST");
});
// get all todos 
app.get("/todos", (req, res) => {
  res.json(todoList);
});

app.listen(PORT, () => {
  console.log("listening to PORT:", PORT);
});

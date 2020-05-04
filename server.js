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

  var where = {};

  if (
    queryParams.hasOwnProperty("completed") &&
    queryParams.completed === "true"
  ) {
    where.completed = true;
  } else if (
    queryParams.hasOwnProperty("completed") &&
    queryParams.completed === "false"
  ) {
    where.completed = false;
  }

  if (
    queryParams.hasOwnProperty("search") &&
    queryParams.search.trim().length > 0
  ) {
    where.description = {
      [db.Op.like]: `%${queryParams.search}%`,
    };
  }
  db.todo
    .findAll({ where })
    .then((todos) => {
      res.json(todos);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// get all todos by id
app.get("/todos/:id", (req, res) => {
  var todoId = parseInt(req.params.id, 10);
  db.todo
    .findByPk(todoId)
    .then((todo) => {
      if (!!todo) {
        res.json(todo.toJSON());
      } else {
        res.status(404).send();
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// add item to array
app.post("/todos", (req, res) => {
  var body = _.pick(req.body, "description", "completed");

  db.todo
    .create({
      description: body.description.trim(),
      completed: body.completed,
    })
    .then((todo) => {
      res.json(todo);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// add item to array
app.delete("/todos/:id", (req, res) => {
  var todoId = parseInt(req.params.id, 10);
  db.todo
    .destroy({
      where: {
        id: todoId,
      },
    })
    .then((rowsDeleted) => {
      if (rowsDeleted) {
        res.json({ success: "Item deleted successfully!" });
      } else {
        res.status(404).json({ error: "No rows to delete" });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
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

db.sequelize.sync().then(() => {
  console.log("DATABASE CONNECTED:" + new Date());
  app.listen(PORT, () => {
    console.log("listening to PORT:", PORT);
  });
});

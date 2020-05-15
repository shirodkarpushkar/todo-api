var express = require("express");
var bodyparser = require("body-parser");
var _ = require("underscore");
var db = require("./db");
var middleware = require("./middleware")(db);
var bcrypt = require("bcrypt");

var PORT = process.env.PORT || 3000;
var app = express();
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.send("Welcome to TODO LIST");
});

// get all todos
app.get("/todos", middleware.requireAuthentication, (req, res) => {
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
app.get("/todos/:id", middleware.requireAuthentication, (req, res) => {
  var todoId = parseInt(req.params.id, 10);
  db.todo
    .findById(todoId)
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
app.post("/todos", middleware.requireAuthentication, (req, res) => {
  var body = _.pick(req.body, "description", "completed");

  db.todo
    .create({
      description: body.description.trim(),
      completed: body.completed,
    })
    .then((todo) => {
      req.user
        .addtodo(todo)
        .then((todo) => {
          return todo.reload();
        })
        .then((todo) => {
          res.json(todo);
        });
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

app.post("/users", (req, res) => {
  var body = _.pick(req.body, "email", "password");
  db.user
    .create({
      email: body.email.trim(),
      password: body.password,
    })
    .then(
      (user) => {
        res.json(user.toPublicJSON());
      },
      (err) => {
        res.status(400).json(err);
      }
    )
    .catch((err) => {
      res.status(500).json(err);
    });
});

app.post("/users/login", (req, res) => {
  var body = _.pick(req.body, "email", "password");

  db.user
    .authenticate(body)
    .then((user) => {
      return res
        .header("Auth", user.generateToken("Authenticated"))
        .json(user.toPublicJSON());
    })
    .catch((err) => {
      return res.status(401).send();
    });
});

// add item to array
app.delete("/todos/:id", middleware.requireAuthentication, (req, res) => {
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
app.put("/todos/:id", middleware.requireAuthentication, (req, res) => {
  var todoId = parseInt(req.params.id, 10);
  var body = _.pick(req.body, "description", "completed");
  var attributes = {};

  if (body.hasOwnProperty("completed")) {
    attributes.completed = body.completed;
  }
  if (body.hasOwnProperty("description")) {
    attributes.description = body.description;
  }

  db.todo
    .findById(todoId)
    .then(
      (todo) => {
        if (todo) {
          return todo.update(attributes);
        } else {
          res.status(404).send();
        }
      },
      (err) => {
        res.status(500).json(err);
      }
    )
    .then(
      (todo) => {
        res.json(todo);
      },
      (err) => {
        res.status(400).json(err);
      }
    );
});

db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);
db.sequelize.sync({ force: true }).then(() => {
  console.log("DATABASE CONNECTED:" + new Date());
  app.listen(PORT, () => {
    console.log("listening to PORT:", PORT);
  });
});

var Sequelize = require("sequelize");
var sequelize = new Sequelize(undefined, undefined, undefined, {
  dialect: "sqlite",
  storage: __dirname + "/basic-sqlite-database.sqlite",
});
var Todo = sequelize.define("todo", {
  description: {
    type: Sequelize.STRING,
    allowNull: false,

    validate: {
      len: [1, 250],
    },
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
sequelize.sync({ force: true }).then(() => {
  console.log("everything is synched!");
  Todo.create({
    description: "Make Tea",
    completed: false,
  })
    .then((todo) => {
      return Todo.create({
        description: "Make Coffee",
        completed: false,
      });
    })
    .then((todo) => {
      console.log("completed!");
    })
    .catch((error) => {
      console.log("error", error);
    });
});

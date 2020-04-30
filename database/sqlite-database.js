var Sequelize = require("sequelize");
const Op = Sequelize.Op;
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
      // return Todo.findByPk(1);
      return Todo.findAll({
        where: {
          description: {
            [Op.like]: "%tea%",
          },
        },
      });
    })
    .then((todos) => {
      if (todos) {
        todos.forEach((el) => {
          console.log(el.toJSON());
        });
      }
    })
    .catch((error) => {
      console.log("error", error);
    });
});

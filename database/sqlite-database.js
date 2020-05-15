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
var user = sequelize.define("user", {
  email: {
    type: Sequelize.STRING,
  },
});

Todo.belongsTo(user);
user.hasMany(Todo);

sequelize
  .sync()
  .then(() => {
    console.log("database connected : ", new Date());
    user.findById(1).then((user) => {
      user
        .getTodos({
          where: {
            completed: false,
          },
        })
        .then((todo) => {
          todo.forEach((todo)=> console.log(todo.toJSON()))
        });
    });
  })

  .catch((error) => {
    console.log("error: Todo not found");
  });

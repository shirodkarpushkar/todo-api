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
var users = sequelize.define("user", {
  email: {
    type: Sequelize.STRING,
  },
});

Todo.belongsTo(users);
users.hasMany(Todo);

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("database connected : ", new Date());
  })

  .catch((error) => {
    console.log("error: Todo not found");
  });

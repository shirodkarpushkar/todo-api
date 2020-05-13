var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var sequelize;

var env = process.env.NODE_ENV || "development";

if (env === "production") {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
  });
} else {
  sequelize = new Sequelize(undefined, undefined, undefined, {
    dialect: "sqlite",
    storage: __dirname + "/data/dev-todo-api.sqlite",
  });
}

var db = {};
db.todo = sequelize.import(__dirname + "/models/todo.js");
db.users = sequelize.import(__dirname + "/models/users.js");
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Op;
module.exports = db;

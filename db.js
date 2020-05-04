var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var sequelize = new Sequelize(undefined, undefined, undefined, {
  dialect: "sqlite",
  storage: __dirname + "/data/dev-todo-api.sqlite",
});

var db = {};
db.todo = sequelize.import(__dirname + "/models/todo.js");
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Op;
module.exports = db;

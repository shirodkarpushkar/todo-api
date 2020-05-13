var bcrypt = require("bcrypt");
var _ = require("underscore");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "users",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.VIRTUAL,
        allowNull: false,
        defaultValue: false,
        validate: {
          len: [7, 100],
        },
          set: (value) => {
              var salt = bcrypt.genSaltSync(10)
              var hashedPassword = bcrypt.hashSync(value, salt)
              this.setDataValue('password',value)
              this.setDataValue("salt", salt);
              this.setDataValue("password_hash", hashedPassword);
              
        },
      },
      salt: {
        type: DataTypes.STRING,
      },
      password_hash: {
        type: DataTypes.STRING,
      },
    },
    {
      hooks: {
        beforeValidate: (user, options) => {
          if (typeof user.email === "string") {
            user.email = user.email.toLowerCase();
          }
        },
      },
    }
  );
};

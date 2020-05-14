var bcrypt = require("bcrypt");
var _ = require("underscore");
var crypto = require("crypto-js");
var jwt = require("jsonwebtoken");
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
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
        set: function (value) {
          var salt = bcrypt.genSaltSync(10);
          var hashedPassword = bcrypt.hashSync(value, salt);
          this.setDataValue("password", value);
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
      classMethods: {
        authenticate: function (body) {
          return new Promise((resolve, reject) => {
            if (
              typeof body.email !== "string" ||
              typeof body.password !== "string"
            ) {
              reject();
            }
            User.findOne({
              where: {
                email: body.email,
              },
            })
              .then((user) => {
                if (
                  !user ||
                  !bcrypt.compareSync(body.password, user.get("password_hash"))
                ) {
                  return reject({
                    error: "Incorrect Id or password",
                  });
                }
                resolve(user);
              })
              .catch((err) => {
                reject();
              });
          });
        },
        findByToken(token) {
          return new Promise((resolve, reject) => {
            try {
              var decryptedToken = jwt.verify(token, "qwerty123");
              var bytes = crypto.AES.decrypt(decryptedToken, "abc123");
              var tokenData = bytes.toString(crypto.enc.Utf8);
              User.findById(tokenData.id).then(
                (user) => {
                  if (user) {
                    resolve(user);
                  } else {
                    reject()
                  }
                },
                (err) => {
                  reject();
                }
              );
            } catch (err) {
              reject();
            }
          });
        },
      },
      instanceMethods: {
        toPublicJSON: function () {
          var json = this.toJSON();
          return _.pick(json, "id", "email", "createdAt", "updatedAt");
        },
        generateToken: function (type) {
          if (!_.isString(type)) {
            return undefined;
          }

          try {
            var stringData = JSON.stringify({
              id: this.get("id"),
              type: type,
            });
            console.log("obj", stringData);
            var encryptedData = crypto.AES.encrypt(
              stringData,
              "abc123"
            ).toString();
            var token = jwt.sign(
              {
                token: encryptedData,
              },
              "qwerty123"
            );
            return token;
          } catch (err) {
            console.log("err", err);

            return undefined;
          }
        },
      },
    }
  );

  return User;
};

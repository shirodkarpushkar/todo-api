module.exports = function (db) {
  return {
    requireAuthentication: function (req, res, next) {
      var token = req.get("Auth");

      db.users.findByToken(token).then(
        (user) => {
          console.log("middle ware user", user);
          req.user = user;
          next();
        },
        (err) => {
          console.log("err", err);
          res.status(401).send();
        }
      );
    },
  };
};

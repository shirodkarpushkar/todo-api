module.exports = function (db) {
  return {
    requireAuthentication: function (req, res, next) {
      var token = req.get("Auth");
      db.users
        .findByToken(token)
        .then(
          (user) => {
            req.user = user;
            next();
          },
          () => {
            res.status(401).send();
          }
        )
        .catch((err) => {
          res.status(500).send();
        });
    },
  };
};

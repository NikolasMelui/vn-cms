const Model = require('../model');

module.exports = async (req, res) => {
  if (!req.isAuth) {
    res.status(403).send({
      message: 'Forbidden'
    });
    return;
  }

  const filter = JSON.parse(req.query.filter || "{}");

  const items = await Model.findAll(filter).catch(err => {
    res.status(400).send({
      message: 'Bad request'
    });
    return;
  });

  res.status(200).send(items);
};

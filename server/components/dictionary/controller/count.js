const Model = require('../model');

module.exports = async (req, res) => {
  const filter = JSON.parse(req.query.filter || "{}");

  const count = await Model.count(filter).catch(err => {
    res.status(400).send({
      message: 'Bad request'
    });
    return;
  });

  res.status(200).send({
    count
  });
};

const Model = require('../model');

module.exports = async (req, res) => {
  if (!req.rules.is_context_read) {
    res.status(403).send({
      message: 'Access denied!'
    });
    return;
  }

  const filter = JSON.parse(req.query.filter || "{}");

  const item = await Model.findByPk(req.params.id, filter).catch(err => {
    res.status(400).send({
      message: 'Bad request'
    });
    return;
  });

  if (!item) {
    res.status(404).send({
      message: 'Not found'
    });
  }

  res.status(200).send(item);
};

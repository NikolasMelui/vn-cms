const Model = require('../model');

module.exports = async (req, res) => {
  if (!req.rules.is_user_read) {
    res.status(403).send({
      message: 'Forbidden'
    });
    return;
  }

  const filter = JSON.parse(req.query.filter || '{}');

  if (!filter.where) {
    filter.where = {};
  }

  // Если запрос от админа то вернуть всех а если нет то вернуть только если совпадают контексты
  if (!req.adminAccess) {
    filter.where.contextId = req.context.id;
  }

  const items = await Model.findAll(filter).catch(err => {
    res.status(400).send({
      message: 'Bad request'
    });
    return;
  });

  res.status(200).send(items);
};

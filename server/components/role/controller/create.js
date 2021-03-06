const Model = require('../model');

module.exports = async (req, res) => {
  // Если есть доступ к созданию ролей или если ранг роли пользователя меньше ранга создаваемой роли то запретить
  // Так же нельзя обновлять роли admin и default
  if (!req.rules.is_role_create || req.rang < req.body.rang || req.body.slug === 'default' || req.body.slug === 'admin') {
    res.status(403).send({
      message: 'Forbidden'
    });
    return;
  }

  const createdItem = await Model.create(req.body).catch(() => {
    res.status(400).send({
      message: 'Bad request'
    });
    return;
  });

  res.status(200).send(createdItem);
};

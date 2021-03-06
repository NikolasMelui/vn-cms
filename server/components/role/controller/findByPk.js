const Model = require('../model');

module.exports = async (req, res) => {
  if (!req.rules.is_role_read) {
    res.status(403).send({
      message: 'Access denied'
    });
    return;
  }
  const id = req.params.id;

  const item = await Model.findByPk(id);

  if (!item) {
    res.status(404).send({
      message: 'Not found'
    });
    return;
  }

  if (!req.adminAccess && (item.slug === 'admin' || item.slug === 'manager')) {
    res.status(403).send({
      message: 'Access denied'
    });
    return;
  }

  res.status(200).send(item);
};

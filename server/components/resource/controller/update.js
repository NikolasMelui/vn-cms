const Model = require('../model');
const SystemSetting = require('../../systemsetting/model');

module.exports = async (req, res) => {
  if (!req.rules.is_resource_update) {
    res.status(403).send({
      message: 'Forbidden'
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
    return;
  }

  if (req.context.slug !== 'root' && item.contextId !== req.context.id) {
    res.status(403).send({
      message: 'Forbidden'
    });
    return;
  }

  const is_id_in_slug = await SystemSetting.findOne({
    where: {
      slug: 'is_id_in_slug'
    }
  }).catch(err => {
    res.status(400).send({
      message: 'Bad request'
    });
    return;
  });

  const updateItem = req.body;

  if (JSON.parse(is_id_in_slug.setting).value) {
    const slugId = updateItem.slug.substring(updateItem.slug.length - `${updateItem.id}`.length);

    if (`-${slugId}` !== `-${updateItem.id}`) {
      updateItem.slug = `${req.body.slug}-${updateItem.id}`;
    }
  }

  const updatedItem = await item.update(updateItem).catch(err => {
    res.status(400).send({
      message: 'Bad request'
    });
    return;
  });

  res.status(200).send(updatedItem);
};

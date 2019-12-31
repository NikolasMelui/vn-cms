module.exports = async (req, res) => {
  if (!req.rules.is_filesystem_files_uploads) {
    res.status(403).send({
      message: 'Forbidden'
    });
    return;
  }

  res.status(200).send({
    message: 'OK'
  });
};

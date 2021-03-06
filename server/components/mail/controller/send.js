const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  if (!req.isAuth) {
    res.status(403).send({
      message: 'Forbidden'
    });
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASS
    }
  });

  const info = await transporter
    .sendMail({
      // from: payload.from,
      // subject: payload.subject,
      // text: payload.text,
      // html: payload.html

      ...req.body,
      from: process.env.MAIL_AUTH_USER,
      to: req.email
    })
    .catch(err => {
      res.status(500).send({
        message: 'Server error'
      });
    });

  res.status(200).send({
    message: 'OK'
  });
};

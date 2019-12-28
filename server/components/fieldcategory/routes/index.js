const express = require('express');
const router = express.Router();

// Controllers
const controller = require('../controller');

// Middleware
const profileByAccessToken = require('../../../middleware/profileByAccessToken');

router.get('/', profileByAccessToken, controller.findAll);

router.get('/find/:id', profileByAccessToken, controller.findByPk);

router.get('/findone', profileByAccessToken, controller.findOne);

router.post('/create', profileByAccessToken, controller.create);

router.put('/update/:id', profileByAccessToken, controller.update);

router.delete('/remove/:id', profileByAccessToken, controller.remove);

router.get('/count', profileByAccessToken, controller.count);

module.exports = router;

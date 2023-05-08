const express = require('express');

const indexController = require(`${__dirname}/../controllers/indexController`);

const router = express.Router();

router.route('/').get(indexController.createHTML);

module.exports = router;
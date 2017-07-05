const express = require('express');
const router = express();

const cronController = require('../controller/cron-test-controller');

router.route('/product').get(cronController.getProducts);
router.route('/product/create').post(cronController.createProducts);

module.exports = router;
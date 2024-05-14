const express = require('express');
const router = express.Router();
const errorController = require('../controllers/errorController');

router.get('/generate-error', errorController.generateError);

module.exports = router;
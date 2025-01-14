const express = require('express');
const { recordUserAnomaly, viewUserAnomaly } = require('../controllers/recordsController');
require('dotenv').config();
const axios = require('axios');

const router = express.Router();

router.use(express.json());

router.post('/save-anomaly', recordUserAnomaly);

router.get('/get-anomaly/:kakao_id', viewUserAnomaly);

module.exports = router;
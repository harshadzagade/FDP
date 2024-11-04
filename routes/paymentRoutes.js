// backend/routes/paymentRoutes.js
const express = require('express');
const { initiatePayment , fetchAllUsers, paymentSuccess, paymentFailure  } = require('../controllers/paymentController');
const router = express.Router();

router.post('/initiate', initiatePayment);

router.get('/users', fetchAllUsers);


router.post('/success', paymentSuccess);
router.post('/failure', paymentFailure);

module.exports = router;

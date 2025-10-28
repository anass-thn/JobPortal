const express = require('express');
const router = express.Router();

// @desc    Test route
// @route   GET /api/applications/test
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Application routes are working!'
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();

// @desc    Test route
// @route   GET /api/jobs/test
// @access  Public
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Job routes are working!'
  });
});

module.exports = router;

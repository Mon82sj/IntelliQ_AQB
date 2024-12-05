// routes/dataRoutes.js
const express = require('express');
const router = express.Router();
const dataController = require('./dataController');

router.get('/data', dataController.getData);
router.delete('/data/:type/:id', dataController.deleteData);

module.exports = router;

// In your routes/dataRoutes.js
router.get('/data', async (req, res) => {
  try {
    const users = await User.find();
    const feedback = await Feedback.find();
    res.status(200).json({ users, feedback });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

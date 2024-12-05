// controllers/dataController.js
const User = require('./User'); // Assume you have a User model
//const Feedback = require('./Feedback'); // Assume you have a Feedback model

// Get all users and feedback
exports.getData = async (req, res) => {
  try {
    const users = await User.find();
    const feedback = await Feedback.find();
    res.status(200).json({ users, feedback });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};

// Delete user or feedback by id
exports.deleteData = async (req, res) => {
  const { id, type } = req.params;
  try {
    if (type === 'user') {
      await User.findByIdAndDelete(id);
    } else if (type === 'feedback') {
      await Feedback.findByIdAndDelete(id);
    }
    res.status(200).json({ message: `${type} deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete data' });
  }
};


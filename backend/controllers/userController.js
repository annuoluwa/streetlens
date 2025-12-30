const { deleteUserById } = require('../models/userModel');

// Delete user account (self-delete)
const deleteAccount = async (req, res) => {
  try {
    const deleted = await deleteUserById(req.user.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Account deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete account' });
  }
};

module.exports = { deleteAccount };

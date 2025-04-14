const User = require('../User/User');

const UpdateTask = async (req, res) => {
    const { taskId, userID, completed, missed } = req.body;
    const user = await User.findById(userID);
    user.tasks = user.tasks.map(task => task.id === taskId ? { ...task, completed, missed } : task);
    await user.save();
    res.status(200).json(user);
};

module.exports = UpdateTask;

const User = require('../User/User');

// Helper function to convert time string (HH:mm) to minutes
const convertTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return (hours * 60) + minutes;
};

const AddAITasks = async (req, res) => {
    try {
        const { userID, tasks, removeTaskIds } = req.body;
        const user = await User.findById(userID);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If removeTaskIds is provided, remove those tasks first
        if (removeTaskIds && removeTaskIds.length > 0) {
            user.tasks = user.tasks.filter(task => !removeTaskIds.includes(task.id));
        }

        // If we're receiving new tasks to add
        if (tasks && tasks.length > 0) {
            // Validate all tasks have required fields
            const isValid = tasks.every(task => 
                task.text && 
                task.startTime && 
                typeof task.duration === 'number' &&
                task.date
            );

            if (!isValid) {
                return res.status(400).json({ 
                    message: 'Invalid task format',
                    error: 'INVALID_TASK_FORMAT'
                });
            }

            // Add the new tasks
            user.tasks.push(...tasks);
        }

        // Save the updated user
        await user.save();
        return res.status(200).json(user);
    } catch (error) {
        console.error('Error updating tasks:', error);
        res.status(500).json({ message: 'Error updating tasks', error: error.message });
    }
};

module.exports = AddAITasks;

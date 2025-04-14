const User = require('../User/User');

// Helper function to convert time string (HH:mm) to minutes
const convertTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return (hours * 60) + minutes;
};

const AddTask = async (req, res) => {
    try {
        const { newTask, userID } = req.body;
        const user = await User.findById(userID);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Convert new task times to minutes for easier comparison
        const taskStartMinutes = convertTimeToMinutes(newTask.startTime);
        const taskEndMinutes = taskStartMinutes + newTask.duration;

        // Check for overlaps with existing tasks
        const hasOverlap = user.tasks.some(existingTask => {
            // Skip tasks on different dates
            if (existingTask.date !== newTask.date) return false;
            
            const existingStartMinutes = convertTimeToMinutes(existingTask.startTime);
            const existingEndMinutes = existingStartMinutes + existingTask.duration;

            // Check if the new task overlaps with existing task
            return (taskStartMinutes < existingEndMinutes && taskEndMinutes > existingStartMinutes);
        });

        if (hasOverlap) {
            return res.status(400).json({ 
                message: 'Cannot add task: The time overlaps with another task on the same day',
                error: 'TASK_OVERLAP'
            });
        }

        // If no overlap, proceed with adding the task
        user.tasks.push(newTask);
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ message: 'Error adding task', error: error.message });
    }
};

module.exports = AddTask;

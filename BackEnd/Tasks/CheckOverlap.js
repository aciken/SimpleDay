const User = require('../User/User');

// Helper function to convert time string (HH:mm) to minutes
const convertTimeToMinutes = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return (hours * 60) + minutes;
};

const CheckOverlap = async (req, res) => {
    try {
        const { userID, tasks } = req.body;
        const user = await User.findById(userID);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Array to store IDs of overlapping tasks
        const overlappingTaskIds = [];

        // Check each new task against existing tasks
        for (const newTask of tasks) {
            const taskStartMinutes = convertTimeToMinutes(newTask.startTime);
            const taskEndMinutes = taskStartMinutes + newTask.duration;

            // Check for overlaps with existing tasks
            user.tasks.forEach(existingTask => {
                // Skip tasks on different dates
                if (existingTask.date !== newTask.date) return;
                
                const existingStartMinutes = convertTimeToMinutes(existingTask.startTime);
                const existingEndMinutes = existingStartMinutes + existingTask.duration;

                // Check if the new task overlaps with existing task
                if (taskStartMinutes < existingEndMinutes && taskEndMinutes > existingStartMinutes) {
                    // Add the ID of the overlapping task if it's not already in the array
                    if (!overlappingTaskIds.includes(existingTask.id)) {
                        overlappingTaskIds.push(existingTask.id);
                    }
                }
            });
        }

        // Return the IDs of overlapping tasks
        res.status(200).json({
            hasOverlap: overlappingTaskIds.length > 0,
            overlappingTaskIds: overlappingTaskIds
        });
    } catch (error) {
        console.error('Error checking task overlap:', error);
        res.status(500).json({ message: 'Error checking task overlap', error: error.message });
    }
};

module.exports = CheckOverlap;

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a task title'],
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium',
    },
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started',
    },
    dueDate: {
        type: Date,
        required: [true, 'Please specify a due date'],
        default: Date.now, // if the client doesn't send a date, use now
    },
    relatedCaseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Task', taskSchema);

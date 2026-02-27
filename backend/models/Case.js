const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a case title'],
    },
    clientName: {
        type: String,
        required: [true, 'Please add a client name'],
    },
    status: {
        type: String,
        enum: ['Ongoing', 'Closed', 'Paused'],
        default: 'Ongoing',
    },
    type: {
        type: String,
        enum: ['Civil', 'Criminal', 'Corporate', 'Family', 'Other'],
        required: true,
    },
    attorneyAssigned: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Case', caseSchema);

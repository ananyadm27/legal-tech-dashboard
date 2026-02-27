const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a document title'],
    },
    type: {
        type: String,
        enum: ['Contract', 'Brief', 'Motion', 'Pleading', 'Other'],
        required: [true, 'Please specify document type'],
    },
    status: {
        type: String,
        enum: ['Pending', 'Reviewed', 'Approved'],
        default: 'Pending',
    },
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Case',
        required: false,
    },
    assignedTo: {
        type: String,
        required: false,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Document', documentSchema);

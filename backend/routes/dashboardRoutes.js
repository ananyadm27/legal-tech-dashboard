const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const Task = require('../models/Task');
const Document = require('../models/Document');

// @route   GET /api/dashboard/summary
// @desc    Get aggregated stats for dashboard
router.get('/summary', async (req, res) => {
    try {
        const totalCases = await Case.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: { $ne: 'Completed' } });
        const pendingDocuments = await Document.countDocuments({ status: 'Pending' });

        // Status dist for Documents
        const docStatusDist = await Document.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Status dist for Tasks
        const taskStatusDist = await Task.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        // Cases by Type
        const casesByType = await Case.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);

        res.json({
            stats: {
                totalCases,
                pendingTasks,
                pendingDocuments
            },
            charts: {
                docStatusDist: docStatusDist.map(d => ({ name: d._id, value: d.count })),
                taskStatusDist: taskStatusDist.map(d => ({ name: d._id, value: d.count })),
                casesByType: casesByType.map(d => ({ name: d._id, value: d.count }))
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

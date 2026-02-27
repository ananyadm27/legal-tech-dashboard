const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const Task = require('../models/Task');
const Case = require('../models/Case');

// --- Document Routes ---

// GET all documents
router.get('/documents', async (req, res) => {
    try {
        const docs = await Document.find().populate('caseId', 'title');
        res.json(docs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new document
router.post('/documents', async (req, res) => {
    try {
        const newDoc = new Document(req.body);
        const savedDoc = await newDoc.save();
        const populatedDoc = await Document.findById(savedDoc._id).populate('caseId', 'title');
        res.status(201).json(populatedDoc);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a document
router.delete('/documents/:id', async (req, res) => {
    try {
        await Document.findByIdAndDelete(req.params.id);
        res.json({ message: 'Document deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Task Routes ---

// GET all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().populate('relatedCaseId', 'title').sort({ dueDate: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new task
router.post('/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const savedTask = await newTask.save();
        const populatedTask = await Task.findById(savedTask._id).populate('relatedCaseId', 'title');
        res.status(201).json(populatedTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a task
router.delete('/tasks/:id', async (req, res) => {
    try {
        await Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Case Routes ---

// GET all cases
router.get('/cases', async (req, res) => {
    try {
        const cases = await Case.find();
        res.json(cases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST a new case
router.post('/cases', async (req, res) => {
    try {
        const newCase = new Case(req.body);
        const savedCase = await newCase.save();
        res.status(201).json(savedCase);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE a case
router.delete('/cases/:id', async (req, res) => {
    try {
        await Case.findByIdAndDelete(req.params.id);
        res.json({ message: 'Case deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

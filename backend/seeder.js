const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Models
const Case = require('./models/Case');
const Task = require('./models/Task');
const Document = require('./models/Document');

// Mock Data
const cases = [
    { title: 'Smith vs. Jones', clientName: 'John Smith', status: 'Ongoing', type: 'Civil', attorneyAssigned: 'Alice Barnes' },
    { title: 'State vs. Doe', clientName: 'State of NY', status: 'Ongoing', type: 'Criminal', attorneyAssigned: 'Bob Miller' },
    { title: 'TechCorp Merger', clientName: 'TechCorp Inc.', status: 'Paused', type: 'Corporate', attorneyAssigned: 'Charlie Davis' },
    { title: 'Williams Estate', clientName: 'Estate of M. Williams', status: 'Closed', type: 'Family', attorneyAssigned: 'Alice Barnes' },
    { title: 'Rivera Property Dispute', clientName: 'Mario Rivera', status: 'Ongoing', type: 'Civil', attorneyAssigned: 'Bob Miller' },
];

const connectAndSeed = async () => {
    dotenv.config();
    await connectDB();

    try {
        await Case.deleteMany();
        await Task.deleteMany();
        await Document.deleteMany();

        console.log('Cleared existing data...');

        const createdCases = await Case.insertMany(cases);
        console.log('Cases seeded.');

        const tasks = [
            { title: 'File Initial Brief', priority: 'High', status: 'Completed', dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), relatedCaseId: createdCases[0]._id },
            { title: 'Client Meeting - Discovery', priority: 'Medium', status: 'In Progress', dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), relatedCaseId: createdCases[0]._id },
            { title: 'Review Subpoenas', priority: 'Urgent', status: 'Not Started', dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), relatedCaseId: createdCases[1]._id },
            { title: 'Draft NDA', priority: 'Low', status: 'Not Started', dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), relatedCaseId: createdCases[2]._id },
            { title: 'Title Search', priority: 'Medium', status: 'In Progress', dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), relatedCaseId: createdCases[4]._id },
        ];

        await Task.insertMany(tasks);
        console.log('Tasks seeded.');

        const documents = [
            { title: 'Initial Complaint.pdf', type: 'Pleading', status: 'Approved', caseId: createdCases[0]._id, assignedTo: 'Alice Barnes' },
            { title: 'Motion for Discovery.docx', type: 'Motion', status: 'Reviewed', caseId: createdCases[1]._id, assignedTo: 'Bob Miller' },
            { title: 'Merger Agreement v1', type: 'Contract', status: 'Pending', caseId: createdCases[2]._id, assignedTo: 'Charlie Davis' },
            { title: 'Will and Testament.pdf', type: 'Other', status: 'Approved', caseId: createdCases[3]._id, assignedTo: 'Alice Barnes' },
            { title: 'Property Deed.pdf', type: 'Other', status: 'Pending', caseId: createdCases[4]._id, assignedTo: 'Bob Miller' },
            { title: 'Settlement Offer.docx', type: 'Contract', status: 'Reviewed', caseId: createdCases[0]._id, assignedTo: 'Alice Barnes' },
        ];

        await Document.insertMany(documents);
        console.log('Documents seeded.');

        console.log('Data seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

connectAndSeed();

import React, { useState } from 'react';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { createTask, deleteTask } from '../services/api';
import './TaskList.css';

const TaskList = ({ tasks, refreshData }) => {
    const [isAdding, setIsAdding] = useState(false);
    // default dueDate to today so the user can save immediately if desired
    const todayString = new Date().toISOString().slice(0,10);
    const [newTask, setNewTask] = useState({ title: '', priority: 'Medium', status: 'Not Started', dueDate: todayString });

    // always render the container so the modal markup can appear even with no tasks
    const emptyMessage = (!tasks || tasks.length === 0) ? (
        <div style={{ padding: '24px' }}>No pending tasks</div>
    ) : null;  

    // note: we no longer return early; instead we render below and include modal separately


    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Urgent': return 'var(--accent-danger)';
            case 'High': return 'var(--accent-warning)';
            case 'Medium': return 'var(--accent-primary)';
            default: return 'var(--text-secondary)';
        }
    };

    const calculateDaysLeft = (dateString) => {
        const today = new Date();
        const dueDate = new Date(dateString);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await deleteTask(id);
                refreshData();
            } catch (err) {
                console.error("Error deleting task", err);
            }
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            // ensure there's a dueDate and convert to Date object
            const payload = { ...newTask };
            if (!payload.dueDate) {
                payload.dueDate = todayString;
            }
            payload.dueDate = new Date(payload.dueDate);

            await createTask(payload);
            setIsAdding(false);
            setNewTask({ title: '', priority: 'Medium', status: 'Not Started', dueDate: todayString });
            refreshData();
        } catch (err) {
            console.error("Error adding task", err);
            alert(err.response?.data?.message || 'Failed to add task');
        }
    };

    return (
        <div className="task-list glass-panel">
            <div className="section-header">
                <h3>Upcoming Deadlines</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="add-btn" onClick={() => setIsAdding(true)}>
                        <Plus size={16} /> Add Task
                    </button>
                    <button className="view-all">View All</button>
                </div>
            </div>

            <div className="tasks-container">
                {emptyMessage}
                {tasks && tasks.slice(0, 5).map(task => { // Show top 5 tasks
                    const daysLeft = calculateDaysLeft(task.dueDate);
                    const isOverdue = daysLeft < 0;

                    return (
                        <div key={task._id} className="task-item">
                            <div className="task-priority" style={{ backgroundColor: getPriorityColor(task.priority) }} />

                            <div className="task-details">
                                <div className="task-title-row">
                                    <h4>{task.title}</h4>
                                    <span className={`task-badge ${task.status.replace(' ', '-').toLowerCase()}`}>
                                        {task.status}
                                    </span>
                                </div>

                                <div className="task-meta">
                                    {task.relatedCaseId && (
                                        <span className="case-name">
                                            <BriefcaseIcon size={14} /> {task.relatedCaseId.title}
                                        </span>
                                    )}
                                    <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                                        {isOverdue ? <AlertIcon size={14} /> : <Calendar size={14} />}
                                        {isOverdue ? `Overdue by ${Math.abs(daysLeft)} days` : `Due in ${daysLeft} days`}
                                    </span>
                                </div>
                            </div>
                            <button className="icon-btn delete-btn" onClick={() => handleDelete(task._id)} title="Delete Task" style={{ alignSelf: 'center', marginRight: '16px' }}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    );
                })}
            </div>
            {/* Add Task Modal */}
            {isAdding && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <h3>Add New Task</h3>
                        <form onSubmit={handleAdd}>
                            <div className="form-group">
                                <label>Title</label>
                                <input required value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} placeholder="e.g. Client Meeting" />
                            </div>
                            <div className="form-group">
                                <label>Priority</label>
                                <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Urgent</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Due Date</label>
                                <input type="date" required value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsAdding(false)}>Cancel</button>
                                <button type="submit" className="save-btn">Save Task</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple inline icons for component self-containment
const BriefcaseIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const AlertIcon = ({ size }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;

export default TaskList;

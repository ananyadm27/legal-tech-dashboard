import React, { useEffect, useState } from 'react';
import { fetchTasks, fetchCases, createTask, deleteTask } from '../services/api';
import '../components/TaskList.css';

const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const todayString = new Date().toISOString().slice(0, 10);
    const [newTask, setNewTask] = useState({ title: '', priority: 'Medium', status: 'Not Started', dueDate: todayString, relatedCaseId: '' });

    const loadTasks = async () => {
        setLoading(true);
        try {
            const [taskRes, caseRes] = await Promise.all([fetchTasks(), fetchCases()]);
            setTasks(taskRes.data);
            setCases(caseRes.data);
        } catch (err) {
            console.error('Error fetching tasks', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTasks();
        const handler = () => loadTasks();
        window.addEventListener('dataUpdated', handler);
        return () => window.removeEventListener('dataUpdated', handler);
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this task?')) {
            try {
                await deleteTask(id);
                loadTasks();
                window.dispatchEvent(new Event('dataUpdated'));
            } catch (err) {
                console.error('Error deleting task', err);
            }
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...newTask };
            if (!payload.dueDate) payload.dueDate = todayString;
            payload.dueDate = new Date(payload.dueDate);
            if (!payload.relatedCaseId) payload.relatedCaseId = null;

            await createTask(payload);
            setIsAdding(false);
            setNewTask({ title: '', priority: 'Medium', status: 'Not Started', dueDate: todayString, relatedCaseId: '' });
            loadTasks();
            window.dispatchEvent(new Event('dataUpdated'));
        } catch (err) {
            console.error('Error adding task', err);
            alert(err.response?.data?.message || 'Failed to add task');
        }
    };

    const calculateDaysLeft = (dateString) => {
        const today = new Date();
        const dueDate = new Date(dateString);
        const diffTime = dueDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Urgent': return '#ef4444';
            case 'High': return '#f97316';
            case 'Medium': return '#3b82f6';
            default: return '#9ca3af';
        }
    };

    if (loading) return <div className="loading">Loading tasks...</div>;

    return (
        <div className="task-list glass-panel">
            <div className="section-header">
                <h3>All Tasks</h3>
                <button className="add-btn" onClick={() => setIsAdding(true)}>
                    + Add Task
                </button>
            </div>

            <div className="tasks-container">
                {tasks.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No tasks available</div>
                ) : (
                    tasks.map(task => {
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
                                                📋 {task.relatedCaseId.title}
                                            </span>
                                        )}
                                        <span className={`due-date ${isOverdue ? 'overdue' : ''}`}>
                                            📅 {isOverdue ? `Overdue by ${Math.abs(daysLeft)} days` : `Due in ${daysLeft} days`}
                                        </span>
                                    </div>
                                </div>
                                <button className="icon-btn delete-btn" onClick={() => handleDelete(task._id)} title="Delete Task" style={{ alignSelf: 'center', marginRight: '16px' }}>
                                    <span style={{ fontSize: '16px' }}>&#10005;</span>
                                </button>
                            </div>
                        );
                    })
                )}
            </div>

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
                                <label>Status</label>
                                <select value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value })}>
                                    <option>Not Started</option>
                                    <option>In Progress</option>
                                    <option>Completed</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Due Date</label>
                                <input type="date" required value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Related Case (optional)</label>
                                <select value={newTask.relatedCaseId} onChange={e => setNewTask({ ...newTask, relatedCaseId: e.target.value })}>
                                    <option value="">None</option>
                                    {cases.map(c => (
                                        <option key={c._id} value={c._id}>{c.title}</option>
                                    ))}
                                </select>
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

export default Tasks;

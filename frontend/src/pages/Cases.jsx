import React, { useEffect, useState } from 'react';
import { fetchCases, createCase, deleteCase } from '../services/api';
import '../components/DocumentTable.css'; // reuse table styles

const Cases = () => {
    const [cases, setCases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [newCase, setNewCase] = useState({ title: '', clientName: '', status: 'Ongoing', type: 'Civil', attorneyAssigned: '' });

    const loadCases = async () => {
        setLoading(true);
        try {
            const res = await fetchCases();
            setCases(res.data);
        } catch (err) {
            console.error('Error fetching cases', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCases();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this case?')) {
            try {
                await deleteCase(id);
                loadCases();
                window.dispatchEvent(new Event('dataUpdated'));
            } catch (err) {
                console.error('Error deleting case', err);
            }
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await createCase(newCase);
            setIsAdding(false);
            setNewCase({ title: '', clientName: '', status: 'Ongoing', type: 'Civil', attorneyAssigned: '' });
            loadCases();
            window.dispatchEvent(new Event('dataUpdated')); // let dashboard know
        } catch (err) {
            console.error('Error adding case', err);
        }
    };

    if (loading) return <div className="loading">Loading cases...</div>;

    return (
        <div className="document-table glass-panel">
            <div className="table-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h3>Cases</h3>
                    <button className="add-btn" onClick={() => setIsAdding(true)}>
                        + Add Case
                    </button>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Client</th>
                            <th>Status</th>
                            <th>Type</th>
                            <th>Attorney</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cases.map(c => (
                            <tr key={c._id}>
                                <td>{c.title}</td>
                                <td>{c.clientName}</td>
                                <td>{c.status}</td>
                                <td>{c.type}</td>
                                <td>{c.attorneyAssigned}</td>
                                <td>
                                    <button className="icon-btn delete-btn" onClick={() => handleDelete(c._id)} title="Delete Case">
                                        <span style={{fontSize:'16px'}}>&#10005;</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {cases.length === 0 && (
                            <tr>
                                <td colSpan="6" className="empty-state">No cases available.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isAdding && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <h3>Add New Case</h3>
                        <form onSubmit={handleAdd}>
                            <div className="form-group">
                                <label>Title</label>
                                <input required value={newCase.title} onChange={e => setNewCase({ ...newCase, title: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Client Name</label>
                                <input required value={newCase.clientName} onChange={e => setNewCase({ ...newCase, clientName: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Status</label>
                                <select value={newCase.status} onChange={e => setNewCase({ ...newCase, status: e.target.value })}>
                                    <option>Ongoing</option>
                                    <option>Paused</option>
                                    <option>Closed</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select value={newCase.type} onChange={e => setNewCase({ ...newCase, type: e.target.value })}>
                                    <option>Civil</option>
                                    <option>Criminal</option>
                                    <option>Corporate</option>
                                    <option>Family</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Attorney Assigned</label>
                                <input required value={newCase.attorneyAssigned} onChange={e => setNewCase({ ...newCase, attorneyAssigned: e.target.value })} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsAdding(false)}>Cancel</button>
                                <button type="submit" className="save-btn">Save Case</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cases;

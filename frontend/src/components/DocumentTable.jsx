import React, { useState } from 'react';
import { FileText, MoreVertical, Filter, Plus, Trash2 } from 'lucide-react';
import { createDocument, deleteDocument } from '../services/api';
import './DocumentTable.css';

const DocumentTable = ({ documents, refreshData }) => {
    const [filter, setFilter] = useState('All');
    const [isAdding, setIsAdding] = useState(false);
    const [newDoc, setNewDoc] = useState({ title: '', type: 'Contract', status: 'Pending', assignedTo: '' });

    if (!documents) return null;

    const filteredDocs = filter === 'All'
        ? documents
        : documents.filter(doc => doc.status === filter);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Approved': return 'status-approved';
            case 'Reviewed': return 'status-reviewed';
            case 'Pending': return 'status-pending';
            default: return '';
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this document?")) {
            try {
                await deleteDocument(id);
                refreshData(); // Parent re-fetches
            } catch (err) {
                console.error("Error deleting document", err);
            }
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            await createDocument(newDoc);
            setIsAdding(false);
            setNewDoc({ title: '', type: 'Contract', status: 'Pending', assignedTo: '' });
            refreshData(); // Parent re-fetches
        } catch (err) {
            console.error("Error adding document", err);
        }
    };

    return (
        <div className="document-table glass-panel">
            <div className="table-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <h3>Recent Documents</h3>
                    <button className="add-btn" onClick={() => setIsAdding(true)}>
                        <Plus size={16} /> Add New
                    </button>
                </div>
                <div className="table-actions">
                    <div className="filter-dropdown">
                        <Filter size={16} />
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Approved">Approved</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Document Name</th>
                            <th>Type</th>
                            <th>Related Case</th>
                            <th>Assigned To</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocs.map((doc) => (
                            <tr key={doc._id}>
                                <td className="doc-name">
                                    <FileText size={16} className="doc-icon" />
                                    <span>{doc.title}</span>
                                </td>
                                <td>{doc.type}</td>
                                <td>{doc.caseId ? doc.caseId.title : 'N/A'}</td>
                                <td>
                                    <div className="assigned-user">
                                        <div className="user-avatar-sm">
                                            {doc.assignedTo.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span>{doc.assignedTo}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={`status-badge ${getStatusClass(doc.status)}`}>
                                        {doc.status}
                                    </span>
                                </td>
                                <td className="actions-cell">
                                    <button className="icon-btn delete-btn" onClick={() => handleDelete(doc._id)} title="Delete Document">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredDocs.length === 0 && (
                            <tr>
                                <td colSpan="6" className="empty-state">No documents found matching "{filter}".</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Add Document Modal */}
            {isAdding && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel">
                        <h3>Add New Document</h3>
                        <form onSubmit={handleAdd}>
                            <div className="form-group">
                                <label>Title</label>
                                <input required value={newDoc.title} onChange={e => setNewDoc({ ...newDoc, title: e.target.value })} placeholder="e.g. Subpoena.pdf" />
                            </div>
                            <div className="form-group">
                                <label>Type</label>
                                <select value={newDoc.type} onChange={e => setNewDoc({ ...newDoc, type: e.target.value })}>
                                    <option>Contract</option>
                                    <option>Brief</option>
                                    <option>Motion</option>
                                    <option>Pleading</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Assigned To</label>
                                <input required value={newDoc.assignedTo} onChange={e => setNewDoc({ ...newDoc, assignedTo: e.target.value })} placeholder="e.g. Alice Barnes" />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setIsAdding(false)}>Cancel</button>
                                <button type="submit" className="save-btn">Save Document</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentTable;

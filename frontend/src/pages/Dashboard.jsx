import React, { useEffect, useState } from 'react';
import { fetchDashboardStats, fetchDocuments, fetchTasks } from '../services/api';
import OverviewCards from '../components/OverviewCards';
import DocumentTable from '../components/DocumentTable';
import TaskList from '../components/TaskList';
import Charts from '../components/Charts';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [charts, setCharts] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsRes, docsRes, tasksRes] = await Promise.all([
                fetchDashboardStats(),
                fetchDocuments(),
                fetchTasks()
            ]);

            setStats(statsRes.data.stats);
            setCharts(statsRes.data.charts);
            setDocuments(docsRes.data);
            setTasks(tasksRes.data);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        const handler = () => loadData();
        window.addEventListener('dataUpdated', handler);
        return () => window.removeEventListener('dataUpdated', handler);
    }, []);

    if (loading) return <div className="loading">Loading dashboard data...</div>;

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Dashboard Overview</h1>
                <p>Welcome back! Here's what's happening today.</p>
            </header>

            <OverviewCards stats={stats} />

            <div className="dashboard-grid">
                <div className="main-column">
                    <Charts chartsData={charts} />
                    <DocumentTable documents={documents} refreshData={loadData} />
                </div>
                <div className="side-column">
                    <TaskList tasks={tasks} refreshData={loadData} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, CheckSquare, Briefcase, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <aside className="sidebar glass-panel">
            <div className="sidebar-header">
                <div className="logo">
                    <div className="logo-icon">⚖️</div>
                    <h2>LexDashboard</h2>
                </div>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/cases" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Briefcase size={20} />
                    <span>Cases</span>
                </NavLink>
                <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <CheckSquare size={20} />
                    <span>Tasks</span>
                </NavLink>
                <NavLink to="/documents" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <FileText size={20} />
                    <span>Documents</span>
                </NavLink>
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item utility-btn">
                    <Settings size={20} />
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;

import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './MainLayout.css';

const MainLayout = () => {
    return (
        <div className="app-container">
            <Sidebar />
            <main className="main-content">
                <header className="topbar">
                    <div className="search-bar glass-panel">
                        <input type="text" placeholder="Search cases, documents, or tasks..." />
                    </div>
                    <div className="user-profile">
                        <div className="avatar">AB</div>
                        <div className="user-info">
                            <span className="user-name">Alice Barnes</span>
                            <span className="user-role">Senior Partner</span>
                        </div>
                    </div>
                </header>
                <div className="page-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;

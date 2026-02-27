import React from 'react';
import { Briefcase, FileText, AlertCircle } from 'lucide-react';
import './OverviewCards.css';

const OverviewCards = ({ stats }) => {
    if (!stats) return null;

    const cards = [
        { title: 'Total Active Cases', value: stats.totalCases, icon: <Briefcase size={24} />, color: 'var(--accent-primary)' },
        { title: 'Pending Documents', value: stats.pendingDocuments, icon: <FileText size={24} />, color: 'var(--accent-warning)' },
        { title: 'Tasks Due Soon', value: stats.pendingTasks, icon: <AlertCircle size={24} />, color: 'var(--accent-danger)' },
    ];

    return (
        <div className="overview-cards">
            {cards.map((card, idx) => (
                <div key={idx} className="stat-card glass-panel glass-panel-hover">
                    <div className="stat-icon" style={{ background: `${card.color}22`, color: card.color }}>
                        {card.icon}
                    </div>
                    <div className="stat-content">
                        <h3>{card.title}</h3>
                        <h2>{card.value}</h2>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OverviewCards;

import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Charts.css';

const Charts = ({ chartsData }) => {
    if (!chartsData) return null;

    const COLORS = ['var(--accent-primary)', 'var(--accent-secondary)', 'var(--accent-warning)', 'var(--accent-danger)', '#8B5CF6'];

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip glass-panel">
                    <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="charts-container">
            {/* Document Status Pie Chart */}
            <div className="chart-card glass-panel">
                <h3>Document Status Distribution</h3>
                <div className="chart-wrapper">
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={chartsData.docStatusDist}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {chartsData.docStatusDist.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="chart-legend">
                        {chartsData.docStatusDist.map((entry, index) => (
                            <div key={index} className="legend-item">
                                <span className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                                <span>{entry.name} ({entry.value})</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Cases by Type Bar Chart */}
            <div className="chart-card glass-panel">
                <h3>Ongoing Cases by Type</h3>
                <div className="chart-wrapper">
                    {chartsData.casesByType && chartsData.casesByType.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartsData.casesByType} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {chartsData.casesByType.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="no-data-message">No case data available</div>
                )}
                </div>
            </div>
        </div>
    );
};

export default Charts;

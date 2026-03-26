import React from 'react';
import { LucideIcon } from 'lucide-react';


interface StatCardProps {
    label: string;
    value: number;
    icon: LucideIcon;
    color: 'primary' | 'warning' | 'success' | 'info';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon: Icon, color }) => {
    return (
        <div className="stat-card">
            <div className="stat-card-info">
                <span className="stat-card-label">{label}</span>
                <span className={`stat-card-number stat-${color}`}>{value}</span>
            </div>
            <Icon size={28} className={`stat-card-icon stat-icon-${color}`} />
        </div>
    );
};

export default StatCard;

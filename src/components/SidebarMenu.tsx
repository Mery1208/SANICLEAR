import React from 'react';


interface MenuItem {
    id: string;
    label: string;
}

interface SidebarMenuProps {
    items: MenuItem[];
    activeItem: string;
    onItemClick: (id: string) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ items, activeItem, onItemClick }) => {
    return (
        <aside className="sidebar-menu dark:bg-slate-900 transition-colors">
            <nav className="sidebar-menu-nav">
                {items.map(item => (
                    <button
                        key={item.id}
                        className={`sidebar-menu-btn dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors ${activeItem === item.id ? 'active dark:bg-slate-800 dark:text-white dark:border-blue-500' : ''}`}
                        onClick={() => onItemClick(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </nav>
        </aside>
    );
};

export default SidebarMenu;

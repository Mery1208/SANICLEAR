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
        <aside className="sidebar-menu">
            <nav className="sidebar-menu-nav">
                {items.map(item => (
                    <button
                        key={item.id}
                        className={`sidebar-menu-btn ${activeItem === item.id ? 'active' : ''}`}
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

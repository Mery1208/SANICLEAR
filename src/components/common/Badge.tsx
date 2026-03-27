import React from 'react';

interface BadgeProps {
  cls: string;
  label: string;
}

const Badge: React.FC<BadgeProps> = ({ cls, label }) => {
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>{label}</span>;
}

export default Badge;

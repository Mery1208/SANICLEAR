import React from 'react';
import '../css/Button.css';
import { LucideIcon } from 'lucide-react';

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';
  icon?: LucideIcon;
  style?: React.CSSProperties;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, type = "button", variant = "primary", icon: Icon, style, disabled }) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant}`}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      {Icon && <Icon size={18} style={{ marginRight: '8px' }} />}
      {text}
    </button>
  );
};

export default Button;
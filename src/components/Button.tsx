import React from 'react';
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
  
  // Tailwind base classes + variant specifics
  const baseClasses = "inline-flex items-center justify-center py-3 px-6 text-base font-semibold rounded-lg transition-all duration-200 cursor-pointer border-none outline-none disabled:opacity-50 disabled:cursor-not-allowed font-inherit";
  
  const variants = {
    primary: "bg-blue-600 text-white shadow-sm hover:not(:disabled):bg-blue-700 hover:not(:disabled):shadow-md active:not(:disabled):translate-y-[1px]",
    secondary: "bg-white text-blue-600 border-2 border-solid border-blue-600 hover:not(:disabled):bg-blue-50",
    success: "bg-emerald-500 text-white shadow-sm hover:not(:disabled):bg-emerald-600 hover:not(:disabled):shadow-md",
    danger: "bg-red-500 text-white shadow-sm hover:not(:disabled):bg-red-600 hover:not(:disabled):shadow-md",
    ghost: "bg-transparent text-slate-800 hover:not(:disabled):bg-slate-100"
  };

  const className = `${baseClasses} ${variants[variant]}`;

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      style={style}
      disabled={disabled}
    >
      {Icon && <Icon size={18} className="mr-2" />}
      {text}
    </button>
  );
};

export default Button;
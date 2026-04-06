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
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  text, 
  onClick, 
  type = "button", 
  variant = "primary", 
  icon: Icon, 
  style, 
  disabled,
  className: extraClassName = ""
}) => {
  
  // Tailwind base classes + variant specifics
  const baseClasses = "inline-flex items-center justify-center py-2.5 px-6 text-sm font-black uppercase tracking-widest rounded-xl transition-all duration-200 cursor-pointer border-none outline-none disabled:opacity-50 disabled:cursor-not-allowed font-inherit shadow-sm active:scale-95 whitespace-nowrap";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:not(:disabled):bg-blue-700 hover:not(:disabled):shadow-lg hover:not(:disabled):shadow-blue-100",
    secondary: "bg-white text-blue-600 border-2 border-solid border-blue-600 hover:not(:disabled):bg-blue-50",
    success: "bg-emerald-500 text-white hover:not(:disabled):bg-emerald-600 hover:not(:disabled):shadow-lg hover:not(:disabled):shadow-emerald-100",
    danger: "bg-red-500 text-white hover:not(:disabled):bg-red-600 hover:not(:disabled):shadow-lg hover:not(:disabled):shadow-red-100",
    ghost: "bg-transparent text-slate-800 hover:not(:disabled):bg-slate-100"
  };

  const className = `${baseClasses} ${variants[variant]} ${extraClassName}`;

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
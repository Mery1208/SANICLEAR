import React from 'react';
import '../css/Button.css'; 

const Button = ({ text, onClick, type = "button", variant = "primary", icon: Icon, style }) => {
  return (
    <button 
      type={type} 
      className={`btn btn-${variant}`} 
      onClick={onClick}
      style={style}
    >
      {Icon && <Icon size={18} style={{ marginRight: '8px' }} />}
      {text}
    </button>
  );
};

export default Button;
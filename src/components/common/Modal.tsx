import React from 'react';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-blue-900/10 backdrop-blur-[6px] flex items-center justify-center z-50 p-4 transition-all animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-white/50 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-50">
          <h3 className="text-xl font-black text-[#1e3a5f] tracking-tight">{title}</h3>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors text-xl font-light"
          >
            &times;
          </button>
        </div>
        <div className="px-8 py-8">{children}</div>
      </div>
    </div>
  );
}

export default Modal;

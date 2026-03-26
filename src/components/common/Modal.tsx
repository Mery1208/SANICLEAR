import React from 'react';
import { X } from 'lucide-react';


interface ModalProps {
    titulo: string;
    visible: boolean;
    onCerrar: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ titulo, visible, onCerrar, children }) => {
    if (!visible) return null;

    return (
        <div className="modal-overlay" onClick={onCerrar}>
            <div className="modal-contenido" onClick={e => e.stopPropagation()}>
                <div className="modal-cabecera">
                    <h2 className="modal-titulo">{titulo}</h2>
                    <button className="modal-cerrar" onClick={onCerrar}>
                        <X size={20} />
                    </button>
                </div>
                <div className="modal-cuerpo">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;

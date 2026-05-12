import React, { useState } from 'react';
import { Shield, Lock, FileText, Cookie, CheckCircle2 } from 'lucide-react';
import logoImg from '../../assets/img/logo.png';
import Modal from './Modal';

const SectionItem = ({ title, text }: { title: string, text: string }) => (
  <div className="flex gap-4 items-start p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors text-left">
    <div className="mt-0.5 p-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-500 shrink-0">
      <CheckCircle2 size={16} />
    </div>
    <div>
      <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-widest mb-1">{title}</p>
      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{text}</p>
    </div>
  </div>
);

const LEGAL_INFO = {
  privacidad: {
    title: 'Política de Privacidad',
    icon: <Lock className="text-blue-500" />,
    intro: 'Protegemos la integridad de los datos sanitarios bajo estándares europeos.',
    sections: [
      { title: 'Cumplimiento RGPD', text: 'Cumplimos estrictamente con el Reglamento General de Protección de Datos y normativas locales de salud.' },
      { title: 'Datos Operativos', text: 'Solo almacenamos nombres, correos institucionales y registros de actividad para la gestión del centro.' },
      { title: 'No Comercialización', text: 'Sus datos personales nunca serán vendidos ni compartidos con terceros con fines publicitarios.' },
      { title: 'Control Total', text: 'Puede solicitar el acceso, rectificación o eliminación de sus datos a través de su panel de administración.' }
    ]
  },
  terminos: {
    title: 'Términos y Condiciones',
    icon: <FileText className="text-blue-500" />,
    intro: 'Marco legal para el uso profesional de nuestra plataforma de higiene.',
    sections: [
      { title: 'Licencia de Uso', text: 'Acceso exclusivo para personal sanitario y de limpieza autorizado por el hospital contratante.' },
      { title: 'Uso Correcto', text: 'La plataforma debe utilizarse únicamente para el reporte y gestión de tareas de limpieza hospitalaria.' },
      { title: 'Propiedad Intelectual', text: 'Todo el software, algoritmos y diseño visual son propiedad exclusiva de SANICLEARS.' },
      { title: 'Actualizaciones', text: 'Nos reservamos el derecho de mejorar y modificar la plataforma para garantizar la mejor experiencia.' }
    ]
  },
  cookies: {
    title: 'Política de Cookies',
    icon: <Cookie className="text-blue-500" />,
    intro: 'Utilizamos tecnología mínima necesaria para garantizar el funcionamiento.',
    sections: [
      { title: 'Cookies Esenciales', text: 'Mantenimiento de sesión, seguridad del login y preferencias de idioma o tema visual.' },
      { title: 'Rendimiento', text: 'Cookies analíticas anónimas que nos permiten detectar fallos y optimizar la velocidad de carga.' },
      { title: 'Privacidad', text: 'No utilizamos cookies de seguimiento de terceros ni píxeles publicitarios de redes sociales.' },
      { title: 'Gestión', text: 'Puede bloquear las cookies desde su navegador, aunque algunas funciones podrían no estar disponibles.' }
    ]
  },
  seguridad: {
    title: 'Seguridad del Sistema',
    icon: <Shield className="text-blue-500" />,
    intro: 'Infraestructura blindada para entornos de misión crítica hospitalaria.',
    sections: [
      { title: 'Encriptación SSL/TLS', text: 'Toda la comunicación entre el navegador y el servidor está cifrada mediante certificados de 256 bits.' },
      { title: 'Backups Diarios', text: 'Copias de seguridad automáticas y redundantes para garantizar la disponibilidad de los datos 24/7.' },
      { title: 'Trazabilidad', text: 'Registro detallado (Audit Log) de cada acción realizada en el sistema para auditorías internas.' },
      { title: 'Aislamiento de Datos', text: 'Cada entidad hospitalaria tiene su propio espacio de datos lógico para evitar filtraciones.' }
    ]
  }
};

const AppFooter: React.FC = () => {
  const [modalType, setModalType] = useState<keyof typeof LEGAL_INFO | null>(null);

  return (
    <footer className="bg-slate-800 text-white py-3 px-3 sm:px-6 mt-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4 sm:gap-8">
          <img src={logoImg} alt="Saniclears" className="h-10 sm:h-14 brightness-0 invert" />
          <span className="text-[10px] sm:text-xs text-white/70">© 2026 Saniclears - Gestión Hospitalaria</span>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={() => setModalType('privacidad')} className="text-[10px] sm:text-xs text-white/50 hover:text-white transition-colors cursor-pointer">Política de Privacidad</button>
          <span className="text-white/20 text-[10px]">|</span>
          <button onClick={() => setModalType('terminos')} className="text-[10px] sm:text-xs text-white/50 hover:text-white transition-colors cursor-pointer">Términos</button>
          <span className="text-white/20 text-[10px]">|</span>
          <button onClick={() => setModalType('seguridad')} className="text-[10px] sm:text-xs text-white/50 hover:text-white transition-colors cursor-pointer">Seguridad</button>
          <span className="text-white/20 text-[10px]">|</span>
          <button onClick={() => setModalType('cookies')} className="text-[10px] sm:text-xs text-white/50 hover:text-white transition-colors cursor-pointer">Cookies</button>
        </div>

        <span className="text-[9px] text-white/30">v1.0.0</span>
      </div>

      {modalType && (
        <Modal 
          title={LEGAL_INFO[modalType].title} 
          onClose={() => setModalType(null)}
        >
          <div className="flex flex-col">
            <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-3xl mb-6 text-center border border-blue-100/50 dark:border-blue-800/30">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                {React.cloneElement(LEGAL_INFO[modalType].icon as React.ReactElement, { size: 32 })}
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200 leading-relaxed italic px-4">
                "{LEGAL_INFO[modalType].intro}"
              </p>
            </div>

            <div className="grid gap-2">
              {LEGAL_INFO[modalType].sections.map((section, idx) => (
                <SectionItem key={idx} title={section.title} text={section.text} />
              ))}
            </div>
          </div>
        </Modal>
      )}
    </footer>
  );
};

export default AppFooter;
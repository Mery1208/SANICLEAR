import React from 'react';

interface SaniclearLogoProps {
  size?: "normal" | "big";
}

const SaniclearLogo: React.FC<SaniclearLogoProps> = ({ size = "normal" }) => {
  const s = size === "big" ? "text-3xl" : "text-xl";
  return (
    <div className={`flex items-center gap-2 font-bold text-blue-600 ${s}`}>
      <span className="bg-blue-600 text-white rounded-lg px-1.5 py-0.5 text-sm">✚</span>
      <span className="tracking-wide">Saniclear</span>
    </div>
  );
}

export default SaniclearLogo;

import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { Language } from '../types';

interface Props {
  language: Language;
  setLanguage: (lang: Language) => void;
  subtitle: React.ReactNode;
}

export const Header: React.FC<Props> = ({ language, setLanguage, subtitle }) => {
  return (
    <header className="text-center mb-10 pt-10 px-4 relative">
      {/* Language Switcher Removed as per request, defaulting to ZH in App.tsx */}
      
      <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-2xl mb-4 shadow-sm border border-brand-100">
        <BrainCircuit className="w-8 h-8 text-brand-600 mr-2" />
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">DBT Retro</h1>
      </div>
      <p className="text-slate-500 max-w-md mx-auto text-base leading-relaxed">
        {subtitle}
      </p>
    </header>
  );
};
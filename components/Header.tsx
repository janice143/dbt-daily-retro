import React from 'react';
import { BrainCircuit, Languages } from 'lucide-react';
import { Language } from '../types';

interface Props {
  language: Language;
  setLanguage: (lang: Language) => void;
  subtitle: React.ReactNode;
}

export const Header: React.FC<Props> = ({ language, setLanguage, subtitle }) => {
  return (
    <header className="text-center mb-10 pt-10 px-4 relative">
      <div className="absolute top-6 right-4 md:right-0">
        <button
          onClick={() => setLanguage(language === 'en' ? 'zh' : 'en')}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-medium text-slate-600 hover:text-brand-600 hover:border-brand-200 transition-all"
        >
          <Languages className="w-4 h-4" />
          {language === 'en' ? '中文' : 'English'}
        </button>
      </div>
      
      <div className="inline-flex items-center justify-center p-3 bg-brand-50 rounded-2xl mb-4 shadow-sm border border-brand-100">
        <BrainCircuit className="w-8 h-8 text-brand-600 mr-2" />
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">InsightLoop</h1>
      </div>
      <p className="text-slate-500 max-w-md mx-auto text-base leading-relaxed">
        {subtitle}
      </p>
    </header>
  );
};
import React from 'react';
import { ReflectionInput } from '../types';
import { CheckCircle2, AlertCircle, Cloud, Sparkles } from 'lucide-react';

interface Props {
  input: ReflectionInput;
  onChange: (field: keyof ReflectionInput, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  t: {
    didLabel: string;
    didPlaceholder: string;
    badLabel: string;
    badPlaceholder: string;
    thinkingLabel: string;
    thinkingPlaceholder: string;
    submitButton: React.ReactNode;
    analyzing: React.ReactNode;
  }
}

export const ReflectionForm: React.FC<Props> = ({ input, onChange, onSubmit, isLoading, t }) => {
  return (
    <div className="grid gap-6 max-w-2xl mx-auto w-full px-4 animate-fade-in-up">
      
      {/* Did Section */}
      <div className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-brand-300 transition-all duration-300">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <label className="font-semibold text-slate-700 text-sm uppercase tracking-wide">{t.didLabel}</label>
        </div>
        <textarea
          value={input.did}
          onChange={(e) => onChange('did', e.target.value)}
          placeholder={t.didPlaceholder}
          className="w-full min-h-[100px] resize-none outline-none text-slate-600 placeholder:text-slate-300 bg-transparent"
          disabled={isLoading}
        />
      </div>

      {/* Bad Section */}
      <div className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-red-300 transition-all duration-300">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <label className="font-semibold text-slate-700 text-sm uppercase tracking-wide">{t.badLabel}</label>
        </div>
        <textarea
          value={input.bad}
          onChange={(e) => onChange('bad', e.target.value)}
          placeholder={t.badPlaceholder}
          className="w-full min-h-[100px] resize-none outline-none text-slate-600 placeholder:text-slate-300 bg-transparent"
          disabled={isLoading}
        />
      </div>

      {/* Thinking Section */}
      <div className="group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all duration-300">
        <div className="flex items-center gap-2 mb-3">
          <Cloud className="w-5 h-5 text-blue-500" />
          <label className="font-semibold text-slate-700 text-sm uppercase tracking-wide">{t.thinkingLabel}</label>
        </div>
        <textarea
          value={input.thinking}
          onChange={(e) => onChange('thinking', e.target.value)}
          placeholder={t.thinkingPlaceholder}
          className="w-full min-h-[100px] resize-none outline-none text-slate-600 placeholder:text-slate-300 bg-transparent"
          disabled={isLoading}
        />
      </div>

      {/* Action Button */}
      <button
        onClick={onSubmit}
        disabled={isLoading || (!input.did && !input.bad && !input.thinking)}
        className={`mt-4 w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-200 shadow-lg flex items-center justify-center gap-2
          ${isLoading 
            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
            : 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-brand-200 hover:-translate-y-0.5 active:translate-y-0'
          }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {t.analyzing}
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            {t.submitButton}
          </>
        )}
      </button>
    </div>
  );
};
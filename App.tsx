import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ReflectionForm } from './components/ReflectionForm';
import { AnalysisView } from './components/AnalysisView';
import { ReflectionInput, AIAnalysis, LoadingState, DEFAULT_INPUT, Language } from './types';
import { analyzeReflection } from './services/geminiService';
import { translations } from './i18n';

const App: React.FC = () => {
  const [input, setInput] = useState<ReflectionInput>(DEFAULT_INPUT);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');

  const t = translations[language];

  const handleInputChange = useCallback((field: keyof ReflectionInput, value: string) => {
    setInput(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback(async () => {
    setStatus(LoadingState.LOADING);
    setError(null);
    
    try {
      const analysis = await analyzeReflection(input, language);
      setResult(analysis);
      setStatus(LoadingState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setStatus(LoadingState.ERROR);
      setError(err.message || t.errorGeneric);
    }
  }, [input, language, t]);

  const handleReset = useCallback(() => {
    setInput(DEFAULT_INPUT);
    setResult(null);
    setStatus(LoadingState.IDLE);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-brand-200 selection:text-brand-900">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-white to-transparent pointer-events-none z-0" />
      
      <div className="relative z-10 max-w-4xl mx-auto pb-20">
        <Header language={language} setLanguage={setLanguage} subtitle={t.subtitle} />

        {status === LoadingState.ERROR && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center justify-between animate-fade-in">
             <span>{error}</span>
             <button onClick={() => setStatus(LoadingState.IDLE)} className="text-red-800 font-bold hover:underline">{t.dismiss}</button>
          </div>
        )}

        {status === LoadingState.SUCCESS && result ? (
          <AnalysisView input={input} analysis={result} onReset={handleReset} t={t} />
        ) : (
          <ReflectionForm 
            input={input} 
            onChange={handleInputChange} 
            onSubmit={handleSubmit} 
            isLoading={status === LoadingState.LOADING}
            t={t}
          />
        )}
      </div>
      
      {/* Footer */}
      <div className="fixed bottom-4 w-full text-center pointer-events-none">
         <p className="text-xs text-slate-300">{t.footer}</p>
      </div>
      
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;

import React, { useRef, useState } from 'react';
import { AIAnalysis, ReflectionInput, AnalysisModule, ReflectionItem } from '../types';
import { Target, Quote, RefreshCw, Download, CheckCircle2, AlertCircle, Cloud, BookOpen } from 'lucide-react';
import { toPng } from 'html-to-image';

interface Props {
  input: ReflectionInput;
  analysis: AIAnalysis;
  onReset: () => void;
  t: {
    badModuleTitle: string;
    thinkingModuleTitle: string;
    theoryLabel: string;
    analysisLabel: string;
    actionLabel: string;
    startNew: string;
    yourReflection: string;
    exportButton: string;
    downloading: string;
    didLabel: string;
    badLabel: string;
    thinkingLabel: string;
  }
}

const ModuleCard: React.FC<{
  categoryLabel: string;
  itemTitle: string;
  icon: React.ReactNode;
  module: AnalysisModule;
  colorClass: string; // 'red' or 'blue'
  t: Props['t'];
}> = ({ categoryLabel, itemTitle, icon, module, colorClass, t }) => {
  const bgGradient = colorClass === 'red' ? 'from-red-500 to-red-600' : 'from-blue-500 to-blue-600';
  const lightBg = colorClass === 'red' ? 'bg-red-50' : 'bg-blue-50';
  const textDark = colorClass === 'red' ? 'text-red-800' : 'text-blue-800';
  const textLight = colorClass === 'red' ? 'text-red-100' : 'text-blue-100';

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 mb-8 last:mb-0">
      {/* Header */}
      <div className={`bg-gradient-to-br ${bgGradient} p-6 text-white`}>
        <div className="flex items-center gap-2 mb-2 opacity-80">
          {icon}
          <span className={`text-xs font-bold uppercase tracking-widest`}>{categoryLabel}</span>
        </div>
        <h2 className="text-2xl font-bold text-white leading-tight mb-4">{itemTitle || module.related_item_title}</h2>
        
        <div className="flex items-start gap-3 mt-4 pt-4 border-t border-white/20">
          <BookOpen className={`w-6 h-6 ${textLight} shrink-0 mt-1`} />
          <div>
             <span className={`text-xs font-medium ${textLight} opacity-80 uppercase mb-1 block`}>{t.theoryLabel}</span>
             <p className="text-xl font-serif font-medium leading-tight">{module.theory}</p>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-8 border-b border-slate-100">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">{t.analysisLabel}</h3>
        <p className="text-slate-700 leading-relaxed text-lg">
          {module.explanation}
        </p>
      </div>

      {/* Actions */}
      <div className={`p-8 ${lightBg}`}>
        <h3 className={`text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2 ${textDark}`}>
          <Target className="w-4 h-4" />
          {t.actionLabel}
        </h3>
        <div className="space-y-3">
          {module.actions.map((step, idx) => (
            <div key={idx} className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full ${colorClass === 'red' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'} flex items-center justify-center font-bold text-xs`}>
                {idx + 1}
              </div>
              <p className="text-slate-700 text-sm font-medium mt-0.5">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const AnalysisView: React.FC<Props> = ({ input, analysis, onReset, t }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleExport = async () => {
    setIsDownloading(true);
    try {
      if (containerRef.current) {
        const dataUrl = await toPng(containerRef.current, { cacheBust: true, backgroundColor: '#F8FAFC' });
        const link = document.createElement('a');
        link.download = 'insightloop-analysis-full.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Failed to export images', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderSimpleList = (items: string[]) => (
    <ul className="list-disc pl-5 space-y-1 text-slate-700">
      {items.filter(i => i.trim()).map((item, i) => (
        <li key={i} className="pl-1">{item}</li>
      ))}
    </ul>
  );

  const renderComplexList = (items: ReflectionItem[]) => (
    <div className="space-y-4">
        {items.filter(i => i.title.trim()).map((item) => (
            <div key={item.id} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                {item.description && (
                    <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                )}
            </div>
        ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto w-full px-4 pb-20 animate-fade-in space-y-8">
      
      <div ref={containerRef} className="space-y-8 p-4 bg-[#F8FAFC]">
        
        {/* Bad Analysis Section */}
        {analysis.bad_modules && analysis.bad_modules.length > 0 && (
          <div className="space-y-6">
            {analysis.bad_modules.map((module, idx) => (
              <ModuleCard 
                key={`bad-${idx}`}
                categoryLabel={t.badModuleTitle}
                itemTitle={module.related_item_title}
                icon={<AlertCircle className="w-5 h-5 text-red-100" />}
                module={module}
                colorClass="red"
                t={t}
              />
            ))}
          </div>
        )}

        {/* Thinking Analysis Section */}
        {analysis.thinking_modules && analysis.thinking_modules.length > 0 && (
          <div className="space-y-6">
            {analysis.thinking_modules.map((module, idx) => (
              <ModuleCard 
                key={`thinking-${idx}`}
                categoryLabel={t.thinkingModuleTitle}
                itemTitle={module.related_item_title}
                icon={<Cloud className="w-5 h-5 text-blue-100" />}
                module={module}
                colorClass="blue"
                t={t}
              />
            ))}
          </div>
        )}

        {/* Encouragement */}
        <div className="bg-slate-800 rounded-2xl p-8 text-center shadow-lg">
          <Quote className="w-8 h-8 text-brand-400 mx-auto mb-4" />
          <p className="text-white text-lg font-medium italic leading-relaxed">"{analysis.encouragement}"</p>
        </div>

        {/* User Reflection Summary */}
        <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 mt-8">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">
            {t.yourReflection}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
             {/* Did */}
             <div className="md:col-span-2">
               <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold text-slate-500 uppercase">{t.didLabel}</span>
               </div>
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {renderSimpleList(input.did)}
               </div>
             </div>

             {/* Bad */}
             <div>
               <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-slate-500 uppercase">{t.badLabel}</span>
               </div>
               <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 h-full">
                  {renderComplexList(input.bad)}
               </div>
             </div>

             {/* Thinking */}
             <div>
               <div className="flex items-center gap-2 mb-2">
                  <Cloud className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold text-slate-500 uppercase">{t.thinkingLabel}</span>
               </div>
               <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 h-full">
                  {renderComplexList(input.thinking)}
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={handleExport}
          disabled={isDownloading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white text-sm font-medium py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
        >
          {isDownloading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              {t.downloading}
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              {t.exportButton}
            </>
          )}
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium py-3 px-6 rounded-full hover:bg-white hover:shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          {t.startNew}
        </button>
      </div>
    </div>
  );
};

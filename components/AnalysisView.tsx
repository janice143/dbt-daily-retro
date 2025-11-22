
import React, { useRef, useState } from 'react';
import { AIAnalysis, ReflectionInput, AnalysisModule, ReflectionItem } from '../types';
import { Target, Quote, RefreshCw, Download, CheckCircle2, AlertCircle, Cloud, Zap, Search, Calendar } from 'lucide-react';
import { toPng } from 'html-to-image';

interface Props {
  input: ReflectionInput;
  analysis: AIAnalysis;
  onReset: () => void;
  date: string;
  t: {
    badModuleTitle: string;
    thinkingModuleTitle: string;
    essenceLabel: string;
    trueGoalLabel: string;
    suggestionsLabel: string;
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
  itemDescription?: string;
  icon: React.ReactNode;
  module: AnalysisModule;
  colorClass: string; // 'red' or 'blue'
  t: Props['t'];
}> = ({ categoryLabel, itemTitle, itemDescription, icon, module, colorClass, t }) => {
  const bgGradient = colorClass === 'red' ? 'from-red-500 to-red-600' : 'from-blue-500 to-blue-600';
  const lightBg = colorClass === 'red' ? 'bg-red-50' : 'bg-blue-50';
  const borderColor = colorClass === 'red' ? 'border-red-100' : 'border-blue-100';
  const iconColor = colorClass === 'red' ? 'text-red-500' : 'text-blue-500';
  const textColor = colorClass === 'red' ? 'text-red-900' : 'text-blue-900';
  const bulletColor = colorClass === 'red' ? 'bg-red-400' : 'bg-blue-400';

  // Fallback title if matching failed
  const displayTitle = itemTitle || "Analysis";

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 mb-10 last:mb-0 group/module">
      {/* Header */}
      <div className={`bg-gradient-to-br ${bgGradient} p-6 text-white relative`}>
        
        <div className="flex items-center gap-2 mb-2 opacity-80">
          {icon}
          <span className={`text-xs font-bold uppercase tracking-widest`}>{categoryLabel}</span>
        </div>
        <h2 className="text-2xl font-bold text-white leading-tight mb-3 pr-10">{displayTitle}</h2>
        
        {itemDescription && (
          <div className="bg-white/10 rounded-xl p-3 border border-white/20 backdrop-blur-sm text-white/90 text-sm leading-relaxed font-normal">
            {itemDescription}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x border-slate-100">
        
        {/* LEFT: Essence & True Goal */}
        <div className="p-8 space-y-8">
          {/* 1. Essence */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-5 h-5 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">{t.essenceLabel}</h3>
            </div>
            <p className="text-slate-800 leading-relaxed text-lg font-medium">
              {module.essence}
            </p>
          </div>

          {/* 2. True Goal */}
          <div className={`p-5 rounded-xl border ${borderColor} ${lightBg}`}>
            <div className="flex items-center gap-2 mb-2">
              <Target className={`w-5 h-5 ${iconColor}`} />
              <h3 className={`text-xs font-bold uppercase tracking-widest ${textColor} opacity-70`}>{t.trueGoalLabel}</h3>
            </div>
            <p className={`text-base font-semibold ${textColor} leading-relaxed`}>
              {module.true_goal}
            </p>
          </div>
        </div>

        {/* RIGHT: 3 Suggestions */}
        <div className="p-8 bg-slate-50/50">
           <div className="flex items-center gap-2 mb-6">
              <Zap className={`w-5 h-5 ${iconColor}`} />
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">{t.suggestionsLabel}</h3>
           </div>
           
           <ul className="space-y-4">
             {module.suggestions.map((suggestion, idx) => (
               <li key={idx} className="flex items-start gap-3">
                 <div className={`w-6 h-6 rounded-full ${bulletColor} text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5`}>
                   {idx + 1}
                 </div>
                 <p className="text-slate-700 text-sm font-medium leading-relaxed pt-0.5">
                   {suggestion}
                 </p>
               </li>
             ))}
           </ul>
        </div>

      </div>
    </div>
  );
};

export const AnalysisView: React.FC<Props> = ({ input, analysis, onReset, date, t }) => {
  const combinedRef = useRef<HTMLDivElement>(null);
  const aiAnalysisRef = useRef<HTMLDivElement>(null);
  const userContentRef = useRef<HTMLDivElement>(null);
  
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleExport = async () => {
    setIsDownloading(true);
    try {
      const dateStr = date.replace(/[^\w]/g, '-');
      const options = { cacheBust: true, backgroundColor: '#F8FAFC' };
      
      // 1. Export Combined (Full Report)
      if (combinedRef.current) {
        const dataUrl = await toPng(combinedRef.current, options);
        const link = document.createElement('a');
        link.download = `dbt-retro-full-${dateStr}.png`;
        link.href = dataUrl;
        link.click();
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // 2. Export AI Analysis Image
      if (aiAnalysisRef.current) {
        const dataUrl1 = await toPng(aiAnalysisRef.current, options);
        const link1 = document.createElement('a');
        link1.download = `dbt-retro-analysis-${dateStr}.png`;
        link1.href = dataUrl1;
        link1.click();
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      // 3. Export User Content Image
      if (userContentRef.current) {
        const dataUrl2 = await toPng(userContentRef.current, options);
        const link2 = document.createElement('a');
        link2.download = `dbt-retro-reflection-${dateStr}.png`;
        link2.href = dataUrl2;
        link2.click();
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
    <div className="max-w-4xl mx-auto w-full px-4 pb-20 animate-fade-in">
      
      {/* Combined Wrapper for Full Report Screenshot */}
      <div ref={combinedRef} className="space-y-8 bg-[#F8FAFC] p-2 rounded-xl">
        
        {/* --- SECTION 1: AI ANALYSIS --- */}
        <div ref={aiAnalysisRef} className="space-y-8 p-6 bg-[#F8FAFC] rounded-xl">
          
          {/* Date Header */}
          <div className="flex items-center justify-center text-slate-600 text-2xl font-bold gap-3 mb-8 pt-4">
            <Calendar className="w-6 h-6 text-brand-500" />
            {date}
          </div>

          {/* Bad Analysis Section */}
          {analysis.bad_modules && analysis.bad_modules.length > 0 && (
            <div className="space-y-6">
              {analysis.bad_modules.map((module, idx) => {
                // Match by ID
                const originalItem = input.bad.find(i => i.id === module.related_item_id);
                return (
                  <ModuleCard 
                    key={`bad-${idx}`}
                    categoryLabel={t.badModuleTitle}
                    itemTitle={originalItem ? originalItem.title : "Analysis"}
                    itemDescription={originalItem ? originalItem.description : ""}
                    icon={<AlertCircle className="w-5 h-5 text-red-100" />}
                    module={module}
                    colorClass="red"
                    t={t}
                  />
                );
              })}
            </div>
          )}

          {/* Thinking Analysis Section */}
          {analysis.thinking_modules && analysis.thinking_modules.length > 0 && (
            <div className="space-y-6">
              {analysis.thinking_modules.map((module, idx) => {
                // Match by ID
                const originalItem = input.thinking.find(i => i.id === module.related_item_id);
                return (
                  <ModuleCard 
                    key={`thinking-${idx}`}
                    categoryLabel={t.thinkingModuleTitle}
                    itemTitle={originalItem ? originalItem.title : "Analysis"}
                    itemDescription={originalItem ? originalItem.description : ""}
                    icon={<Cloud className="w-5 h-5 text-blue-100" />}
                    module={module}
                    colorClass="blue"
                    t={t}
                  />
                );
              })}
            </div>
          )}

          {/* Encouragement */}
          <div className="bg-slate-800 rounded-2xl p-8 text-center shadow-lg">
            <Quote className="w-8 h-8 text-brand-400 mx-auto mb-4" />
            <p className="text-white text-lg font-medium italic leading-relaxed">"{analysis.encouragement}"</p>
          </div>
        </div>


        {/* --- SECTION 2: USER CONTENT --- */}
        <div ref={userContentRef} className="p-6 bg-[#F8FAFC] rounded-xl">
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  {t.yourReflection}
              </h3>
              <span className="text-slate-400 text-sm font-medium">{date}</span>
            </div>
            
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

      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 mt-8">
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

import React, { useRef, useState } from 'react';
import { AIAnalysis, ReflectionInput } from '../types';
import { Lightbulb, Target, Quote, RefreshCw, Download, CheckCircle2, AlertCircle, Cloud } from 'lucide-react';
import { toPng } from 'html-to-image';

interface Props {
  input: ReflectionInput;
  analysis: AIAnalysis;
  onReset: () => void;
  t: {
    coreInsight: string;
    analysisTitle: string;
    actionableTitle: string;
    startNew: string;
    yourReflection: string;
    exportButton: string;
    downloading: string;
    didLabel: string;
    badLabel: string;
    thinkingLabel: string;
  }
}

export const AnalysisView: React.FC<Props> = ({ input, analysis, onReset, t }) => {
  const analysisRef = useRef<HTMLDivElement>(null);
  const reflectionRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleExport = async () => {
    setIsDownloading(true);
    try {
      if (analysisRef.current) {
        const dataUrl = await toPng(analysisRef.current, { cacheBust: true, backgroundColor: '#ffffff' });
        const link = document.createElement('a');
        link.download = 'insightloop-analysis.png';
        link.href = dataUrl;
        link.click();
      }
      
      // Small delay to ensure smoother browser handling of multiple downloads
      await new Promise(resolve => setTimeout(resolve, 500));

      if (reflectionRef.current) {
        const dataUrl = await toPng(reflectionRef.current, { cacheBust: true, backgroundColor: '#ffffff' });
        const link = document.createElement('a');
        link.download = 'insightloop-reflection.png';
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Failed to export images', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full px-4 pb-20 animate-fade-in space-y-8">
      
      {/* AI Analysis Card */}
      <div ref={analysisRef} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        {/* Header / Insight */}
        <div className="bg-gradient-to-br from-brand-500 to-brand-600 p-8 text-white">
          <div className="flex items-start gap-4">
            <Lightbulb className="w-8 h-8 text-brand-100 shrink-0 mt-1" />
            <div>
              <h2 className="text-sm font-bold text-brand-100 uppercase tracking-wider mb-2">{t.coreInsight}</h2>
              <p className="text-xl md:text-2xl font-serif font-medium leading-snug">"{analysis.key_insight}"</p>
            </div>
          </div>
        </div>

        {/* Essence Analysis */}
        <div className="p-8 border-b border-slate-100">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">{t.analysisTitle}</h3>
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed text-lg">
              {analysis.essence}
            </p>
          </div>
        </div>

        {/* Actionable Steps */}
        <div className="p-8 bg-slate-50/50">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
            <Target className="w-4 h-4" />
            {t.actionableTitle}
          </h3>
          <div className="space-y-4">
            {analysis.actionable_steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </div>
                <p className="text-slate-700 mt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        <div className="p-8 bg-brand-50 border-t border-brand-100">
          <div className="flex gap-4 items-center justify-center text-center">
            <Quote className="w-5 h-5 text-brand-400 rotate-180" />
            <p className="text-brand-900 font-medium italic">{analysis.encouragement}</p>
            <Quote className="w-5 h-5 text-brand-400" />
          </div>
        </div>
      </div>

      {/* User Reflection Card */}
      <div ref={reflectionRef} className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8">
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">
          {t.yourReflection}
        </h3>
        
        <div className="space-y-6">
          {/* Did */}
          <div className="flex gap-4">
            <div className="shrink-0 mt-1">
              <CheckCircle2 className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-400 uppercase mb-1">{t.didLabel.split('(')[0]}</span>
              <p className="text-slate-700 whitespace-pre-wrap">{input.did || "—"}</p>
            </div>
          </div>

          {/* Bad */}
          <div className="flex gap-4">
            <div className="shrink-0 mt-1">
              <AlertCircle className="w-5 h-5 text-red-200" />
            </div>
            <div>
              <span className="block text-xs font-bold text-red-400 uppercase mb-1">{t.badLabel.split('(')[0]}</span>
              <p className="text-slate-700 whitespace-pre-wrap">{input.bad || "—"}</p>
            </div>
          </div>

           {/* Thinking */}
           <div className="flex gap-4">
            <div className="shrink-0 mt-1">
              <Cloud className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <span className="block text-xs font-bold text-blue-400 uppercase mb-1">{t.thinkingLabel.split('(')[0]}</span>
              <p className="text-slate-700 whitespace-pre-wrap">{input.thinking || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={handleExport}
          disabled={isDownloading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-medium py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
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
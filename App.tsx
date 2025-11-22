import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ReflectionForm } from './components/ReflectionForm';
import { AnalysisView } from './components/AnalysisView';
import { ReflectionInput, AIAnalysis, LoadingState, DEFAULT_INPUT, Language, ReflectionItem } from './types';
import { analyzeReflection } from './services/geminiService';
import { translations } from './i18n';

const App: React.FC = () => {
  const [input, setInput] = useState<ReflectionInput>(DEFAULT_INPUT);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<AIAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Default to Chinese ('zh') as requested
  const [language, setLanguage] = useState<Language>('zh');

  // Generate current date
  const todayDate = new Date().toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    weekday: 'long' 
  });

  const t = translations[language];

  const handleDidChange = useCallback((value: string[]) => {
    setInput(prev => ({ ...prev, did: value }));
  }, []);

  const handleComplexChange = useCallback((field: 'bad' | 'thinking', value: ReflectionItem[]) => {
    setInput(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFillTemplate = useCallback(() => {
    setInput({
      did: [
        "口语练习",
        "学AI agent",
        "健身"
      ],
      bad: [
        {
            id: 'b1',
            title: "短视频刷太多了",
            description: "短视频刷太多了，似乎大脑累的时候，总是有些间隙想消费一些轻松的无脑的内容，所以就寻求短视频。\n\n大脑不能过度消耗，要找到个节奏，累了就睡觉，而不是寻求二进制垃圾。\n大脑需要一些有营养的东西，而且还不能过度，可以用饮食模型来解释大脑使用吗？\n\n我的理想状态是：保持思考，杜绝过度用脑（因为睡不着，想看短视频），看书、听内容，消费一些有营养的东西。"
        }
      ],
      thinking: [
        {
            id: 't1',
            title: "目标还是不够清晰",
            description: "我的学习目标还是不够清晰，至少要有2个礼拜的目标，这个目标要有清晰的落地点。\n\n比如学Ai agent，两个礼拜后，要达成什么：文章输出？项目输出？\n\n学口语，两个礼拜要达成什么：\n- 流畅度？\n- 回答一个问题，组织一个答案要多久\n- 词汇记忆和使用\n怎么测试自己是否达成了目标呢？"
        }
      ]
    });
    // Ensure language is set to zh when filling template (though it's default now)
    setLanguage('zh');
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
          <AnalysisView input={input} analysis={result} onReset={handleReset} t={t} date={todayDate} />
        ) : (
          <ReflectionForm 
            input={input} 
            onDidChange={handleDidChange}
            onComplexChange={handleComplexChange}
            onSubmit={handleSubmit} 
            onFillTemplate={handleFillTemplate}
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
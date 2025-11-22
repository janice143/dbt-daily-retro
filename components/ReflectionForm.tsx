
import React, { useRef, useEffect } from 'react';
import { ReflectionInput, ReflectionItem } from '../types';
import { CheckCircle2, AlertCircle, Cloud, Sparkles, Wand2, Plus, X, Info, BookOpen } from 'lucide-react';

interface Props {
  input: ReflectionInput;
  onDidChange: (value: string[]) => void;
  onComplexChange: (field: 'bad' | 'thinking', value: ReflectionItem[]) => void;
  onSubmit: () => void;
  onFillTemplate: () => void;
  isLoading: boolean;
  t: {
    didLabel: string;
    didPlaceholder: string;
    badLabel: string;
    thinkingLabel: string;
    itemTitlePlaceholder: string;
    itemDescPlaceholder: string;
    submitButton: React.ReactNode;
    analyzing: React.ReactNode;
    fillTemplate: string;
    addMore: string;
    limitReached: string;
    maxLimitBadge: string;
    tutorial: string;
  }
}

// Simple List Input for "Did"
const ListInput: React.FC<{
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
  icon: React.ReactNode;
  label: string;
  colorClass: string;
  t: Props['t'];
  disabled: boolean;
}> = ({ items, onChange, placeholder, icon, label, colorClass, t, disabled }) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (items.length > 1 && items[items.length - 1] === '') {
      inputRefs.current[items.length - 1]?.focus();
    }
  }, [items.length]);

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange(newItems);
  };

  const addItem = () => {
    if (items.length < 5) {
      onChange([...items, '']);
    }
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems.length ? newItems : ['']); 
  };

  const isLimitReached = items.length >= 5;

  return (
    <div className={`group relative bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-${colorClass}-300 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {icon}
          <label className="font-semibold text-slate-700 text-sm uppercase tracking-wide">{label}</label>
        </div>
        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
          {items.length}/5
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 group/item">
            <div className={`w-1.5 h-1.5 rounded-full bg-${colorClass}-400 shrink-0`} />
            <input
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-300 text-base py-1 border-b border-transparent focus:border-slate-200 transition-colors"
            />
            {items.length > 1 && (
              <button
                onClick={() => removeItem(index)}
                className="text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover/item:opacity-100 focus:opacity-100"
                disabled={disabled}
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-slate-50 pt-3">
        {!isLimitReached ? (
          <button
            onClick={addItem}
            disabled={disabled}
            className={`flex items-center gap-1 text-sm font-medium text-${colorClass}-600 hover:text-${colorClass}-700 transition-colors`}
          >
            <Plus className="w-4 h-4" />
            {t.addMore}
          </button>
        ) : (
           <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
             <Info className="w-3.5 h-3.5" />
             {t.limitReached}
           </div>
        )}
      </div>
    </div>
  );
};

// Complex Input for "Bad" and "Thinking" (Title + Description)
const ComplexListInput: React.FC<{
  items: ReflectionItem[];
  onChange: (items: ReflectionItem[]) => void;
  icon: React.ReactNode;
  label: string;
  colorClass: string; // 'red' | 'blue'
  t: Props['t'];
  disabled: boolean;
}> = ({ items, onChange, icon, label, colorClass, t, disabled }) => {
  
  const handleFieldChange = (index: number, field: keyof ReflectionItem, value: string) => {
    const newItems = items.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    onChange(newItems);
  };

  const addItem = () => {
    if (items.length < 3) {
      onChange([...items, { id: crypto.randomUUID(), title: '', description: '' }]);
    }
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems.length ? newItems : [{ id: crypto.randomUUID(), title: '', description: '' }]);
  };

  const isLimitReached = items.length >= 3;

  return (
    <div className={`group relative bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-${colorClass}-300 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {icon}
          <label className={`font-bold text-${colorClass}-600 text-base uppercase tracking-wide`}>{label}</label>
        </div>
        <span className={`text-[10px] font-semibold uppercase tracking-wider text-${colorClass}-600 bg-${colorClass}-50 px-2 py-1 rounded-full border border-${colorClass}-100`}>
          {t.maxLimitBadge}
        </span>
      </div>

      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={item.id} className={`relative flex flex-col gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 group/card hover:shadow-md hover:border-${colorClass}-200 transition-all duration-200`}>
            
            {/* Title Input */}
            <input
              type="text"
              value={item.title}
              onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
              placeholder={t.itemTitlePlaceholder}
              disabled={disabled}
              className="w-full bg-transparent text-slate-800 font-bold text-lg placeholder:text-slate-300 placeholder:font-medium border-b border-slate-200 focus:border-slate-400 pb-2 outline-none transition-colors"
            />
            
            {/* Description Textarea */}
            <textarea
              value={item.description}
              onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
              placeholder={t.itemDescPlaceholder}
              disabled={disabled}
              rows={3}
              className="w-full bg-transparent text-slate-600 text-sm leading-relaxed placeholder:text-slate-300 resize-none outline-none"
            />

            {/* Remove Button */}
            {items.length > 1 && (
              <button
                onClick={() => removeItem(index)}
                disabled={disabled}
                className="absolute top-4 right-4 text-slate-300 hover:text-red-400 transition-colors opacity-0 group-hover/card:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            )}
             <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-${colorClass}-300 opacity-50`} />
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-2 flex justify-center">
        {!isLimitReached ? (
          <button
            onClick={addItem}
            disabled={disabled}
            className={`w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 font-medium text-sm hover:border-${colorClass}-400 hover:text-${colorClass}-600 transition-all flex items-center justify-center gap-2`}
          >
            <Plus className="w-4 h-4" />
            {t.addMore}
          </button>
        ) : (
           <div className="w-full py-3 text-center text-xs text-slate-400 font-medium bg-slate-50 rounded-xl border border-slate-100">
             {t.limitReached}
           </div>
        )}
      </div>
    </div>
  );
};

export const ReflectionForm: React.FC<Props> = ({ input, onDidChange, onComplexChange, onSubmit, onFillTemplate, isLoading, t }) => {
  
  const hasContent = 
    input.did.some(i => i.trim()) || 
    input.bad.some(i => i.title.trim()) || 
    input.thinking.some(i => i.title.trim());

  return (
    <div className="grid gap-8 max-w-2xl mx-auto w-full px-4 animate-fade-in-up relative">
      
      <div className="absolute -top-10 right-4 md:right-0 flex items-center gap-4">
        <a 
          href="https://www.believed-breadfruit.top/2025/11/22/2025-11-22-%E4%B8%80%E4%B8%AAai%E6%9E%81%E7%AE%80%E5%A4%8D%E7%9B%98%E6%80%9D%E8%B7%AF/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs font-medium text-slate-400 hover:text-brand-600 flex items-center gap-1 transition-colors"
        >
          <BookOpen className="w-3 h-3" />
          {t.tutorial}
        </a>
        <button
          onClick={onFillTemplate}
          disabled={isLoading}
          className="text-xs font-medium text-brand-600 hover:text-brand-800 flex items-center gap-1 transition-colors disabled:opacity-50"
        >
          <Wand2 className="w-3 h-3" />
          {t.fillTemplate}
        </button>
      </div>

      {/* Did Section (Simple List) */}
      <ListInput
        items={input.did}
        onChange={onDidChange}
        placeholder={t.didPlaceholder}
        icon={<CheckCircle2 className="w-5 h-5 text-green-500" />}
        label={t.didLabel}
        colorClass="green"
        t={t}
        disabled={isLoading}
      />

      {/* Bad Section (Complex) */}
      <ComplexListInput
        items={input.bad}
        onChange={(val) => onComplexChange('bad', val)}
        icon={<AlertCircle className="w-6 h-6 text-red-500" />}
        label={t.badLabel}
        colorClass="red"
        t={t}
        disabled={isLoading}
      />

      {/* Thinking Section (Complex) */}
      <ComplexListInput
        items={input.thinking}
        onChange={(val) => onComplexChange('thinking', val)}
        icon={<Cloud className="w-6 h-6 text-blue-500" />}
        label={t.thinkingLabel}
        colorClass="blue"
        t={t}
        disabled={isLoading}
      />

      {/* Action Button */}
      <div className="pb-10">
        <button
            onClick={onSubmit}
            disabled={isLoading || !hasContent}
            className={`w-full py-4 rounded-2xl font-bold text-lg tracking-wide transition-all duration-200 shadow-xl flex items-center justify-center gap-2
            ${isLoading || !hasContent
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : 'bg-brand-600 hover:bg-brand-700 text-white hover:shadow-brand-200 hover:-translate-y-1 active:translate-y-0'
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
    </div>
  );
};

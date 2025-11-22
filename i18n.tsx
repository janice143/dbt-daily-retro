
import React from 'react';
import { Language } from './types';

interface Translation {
  subtitle: React.ReactNode;
  didLabel: string;
  didPlaceholder: string;
  badLabel: string;
  thinkingLabel: string;
  itemTitlePlaceholder: string;
  itemDescPlaceholder: string;
  submitButton: React.ReactNode;
  analyzing: React.ReactNode;
  badModuleTitle: string;
  thinkingModuleTitle: string;
  essenceLabel: string;   
  trueGoalLabel: string;  
  suggestionsLabel: string; 
  startNew: string;
  errorGeneric: string;
  dismiss: string;
  footer: string;
  yourReflection: string;
  exportButton: string;
  downloading: string;
  fillTemplate: string;
  addMore: string;
  limitReached: string;
  maxLimitBadge: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    subtitle: (
      <>Your daily AI mentor. Reflect on what you <span className="font-semibold text-slate-700">Did</span>, what was <span className="font-semibold text-red-500">Bad</span>, and what you're <span className="font-semibold text-blue-500">Thinking</span>.</>
    ),
    didLabel: "Did (Tasks Completed)",
    didPlaceholder: "Add a completed task...",
    badLabel: "Bad (Behavioral Issues)",
    thinkingLabel: "Thinking (Cognitive Roadblocks)",
    itemTitlePlaceholder: "Title (e.g., Procrastinated on report)",
    itemDescPlaceholder: "Description (e.g., I felt overwhelmed so I scrolled TikTok for 2 hours...)",
    submitButton: "Generate Analysis",
    analyzing: "Analyzing...",
    badModuleTitle: "Behavioral Analysis",
    thinkingModuleTitle: "Cognitive Analysis",
    essenceLabel: "The Essence",
    trueGoalLabel: "Your True Goal",
    suggestionsLabel: "My 3 Suggestions",
    startNew: "Start New Reflection",
    errorGeneric: "Something went wrong. Please try again.",
    dismiss: "Dismiss",
    footer: "Powered by Gemini 2.5",
    yourReflection: "Your Reflection",
    exportButton: "Save as Images",
    downloading: "Saving...",
    fillTemplate: "Fill Example",
    addMore: "Add Item",
    limitReached: "Limit Reached",
    maxLimitBadge: "Max 3 Items - Focus on the Critical Few",
  },
  zh: {
    subtitle: (
      <>你的每日 AI 导师。复盘你 <span className="font-semibold text-slate-700">做了什么 (Did)</span>，哪里 <span className="font-semibold text-red-500">做得不好 (Bad)</span>，以及当下的 <span className="font-semibold text-blue-500">思考 (Thinking)</span>。</>
    ),
    didLabel: "Did (我做了什么)",
    didPlaceholder: "输入已完成的事项...",
    badLabel: "Bad (做得不够好/需改变)",
    thinkingLabel: "Thinking (当下念头/脑内噪音)",
    itemTitlePlaceholder: "核心问题 (如：睡前刷手机)",
    itemDescPlaceholder: "详细描述 (如：明明很困但就是不想睡，感觉像在报复性娱乐...)",
    submitButton: "生成导师反馈",
    analyzing: "正在深入剖析...",
    badModuleTitle: "行为模式分析 (针对 Bad)",
    thinkingModuleTitle: "认知模式分析 (针对 Thinking)",
    essenceLabel: "问题的本质",
    trueGoalLabel: "你的真实目标",
    suggestionsLabel: "给你的3条建议",
    startNew: "开始新的复盘",
    errorGeneric: "出错了，请重试。",
    dismiss: "关闭",
    footer: "基于 Gemini 2.5 构建",
    yourReflection: "你的复盘记录",
    exportButton: "保存复盘卡片",
    downloading: "正在保存...",
    fillTemplate: "一键填入示例",
    addMore: "添加事项",
    limitReached: "已达上限",
    maxLimitBadge: "上限3条，深度复盘核心问题",
  }
};

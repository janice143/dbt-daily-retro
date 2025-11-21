import React from 'react';
import { Language } from './types';

interface Translation {
  subtitle: React.ReactNode;
  didLabel: string;
  didPlaceholder: string;
  badLabel: string;
  badPlaceholder: string;
  thinkingLabel: string;
  thinkingPlaceholder: string;
  submitButton: React.ReactNode;
  analyzing: React.ReactNode;
  coreInsight: string;
  analysisTitle: string;
  actionableTitle: string;
  startNew: string;
  errorGeneric: string;
  dismiss: string;
  footer: string;
  yourReflection: string;
  exportButton: string;
  downloading: string;
}

export const translations: Record<Language, Translation> = {
  en: {
    subtitle: (
      <>Your daily AI mentor. Reflect on what you <span className="font-semibold text-slate-700">Did</span>, what was <span className="font-semibold text-red-500">Bad</span>, and what you're <span className="font-semibold text-blue-500">Thinking</span>.</>
    ),
    didLabel: "Did (What I did)",
    didPlaceholder: "Completed the Q3 report, went for a run...",
    badLabel: "Bad (What needs change)",
    badPlaceholder: "Procrastinated on the email reply, ate too much sugar...",
    thinkingLabel: "Thinking (Mental Context)",
    thinkingPlaceholder: "Feeling anxious about the deadline, maybe I'm burned out...",
    submitButton: "Generate Mentor Feedback",
    analyzing: "Analyzing...",
    coreInsight: "Core Insight",
    analysisTitle: "Analysis of the Problem",
    actionableTitle: "Actionable Advice",
    startNew: "Start New Reflection",
    errorGeneric: "Something went wrong. Please try again.",
    dismiss: "Dismiss",
    footer: "Powered by Gemini 2.5",
    yourReflection: "Your Reflection",
    exportButton: "Save as Images",
    downloading: "Saving..."
  },
  zh: {
    subtitle: (
      <>你的每日 AI 导师。复盘你 <span className="font-semibold text-slate-700">做了什么 (Did)</span>，哪里 <span className="font-semibold text-red-500">做得不好 (Bad)</span>，以及当下的 <span className="font-semibold text-blue-500">思考 (Thinking)</span>。</>
    ),
    didLabel: "Did (我做了什么)",
    didPlaceholder: "完成了 Q3 报告，去跑步了...",
    badLabel: "Bad (做得不够好/需改变)",
    badPlaceholder: "拖延了回邮件，吃了太多糖...",
    thinkingLabel: "Thinking (当下念头/脑内噪音)",
    thinkingPlaceholder: "对截止日期感到焦虑，也许我精疲力尽了...",
    submitButton: "生成导师反馈",
    analyzing: "正在分析...",
    coreInsight: "核心洞察",
    analysisTitle: "本质分析",
    actionableTitle: "行动建议",
    startNew: "开始新的复盘",
    errorGeneric: "出错了，请重试。",
    dismiss: "关闭",
    footer: "基于 Gemini 2.5 构建",
    yourReflection: "你的复盘记录",
    exportButton: "保存复盘卡片",
    downloading: "正在保存..."
  }
};
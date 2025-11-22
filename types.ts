
export interface ReflectionItem {
  id: string;
  title: string;
  description: string;
}

export interface ReflectionInput {
  did: string[];
  bad: ReflectionItem[];
  thinking: ReflectionItem[];
}

export interface AnalysisModule {
  related_item_id: string;
  essence: string;       // 1. The Essence of the problem
  true_goal: string;     // 2. The User's True Goal
  suggestions: string[]; // 3. Top 3 Core Suggestions
}

export interface AIAnalysis {
  bad_modules: AnalysisModule[];
  thinking_modules: AnalysisModule[];
  encouragement: string; // Global encouragement
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export const DEFAULT_INPUT: ReflectionInput = {
  did: [''],
  bad: [{ id: '1', title: '', description: '' }],
  thinking: [{ id: '1', title: '', description: '' }]
};

export type Language = 'en' | 'zh';
